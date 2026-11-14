import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import mockData from "@/data/mock-links.json";
import { LinkItem, UserProfile, SocialLink } from "@/types/link";
import {
  addLinkToFirestore,
  getLinksFromFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  subscribeToFirestoreLinks,
  isNotFoundError,
} from "./firestoreLinks";
import { normalizeCategory, normalizeLinks } from "./categories";

/**
 * 한 번이라도 Firestore 스냅샷에 등장한 링크 id.
 * 스냅샷에서 사라지면 (다른 탭/기기에서 삭제됨) 로컬 목록에서도 제거하기 위해 사용.
 * Firestore에 없는 로컬 데모 링크(link_01 등)는 여기에 들어가지 않으므로 유지된다.
 */
const knownFirestoreIds = new Set<string>();

function mergeFirestoreLinks(localLinks: LinkItem[], firestoreLinks: LinkItem[]): LinkItem[] {
  const firestoreIds = new Set(firestoreLinks.map((l) => l.id));
  const localOnly = localLinks.filter(
    (l) => !firestoreIds.has(l.id) && !knownFirestoreIds.has(l.id)
  );
  firestoreLinks.forEach((l) => knownFirestoreIds.add(l.id));
  return [...firestoreLinks, ...localOnly];
}

interface LinkStoreState {
  profile: UserProfile;
  socials: SocialLink[];
  links: LinkItem[];
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
  resetToMockData: () => void;
  fetchLinksFromFirestore: () => Promise<void>;
  subscribeToFirestore: () => () => void;
}

const defaultData = mockData.data;

export const useLinkStore = create<LinkStoreState>()(
  persist(
    (set, get) => ({
      profile: defaultData.profile,
      socials: defaultData.socials as SocialLink[],
      links: defaultData.links as LinkItem[],
      selectedCategory: "ALL",
      isManageMode: false,
      _hasHydrated: false,

      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
      setSelectedCategory: (category: string) => set({ selectedCategory: category }),
      toggleManageMode: () => set((state) => ({ isManageMode: !state.isManageMode })),
      setManageMode: (mode: boolean) => set({ isManageMode: mode }),

      // Firestore 경로: users/anonymous/links 에 신규 링크 저장
      addLink: async (newLinkData) => {
        const currentLinks = get().links;
        // 새 링크는 목록 최상단(order가 작거나 앞단)에 배치
        const order =
          currentLinks.length > 0 ? Math.min(...currentLinks.map((l) => l.order)) - 1 : 1;

        try {
          const createdLink = await addLinkToFirestore(newLinkData, order);
          set((state) => ({
            links: [createdLink, ...state.links.filter((l) => l.id !== createdLink.id)],
          }));
          return createdLink;
        } catch (error) {
          console.error("Firestore 링크 추가 실패, 로컬 폴백 저장 수행:", error);
          const now = new Date().toISOString();
          const fallbackLink: LinkItem = {
            id: `link_${Date.now()}`,
            title: newLinkData.title.trim(),
            description: newLinkData.description?.trim() || "",
            url: newLinkData.url.trim(),
            category: normalizeCategory(newLinkData.category),
            icon: newLinkData.icon || "globe",
            isActive: newLinkData.isActive ?? true,
            isFeatured: Boolean(newLinkData.isFeatured),
            order,
            clickCount: 0,
            createdAt: now,
            updatedAt: now,
          };
          set((state) => ({ links: [fallbackLink, ...state.links] }));
          return fallbackLink;
        }
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
          // Firestore에 없는 로컬 데모 링크는 로컬 수정만 유지
          if (isNotFoundError(error)) return;
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
          knownFirestoreIds.delete(id);
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
          if (!isNotFoundError(error)) console.warn("toggleLinkActive Firestore 동기화 실패:", error);
        }
      },

      incrementClickCount: async (id) => {
        const current = get().links.find((link) => link.id === id);
        const newCount = (current?.clickCount || 0) + 1;
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, clickCount: newCount } : link
          ),
        }));
        try {
          await updateLinkInFirestore(id, { clickCount: newCount });
        } catch (error) {
          if (!isNotFoundError(error)) console.warn("incrementClickCount Firestore 동기화 실패:", error);
        }
      },

      resetToMockData: () => {
        set({
          profile: defaultData.profile,
          socials: defaultData.socials as SocialLink[],
          links: defaultData.links as LinkItem[],
          selectedCategory: "ALL",
        });
      },

      fetchLinksFromFirestore: async () => {
        try {
          const firestoreLinks = await getLinksFromFirestore();
          if (firestoreLinks.length > 0) {
            set((state) => ({ links: mergeFirestoreLinks(state.links, firestoreLinks) }));
          }
        } catch (error) {
          console.error("fetchLinksFromFirestore error:", error);
        }
      },

      subscribeToFirestore: () => {
        try {
          const unsubscribe = subscribeToFirestoreLinks((firestoreLinks) => {
            // 빈 스냅샷(마지막 링크 삭제)도 반영해야 하므로 길이 조건 없이 병합
            set((state) => ({ links: mergeFirestoreLinks(state.links, firestoreLinks) }));
          });
          return unsubscribe;
        } catch (error) {
          console.error("subscribeToFirestore error:", error);
          return () => {};
        }
      },
    }),
    {
      name: "mylink_profile_data_v1", // PRD 6.3 LocalStorage 저장 키
      storage: createJSONStorage(() => localStorage),
      // v1: 카테고리 5개(ROBOTICS 등) → 3개(PORTFOLIO/WEBSITE/ETC) 변경에 따른 저장 데이터 변환
      version: 1,
      migrate: (persisted) => {
        const state = persisted as Partial<LinkStoreState> | undefined;
        if (state?.links) state.links = normalizeLinks(state.links);
        return state as LinkStoreState;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        profile: state.profile,
        socials: state.socials,
        links: state.links,
      }),
    }
  )
);
