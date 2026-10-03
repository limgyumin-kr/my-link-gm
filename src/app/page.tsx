"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "tech" | "projects" | "strengths">("all");
  const email = "gyumin@example.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  const techStacks = [
    { name: "React 19", category: "FRONTEND", level: "CORE", bg: "bg-[#38BDF8]", text: "text-black" },
    { name: "Next.js 16", category: "FRAMEWORK", level: "CORE", bg: "bg-[#FFE600]", text: "text-black" },
    { name: "TypeScript", category: "LANGUAGE", level: "ADVANCED", bg: "bg-[#818CF8]", text: "text-black" },
    { name: "Tailwind CSS v4", category: "STYLING", level: "CORE", bg: "bg-[#2DD4BF]", text: "text-black" },
    { name: "NextAuth.js", category: "AUTH", level: "DAILY", bg: "bg-[#F472B6]", text: "text-black" },
    { name: "Git & GitHub", category: "VCS", level: "DAILY", bg: "bg-[#FB923C]", text: "text-black" },
    { name: "Vercel", category: "DEVOPS", level: "DEPLOY", bg: "bg-[#A3E635]", text: "text-black" },
    { name: "Figma", category: "DESIGN", level: "UI/UX", bg: "bg-[#E879F9]", text: "text-black" },
  ];

  const projects = [
    {
      id: "01",
      title: "MyLink 개발자 허브",
      desc: "Next.js 16과 Neobrutalism 디자인을 결합하여 개성과 포트폴리오를 한눈에 전달하는 프로필 플랫폼",
      tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "NextAuth"],
      status: "LIVE OPERATING",
      statusColor: "bg-[#A3E635]",
      link: "https://github.com/limgyumin-kr",
      badgeColor: "bg-[#FFE600]",
    },
    {
      id: "02",
      title: "인터랙티브 웹 컴포넌트 킷",
      desc: "웹 접근성과 쫀득한 마이크로 인터랙션을 제공하는 네오브루탈리즘 테마의 프론트엔드 UI 컴포넌트 킷",
      tags: ["React 19", "Tailwind CSS", "Micro-Interactions", "WCAG"],
      status: "IN DEVELOPMENT",
      statusColor: "bg-[#38BDF8]",
      link: "https://github.com/limgyumin-kr",
      badgeColor: "bg-[#F472B6]",
    },
    {
      id: "03",
      title: "AI 스마트 워크플로우 툴",
      desc: "LLM API를 통합하여 일상적인 작업과 코딩 생산성을 비약적으로 높여주는 프론트엔드 생산성 도구",
      tags: ["AI Integration", "Next.js API", "TypeScript", "Prompt Eng"],
      status: "PROTOTYPE",
      statusColor: "bg-[#FB923C]",
      link: "https://github.com/limgyumin-kr",
      badgeColor: "bg-[#C084FC]",
    },
  ];

  const superpowers = [
    {
      badge: "01 / INTERFACE",
      title: "반응형 & 피셀 퍼펙트 UX",
      desc: "모바일, 태블릿, 데스크톱 어떤 화면에서도 시각적 깨짐 없이 쫀득하고 직관적인 사용자 경험을 선사합니다.",
      bg: "bg-[#FFE600]",
      border: "border-black",
      icon: "⚡",
    },
    {
      badge: "02 / CODE",
      title: "지속 가능한 클린 코드",
      desc: "Next.js 16 App Router와 TypeScript 기반의 견고한 타입 설계, 동료가 읽기 편한 컴포넌트 구조를 추구합니다.",
      bg: "bg-[#A3E635]",
      border: "border-black",
      icon: "🛠️",
    },
    {
      badge: "03 / TEAM",
      title: "능동적인 소통과 협업",
      desc: "빠른 피드백 수용, 투명한 진행 상황 공유, 함께 배우고 문제를 풀어가는 유연한 팀 문화를 만듭니다.",
      bg: "bg-[#FF6B97]",
      border: "border-black",
      icon: "🚀",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5] dark:bg-[#0c0d12] text-black dark:text-white font-sans bg-neo-grid selection:bg-[#FFE600] selection:text-black">
      
      {/* 1. 상단 무한 롤링 마키 티커 (Marquee) */}
      <div className="w-full bg-[#FFE600] text-black border-b-[3px] border-black py-2.5 overflow-hidden font-black text-xs sm:text-sm tracking-wider uppercase select-none shadow-[0px_3px_0px_0px_#000]">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          <span>⚡ LIM GYUMIN ★ FRONTEND DEVELOPER</span>
          <span>★</span>
          <span>🚀 AVAILABLE FOR OPPORTUNITIES</span>
          <span>★</span>
          <span>💻 NEXT.JS 16 & REACT 19</span>
          <span>★</span>
          <span>🎨 NEOBRUTALISM DESIGN SYSTEM</span>
          <span>★</span>
          <span>✨ CRAFTING DELIGHTFUL EXPERIENCES</span>
          <span>★</span>
          <span>📍 SEOUL, KOREA</span>
          <span>★</span>
          <span>⚡ LIM GYUMIN ★ FRONTEND DEVELOPER</span>
          <span>★</span>
          <span>🚀 AVAILABLE FOR OPPORTUNITIES</span>
          <span>★</span>
          <span>💻 NEXT.JS 16 & REACT 19</span>
          <span>★</span>
          <span>🎨 NEOBRUTALISM DESIGN SYSTEM</span>
          <span>★</span>
        </div>
      </div>

      {/* 2. 네오브루탈리즘 네비게이션 헤더 */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#161722] border-b-[3px] border-black dark:border-white shadow-[0px_4px_0px_0px_#000] dark:shadow-[0px_4px_0px_0px_#fff]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* 로고 스티커 */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 bg-[#FFE600] border-2 sm:border-[3px] border-black shadow-[3px_3px_0px_0px_#000] -rotate-1 font-black text-sm sm:text-base tracking-tight text-black flex items-center gap-2">
              <span className="inline-block animate-bounce">⚡</span>
              <span>MYLINK.DEV</span>
            </div>
            <span className="hidden md:inline-block px-2 py-0.5 text-[11px] font-mono font-bold bg-[#A3E635] text-black border-2 border-black rotate-1">
              v2.0_NEO
            </span>
          </div>

          {/* 상태 배지 & 액션 버튼 */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#A3E635] text-black border-2 border-black font-extrabold text-xs shadow-[2px_2px_0px_0px_#000]">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-ping inline-block" />
              <span className="hidden sm:inline">채용 / 협업 환영</span>
              <span className="sm:hidden">OPEN</span>
            </div>

            <a
              href="https://github.com/limgyumin-kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-[#252636] text-black dark:text-white border-2 border-black dark:border-white font-extrabold text-xs shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] dark:hover:shadow-[5px_5px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GITHUB</span>
            </a>
          </div>

        </div>
      </header>

      {/* 3. 본문 레이아웃 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* 좌측: 네오브루탈리즘 개발자 여권 / 프로필 카드 (lg:col-span-5) */}
          {/* ======================================================== */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            
            {/* 메인 윈도우 스타일 카드 */}
            <div className="bg-white dark:bg-[#161722] border-[3px] border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
              
              {/* 윈도우 헤더 바 */}
              <div className="bg-[#FFE600] text-black px-4 py-2.5 border-b-[3px] border-black flex items-center justify-between font-mono font-black text-xs uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 rounded-full bg-[#FF5F56] border-2 border-black inline-block" />
                  <span className="h-3.5 w-3.5 rounded-full bg-[#FFBD2E] border-2 border-black inline-block" />
                  <span className="h-3.5 w-3.5 rounded-full bg-[#27C93F] border-2 border-black inline-block" />
                  <span className="ml-2">GYUMIN_DEV.EXE</span>
                </div>
                <span className="bg-black text-[#FFE600] px-2 py-0.5 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>

              {/* 프로필 이미지 & 아바타 영역 */}
              <div className="p-6 sm:p-7">
                <div className="relative mb-6">
                  
                  {/* 아바타 테두리 및 그림자 */}
                  <div className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 bg-[#38BDF8] border-[3px] border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] overflow-hidden group">
                    <Image
                      src="/profile.jpg"
                      alt="임규민 프로필"
                      width={176}
                      height={176}
                      priority
                      className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* 튀어나온 스티커 배지 */}
                  <div className="absolute -bottom-3 -right-2 sm:right-6 bg-[#FF6B97] text-black px-3 py-1 border-2 border-black font-black text-xs shadow-[3px_3px_0px_0px_#000] rotate-3 uppercase">
                    ★ DEV LEVEL 01
                  </div>
                </div>

                {/* 이름 및 타이틀 */}
                <div className="text-center sm:text-left space-y-2">
                  <div className="inline-block bg-black text-[#FFE600] px-3 py-1 font-mono font-black text-xs uppercase tracking-wider mb-1">
                    FRONTEND ENGINEER
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white uppercase">
                    임규민
                  </h1>
                  <p className="font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
                    // LIM GYUMIN &lt;limgyumin.kr&gt;
                  </p>
                </div>

                {/* 자기소개 */}
                <div className="mt-5 p-4 bg-[#FFFDF0] dark:bg-[#1f202e] border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] text-xs sm:text-sm font-semibold leading-relaxed break-keep">
                  <p className="text-zinc-800 dark:text-zinc-200">
                    &ldquo;사용자가 마주하는 일상의 불편함을 기술과 직관적인 UI로 해결하는 개발자입니다. 견고한 클린 코드와 살아 숨 쉬는 인터랙션을 좋아합니다.&rdquo;
                  </p>
                </div>

                {/* 스펙 태그 그리드 */}
                <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                  <div className="p-2.5 bg-[#A3E635] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    <div className="text-[10px] text-zinc-800 font-extrabold">LOCATION</div>
                    <div>📍 Seoul, KR</div>
                  </div>
                  <div className="p-2.5 bg-[#38BDF8] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    <div className="text-[10px] text-zinc-800 font-extrabold">ROLE</div>
                    <div>🚀 Junior Front</div>
                  </div>
                  <div className="p-2.5 bg-[#F472B6] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    <div className="text-[10px] text-zinc-800 font-extrabold">CORE STACK</div>
                    <div>⚡ React / Next</div>
                  </div>
                  <div className="p-2.5 bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    <div className="text-[10px] text-zinc-800 font-extrabold">PASSION</div>
                    <div>🔥 100% READY</div>
                  </div>
                </div>

                <div className="my-6 border-b-[3px] border-black dark:border-white" />

                {/* 메인 액션 버튼 */}
                <div className="space-y-3">
                  <button
                    onClick={handleCopyEmail}
                    type="button"
                    className={`w-full py-3.5 px-4 font-black text-sm uppercase tracking-wider border-2 sm:border-[3px] border-black transition-all cursor-pointer flex items-center justify-between shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_0px_#000] ${
                      copied
                        ? "bg-[#A3E635] text-black"
                        : "bg-[#FFE600] text-black hover:bg-[#FFF066]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>📋</span>
                      <span>{copied ? "EMAIL COPIED! ✓" : "COPY EMAIL"}</span>
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 bg-black text-white">
                      {copied ? "복사완료!" : email}
                    </span>
                  </button>

                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href="https://github.com/limgyumin-kr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-3 bg-white dark:bg-[#252636] text-black dark:text-white font-extrabold text-xs uppercase tracking-wider text-center border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] dark:hover:shadow-[5px_5px_0px_0px_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>★ GITHUB</span>
                      <span>↗</span>
                    </a>

                    <a
                      href={`mailto:${email}`}
                      className="py-3 px-3 bg-[#38BDF8] text-black font-extrabold text-xs uppercase tracking-wider text-center border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>✉️ MAILTO</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* 미니 스티커 박스: 데브 모토 */}
            <div className="p-4 bg-[#FF6B97] text-black border-[3px] border-black shadow-[5px_5px_0px_0px_#000] rotate-[-1deg]">
              <div className="flex items-center justify-between mb-1.5 font-mono text-[11px] font-black uppercase">
                <span>[ MANIFESTO ]</span>
                <span>★ NO BORING CODE ★</span>
              </div>
              <p className="font-extrabold text-sm leading-snug">
                &ldquo;코드는 간결하게, 경험은 짜릿하게. 사용자를 미소 짓게 만드는 디테일을 만듭니다.&rdquo;
              </p>
            </div>

          </aside>

          {/* ======================================================== */}
          {/* 우측: 네오브루탈리즘 콘텐츠 & 벤토 섹션 (lg:col-span-7) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 레트로 폴더 탭 네비게이터 */}
            <div className="flex flex-wrap items-center gap-2 select-none">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2.5 font-black text-xs sm:text-sm uppercase tracking-wider border-2 sm:border-[3px] border-black transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#FFE600] text-black shadow-[4px_4px_0px_0px_#000] -translate-y-1"
                    : "bg-white dark:bg-[#1f202e] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-y-0.5"
                }`}
              >
                📁 OVERVIEW (전체)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tech")}
                className={`px-4 py-2.5 font-black text-xs sm:text-sm uppercase tracking-wider border-2 sm:border-[3px] border-black transition-all cursor-pointer ${
                  activeTab === "tech"
                    ? "bg-[#38BDF8] text-black shadow-[4px_4px_0px_0px_#000] -translate-y-1"
                    : "bg-white dark:bg-[#1f202e] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-y-0.5"
                }`}
              >
                ⚡ TECH STACK
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("projects")}
                className={`px-4 py-2.5 font-black text-xs sm:text-sm uppercase tracking-wider border-2 sm:border-[3px] border-black transition-all cursor-pointer ${
                  activeTab === "projects"
                    ? "bg-[#A3E635] text-black shadow-[4px_4px_0px_0px_#000] -translate-y-1"
                    : "bg-white dark:bg-[#1f202e] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-y-0.5"
                }`}
              >
                🚀 PROJECTS
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("strengths")}
                className={`px-4 py-2.5 font-black text-xs sm:text-sm uppercase tracking-wider border-2 sm:border-[3px] border-black transition-all cursor-pointer ${
                  activeTab === "strengths"
                    ? "bg-[#F472B6] text-black shadow-[4px_4px_0px_0px_#000] -translate-y-1"
                    : "bg-white dark:bg-[#1f202e] text-black dark:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:-translate-y-0.5"
                }`}
              >
                💡 SUPERPOWERS
              </button>
            </div>

            {/* 1. 핵심 슈퍼파워 / 강점 카드 */}
            {(activeTab === "all" || activeTab === "strengths") && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b-[3px] border-black dark:border-white pb-2">
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <span className="p-1 bg-[#FFE600] border-2 border-black text-black">⚡</span>
                    <span>CORE SUPERPOWERS // 핵심 역량</span>
                  </h2>
                  <span className="font-mono text-xs font-bold text-zinc-500">
                    [ 03 PILLARS ]
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {superpowers.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-5 ${item.bg} text-black border-[3px] border-black shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_#000] transition-all flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white">
                            {item.badge}
                          </span>
                          <span className="text-2xl">{item.icon}</span>
                        </div>
                        <h3 className="font-black text-base uppercase leading-snug mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs font-bold leading-relaxed text-zinc-900">
                          {item.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t-2 border-black/40 font-mono text-[10px] font-black">
                        STATUS: VERIFIED ★
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2. 테크 인벤토리 (기술 스택) */}
            {(activeTab === "all" || activeTab === "tech") && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b-[3px] border-black dark:border-white pb-2">
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <span className="p-1 bg-[#38BDF8] border-2 border-black text-black">🛠️</span>
                    <span>TECH INVENTORY // 기술 스택</span>
                  </h2>
                  <span className="font-mono text-xs font-bold text-zinc-500">
                    [ READY TO SHIP ]
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {techStacks.map((tech) => (
                    <div
                      key={tech.name}
                      className={`p-4 ${tech.bg} ${tech.text} border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all flex flex-col justify-between`}
                    >
                      <div>
                        <div className="font-mono text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-black text-white inline-block mb-2">
                          {tech.category}
                        </div>
                        <div className="font-black text-base sm:text-lg leading-tight uppercase">
                          {tech.name}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-2 border-t-2 border-black flex items-center justify-between font-mono text-[10px] font-black">
                        <span>PROFICIENCY</span>
                        <span className="px-1.5 py-0.2 bg-white text-black border border-black">
                          {tech.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. 프로젝트 전시관 */}
            {(activeTab === "all" || activeTab === "projects") && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b-[3px] border-black dark:border-white pb-2">
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <span className="p-1 bg-[#A3E635] border-2 border-black text-black">📂</span>
                    <span>PROJECT ARCHIVE // 주요 프로젝트</span>
                  </h2>
                  <a
                    href="https://github.com/limgyumin-kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-black uppercase text-black dark:text-[#FFE600] hover:underline"
                  >
                    VIEW ALL ON GITHUB ↗
                  </a>
                </div>

                <div className="space-y-5">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-white dark:bg-[#161722] border-[3px] border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] p-5 sm:p-6 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000] dark:hover:shadow-[8px_8px_0px_0px_#fff] transition-all group"
                    >
                      {/* 프로젝트 헤더 바 */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2.5 py-1 ${proj.badgeColor} text-black font-mono font-black text-xs border-2 border-black`}>
                            PROJECT #{proj.id}
                          </span>
                          <span className={`px-2 py-0.5 ${proj.statusColor} text-black font-mono font-black text-[10px] border-2 border-black`}>
                            ● {proj.status}
                          </span>
                        </div>

                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-black text-[#FFE600] font-mono font-black text-xs uppercase border-2 border-black hover:bg-[#FFE600] hover:text-black transition-colors flex items-center gap-1"
                        >
                          <span>REPO</span>
                          <span>↗</span>
                        </a>
                      </div>

                      {/* 타이틀 및 설명 */}
                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white mb-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4 break-keep">
                        {proj.desc}
                      </p>

                      {/* 태그 목록 */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t-2 border-zinc-200 dark:border-zinc-800">
                        {proj.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-[#FFFDF0] dark:bg-[#252636] text-black dark:text-white font-mono font-bold text-xs border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. 네오브루탈리즘 문의 / 제안 배너 카드 */}
            <section className="bg-[#FFE600] text-black border-[3px] border-black shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-block px-2.5 py-0.5 bg-black text-[#FFE600] font-mono font-black text-xs uppercase">
                    COLLABORATION & HIRE
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">
                    HAVE A COOL PROJECT? <br className="hidden sm:inline" />LET&apos;S TALK!
                  </h3>
                  <p className="text-xs sm:text-sm font-extrabold text-zinc-900 max-w-md">
                    스타트업, 웹 서비스, 사이드 프로젝트, 커피챗까지! 주니어 개발자로서 함께 성장할 팀을 찾고 있습니다.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCopyEmail}
                    type="button"
                    className="px-5 py-3 bg-black text-white hover:bg-zinc-800 font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#fff] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
                  >
                    {copied ? "COPIED! ✓" : "이메일 복사하기"}
                  </button>
                  <a
                    href={`mailto:${email}`}
                    className="px-5 py-3 bg-[#FF6B97] text-black hover:bg-[#ff85ab] font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
                  >
                    메일 보내기 ↗
                  </a>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* 푸터 영역 */}
        <footer className="mt-16 pt-8 border-t-[3px] border-black dark:border-white flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs font-black">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-[#FFE600] border-2 border-black text-black">⚡</span>
            <span>© {new Date().getFullYear()} LIM GYUMIN. BUILT WITH NEXT.JS 16 & NEOBRUTALISM.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-[#A3E635] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              PIXEL PERFECT
            </span>
            <span className="px-2 py-1 bg-[#38BDF8] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              HIGH CONTRAST
            </span>
          </div>
        </footer>
      </main>

    </div>
  );
}
