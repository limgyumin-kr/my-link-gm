"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";
import { useLinkStore } from "@/lib/store";

/**
 * 앱 전체에서 한 번만 렌더링되는 로그인 상태 동기화 컴포넌트 (화면에는 아무것도 그리지 않음)
 * - onAuthStateChanged로 로그인 상태 감지
 * - 로그인한 사용자의 users/{uid}/links 실시간 구독, 로그아웃 시 링크 목록 비우기
 */
export function AuthSync() {
  const startAuthListener = useAuthStore((s) => s.startAuthListener);
  const uid = useAuthStore((s) => s.user?.uid ?? null);
  const subscribeToFirestore = useLinkStore((s) => s.subscribeToFirestore);
  const clearLinks = useLinkStore((s) => s.clearLinks);

  useEffect(() => startAuthListener(), [startAuthListener]);

  useEffect(() => {
    if (!uid) {
      clearLinks();
      return;
    }
    return subscribeToFirestore(uid);
  }, [uid, subscribeToFirestore, clearLinks]);

  return null;
}
