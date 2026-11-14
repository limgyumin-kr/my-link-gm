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
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import { LinkItem } from "@/types/link";
import { normalizeCategory, normalizeLinkCategory } from "./categories";

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
 * Firestore 문서 데이터 → LinkItem 변환.
 * 이전 카테고리(ROBOTICS, ARTICLE 등)로 저장된 문서는 새 3개 카테고리로 자동 변환한다.
 */
function docToLink(id: string, data: DocumentData): LinkItem {
  return normalizeLinkCategory({
    id,
    title: data.title ?? "",
    description: data.description ?? "",
    url: data.url ?? "",
    category: data.category,
    icon: data.icon ?? "globe",
    isActive: data.isActive ?? true,
    isFeatured: Boolean(data.isFeatured),
    order: typeof data.order === "number" ? data.order : 0,
    clickCount: typeof data.clickCount === "number" ? data.clickCount : 0,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  });
}

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
    category: normalizeCategory(newLinkData.category),
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
      links.push(docToLink(docSnap.id, docSnap.data()));
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
  const docRef = getLinkDocRef(id);
  // id/createdAt은 수정 대상이 아니므로 제외
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, createdAt: _createdAt, ...rest } = updates;
  const cleanUpdates: Record<string, unknown> = {
    ...rest,
    updatedAt: new Date().toISOString(),
  };

  // Firestore는 undefined 값을 허용하지 않으므로 제거
  Object.keys(cleanUpdates).forEach((key) => {
    if (cleanUpdates[key] === undefined) {
      delete cleanUpdates[key];
    }
  });

  // 실패 시 호출자가 롤백/에러 안내를 할 수 있도록 에러를 그대로 던짐
  await updateDoc(docRef, cleanUpdates);
}

/**
 * Firestore users/anonymous/links 경로의 링크 삭제
 * 실패 시 에러를 그대로 던짐 (호출자에서 롤백 처리)
 */
export async function deleteLinkFromFirestore(id: string): Promise<void> {
  await deleteDoc(getLinkDocRef(id));
}

/**
 * Firestore 문서가 존재하지 않아 발생한 에러인지 확인 (로컬 전용 데모 링크 판별용)
 */
export function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "not-found"
  );
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
        links.push(docToLink(docSnap.id, docSnap.data()));
      });
      onUpdate(links);
    },
    (err) => {
      console.error("subscribeToFirestoreLinks error:", err);
      onError?.(err);
    }
  );
}
