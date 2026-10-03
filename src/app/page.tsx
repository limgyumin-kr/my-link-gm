"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const email = "gyumin@example.com"; // 추후 본인 이메일로 변경 가능

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-black px-4 py-12 text-zinc-900 dark:text-zinc-100">
      {/* 프로필 메인 카드 */}
      <main className="w-full max-w-md text-center">
        <div className="relative rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-8 sm:p-10 shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-200/80 dark:border-zinc-800 transition-all">
          {/* 아바타 아이콘 */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 p-1 shadow-md ring-4 ring-blue-50 dark:ring-zinc-800">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-zinc-900">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                규민
              </span>
            </div>
          </div>

          {/* 소속 / 학번 배지 */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            목포해양대학교 21학번
          </div>

          {/* 이름 */}
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
            임규민
          </h1>

          {/* 소개글 */}
          <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal mb-8 break-keep">
            안녕하세요 바이브 코딩을 배우고 있는
            <br />
            목포해양대학교 21학번 대학생입니다.
          </p>

          {/* 태그 / 관심사 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="rounded-lg bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              🌊 목포해양대
            </span>
            <span className="rounded-lg bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              ✨ 바이브 코딩
            </span>
            <span className="rounded-lg bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              💻 웹 개발
            </span>
            <span className="rounded-lg bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              🚀 성장 중
            </span>
          </div>

          {/* 링크 및 액션 버튼 목록 */}
          <div className="space-y-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 px-5 py-3.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm group"
            >
              <span className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-zinc-700 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                GitHub 둘러보기
              </span>
              <span className="text-zinc-400 group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </a>

            <button
              onClick={handleCopyEmail}
              type="button"
              className="flex items-center justify-between w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 px-5 py-3.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-sm group"
            >
              <span className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-zinc-700 dark:text-zinc-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                이메일 문의하기
              </span>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {copied ? "복사완료!" : "복사"}
              </span>
            </button>
          </div>
        </div>

        {/* 미니멀 푸터 */}
        <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-600">
          © {new Date().getFullYear()} 임규민. All rights reserved.
        </p>
      </main>
    </div>
  );
}
