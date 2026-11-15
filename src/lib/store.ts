import { create } from "zustand";
import { LinkItem } from "@/types/link";
import {
  addLinkToFirestore,
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  subscribeToFirestoreLinks,
} from "./firestoreLinks";

/** 링크 목록 로딩 상태: Firestore 첫 스냅샷 전 / 수신 완료 / 구독 실패 */
export type LinksStatus = "loading" | "ready" | "error";

type NewLinkInput = Omit<LinkItem, "id" | "createdAt" | "updatedAt" | "clickCount" | "order">;

interface LinkStoreState {
  /** Firestore(users/{uid}/links)가 유일한 원본. 로컬에 저장하지 않는다. */
  links: LinkItem[];
  linksStatus: LinksStatus;
  /** 링크 관리 화면의 카테고리 필터 ("ALL" | LinkCategory) */
  selectedCategory: string;
  /** 현재 링크 목록의 소유자 uid (로그아웃 상태면 null) */
  ownerUid: string | null;

  setSelectedCategory: (category: string) => void;

  // CRUD 액션 (Firestore 연동)
  addLink: (link: NewLinkInput) => Promise<LinkItem>;
  updateLink: (id: string, updates: Partial<LinkItem>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  toggleLinkActive: (id: string) => Promise<void>;

  /** users/{uid}/links 실시간 구독 시작 (로그인 시 AuthSync에서 호출) */
  subscribeToFirestore: (uid: string) => () => void;
  /** 로그아웃 시 링크 목록 비우기 */
  clearLinks: () => void;
}

function requireUid(uid: string | null): string {
  if (!uid) throw new Error("로그인이 필요합니다.");
  return uid;
}

export const useLinkStore = create<LinkStoreState>()((set, get) => ({
  links: [],
  linksStatus: "loading",
  selectedCategory: "ALL",
  ownerUid: null,

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  // users/{uid}/links 에 신규 링크 저장 (실패 시 에러 전파)
  addLink: async (newLinkData) => {
    const currentLinks = get().links;
    // 새 링크는 목록 최상단(order가 가장 작게)에 배치
    const order =
      currentLinks.length > 0 ? Math.min(...currentLinks.map((l) => l.order)) - 1 : 1;

    const createdLink = await addLinkToFirestore(requireUid(get().ownerUid), newLinkData, order);
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
      await updateLinkInFirestore(requireUid(get().ownerUid), id, updates);
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
      await deleteLinkFromFirestore(requireUid(get().ownerUid), id);
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

  // 공개/비공개 전환 (실패 시 원래 상태로 복구 후 에러 전파)
  toggleLinkActive: async (id) => {
    const current = get().links.find((link) => link.id === id);
    if (!current) return;
    const newActive = !current.isActive;

    set((state) => ({
      links: state.links.map((link) =>
        link.id === id ? { ...link, isActive: newActive, updatedAt: new Date().toISOString() } : link
      ),
    }));

    try {
      await updateLinkInFirestore(requireUid(get().ownerUid), id, { isActive: newActive });
    } catch (error) {
      set((state) => ({
        links: state.links.map((link) => (link.id === id ? current : link)),
      }));
      throw error;
    }
  },

  // Firestore 실시간 구독: 스냅샷이 곧 링크 목록 (로컬 병합 없음)
  subscribeToFirestore: (uid) => {
    // 사용자가 바뀌면 이전 사용자의 링크가 잠깐이라도 보이지 않도록 먼저 비움
    set({ ownerUid: uid, links: [], linksStatus: "loading", selectedCategory: "ALL" });
    try {
      return subscribeToFirestoreLinks(
        uid,
        (firestoreLinks) => {
          // 구독 해제 직전에 도착한 다른 사용자의 스냅샷은 무시
          if (get().ownerUid !== uid) return;
          set({ links: firestoreLinks, linksStatus: "ready" });
        },
        () => {
          if (get().ownerUid === uid) set({ linksStatus: "error" });
        }
      );
    } catch (error) {
      console.error("subscribeToFirestore error:", error);
      set({ linksStatus: "error" });
      return () => {};
    }
  },

  clearLinks: () =>
    set({ ownerUid: null, links: [], linksStatus: "loading", selectedCategory: "ALL" }),
}));
