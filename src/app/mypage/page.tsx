"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLinkStore } from "@/lib/store";
import { LinkCategory, LinkItem } from "@/types/link";
import { LinkModal } from "@/components/LinkModal";
import {
  ExternalLink,
  Trash2,
  ArrowLeft,
  Plus,
  Mail,
  Check,
} from "lucide-react";
import { IconGithub, IconInstagram } from "@/components/icons";

export default function MyPage() {
  const {
    links,
    addLink,
    deleteLink,
    fetchLinksFromFirestore,
    subscribeToFirestore,
  } = useLinkStore();
  const [mounted, setMounted] = useState(false);

  // 다이얼로그 모달 상태
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = "limgyumin22@naver.com";
  const githubUrl = "https://github.com/limgyumin-kr";
  const instagramId = "@lnstargramn";
  const instagramUrl = "https://instagram.com/lnstargramn";

  useEffect(() => {
    setMounted(true);
    fetchLinksFromFirestore();
    const unsubscribe = subscribeToFirestore();
    return () => {
      unsubscribe?.();
    };
  }, [fetchLinksFromFirestore, subscribeToFirestore]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 이메일 복사 핸들러
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      showToast("이메일 주소가 클립보드에 복사되었습니다.");
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      showToast(email);
    }
  };

  // 다이얼로그 모달 저장 핸들러 (Firestore users/anonymous/links 저장)
  const handleDialogSave = async (data: {
    title: string;
    description: string;
    url: string;
    category: LinkCategory;
    icon?: string;
    isActive: boolean;
    isFeatured?: boolean;
  }) => {
    try {
      await addLink(data);
      setIsDialogOpen(false);
      showToast(`'${data.title}' 링크가 Firestore에 추가되었습니다.`);
    } catch (error) {
      console.error("링크 추가 오류:", error);
      showToast("링크 추가 중 문제가 발생했습니다.");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F2F3F8] py-8 px-4 flex justify-center items-start">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E8EF] p-6 animate-pulse h-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F2F3F8] text-[#354153] py-6 px-4 antialiased">
      <div className="max-w-md mx-auto flex flex-col gap-4">
        
        {/* 상단 네비게이션 */}
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#697383] hover:text-[#141A24] transition bg-white px-3 py-1.5 rounded-[10px] border border-[#E5E8EF] shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>메인으로 이동</span>
          </Link>
          <span className="text-xs text-[#99A1B1] font-medium">마이페이지</span>
        </div>

        {/* 1~5. 프로필 섹션 (Center, Top 프로필 사진 & 정보) */}
        <section className="bg-white rounded-2xl border border-[#E5E8EF] p-6 shadow-xs flex flex-col items-center text-center">
          
          {/* 1. 프로필 사진: center, top */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-[#E5E8EF] shrink-0 bg-[#F2F3F8]">
            <Image
              src="/profile.jpg"
              alt="임규민 프로필"
              fill
              sizes="96px"
              priority
              className="object-cover"
            />
          </div>

          {/* 2. 프로필 사진 아래: 내 이름 "임규민" */}
          <h1 className="text-xl font-bold text-[#141A24] mt-3 tracking-tight">
            임규민
          </h1>

          {/* 3. 이름 아래: 작게 "@lnstargramn" */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#697383] hover:text-[#0078FF] transition mt-1 font-medium group"
          >
            <IconInstagram className="w-3.5 h-3.5 text-[#E1306C] group-hover:scale-110 transition-transform" />
            <span>{instagramId}</span>
          </a>

          {/* 4. 인스타그램 아이디 아래 소개글 */}
          <p className="text-[13px] text-[#4A5667] mt-3 leading-relaxed px-2 font-normal">
            목포해양대학교 컴퓨터공학과 3학년 재학중인 임규민입니다.
          </p>

          <div className="h-[1px] bg-[#E5E8EF] w-full my-4" />

          {/* 5. 소개글 아래: 깃주소, Email 2가지만 버튼 형식 (LinkedIn, Youtube 삭제) */}
          <div className="flex items-center gap-2.5 w-full">
            {/* 깃주소 버튼 */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-10 px-3 rounded-[12px] bg-[#F2F3F8] hover:bg-[#E5E8EF] text-[#141A24] flex items-center justify-center gap-2 text-xs font-semibold transition border border-[#E5E8EF] socar-press active:scale-[0.96]"
            >
              <IconGithub className="w-4 h-4 text-[#141A24]" />
              <span>GitHub</span>
            </a>

            {/* Email 버튼 */}
            <button
              onClick={handleCopyEmail}
              className="flex-1 h-10 px-3 rounded-[12px] bg-[#5B5FC7] hover:bg-[#4E52B5] text-white flex items-center justify-center gap-2 text-xs font-semibold transition shadow-xs socar-press active:scale-[0.96] cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>복사됨</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 text-white" />
                  <span>Email</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* 6. 새 링크 추가 버튼 (하나로만 깔끔하게 통일) */}
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="w-full h-12 rounded-[14px] bg-[#5B5FC7] hover:bg-[#4E52B5] text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-xs socar-press active:scale-[0.97] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>새 링크 추가</span>
        </button>

        {/* 6. 링크 목록 (주제만 보이고 다른 글은 보이지 않도록 깔끔하게 변경) */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1 text-xs text-[#697383]">
            <span className="font-semibold text-[#141A24]">내 링크</span>
            <span>{links.length}개</span>
          </div>

          {links.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E8EF] p-8 text-center text-xs text-[#99A1B1]">
              등록된 링크가 없습니다. &apos;새 링크 추가&apos; 버튼을 눌러보세요.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {links.map((item: LinkItem) => (
                <div
                  key={item.id}
                  onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                  className="group relative bg-white hover:bg-[#F9F9FB] rounded-[14px] border border-[#E5E8EF] hover:border-[#CBD1DC] px-4 py-3.5 transition flex items-center justify-between gap-3 cursor-pointer shadow-xs socar-press active:scale-[0.98]"
                >
                  {/* 주제(제목)만 보이게 함 (설명, 도메인, 조회수 등 배제) */}
                  <span className="text-sm font-bold text-[#141A24] group-hover:text-[#5B5FC7] transition-colors truncate">
                    {item.title}
                  </span>

                  {/* 우측 링크 이동 화살표 및 삭제 버튼 */}
                  <div className="flex items-center gap-2 shrink-0">
                    <ExternalLink className="w-4 h-4 text-[#99A1B1] group-hover:text-[#5B5FC7] transition-colors" />
                    
                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (confirm(`'${item.title}' 링크를 삭제하시겠습니까?`)) {
                          await deleteLink(item.id);
                          showToast("링크가 삭제되었습니다.");
                        }
                      }}
                      className="w-7 h-7 rounded-[8px] text-[#CBD1DC] hover:text-[#FF3A5B] hover:bg-[#FFF0F3] flex items-center justify-center transition"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 푸터 */}
        <footer className="text-center py-4 text-[11px] text-[#CBD1DC]">
          © 2026 임규민. All rights reserved.
        </footer>
      </div>

      {/* 새 링크 추가 다이얼로그 (빈칸 경고 및 엄격한 URL 유효성 검사 내장) */}
      <LinkModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleDialogSave}
        buttonColor="#5B5FC7"
      />

      {/* 정갈한 토스트 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="bg-[#141A24] text-white px-4 py-2.5 rounded-[12px] shadow-lg text-xs font-semibold flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#04CA81]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
