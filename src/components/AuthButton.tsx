"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LogOut, Loader2 } from "lucide-react";
import { useAuthStore, getAuthErrorMessage } from "@/lib/authStore";

/** Google 'G' 로고 (로그인 버튼용) */
export function GoogleLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** 표시용 이름: displayName → 이메일 앞부분 → '사용자' */
export function getDisplayName(displayName?: string | null, email?: string | null): string {
  return displayName?.trim() || email?.split("@")[0] || "사용자";
}

interface AuthButtonProps {
  onToast?: (msg: string) => void;
  /** 로그인 버튼을 크게 표시 (안내 카드용) */
  size?: "sm" | "lg";
}

/**
 * 로그아웃 상태: "Google로 로그인" 버튼
 * 로그인 상태: "{이름}님" + "로그아웃" 버튼
 */
export function AuthButton({ onToast, size = "sm" }: AuthButtonProps) {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signOut = useAuthStore((s) => s.signOut);
  const [isPending, setIsPending] = useState(false);

  const handleSignIn = async () => {
    setIsPending(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google 로그인 실패:", error);
      const msg = getAuthErrorMessage(error);
      if (msg) onToast?.(msg);
    } finally {
      setIsPending(false);
    }
  };

  const handleSignOut = async () => {
    setIsPending(true);
    try {
      await signOut();
      onToast?.("로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      onToast?.("로그아웃 중 문제가 발생했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  if (status === "loading") {
    return <div className="h-8 w-24 rounded-[8px] bg-[#F2F3F8] animate-pulse" aria-hidden="true" />;
  }

  if (status === "signedOut" || !user) {
    const sizeClass =
      size === "lg" ? "h-11 px-5 text-sm rounded-[12px] gap-2" : "h-8 px-2.5 text-[12px] rounded-[8px] gap-1.5";
    return (
      <button
        type="button"
        onClick={handleSignIn}
        disabled={isPending}
        className={`${sizeClass} bg-white border border-[#CBD1DC] text-[#141A24] hover:bg-[#F9F9FB] font-semibold flex items-center justify-center transition shadow-xs socar-press active:scale-[0.96] disabled:opacity-60 cursor-pointer whitespace-nowrap`}
      >
        {isPending ? (
          <Loader2 className={size === "lg" ? "w-4 h-4 animate-spin" : "w-3.5 h-3.5 animate-spin"} />
        ) : (
          <GoogleLogo className={size === "lg" ? "w-[18px] h-[18px]" : "w-3.5 h-3.5"} />
        )}
        <span>Google로 로그인</span>
      </button>
    );
  }

  const name = getDisplayName(user.displayName, user.email);

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <div className="flex items-center gap-1.5 min-w-0" title={user.email ?? undefined}>
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt=""
            width={24}
            height={24}
            unoptimized
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full border border-[#E5E8EF] shrink-0 hidden sm:block"
          />
        ) : null}
        <span className="text-[12px] font-semibold text-[#141A24] truncate max-w-[88px] sm:max-w-[140px]">
          {name}님
        </span>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="h-8 px-2.5 rounded-[8px] bg-white border border-[#E5E8EF] text-[#697383] hover:text-[#FF3A5B] hover:border-[#FFD1DA] hover:bg-[#FFF0F3] text-[12px] font-semibold flex items-center gap-1 transition socar-press active:scale-[0.96] disabled:opacity-60 cursor-pointer whitespace-nowrap"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>로그아웃</span>
      </button>
    </div>
  );
}
