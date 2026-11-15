"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Home,
  UserRound,
  Sliders,
  Link2,
  LogOut,
  Loader2,
} from "lucide-react";
import { User } from "firebase/auth";
import { useAuthStore, getDisplayName } from "@/lib/authStore";
import { useLinkStore } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function Avatar({ user, name, size }: { user: User; name: string; size: number }) {
  if (user.photoURL) {
    return (
      <Image
        src={user.photoURL}
        alt=""
        width={size}
        height={size}
        unoptimized
        referrerPolicy="no-referrer"
        className="rounded-full border border-[#E5E8EF] shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="rounded-full bg-[#EBF5FF] text-[#0078FF] font-bold flex items-center justify-center shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

/** 메뉴 항목 오른쪽의 작은 상태 표시 (현재 페이지, 켜짐 등) */
function ItemBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-auto text-[10px] font-bold text-[#0078FF] bg-[#EBF5FF] px-1.5 py-0.5 rounded-full">
      {children}
    </span>
  );
}

/**
 * 로그인 상태의 프로필 드롭다운 메뉴
 * - 트리거: 프로필 사진 + 이름 + ▾ (모바일은 사진만)
 * - 계정 정보(이름/이메일/링크 통계) → 페이지 이동 → 링크 관리/공유 → 로그아웃
 */
export function ProfileMenu({ user, onToast }: { user: User; onToast?: (msg: string) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const signOut = useAuthStore((s) => s.signOut);
  const links = useLinkStore((s) => s.links);
  const linksStatus = useLinkStore((s) => s.linksStatus);
  const isManageMode = useLinkStore((s) => s.isManageMode);
  const setManageMode = useLinkStore((s) => s.setManageMode);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const name = getDisplayName(user.email, user.displayName);
  const publicCount = links.filter((l) => l.isActive).length;
  const isHome = pathname === "/";
  const isMyPage = pathname === "/mypage";

  const handleToggleManage = () => {
    if (isHome) {
      setManageMode(!isManageMode);
      onToast?.(isManageMode ? "보기 모드로 전환했습니다." : "링크 관리 모드를 켰습니다.");
    } else {
      // 관리 모드는 메인 페이지 기능이므로 이동 후 켬
      setManageMode(true);
      router.push("/");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/`);
      onToast?.("내 페이지 링크가 복사되었습니다.");
    } catch {
      onToast?.("클립보드 복사에 실패했습니다.");
    }
  };

  const handleSignOut = async (e: Event) => {
    // 로그아웃이 끝날 때까지 메뉴를 열어둬 진행 상태를 보여줌
    e.preventDefault();
    setIsSigningOut(true);
    try {
      await signOut();
      onToast?.("로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      onToast?.("로그아웃 중 문제가 발생했습니다.");
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="group h-8 pl-1 pr-1.5 sm:pr-2 rounded-full border border-[#E5E8EF] bg-white hover:bg-[#F2F3F8] data-[state=open]:bg-[#F2F3F8] data-[state=open]:border-[#CBD1DC] flex items-center gap-1.5 min-w-0 transition outline-none focus-visible:ring-2 focus-visible:ring-[#0078FF] cursor-pointer"
        aria-label={`${name}님 계정 메뉴`}
      >
        <Avatar user={user} name={name} size={24} />
        <span className="hidden sm:flex items-baseline min-w-0 text-[12px] font-semibold text-[#141A24]">
          <span className="truncate max-w-[120px]">{name}</span>
          <span className="shrink-0">님</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-[#99A1B1] shrink-0 transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[260px]">
        {/* 계정 정보 */}
        <div className="flex items-center gap-3 px-2.5 pt-2 pb-2.5">
          <Avatar user={user} name={name} size={40} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#141A24] truncate">{name}님</p>
            <p className="text-[11px] text-[#697383] truncate">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 px-1 pb-1.5">
          <div className="rounded-[9px] bg-[#F9F9FB] border border-[#F2F3F8] px-2.5 py-1.5">
            <p className="text-[10px] text-[#99A1B1]">전체 링크</p>
            <p className="text-[13px] font-bold text-[#141A24]">
              {linksStatus === "ready" ? `${links.length}개` : "-"}
            </p>
          </div>
          <div className="rounded-[9px] bg-[#F9F9FB] border border-[#F2F3F8] px-2.5 py-1.5">
            <p className="text-[10px] text-[#99A1B1]">공개 중</p>
            <p className="text-[13px] font-bold text-[#04CA81]">
              {linksStatus === "ready" ? `${publicCount}개` : "-"}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* 페이지 이동 */}
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => !isHome && router.push("/")}>
            <Home className="w-4 h-4 text-[#99A1B1]" />
            <span>내 프로필 페이지</span>
            {isHome && <ItemBadge>현재</ItemBadge>}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => !isMyPage && router.push("/mypage")}>
            <UserRound className="w-4 h-4 text-[#99A1B1]" />
            <span>마이페이지</span>
            {isMyPage && <ItemBadge>현재</ItemBadge>}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* 링크 관리 & 공유 */}
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={handleToggleManage}>
            <Sliders className="w-4 h-4 text-[#99A1B1]" />
            <span>{isHome && isManageMode ? "보기 모드로 전환" : "링크 관리 모드"}</span>
            {isHome && isManageMode && <ItemBadge>켜짐</ItemBadge>}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCopyLink}>
            <Link2 className="w-4 h-4 text-[#99A1B1]" />
            <span>내 페이지 링크 복사</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={handleSignOut} disabled={isSigningOut}>
          {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          <span>{isSigningOut ? "로그아웃 중..." : "로그아웃"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
