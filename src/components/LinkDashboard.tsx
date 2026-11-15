"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Link2 } from "lucide-react";
import { useLinkStore } from "@/lib/store";
import { LinkItem, LinkCategory } from "@/types/link";
import { MyPageCard } from "@/components/MyPageCard";
import { LinkRow } from "@/components/LinkRow";
import { CategoryFilter } from "@/components/CategoryFilter";
import { LinkModal } from "@/components/LinkModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

type LinkFormData = {
  title: string;
  description: string;
  url: string;
  category: LinkCategory;
  icon?: string;
  isActive: boolean;
  isFeatured?: boolean;
};

/**
 * 로그인 상태의 메인 페이지: 링크 관리
 * - 상단: 내 페이지 요약(공유 주소, 통계)
 * - 하단: 카테고리 필터 + 링크 목록(공개 스위치, 수정, 삭제) + 링크 추가
 */
export function LinkDashboard() {
  const links = useLinkStore((s) => s.links);
  const linksStatus = useLinkStore((s) => s.linksStatus);
  const selectedCategory = useLinkStore((s) => s.selectedCategory);
  const setSelectedCategory = useLinkStore((s) => s.setSelectedCategory);
  const addLink = useLinkStore((s) => s.addLink);
  const updateLink = useLinkStore((s) => s.updateLink);
  const deleteLink = useLinkStore((s) => s.deleteLink);
  const toggleLinkActive = useLinkStore((s) => s.toggleLinkActive);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [deletingLink, setDeletingLink] = useState<LinkItem | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: links.length };
    links.forEach((l) => {
      counts[l.category] = (counts[l.category] || 0) + 1;
    });
    return counts;
  }, [links]);

  // 대표 링크 → order 순 (공개 페이지와 같은 순서)
  const displayedLinks = useMemo(
    () =>
      links
        .filter((l) => selectedCategory === "ALL" || l.category === selectedCategory)
        .sort(
          (a, b) =>
            Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) || a.order - b.order
        ),
    [links, selectedCategory]
  );

  const handleSave = async (data: LinkFormData) => {
    try {
      if (editingLink) {
        await updateLink(editingLink.id, data);
        toast.success("링크가 수정되었습니다.", { description: data.title });
        setEditingLink(null);
      } else {
        await addLink(data);
        toast.success("새 링크가 저장되었습니다.", { description: data.title });
        setIsAddOpen(false);
      }
    } catch (error) {
      console.error("링크 저장 오류:", error);
      toast.error("링크 저장 중 오류가 발생했습니다.");
      throw error;
    }
  };

  const handleToggle = async (link: LinkItem) => {
    try {
      await toggleLinkActive(link.id);
      toast.success(link.isActive ? "비공개로 전환했습니다." : "공개로 전환했습니다.", {
        description: link.title,
      });
    } catch {
      toast.error("공개 설정을 바꾸지 못했습니다.", { description: link.title });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingLink) return;
    try {
      await deleteLink(deletingLink.id);
      toast.success("링크가 삭제되었습니다.", { description: deletingLink.title });
      setDeletingLink(null);
    } catch (error) {
      console.error("링크 삭제 오류:", error);
      toast.error("링크 삭제 중 오류가 발생했습니다.");
      throw error;
    }
  };

  return (
    <main className="max-w-2xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6">
      <MyPageCard />

      <section aria-labelledby="links-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="links-heading" className="text-[17px] font-bold text-[#141A24] flex items-center gap-2">
            내 링크
            {linksStatus === "ready" && (
              <span className="text-[13px] font-semibold text-[#99A1B1] tabular-nums">{links.length}</span>
            )}
          </h2>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="h-9 pl-3 pr-3.5 rounded-full bg-[#0078FF] hover:bg-[#0066DB] text-white text-[13px] font-semibold flex items-center gap-1 transition shadow-xs socar-press active:scale-[0.96] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            링크 추가
          </button>
        </div>

        {links.length > 0 && (
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />
        )}

        {linksStatus === "loading" ? (
          <ul className="flex flex-col gap-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <li key={i} className="h-[66px] rounded-[16px] border border-[#E5E8EF] bg-white animate-pulse" />
            ))}
          </ul>
        ) : linksStatus === "error" ? (
          <div className="rounded-[16px] border border-[#FFD1DA] bg-[#FFF0F3] p-6 text-center text-[13px] text-[#FF3A5B] font-semibold">
            링크 목록을 불러오지 못했습니다. 네트워크 상태를 확인한 뒤 새로고침해주세요.
          </div>
        ) : links.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-[#CBD1DC] bg-white px-6 py-10 flex flex-col items-center text-center gap-2">
            <span className="w-11 h-11 rounded-full bg-[#EBF5FF] text-[#0078FF] flex items-center justify-center">
              <Link2 className="w-5 h-5" />
            </span>
            <p className="text-[15px] font-semibold text-[#141A24]">첫 링크를 추가해보세요</p>
            <p className="text-[13px] text-[#697383]">추가한 링크는 내 공개 페이지에 바로 표시돼요.</p>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="mt-2 h-9 px-4 rounded-full bg-[#141A24] text-white text-[13px] font-semibold flex items-center gap-1 transition socar-press active:scale-[0.96] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              링크 추가
            </button>
          </div>
        ) : displayedLinks.length === 0 ? (
          <div className="rounded-[16px] border border-[#E5E8EF] bg-white p-8 text-center text-[13px] text-[#99A1B1]">
            이 카테고리에는 링크가 없습니다.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {displayedLinks.map((link) => (
              <LinkRow
                key={link.id}
                link={link}
                onEdit={setEditingLink}
                onDelete={setDeletingLink}
                onToggleActive={handleToggle}
              />
            ))}
          </ul>
        )}
      </section>

      <LinkModal
        isOpen={isAddOpen || editingLink !== null}
        initialData={editingLink}
        onClose={() => {
          setIsAddOpen(false);
          setEditingLink(null);
        }}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        isOpen={deletingLink !== null}
        title={deletingLink?.title}
        onClose={() => setDeletingLink(null)}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}
