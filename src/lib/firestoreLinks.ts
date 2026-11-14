import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import { LinkItem, LinkCategory } from "@/types/link";

/**
 * Firestore 링크 컬렉션 경로: users/anonymous/links
 */
export const FIRESTORE_USERS_ANONYMOUS_LINKS = "users/anonymous/links" as const;

export const getLinksCollectionRef = () => {
  return collection(db, "users", "anonymous", "links");
};

export const getLinkDocRef = (id: string) => {
  return doc(db, "users", "anonymous", "links", id);
};

/**
 * Firestore users/anonymous/links 경로에 새 링크 저장
 */
export async function addLinkToFirestore(
  newLinkData: Omit<LinkItem, "id" | "createdAt" | "updatedAt" | "clickCount" | "order">,
  order: number = 0
): Promise<LinkItem> {
  const colRef = getLinksCollectionRef();
  const newDocRef = doc(colRef);
  const now = new Date().toISOString();

  // Firestore는 undefined 필드가 포함되면 에러를 던지므로 명시적 안전값 지정
  const newLink: LinkItem = {
    id: newDocRef.id,
    title: newLinkData.title.trim(),
    description: newLinkData.description?.trim() || "",
    url: newLinkData.url.trim(),
    category: (newLinkData.category as LinkCategory) || "ROBOTICS",
    icon: newLinkData.icon || "globe",
    isActive: newLinkData.isActive ?? true,
    isFeatured: Boolean(newLinkData.isFeatured),
    order,
    clickCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(newDocRef, newLink);
  return newLink;
}

/**
 * Firestore users/anonymous/links 경로의 링크 목록 조회
 */
export async function getLinksFromFirestore(): Promise<LinkItem[]> {
  try {
    const colRef = getLinksCollectionRef();
    const q = query(colRef, orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    const links: LinkItem[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      links.push({
        id: docSnap.id,
        title: data.title ?? "",
        description: data.description ?? "",
        url: data.url ?? "",
        category: (data.category as LinkCategory) ?? "ROBOTICS",
        icon: data.icon ?? "globe",
        isActive: data.isActive ?? true,
        isFeatured: Boolean(data.isFeatured),
        order: typeof data.order === "number" ? data.order : 0,
        clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
        createdAt: data.createdAt ?? new Date().toISOString(),
        updatedAt: data.updatedAt ?? new Date().toISOString(),
      });
    });

    return links;
  } catch (error) {
    console.error("getLinksFromFirestore error:", error);
    return [];
  }
}

/**
 * Firestore users/anonymous/links 경로의 링크 수정
 */
export async function updateLinkInFirestore(
  id: string,
  updates: Partial<LinkItem>
): Promise<void> {
  try {
    const docRef = getLinkDocRef(id);
    const cleanUpdates: Record<string, unknown> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // undefined 제거
    Object.keys(cleanUpdates).forEach((key) => {
      if (cleanUpdates[key] === undefined) {
        delete cleanUpdates[key];
      }
    });

    await updateDoc(docRef, cleanUpdates);
  } catch (error) {
    console.warn("updateLinkInFirestore skipped or failed:", error);
  }
}

/**
 * Firestore users/anonymous/links 경로의 링크 삭제
 */
export async function deleteLinkFromFirestore(id: string): Promise<void> {
  try {
    const docRef = getLinkDocRef(id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn("deleteLinkFromFirestore skipped or failed:", error);
  }
}

/**
 * Firestore users/anonymous/links 경로의 실시간 변경 구독
 */
export function subscribeToFirestoreLinks(
  onUpdate: (links: LinkItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = getLinksCollectionRef();
  const q = query(colRef, orderBy("order", "asc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const links: LinkItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        links.push({
          id: docSnap.id,
          title: data.title ?? "",
          description: data.description ?? "",
          url: data.url ?? "",
          category: (data.category as LinkCategory) ?? "ROBOTICS",
          icon: data.icon ?? "globe",
          isActive: data.isActive ?? true,
          isFeatured: Boolean(data.isFeatured),
          order: typeof data.order === "number" ? data.order : 0,
          clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
          createdAt: data.createdAt ?? new Date().toISOString(),
          updatedAt: data.updatedAt ?? new Date().toISOString(),
        });
      });
      onUpdate(links);
    },
    (err) => {
      console.error("subscribeToFirestoreLinks error:", err);
      onError?.(err);
    }
  );
}
