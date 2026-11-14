import { NextResponse, type NextRequest } from "next/server";
import mockData from "@/data/mock-links.json";
import { getLinksFromFirestore, addLinkToFirestore } from "@/lib/firestoreLinks";
import { LinkItem } from "@/types/link";

/**
 * GET /api/links
 * 쿼리 파라미터 지원:
 * - category: ROBOTICS | DEVELOPMENT | PORTFOLIO | ARTICLE | COMMUNITY | ALL
 * - activeOnly: boolean (true일 경우 활성화된 링크만 반환)
 *
 * Firestore users/anonymous/links 경로의 링크를 우선 로드하고, 기본 목데이터와 병합하여 반환합니다.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const activeOnly = searchParams.get("activeOnly") === "true";

    let firestoreLinks: LinkItem[] = [];
    try {
      firestoreLinks = await getLinksFromFirestore();
    } catch (e) {
      console.warn("API GET /api/links firestore fetch skipped/failed:", e);
    }

    const firestoreIds = new Set(firestoreLinks.map((l) => l.id));
    let links = [
      ...firestoreLinks,
      ...mockData.data.links.filter((l) => !firestoreIds.has(l.id)),
    ];

    // 활성 상태 필터링
    if (activeOnly) {
      links = links.filter((item) => item.isActive);
    }

    // 카테고리 필터링
    if (category && category !== "ALL") {
      links = links.filter((item) => item.category === category);
    }

    // 정렬: 1순위 Featured, 2순위 order 오름차순
    links.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return a.order - b.order;
    });

    return NextResponse.json({
      status: "success",
      statusCode: 200,
      message: "링크 목록을 성공적으로 조회했습니다.",
      data: {
        ...mockData.data,
        links,
        pagination: {
          ...mockData.data.pagination,
          total: links.length,
          page: 1,
          limit: 10,
          totalPages: Math.max(1, Math.ceil(links.length / 10)),
        },
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
 * Firestore users/anonymous/links 경로에 신규 링크 추가
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, category, description, icon, isActive, isFeatured, order } = body;

    if (!title || !url || !category) {
      return NextResponse.json(
        {
          status: "error",
          statusCode: 400,
          message: "필수 항목(title, url, category)이 누락되었습니다.",
        },
        { status: 400 }
      );
    }

    const createdLink = await addLinkToFirestore(
      {
        title,
        url,
        category,
        description: description || "",
        icon: icon || "globe",
        isActive: isActive ?? true,
        isFeatured: Boolean(isFeatured),
      },
      typeof order === "number" ? order : 0
    );

    return NextResponse.json(
      {
        status: "success",
        statusCode: 201,
        message: "Firestore users/anonymous/links에 링크가 성공적으로 추가되었습니다.",
        data: createdLink,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        statusCode: 500,
        message: "링크 생성 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
