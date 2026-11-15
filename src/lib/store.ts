import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import mockData from "@/data/mock-links.json";
import { LinkItem, UserProfile, SocialLink } from "@/types/link";
import {
  addLinkToFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  subscribeToFirestoreLinks,
} from "./firestoreLinks";

/** 링크 목록 로딩 상태: Firestore 첫 스냅샷 전 / 수신 완료 / 구독 실패 */
export type LinksStatus = "loading" | "ready" | "error";

interface LinkStoreState {
  profile: UserProfile;
  socials: SocialLink[];
  /** Firestore(users/anonymous/links)가 유일한 원본. 로컬에 저장하지 않는다. */
  links: LinkItem[];
  linksStatus: LinksStatus;
  selectedCategory: string; // "ALL" | LinkCategory
  isManageMode: boolean; // 방문자 모드 vs 관리 모드 토글
  _hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
  setSelectedCategory: (category: string) => void;
  toggleManageMode: () => void;
  setManageMode: (mode: boolean) => void;

  // CRUD 액션 (Firestore 연동)
  addLink: (
    link: Omit<LinkItem, "id" | "createdAt" | "updatedAt" | "clickCount" | "order">
  ) => Promise<LinkItem>;
  updateLink: (id: string, updates: Partial<LinkItem>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  toggleLinkActive: (id: string) => Promise<void>;
  incrementClickCount: (id: string) => Promise<void>;
  subscribeToFirestore: () => () => void;
}

const defaultData = mockData.data;

export const useLinkStore = create<LinkStoreState>()(
  persist(
    (set, get) => ({
      profile: defaultData.profile,
      socials: defaultData.socials as SocialLink[],
      // 데모 링크를 기본값으로 두면 LocalStorage가 비어 있을 때마다(새 브라우저, 사이트 데이터 삭제 등)
      // 삭제했던 데모 링크가 되살아나므로, 링크는 항상 Firestore에서만 받아온다.
      links: [],
      linksStatus: "loading",
      selectedCategory: "ALL",
      isManageMode: false,
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
      setSelectedCategory: (category: string) => set({ selectedCategory: category }),
      toggleManageMode: () => set((state) => ({ isManageMode: !state.isManageMode })),
      setManageMode: (mode: boolean) => set({ isManageMode: mode }),

      // Firestore 경로: users/anonymous/links 에 신규 링크 저장 (실패 시 에러 전파)
      addLink: async (newLinkData) => {
        const currentLinks = get().links;
        // 새 링크는 목록 최상단(order가 가장 작게)에 배치
        const order =
          currentLinks.length > 0 ? Math.min(...currentLinks.map((l) => l.order)) - 1 : 1;

        const createdLink = await addLinkToFirestore(newLinkData, order);
        set((state) => ({
          links: [createdLink, ...state.links.filter((l) => l.id !== createdLink.id)],
        }));
        return createdLink;
      },

      // 낙관적 업데이트 → Firestore updateDoc → 실패 시 롤백 후 에러 전파
      updateLink: async (id, updates) => {
        const previous = get().links.find((link) => link.id === id);
        if (!previous) throw new Error(`링크를 찾을 수 없습니다: ${id}`);

        const now = new Date().toISOString();
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, ...updates, id, updatedAt: now } : link
          ),
        }));

        try {
          await updateLinkInFirestore(id, updates);
        } catch (error) {
          set((state) => ({
            links: state.links.map((link) => (link.id === id ? previous : link)),
          }));
          throw error;
        }
      },

      // 낙관적 삭제 → Firestore deleteDoc → 실패 시 원래 위치로 복구 후 에러 전파
      deleteLink: async (id) => {
        const currentLinks = get().links;
        const index = currentLinks.findIndex((link) => link.id === id);
        if (index === -1) return;
        const removed = currentLinks[index];

        set((state) => ({
          links: state.links.filter((link) => link.id !== id),
        }));

        try {
          await deleteLinkFromFirestore(id);
        } catch (error) {
          set((state) => {
            if (state.links.some((link) => link.id === id)) return state;
            const restored = [...state.links];
            restored.splice(Math.min(index, restored.length), 0, removed);
            return { links: restored };
          });
          throw error;
        }
      },

      toggleLinkActive: async (id) => {
        const current = get().links.find((link) => link.id === id);
        if (!current) return;
        const newActive = !current.isActive;
        const now = new Date().toISOString();

        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, isActive: newActive, updatedAt: now } : link
          ),
        }));

        try {
          await updateLinkInFirestore(id, { isActive: newActive });
        } catch (error) {
          // 실패 시 원래 상태로 복구
          set((state) => ({
            links: state.links.map((link) => (link.id === id ? current : link)),
          }));
          console.warn("toggleLinkActive Firestore 동기화 실패:", error);
        }
      },

      incrementClickCount: async (id) => {
        const current = get().links.find((link) => link.id === id);
        if (!current) return;
        const newCount = (current.clickCount || 0) + 1;
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, clickCount: newCount } : link
          ),
        }));
        try {
          await updateLinkInFirestore(id, { clickCount: newCount });
        } catch (error) {
          console.warn("incrementClickCount Firestore 동기화 실패:", error);
        }
      },

      // Firestore 실시간 구독: 스냅샷이 곧 링크 목록 (로컬 병합 없음)
      subscribeToFirestore: () => {
        try {
          return subscribeToFirestoreLinks(
            (firestoreLinks) => set({ links: firestoreLinks, linksStatus: "ready" }),
            () => set({ linksStatus: "error" })
          );
        } catch (error) {
          console.error("subscribeToFirestore error:", error);
          set({ linksStatus: "error" });
          return () => {};
        }
      },
    }),
    {
      name: "mylink_profile_data_v1", // PRD 6.3 LocalStorage 저장 키
      storage: createJSONStorage(() => localStorage),
      // v2: 링크는 더 이상 LocalStorage에 저장하지 않음 (Firestore 단일 원본) → 기존 저장분 제거
      version: 2,
      migrate: (persisted) => {
        const state = { ...(persisted as Record<string, unknown> | undefined) };
        delete state.links;
        return state as unknown as LinkStoreState;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        profile: state.profile,
        socials: state.socials,
      }),
    }
  )
);
