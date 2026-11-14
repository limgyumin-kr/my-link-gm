"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ExternalLink, Loader2, Pencil, Trash2, X } from "lucide-react";
import { LinkItem } from "@/types/link";
import { validateUrl } from "@/lib/url";

interface EditableLinkRowProps {
  link: LinkItem;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  /** 저장 성공 시 resolve, 실패 시 reject (편집 상태 유지) */
  onSave: (updates: { title: string; url: string }) => Promise<void>;
  onRequestDelete: () => void;
}

export function EditableLinkRow({
  link,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onRequestDelete,
}: EditableLinkRowProps) {
  if (isEditing) {
    // 편집 모드 진입 시마다 새로 마운트되어 현재 링크 값으로 초기화됨
    return <InlineLinkEditor link={link} onCancel={onCancelEdit} onSave={onSave} />;
  }

  return (
    <div
      onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
      className="group relative bg-white hover:bg-[#F9F9FB] rounded-[14px] border border-[#E5E8EF] hover:border-[#CBD1DC] pl-4 pr-2 py-2.5 transition flex items-center justify-between gap-3 cursor-pointer shadow-xs socar-press active:scale-[0.98]"
    >
      <span className="text-sm font-bold text-[#141A24] group-hover:text-[#5B5FC7] transition-colors truncate">
        {link.title}
      </span>

      <div className="flex items-center gap-1 shrink-0">
        <ExternalLink className="w-4 h-4 text-[#99A1B1] group-hover:text-[#5B5FC7] transition-colors mr-1" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStartEdit();
          }}
          className="w-8 h-8 rounded-[8px] text-[#99A1B1] hover:text-[#5B5FC7] hover:bg-[#EEEFFB] flex items-center justify-center transition cursor-pointer"
          title="수정"
          aria-label={`'${link.title}' 수정`}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRequestDelete();
          }}
          className="w-8 h-8 rounded-[8px] text-[#99A1B1] hover:text-[#FF3A5B] hover:bg-[#FFF0F3] flex items-center justify-center transition cursor-pointer"
          title="삭제"
          aria-label={`'${link.title}' 삭제`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface InlineLinkEditorProps {
  link: LinkItem;
  onCancel: () => void;
  onSave: (updates: { title: string; url: string }) => Promise<void>;
}

function InlineLinkEditor({ link, onCancel: onCancelEdit, onSave }: InlineLinkEditorProps) {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // 마운트 시 제목 입력란 전체 선택
  useEffect(() => {
    titleInputRef.current?.select();
  }, []);

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const nextErrors: { title?: string; url?: string } = {};

    if (!trimmedTitle) nextErrors.title = "제목을 입력해주세요.";
    else if (trimmedTitle.length > 50) nextErrors.title = "제목은 50자 이내로 입력해주세요.";

    const validation = validateUrl(url.trim());
    if (!url.trim()) nextErrors.url = "URL을 입력해주세요.";
    else if (!validation.isValid)
      nextErrors.url = validation.errorMessage || "올바른 웹 주소를 입력해주세요.";

    if (nextErrors.title || nextErrors.url) {
      setErrors(nextErrors);
      return;
    }

    // 변경 사항이 없으면 저장 요청 없이 종료
    if (trimmedTitle === link.title && validation.normalizedUrl === link.url) {
      onCancelEdit();
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ title: trimmedTitle, url: validation.normalizedUrl });
    } catch {
      setErrors({ title: "저장에 실패했습니다. 다시 시도해주세요." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // 한글 조합 중 Enter 무시
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancelEdit();
    }
  };

    return (
      <div className="bg-white rounded-[14px] border-2 border-[#5B5FC7] px-3.5 py-3 shadow-xs flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={`edit-title-${link.id}`} className="text-[11px] font-semibold text-[#697383]">
            제목
          </label>
          <input
            id={`edit-title-${link.id}`}
            ref={titleInputRef}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            maxLength={60}
            aria-invalid={Boolean(errors.title)}
            className={`h-9 w-full rounded-[10px] border px-3 text-sm font-semibold text-[#141A24] outline-none transition focus:ring-2 focus:ring-[#5B5FC7]/40 disabled:opacity-60 ${
              errors.title ? "border-[#FF3A5B]" : "border-[#E5E8EF] focus:border-[#5B5FC7]"
            }`}
          />
          {errors.title && <p className="text-[11px] text-[#FF3A5B]">{errors.title}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={`edit-url-${link.id}`} className="text-[11px] font-semibold text-[#697383]">
            URL
          </label>
          <input
            id={`edit-url-${link.id}`}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (errors.url) setErrors((prev) => ({ ...prev, url: undefined }));
            }}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            inputMode="url"
            aria-invalid={Boolean(errors.url)}
            className={`h-9 w-full rounded-[10px] border px-3 text-[13px] text-[#354153] outline-none transition focus:ring-2 focus:ring-[#5B5FC7]/40 disabled:opacity-60 ${
              errors.url ? "border-[#FF3A5B]" : "border-[#E5E8EF] focus:border-[#5B5FC7]"
            }`}
          />
          {errors.url && <p className="text-[11px] text-[#FF3A5B]">{errors.url}</p>}
        </div>

        <div className="flex items-center justify-end gap-1.5 pt-1">
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isSaving}
            className="h-8 px-3 rounded-[9px] text-xs font-semibold text-[#697383] bg-[#F2F3F8] hover:bg-[#E5E8EF] flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            취소
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 px-3 rounded-[9px] text-xs font-semibold text-white bg-[#5B5FC7] hover:bg-[#4E52B5] flex items-center gap-1 transition disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    );
}
