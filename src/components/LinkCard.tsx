"use client";

import React from "react";
import { LinkItem } from "@/types/link";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CategoryIcon, ExternalLink, Pencil, Trash2 } from "@/components/icons";
import { CATEGORY_LABELS } from "@/lib/categories";

interface LinkCardProps {
  link: LinkItem;
  isManageMode: boolean;
  onEdit: (link: LinkItem) => void;
  onDelete: (link: LinkItem) => void;
  onToggleActive: (id: string) => void;
  onClickLink: (id: string) => void;
}

const CATEGORY_NAMES = CATEGORY_LABELS;

export function LinkCard({
  link,
  isManageMode,
  onEdit,
  onDelete,
  onToggleActive,
  onClickLink,
}: LinkCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // 관리 모드에서는 카드 클릭으로 링크를 열지 않음 (수정/삭제 버튼을 빗맞혀도 새 탭이 열리지 않도록)
    if (isManageMode) return;

    // 관리 버튼/액션 영역 클릭 시 링크 이동 방지
    if ((e.target as HTMLElement).closest("button, [data-card-actions]")) {
      return;
    }

    onClickLink(link.id);
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const isInactive = !link.isActive;

  return (
    <div
      onClick={handleClick}
      // 관리 모드에서는 눌림(scale) 효과를 끔: 카드가 줄어들면 우측 버튼이 커서 밑에서 밀려나
      // mousedown/mouseup 대상이 달라져 클릭이 버튼 대신 카드로 전달되는 문제가 있었음
      className={`group relative rounded-[14px] border p-4 bg-white transition-all ${
        isManageMode ? "cursor-default" : "cursor-pointer socar-press active:scale-[0.96]"
      } ${
        link.isFeatured
          ? "border-[#0078FF]/40 shadow-xs"
          : "border-[#E5E8EF] hover:border-[#CBD1DC]"
      } ${isInactive ? "opacity-60 bg-[#F9F9FB]" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* 아이콘 컨테이너 */}
        <div
          className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 mt-0.5 ${
            link.isFeatured
              ? "bg-[#0078FF] text-white"
              : "bg-[#EBF5FF] text-[#0078FF]"
          }`}
        >
          <CategoryIcon category={link.category} icon={link.icon} className="w-5 h-5" />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4.5 font-medium">
              {CATEGORY_NAMES[link.category] || link.category}
            </Badge>

            {link.isFeatured && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4.5 font-bold">
                FEATURED
              </Badge>
            )}

            {isInactive && (
              <Badge variant="inactive" className="text-[10px] px-1.5 py-0 h-4.5 font-medium">
                비공개
              </Badge>
            )}
          </div>

          <h3 className="text-[15px] font-bold text-[#141A24] mt-1.5 leading-snug break-words group-hover:text-[#0078FF] transition-colors">
            {link.title}
          </h3>

          {link.description && (
            <p className="text-[13px] text-[#697383] mt-1 leading-relaxed line-clamp-2">
              {link.description}
            </p>
          )}

          {/* 클릭 통계 & 링크 도메인 표시 */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-[#99A1B1]">
            <span className="truncate max-w-[200px]">
              {link.url.replace(/^https?:\/\//i, "")}
            </span>
            <span>•</span>
            <span>
              조회 <strong className="font-semibold text-[#697383]">{link.clickCount || 0}</strong>회
            </span>
          </div>
        </div>

        {/* 우측 액션 영역 */}
        <div
          data-card-actions
          onClick={(e) => isManageMode && e.stopPropagation()}
          className="shrink-0 flex items-center gap-1 self-center pl-1"
        >
          {isManageMode ? (
            <div className="flex items-center gap-1.5 bg-[#F2F3F8] p-1 rounded-[10px]">
              <Switch
                checked={link.isActive}
                onCheckedChange={() => onToggleActive(link.id)}
                aria-label="노출 여부 토글"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(link);
                }}
                className="w-8 h-8 rounded-[8px] bg-white text-[#354153] cursor-pointer hover:text-[#0078FF] hover:bg-[#EBF5FF] flex items-center justify-center transition"
                title="수정하기"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(link);
                }}
                className="w-8 h-8 rounded-[8px] bg-white text-[#697383] cursor-pointer hover:text-[#FF3A5B] hover:bg-[#FFF0F3] flex items-center justify-center transition"
                title="삭제하기"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-[10px] bg-[#F2F3F8] group-hover:bg-[#EBF5FF] text-[#697383] group-hover:text-[#0078FF] flex items-center justify-center transition">
              <ExternalLink className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
