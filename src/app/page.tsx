"use client";

import { useState } from "react";
import Image from "next/image";

// SOCAR Frame 2.0 정갈한 SVG 아이콘 (이모지 대신 정식 아이콘 사용)
function IconCopy({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconGithub({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function IconMail({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconExternal({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconRobot({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M12 2v6" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function IconCode({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconZap({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "ROBOTICS" | "WEB">("ALL");
  const email = "limgyumin22@naver.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const techStacks = [
    { name: "Lerobot S-101", group: "ROBOTICS", level: "ACTIVE" },
    { name: "Python / PyTorch", group: "AI & ML", level: "CORE" },
    { name: "Robot Learning", group: "ROBOTICS", level: "CORE" },
    { name: "Computer Vision", group: "AI & ML", level: "CORE" },
    { name: "Hardware I/O", group: "ROBOTICS", level: "CORE" },
    { name: "React 19", group: "WEB", level: "CORE" },
    { name: "Next.js 16", group: "WEB", level: "CORE" },
    { name: "TypeScript", group: "WEB", level: "PRO" },
    { name: "Tailwind CSS", group: "WEB", level: "CORE" },
    { name: "Git & GitHub", group: "DEV OPS", level: "DAILY" },
  ];

  const projects = [
    {
      id: "01",
      category: "ROBOTICS",
      title: "Lerobot S-101 AI 배터리 전압 분류 로봇 시스템",
      desc: "Lerobot S-101 로봇팔의 모션 및 비전 데이터를 직접 수집·학습시켜, 건전지의 전압을 판정하고 9V 기준으로 자동 분류 적재하는 스마트 로보틱스 솔루션입니다.",
      status: "연구 및 가동 중",
      tags: ["Lerobot S-101", "Python", "Robot Learning", "Computer Vision", "Hardware I/O"],
      rules: [
        { condition: "전압 < 9.0V", target: "방전 배터리 → RED BOX 적재", isAlert: true },
        { condition: "전압 ≥ 9.0V", target: "정상 배터리 → BLACK BOX 적재", isAlert: false },
      ],
      link: "https://github.com/limgyumin-kr",
    },
    {
      id: "02",
      category: "WEB",
      title: "MyLink 엔지니어 프로필 & 포트폴리오 허브",
      desc: "Next.js 16과 React 19를 기반으로 설계하여, 모바일 환경과 데스크톱 모두에서 빠른 탐색과 직관적인 정보 위계를 전달하는 개인 기술 플랫폼입니다.",
      status: "배포 운영 중",
      tags: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
      link: "https://github.com/limgyumin-kr/my-link-gm",
    },
    {
      id: "03",
      category: "WEB",
      title: "실시간 로봇 관절 & 모니터링 인터페이스 킷",
      desc: "로봇팔의 6축 관절 좌표와 배터리 검사 통계 및 픽앤플레이스 작업 현황을 실시간 웹소켓으로 시각화하는 인터페이스 컴포넌트 킷입니다.",
      status: "개발 진행 중",
      tags: ["React 19", "WebSocket", "Telemetry UI", "Dashboard"],
      link: "https://github.com/limgyumin-kr",
    },
  ];

  const filteredProjects = selectedFilter === "ALL" 
    ? projects 
    : projects.filter(p => p.category === selectedFilter);

  const capabilities = [
    {
      step: "01",
      title: "AI 로봇팔 제어 & 모션 데이터 학습",
      desc: "Lerobot S-101 로봇팔의 궤적 및 시각 데이터를 직접 학습시키고, 하드웨어 센서와 연동된 정밀 자동화 로직을 구축합니다.",
      icon: <IconRobot className="w-5 h-5 text-[#0078FF]" />,
    },
    {
      step: "02",
      title: "모던 웹 & 하드웨어 텔레메트리 융합",
      desc: "Next.js와 React 19 최신 스택을 활용하여 복잡한 센서 데이터와 제어 상태를 사용자 친화적인 웹 인터페이스로 시각화합니다.",
      icon: <IconCode className="w-5 h-5 text-[#0078FF]" />,
    },
    {
      step: "03",
      title: "강인한 피지컬과 집념의 문제 해결",
      desc: "189cm / 110kg의 탄탄한 체력과 끈기로 현장 하드웨어의 이슈부터 소프트웨어 결함까지 원인을 집요하게 추적하여 완수합니다.",
      icon: <IconZap className="w-5 h-5 text-[#0078FF]" />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F2F3F8] text-[#354153] font-sans antialiased pb-24">
      {/* TopAppBar (52px 헤더, 고정) */}
      <header className="sticky top-0 z-30 h-[52px] w-full bg-white border-b border-[#E5E8EF] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[18px] text-[#141A24] tracking-tight">임규민</span>
          <span className="text-[13px] text-[#697383] font-medium hidden sm:inline">로보틱스 & 풀스택 엔지니어</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/limgyumin-kr"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub 프로필 방문"
            className="h-8 px-3 rounded-[8px] bg-[#F2F3F8] text-[#354153] hover:bg-[#E5E8EF] active:scale-95 transition flex items-center gap-1.5 text-[13px] font-semibold socar-press"
          >
            <IconGithub className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">GitHub</span>
          </a>
          <button
            onClick={handleCopyEmail}
            className="h-8 px-3 rounded-[8px] bg-[#0078FF] text-white hover:bg-[#0069FF] active:scale-95 transition flex items-center gap-1.5 text-[13px] font-semibold socar-press"
          >
            {copied ? <IconCheck className="w-3.5 h-3.5" /> : <IconCopy className="w-3.5 h-3.5" />}
            <span>{copied ? "복사됨" : "이메일"}</span>
          </button>
        </div>
      </header>

      {/* Main Container (모바일 375px 기준 ~ 최대 640px 모바일/태블릿 최적화 컨테이너) */}
      <main className="max-w-xl mx-auto px-4 pt-4 flex flex-col gap-4">
        
        {/* Profile Card (16px radius, flat white, 1px divider) */}
        <section className="bg-white rounded-2xl border border-[#E5E8EF] p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#E5E8EF] shrink-0 bg-[#F2F3F8]">
              <Image
                src="/profile.jpg"
                alt="임규민 프로필"
                fill
                sizes="80px"
                priority
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold text-[#141A24] leading-tight truncate">
                  임규민
                </h1>
                <span className="px-2 py-0.5 rounded-[6px] bg-[#EBF5FF] text-[#0078FF] text-[12px] font-semibold tracking-tight">
                  ACTIVE
                </span>
              </div>
              <p className="text-[14px] text-[#697383] mt-1 font-medium">
                Robotics & Full-Stack AI Engineer
              </p>
              <p className="text-[13px] text-[#99A1B1] mt-0.5">
                현실의 물리적 하드웨어와 모던 웹을 연결합니다.
              </p>
            </div>
          </div>

          <div className="h-[1px] bg-[#E5E8EF] w-full" />

          {/* Quick Specification Table (숫자 bold + 단위 regular 컨벤션 준수) */}
          <div className="grid grid-cols-3 gap-2 text-center bg-[#F2F3F8] p-3 rounded-[12px]">
            <div>
              <p className="text-[12px] text-[#697383] font-medium">신체 규격</p>
              <p className="text-[15px] text-[#141A24] mt-0.5">
                <span className="font-bold">189</span>
                <span className="text-[13px] text-[#697383] ml-0.5">cm</span>
                <span className="mx-1 text-[#CBD1DC]">/</span>
                <span className="font-bold">110</span>
                <span className="text-[13px] text-[#697383] ml-0.5">kg</span>
              </p>
            </div>
            <div className="border-x border-[#CBD1DC]/60 px-1">
              <p className="text-[12px] text-[#697383] font-medium">로봇 제어</p>
              <p className="text-[15px] text-[#141A24] mt-0.5">
                <span className="font-bold">S-101</span>
                <span className="text-[13px] text-[#697383] ml-1">Learning</span>
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[#697383] font-medium">풀스택 웹</p>
              <p className="text-[15px] text-[#141A24] mt-0.5">
                <span className="font-bold">Next</span>
                <span className="text-[13px] text-[#697383] ml-0.5">.js 16</span>
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleCopyEmail}
              className="flex-1 h-11 rounded-[12px] bg-[#0078FF] text-white hover:bg-[#0069FF] font-semibold text-[14px] flex items-center justify-center gap-2 socar-press active:scale-[0.96]"
            >
              {copied ? <IconCheck className="w-4 h-4" /> : <IconMail className="w-4 h-4" />}
              <span>{copied ? "이메일 주소가 복사되었습니다" : "이메일로 문의하기"}</span>
            </button>
            <a
              href="https://github.com/limgyumin-kr"
              target="_blank"
              rel="noreferrer"
              className="h-11 px-4 rounded-[12px] bg-[#F2F3F8] text-[#354153] hover:bg-[#E5E8EF] font-semibold text-[14px] flex items-center justify-center gap-1.5 socar-press active:scale-[0.96]"
            >
              <IconGithub className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </section>

        {/* Capabilities Section (3 핵심 강점) */}
        <section className="bg-white rounded-2xl border border-[#E5E8EF] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-bold text-[#141A24]">핵심 역량</h2>
            <span className="text-[12px] text-[#697383]">3가지 핵심 축</span>
          </div>

          <div className="flex flex-col divide-y divide-[#E5E8EF]">
            {capabilities.map((item) => (
              <div key={item.step} className="py-3.5 first:pt-1 last:pb-1 flex items-start gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#EBF5FF] flex items-center justify-center shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#0078FF] tracking-wider">
                      STEP {item.step}
                    </span>
                    <h3 className="text-[14px] font-semibold text-[#141A24]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[13px] text-[#697383] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section with Chips */}
        <section className="bg-white rounded-2xl border border-[#E5E8EF] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#141A24]">주요 프로젝트</h2>
              <p className="text-[13px] text-[#697383] mt-0.5">연구 개발 및 실시간 운영 프로젝트</p>
            </div>
            <span className="text-[12px] font-bold text-[#0078FF] bg-[#EBF5FF] px-2 py-0.5 rounded-full">
              {filteredProjects.length}개
            </span>
          </div>

          {/* Chips Filter (SOCAR Frame Pill Chip Pattern) */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedFilter("ALL")}
              className={`h-9 px-4 rounded-full text-[13px] font-semibold transition socar-press active:scale-95 shrink-0 border ${
                selectedFilter === "ALL"
                  ? "bg-[#EBF5FF] border-[#0078FF] text-[#0078FF]"
                  : "bg-white border-[#E5E8EF] text-[#697383] hover:bg-[#F2F3F8]"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedFilter("ROBOTICS")}
              className={`h-9 px-4 rounded-full text-[13px] font-semibold transition socar-press active:scale-95 shrink-0 border ${
                selectedFilter === "ROBOTICS"
                  ? "bg-[#EBF5FF] border-[#0078FF] text-[#0078FF]"
                  : "bg-white border-[#E5E8EF] text-[#697383] hover:bg-[#F2F3F8]"
              }`}
            >
              로보틱스 & AI
            </button>
            <button
              onClick={() => setSelectedFilter("WEB")}
              className={`h-9 px-4 rounded-full text-[13px] font-semibold transition socar-press active:scale-95 shrink-0 border ${
                selectedFilter === "WEB"
                  ? "bg-[#EBF5FF] border-[#0078FF] text-[#0078FF]"
                  : "bg-white border-[#E5E8EF] text-[#697383] hover:bg-[#F2F3F8]"
              }`}
            >
              웹 & 인터페이스
            </button>
          </div>

          {/* Project List Cards */}
          <div className="flex flex-col gap-3">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-[14px] border border-[#E5E8EF] p-4 bg-[#F9F9FB] hover:border-[#CBD1DC] transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-[#0078FF] bg-[#EBF5FF] px-2 py-0.5 rounded-[6px]">
                      {proj.id}
                    </span>
                    <span className="text-[12px] font-medium text-[#697383]">
                      {proj.status}
                    </span>
                  </div>
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#697383] hover:text-[#0078FF] p-1 -m-1"
                    aria-label="상세 링크 열기"
                  >
                    <IconExternal className="w-4 h-4" />
                  </a>
                </div>

                <h3 className="text-[15px] font-bold text-[#141A24] mt-2 leading-snug">
                  {proj.title}
                </h3>
                <p className="text-[13px] text-[#697383] mt-1.5 leading-relaxed">
                  {proj.desc}
                </p>

                {/* Specific Robot Decision Rules Callout */}
                {proj.rules && (
                  <div className="mt-3 p-3 bg-white rounded-[10px] border border-[#E5E8EF] flex flex-col gap-2">
                    <div className="text-[12px] font-semibold text-[#141A24] flex items-center justify-between">
                      <span>자동 판정 로직</span>
                      <span className="text-[11px] text-[#0078FF] font-medium">9.0V 임계값</span>
                    </div>
                    {proj.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[12px] bg-[#F2F3F8] px-2.5 py-1.5 rounded-[6px]">
                        <span className="font-semibold text-[#354153]">{rule.condition}</span>
                        <span className={`font-semibold ${rule.isAlert ? "text-[#FF3A5B]" : "text-[#0078FF]"}`}>
                          {rule.target}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#E5E8EF]">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium bg-white border border-[#E5E8EF] text-[#697383] px-2 py-0.5 rounded-[6px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Matrix Section */}
        <section className="bg-white rounded-2xl border border-[#E5E8EF] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-bold text-[#141A24]">기술 스택</h2>
            <span className="text-[12px] text-[#697383]">주요 보유 기술</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {techStacks.map((tech) => (
              <div
                key={tech.name}
                className="p-3 rounded-[12px] bg-[#F9F9FB] border border-[#E5E8EF] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0078FF] tracking-tight">
                    {tech.group}
                  </span>
                  <span className="text-[10px] font-semibold text-[#697383] bg-white border border-[#E5E8EF] px-1.5 py-0.5 rounded-[4px]">
                    {tech.level}
                  </span>
                </div>
                <p className="text-[14px] font-bold text-[#141A24] mt-2">
                  {tech.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Plate */}
        <section className="bg-white rounded-2xl border border-[#E5E8EF] p-5 shadow-sm flex flex-col gap-3">
          <h2 className="text-[16px] font-bold text-[#141A24]">연락처</h2>
          <p className="text-[13px] text-[#697383]">
            로보틱스 연구, 프로젝트 협업 또는 문의사항은 언제든 편하게 연락해 주세요.
          </p>

          <div className="flex items-center justify-between p-3 rounded-[12px] bg-[#F2F3F8] border border-[#E5E8EF]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <IconMail className="w-4 h-4 text-[#0078FF] shrink-0" />
              <span className="text-[13px] font-medium text-[#141A24] truncate">{email}</span>
            </div>
            <button
              onClick={handleCopyEmail}
              className="text-[12px] font-semibold text-[#0078FF] hover:underline shrink-0 ml-2 socar-press"
            >
              {copied ? "복사완료" : "주소 복사"}
            </button>
          </div>
        </section>

        {/* Footer with Minimal Attribution */}
        <footer className="text-center py-6 text-[12px] text-[#99A1B1] flex flex-col gap-1">
          <p>© 2026 Gyumin Lim. All rights reserved.</p>
          <p className="text-[11px] text-[#B4BBCB]">
            Crafted following SOCAR Frame 2.0 design guidelines.
          </p>
        </footer>
      </main>

      {/* Bottom Sticky Action Bar (모바일 한 손 조작 환경 대응: 바텀 고정 액션 플레이트) */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#E5E8EF] py-3 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        <div className="max-w-xl mx-auto flex items-center gap-2.5">
          <button
            onClick={handleCopyEmail}
            className="flex-1 h-12 rounded-[14px] bg-[#0078FF] text-white hover:bg-[#0069FF] font-semibold text-[15px] flex items-center justify-center gap-2 socar-press active:scale-[0.96] shadow-sm"
          >
            {copied ? <IconCheck className="w-4 h-4" /> : <IconMail className="w-4 h-4" />}
            <span>{copied ? "이메일 복사 완료" : "협업 문의하기"}</span>
          </button>
          <a
            href="https://github.com/limgyumin-kr"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub 바로가기"
            className="w-12 h-12 rounded-[14px] bg-[#F2F3F8] text-[#354153] hover:bg-[#E5E8EF] flex items-center justify-center socar-press active:scale-[0.96] shrink-0 border border-[#E5E8EF]"
          >
            <IconGithub className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
