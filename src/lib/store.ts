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
} from "./firestoreLinks";

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
            category: newLinkData.category,
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

      updateLink: async (id, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, ...updates, updatedAt: now } : link
          ),
        }));
        await updateLinkInFirestore(id, updates);
      },

      deleteLink: async (id) => {
        set((state) => ({
          links: state.links.filter((link) => link.id !== id),
        }));
        await deleteLinkFromFirestore(id);
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

        await updateLinkInFirestore(id, { isActive: newActive });
      },

      incrementClickCount: async (id) => {
        const current = get().links.find((link) => link.id === id);
        const newCount = (current?.clickCount || 0) + 1;
        set((state) => ({
          links: state.links.map((link) =>
            link.id === id ? { ...link, clickCount: newCount } : link
          ),
        }));
        await updateLinkInFirestore(id, { clickCount: newCount });
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
            set((state) => {
              const firestoreIds = new Set(firestoreLinks.map((l) => l.id));
              const nonFirestoreLinks = state.links.filter((l) => !firestoreIds.has(l.id));
              return {
                links: [...firestoreLinks, ...nonFirestoreLinks],
              };
            });
          }
        } catch (error) {
          console.error("fetchLinksFromFirestore error:", error);
        }
      },

      subscribeToFirestore: () => {
        try {
          const unsubscribe = subscribeToFirestoreLinks((firestoreLinks) => {
            if (firestoreLinks.length > 0) {
              set((state) => {
                const firestoreIds = new Set(firestoreLinks.map((l) => l.id));
                const nonFirestoreLinks = state.links.filter((l) => !firestoreIds.has(l.id));
                return {
                  links: [...firestoreLinks, ...nonFirestoreLinks],
                };
              });
            }
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
