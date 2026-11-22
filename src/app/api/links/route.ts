import { NextResponse, type NextRequest } from "next/server";
import { getPublicLinksFromFirestore } from "@/lib/firestoreLinks";

/**
 * GET /api/links?uid={uid}
 * 쿼리 파라미터 지원:
 * - uid: (필수) 조회할 사용자 uid → Firestore users/{uid}/links
 * - category: PORTFOLIO | WEBSITE | ETC | ALL
 *
 * 서버 API에는 로그인 정보가 없으므로 공개(isActive == true) 링크만 반환합니다.
 * (보안 규칙상 비로그인 요청은 공개 링크 조건 없이 목록을 읽을 수 없음)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        {
          status: "error",
          statusCode: 400,
          message: "uid 쿼리 파라미터가 필요합니다. (예: /api/links?uid=...)",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // 공개 링크만 조회 (대표 링크 → order 오름차순 정렬 포함)
    let links = await getPublicLinksFromFirestore(uid);

    // 카테고리 필터링
    if (category && category !== "ALL") {
      links = links.filter((item) => item.category === category);
    }

    return NextResponse.json({
      status: "success",
      statusCode: 200,
      message: "링크 목록을 성공적으로 조회했습니다.",
      data: {
        links,
        total: links.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        statusCode: 500,
        message: "링크 목록을 불러오는 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/links
 * 링크는 users/{uid}/links 에 저장되며, 로그인한 본인만 추가할 수 있어야 한다.
 * 서버 API에는 로그인 정보가 없어 본인 확인이 불가능하므로 비활성화하고,
 * 클라이언트(Firebase Auth 로그인 상태)에서 직접 Firestore에 저장한다.
 */
export async function POST() {
  return NextResponse.json(
    {
      status: "error",
      statusCode: 405,
      message: "링크 추가는 Google 로그인 후 화면에서만 가능합니다.",
      timestamp: new Date().toISOString(),
    },
    { status: 405, headers: { Allow: "GET" } }
  );
}
