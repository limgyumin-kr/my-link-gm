"use client";

import React, { useState, useMemo } from "react";
import { useLinkStore } from "@/lib/store";
import { useAuthStore } from "@/lib/authStore";
import { UserInfoCard } from "@/components/UserInfoCard";
import { LoginRequiredCard } from "@/components/LoginRequiredCard";
import { useIsClient } from "@/lib/useIsClient";
import { TopAppBar } from "@/components/TopAppBar";
import { ProfileSection } from "@/components/ProfileSection";
import { CategoryFilter } from "@/components/CategoryFilter";
import { LinkCard } from "@/components/LinkCard";
import { LinkModal } from "@/components/LinkModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Snackbar } from "@/components/Snackbar";
import { Button } from "@/components/ui/button";
import { LinkItem, LinkCategory } from "@/types/link";
import { Plus, Sparkles } from "@/components/icons";

export default function MyLinkPage() {
  const {
    profile,
    socials,
    links,
    selectedCategory,
    isManageMode,
    setSelectedCategory,
    toggleManageMode,
    addLink,
    updateLink,
    deleteLink,
    toggleLinkActive,
    incrementClickCount,
    linksStatus,
  } = useLinkStore();
  // 로그인 상태 (onAuthStateChanged는 layout의 AuthSync에서 감지)
  const authStatus = useAuthStore((s) => s.status);
  const isSignedIn = authStatus === "signedIn";

  const mounted = useIsClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // 카테고리별 개수 계산
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: 0 };
    links.forEach((l) => {
      // 방문자 모드에서는 활성화된 링크만 카운트, 관리 모드에서는 전체 카운트
      if (isManageMode || l.isActive) {
        counts.ALL = (counts.ALL || 0) + 1;
        counts[l.category] = (counts[l.category] || 0) + 1;
      }
    });
    return counts;
  }, [links, isManageMode]);

  // 필터링 및 정렬된 링크 목록
  const displayedLinks = useMemo(() => {
    return links
      .filter((item) => {
        // 관리 모드가 아닐 때는 활성화된 링크만 노출
        if (!isManageMode && !item.isActive) return false;
        // 카테고리 필터
        if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        // 1순위: Featured 링크 우선
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        // 2순위: order 순서
        return a.order - b.order;
      });
  }, [links, isManageMode, selectedCategory]);

  const handleSaveLink = async (data: {
    title: string;
    description: string;
    url: string;
    category: LinkCategory;
    icon?: string;
    isActive: boolean;
    isFeatured?: boolean;
  }) => {
    try {
      if (editingLink) {
        await updateLink(editingLink.id, data);
        showToast("링크가 성공적으로 수정되었습니다.");
        setEditingLink(null);
      } else {
        await addLink(data);
        showToast("새 링크가 Firestore에 저장되었습니다.");
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("링크 저장 오류:", error);
      showToast("링크 저장 중 오류가 발생했습니다.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingLink) return;
    try {
      await deleteLink(deletingLink.id);
      showToast("링크가 삭제되었습니다.");
      setDeletingLink(null);
    } catch (error) {
      console.error("링크 삭제 오류:", error);
      showToast("링크 삭제 중 오류가 발생했습니다.");
      throw error;
    }
  };

  if (!mounted) {
    // 뼈대 로딩 (스켈레톤)
    return (
      <div className="min-h-screen w-full bg-[#F2F3F8] text-[#354153] flex flex-col items-center">
        <div className="h-[52px] w-full bg-white border-b border-[#E5E8EF]" />
        <main className="max-w-xl w-full px-4 pt-4 flex flex-col gap-4">
          <div className="h-44 w-full bg-white rounded-2xl border border-[#E5E8EF] animate-pulse" />
          <div className="h-10 w-full bg-white rounded-full border border-[#E5E8EF] animate-pulse" />
          <div className="h-20 w-full bg-white rounded-[14px] border border-[#E5E8EF] animate-pulse" />
          <div className="h-20 w-full bg-white rounded-[14px] border border-[#E5E8EF] animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F2F3F8] text-[#354153] font-sans antialiased pb-28">
      {/* 52px 고정 상단바 (SOCAR Frame TopAppBar) */}
      <TopAppBar
        isManageMode={isManageMode}
        onToggleManageMode={toggleManageMode}
        onToast={showToast}
      />

      {/* 메인 1단 카드 컨테이너 (모바일 375px ~ 최대 576px 최적화) */}
      <main className="max-w-xl mx-auto px-4 pt-4 flex flex-col gap-4">
        {/* 관리 모드 안내 배너 */}
        {isSignedIn && isManageMode && (
          <div className="bg-[#EBF5FF] border border-[#0078FF]/30 rounded-[12px] p-3 flex items-center justify-between text-xs text-[#0078FF] animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0078FF] animate-ping" />
              <span className="font-bold">관리 모드 활성화</span>
              <span className="text-[#697383] hidden sm:inline">
                • 각 링크의 수정, 삭제 및 노출 ON/OFF 스위치가 표시됩니다.
              </span>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-2.5 py-1 rounded-[6px] bg-[#0078FF] text-white font-semibold socar-press active:scale-[0.96] shrink-0"
            >
              + 링크 추가
            </button>
          </div>
        )}

        {/* 프로필 섹션 (16px 라운드 화이트 카드) */}
        <ProfileSection profile={profile} socials={socials} onToast={showToast} />

        {authStatus === "loading" ? (
          // onAuthStateChanged 첫 응답 전: 로그인 여부 확인 중
          <div className="h-40 w-full bg-white rounded-2xl border border-[#E5E8EF] animate-pulse" />
        ) : !isSignedIn ? (
          // 로그아웃 상태: 링크 기능 대신 로그인 안내
          <LoginRequiredCard onToast={showToast} />
        ) : (
        <>
        {/* 로그인 사용자 정보 (Firestore users/{uid}) */}
        <UserInfoCard linkCount={linksStatus === "ready" ? links.length : undefined} />

        {/* 링크 목록 헤더 & 카테고리 필터 */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[16px] font-bold text-[#141A24]">링크 목록</h2>
              <span className="text-[12px] font-bold text-[#0078FF] bg-[#EBF5FF] px-2 py-0.5 rounded-full">
                {displayedLinks.length}개
              </span>
            </div>

            {/* 링크 추가 액션 (관리 모드 혹은 빠른 추가) */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="h-8 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5 text-[#0078FF]" />
                <span>새 링크 추가</span>
              </Button>
            </div>
          </div>

          {/* 카테고리 필터 칩 (SOCAR Frame Pill Chip) */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />
        </section>

        {/* 링크 목록 카드 렌더링 */}
        <section className="flex flex-col gap-3">
          {linksStatus === "loading" ? (
            // Firestore 첫 응답 전: 빈 목록 안내가 깜빡이지 않도록 스켈레톤 표시
            [0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[92px] rounded-[14px] border border-[#E5E8EF] bg-white animate-pulse"
              />
            ))
          ) : linksStatus === "error" ? (
            <div className="rounded-2xl border border-[#FFD1DA] bg-[#FFF0F3] p-6 text-center text-xs text-[#FF3A5B] font-semibold">
              링크 목록을 불러오지 못했습니다. 네트워크 상태를 확인한 뒤 새로고침해주세요.
            </div>
          ) : displayedLinks.length === 0 ? (
            <div className="rounded-2xl border border-[#E5E8EF] bg-white p-8 text-center flex flex-col items-center justify-center gap-2">
              <p className="text-sm font-semibold text-[#141A24]">
                선택한 조건에 맞는 링크가 없습니다.
              </p>
              <p className="text-xs text-[#697383]">
                새로운 링크를 등록하거나 다른 카테고리를 선택해보세요.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>첫 링크 등록하기</span>
              </Button>
            </div>
          ) : (
            displayedLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                isManageMode={isManageMode}
                onEdit={(item) => setEditingLink(item)}
                onDelete={(item) => setDeletingLink(item)}
                onToggleActive={(id) => toggleLinkActive(id)}
                onClickLink={(id) => incrementClickCount(id)}
              />
            ))
          )}
        </section>

        {/* 하단 액션 카드 (CTA) */}
        <section className="rounded-2xl bg-white border border-[#E5E8EF] p-5 shadow-xs flex flex-col gap-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#0078FF]">
            <Sparkles className="w-4 h-4" />
            <span>간편한 링크 공유 & 브랜딩</span>
          </div>
          <h3 className="text-base font-bold text-[#141A24]">
            나만의 마이링크(MyLink)를 만들어보세요
          </h3>
          <p className="text-xs text-[#697383] leading-relaxed">
            흩어져 있는 포트폴리오, 깃허브, SNS 링크를 단 1분 만에 단 하나의 감각적인 페이지로 집약하세요.
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full h-11 text-sm font-semibold rounded-[12px] mt-1"
          >
            <Plus className="w-4 h-4" />
            <span>새 링크 지금 추가하기</span>
          </Button>
        </section>
        </>
        )}

        {/* 푸터 (SOCAR Frame 2.0 규칙 준수: 디자인시스템 명칭은 푸터 attribution에만 한정) */}
        <footer className="text-center py-6 text-xs text-[#99A1B1] flex flex-col gap-1">
          <p>© 2026 MyLink. Powered by SOCAR Frame 2.0</p>
          <p className="text-[11px] text-[#CBD1DC]">
            Links are securely stored in your Google account space.
          </p>
        </footer>
      </main>

      {/* 하단 고정 액션 바 (모바일 한 손 조작 환경 대응: 바텀 고정 액션 플레이트) - 로그인 시에만 */}
      {isSignedIn && (
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#E5E8EF] py-2.5 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 h-11 rounded-[12px] text-sm font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>새 링크 추가</span>
          </Button>

          <Button
            variant={isManageMode ? "default" : "outline"}
            onClick={toggleManageMode}
            className="h-11 px-4 rounded-[12px] text-xs font-semibold shrink-0"
          >
            {isManageMode ? "보기 모드" : "관리 모드"}
          </Button>
        </div>
      </div>
      )}

      {/* 링크 추가 / 수정 모달 (shadcn/ui Dialog) */}
      <LinkModal
        isOpen={isAddModalOpen || editingLink !== null}
        initialData={editingLink}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLink(null);
        }}
        onSave={handleSaveLink}
      />

      {/* 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        isOpen={deletingLink !== null}
        title={deletingLink?.title}
        onClose={() => setDeletingLink(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* 정갈한 스낵바 피드백 */}
      <Snackbar message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
