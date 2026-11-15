"use client";

import React from "react";
import Image from "next/image";
import { useAuthStore, getDisplayName } from "@/lib/authStore";

function formatDateTime(iso?: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 로그인한 사용자의 Firestore users/{uid} 문서 정보를 보여주는 카드
 */
export function UserInfoCard({ linkCount }: { linkCount?: number }) {
  const user = useAuthStore((s) => s.user);
  const userDoc = useAuthStore((s) => s.userDoc);

  if (!user) return null;

  // Firestore 문서가 아직 도착하지 않았다면 Auth 정보로 먼저 표시
  // 표시 이름은 이메일 앞부분 기준 (저장된 문서보다 현재 로그인 정보의 이메일을 우선)
  const name = getDisplayName(user.email ?? userDoc?.email, user.displayName);
  const email = userDoc?.email || user.email || "";
  const photoURL = userDoc?.photoURL || user.photoURL || "";

  return (
    <section className="rounded-2xl bg-white border border-[#E5E8EF] p-4 shadow-xs flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {photoURL ? (
          <Image
            src={photoURL}
            alt={`${name} 프로필 사진`}
            width={48}
            height={48}
            unoptimized
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full border border-[#E5E8EF] shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-[#EBF5FF] text-[#0078FF] flex items-center justify-center font-bold shrink-0">
            {name.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-[#141A24] truncate">{name}님의 MyLink</p>
          <p className="text-xs text-[#697383] truncate">{email}</p>
        </div>
        {typeof linkCount === "number" && (
          <div className="shrink-0 text-right">
            <p className="text-[11px] text-[#99A1B1]">내 링크</p>
            <p className="text-sm font-bold text-[#0078FF]">{linkCount}개</p>
          </div>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-[10px] bg-[#F9F9FB] border border-[#F2F3F8] px-3 py-2 min-w-0">
          <dt className="text-[#99A1B1]">가입일</dt>
          <dd className="font-semibold text-[#354153] mt-0.5 truncate">
            {userDoc ? formatDateTime(userDoc.createdAt) : "불러오는 중..."}
          </dd>
        </div>
        <div className="rounded-[10px] bg-[#F9F9FB] border border-[#F2F3F8] px-3 py-2 min-w-0">
          <dt className="text-[#99A1B1]">최근 로그인</dt>
          <dd className="font-semibold text-[#354153] mt-0.5 truncate">
            {userDoc ? formatDateTime(userDoc.lastLoginAt) : "불러오는 중..."}
          </dd>
        </div>
        <div className="col-span-2 rounded-[10px] bg-[#F9F9FB] border border-[#F2F3F8] px-3 py-2 min-w-0">
          <dt className="text-[#99A1B1]">저장 경로 (Firestore)</dt>
          <dd className="font-mono text-[#354153] mt-0.5 truncate" title={`users/${user.uid}/links`}>
            users/{user.uid}/links
          </dd>
        </div>
      </dl>
    </section>
  );
}
