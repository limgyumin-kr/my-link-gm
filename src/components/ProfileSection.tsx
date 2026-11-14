"use client";

import React, { useState } from "react";
import Image from "next/image";
import { UserProfile, SocialLink } from "@/types/link";
import { SocialIcon, Check, Copy } from "@/components/icons";

interface ProfileSectionProps {
  profile: UserProfile;
  socials: SocialLink[];
  onToast: (msg: string) => void;
}

export function ProfileSection({ profile, socials, onToast }: ProfileSectionProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async (emailUrl: string) => {
    const rawEmail = emailUrl.replace(/^mailto:/i, "");
    try {
      await navigator.clipboard.writeText(rawEmail);
      setCopiedEmail(true);
      onToast("이메일 주소가 클립보드에 복사되었습니다.");
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      onToast(rawEmail);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-[#E5E8EF] p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {/* 80x80px 아바타 (rounded-2xl) */}
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#E5E8EF] shrink-0 bg-[#F2F3F8]">
          <Image
            src={profile.avatarUrl || "/profile.jpg"}
            alt={profile.displayName}
            fill
            sizes="80px"
            priority
            className="object-cover"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#141A24] leading-tight truncate">
              {profile.displayName}
            </h1>
            <span className="px-2 py-0.5 rounded-[6px] bg-[#EBF5FF] text-[#0078FF] text-[11px] font-semibold tracking-tight">
              PRO
            </span>
          </div>
          <p className="text-[14px] text-[#697383] mt-1 font-semibold truncate">
            {profile.role}
          </p>
          <p className="text-[13px] text-[#99A1B1] mt-0.5 line-clamp-2 leading-relaxed">
            {profile.bio}
          </p>
        </div>
      </div>

      {/* 1px 헤어라인 디바이더 */}
      <div className="h-[1px] bg-[#E5E8EF] w-full" />

      {/* 태그 리스트 */}
      {profile.tags && profile.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium bg-[#F2F3F8] text-[#4A5667] px-2 py-0.5 rounded-[6px]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 소셜 아이콘 바 (원형 SVG 버튼) */}
      <div className="flex items-center gap-2 pt-1">
        {socials.map((social) => {
          const isMail = social.platform === "mail" || social.url.startsWith("mailto:");

          if (isMail) {
            return (
              <button
                key={social.platform}
                onClick={() => handleCopyEmail(social.url)}
                className="flex-1 h-10 px-3 rounded-[10px] bg-[#F2F3F8] hover:bg-[#E5E8EF] text-[#354153] flex items-center justify-center gap-1.5 text-xs font-semibold transition socar-press active:scale-[0.96]"
                title={social.label}
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#04CA81]" />
                    <span>복사됨</span>
                  </>
                ) : (
                  <>
                    <SocialIcon platform={social.platform} className="w-3.5 h-3.5 text-[#0078FF]" />
                    <span>{social.label}</span>
                  </>
                )}
              </button>
            );
          }

          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-10 px-3 rounded-[10px] bg-[#F2F3F8] hover:bg-[#E5E8EF] text-[#354153] flex items-center justify-center gap-1.5 text-xs font-semibold transition socar-press active:scale-[0.96]"
              title={social.label}
            >
              <SocialIcon platform={social.platform} className="w-3.5 h-3.5 text-[#354153]" />
              <span className="truncate">{social.label}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
