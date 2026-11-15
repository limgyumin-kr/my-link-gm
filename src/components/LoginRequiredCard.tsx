"use client";

import React from "react";
import { Lock, Link2, Pencil, Cloud } from "lucide-react";
import { AuthButton } from "@/components/AuthButton";

/**
 * 로그아웃 상태에서 링크 영역 대신 보여주는 안내 카드
 */
export function LoginRequiredCard({ onToast }: { onToast?: (msg: string) => void }) {
  return (
    <section className="rounded-2xl bg-white border border-[#E5E8EF] p-6 shadow-xs flex flex-col items-center text-center gap-4">
      <div className="w-12 h-12 rounded-full bg-[#EBF5FF] text-[#0078FF] flex items-center justify-center">
        <Lock className="w-5 h-5" />
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="text-base font-bold text-[#141A24]">로그인 후 이용할 수 있어요</h2>
        <p className="text-[13px] text-[#697383] leading-relaxed">
          Google 계정으로 로그인하면 나만의 링크 페이지를 만들고 관리할 수 있습니다.
          <br className="hidden sm:inline" /> 링크는 내 계정에만 안전하게 저장됩니다.
        </p>
      </div>

      <ul className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
        <li className="flex items-center gap-2 rounded-[10px] bg-[#F9F9FB] border border-[#F2F3F8] px-3 py-2.5">
          <Link2 className="w-4 h-4 text-[#0078FF] shrink-0" />
          <span className="text-xs text-[#354153] font-medium">링크 추가</span>
        </li>
        <li className="flex items-center gap-2 rounded-[10px] bg-[#F9F9FB] border border-[#F2F3F8] px-3 py-2.5">
          <Pencil className="w-4 h-4 text-[#0078FF] shrink-0" />
          <span className="text-xs text-[#354153] font-medium">수정 · 삭제 · 공개설정</span>
        </li>
        <li className="flex items-center gap-2 rounded-[10px] bg-[#F9F9FB] border border-[#F2F3F8] px-3 py-2.5">
          <Cloud className="w-4 h-4 text-[#0078FF] shrink-0" />
          <span className="text-xs text-[#354153] font-medium">기기 간 자동 동기화</span>
        </li>
      </ul>

      <AuthButton size="lg" onToast={onToast} />
    </section>
  );
}
