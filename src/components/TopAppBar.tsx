"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Share2, Check, Sliders } from "@/components/icons";
import { UserRound } from "lucide-react";
import { AuthButton } from "@/components/AuthButton";
import { useAuthStore } from "@/lib/authStore";

interface TopAppBarProps {
  isManageMode: boolean;
  onToggleManageMode: () => void;
  onToast: (msg: string) => void;
}

export function TopAppBar({
  isManageMode,
  onToggleManageMode,
  onToast,
}: TopAppBarProps) {
  const [copied, setCopied] = useState(false);
  const isSignedIn = useAuthStore((s) => s.status === "signedIn");

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        onToast("페이지 링크가 복사되었습니다!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      onToast("클립보드 복사에 실패했습니다.");
    }
  };

  return (
    <header className="sticky top-0 z-30 h-[52px] w-full bg-white border-b border-[#E5E8EF] px-4 flex items-center justify-between">
      {/* 로고 & 타이틀 */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-[6px] bg-[#0078FF] text-white flex items-center justify-center font-black text-xs tracking-tighter">
          ML
        </div>
        <span className="font-bold text-[17px] text-[#141A24] tracking-tight">
          MyLink
        </span>
        <span className="text-[12px] text-[#99A1B1] font-medium hidden xs:inline">
          마이링크
        </span>
      </div>

      {/* 우측 액션 버튼들 */}
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        {/* 마이페이지 링크 */}
        <Link
          href="/mypage"
          className="h-8 px-2.5 rounded-[8px] bg-white border border-[#5B5FC7]/30 text-[#5B5FC7] hover:bg-[#5B5FC7]/10 active:scale-[0.96] transition flex items-center gap-1.5 text-[12px] font-semibold socar-press"
          title="마이페이지"
          aria-label="마이페이지"
        >
          <UserRound className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">마이페이지</span>
        </Link>

        {/* 관리 모드 토글 버튼 (로그인 상태에서만) */}
        {isSignedIn && (
        <button
          onClick={onToggleManageMode}
          className={`h-8 px-2.5 rounded-[8px] text-[12px] font-semibold transition flex items-center gap-1.5 socar-press active:scale-[0.96] border ${
            isManageMode
              ? "bg-[#0078FF] text-white border-[#0078FF]"
              : "bg-[#F2F3F8] text-[#354153] border-[#E5E8EF] hover:bg-[#E5E8EF]"
          }`}
          title={isManageMode ? "방문자 화면으로 보기" : "링크 편집 및 관리"}
          aria-label={isManageMode ? "관리 중" : "편집"}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isManageMode ? "관리 중" : "편집"}</span>
        </button>
        )}

        {/* 공유하기 버튼 */}
        <button
          onClick={handleShare}
          className="h-8 px-2.5 rounded-[8px] bg-white border border-[#E5E8EF] text-[#354153] hover:bg-[#F2F3F8] active:scale-[0.96] transition flex items-center gap-1.5 text-[12px] font-semibold socar-press"
          title="페이지 공유하기"
          aria-label="페이지 공유하기"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#04CA81]" />
              <span className="text-[#04CA81] hidden sm:inline">복사됨</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[#697383]" />
              <span className="hidden sm:inline">공유하기</span>
            </>
          )}
        </button>

        {/* Google 로그인 / 로그아웃 */}
        <AuthButton onToast={onToast} />
      </div>
    </header>
  );
}
