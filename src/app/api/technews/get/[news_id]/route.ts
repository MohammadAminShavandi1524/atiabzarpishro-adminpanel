import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    news_id: string;
  }>;
}

export async function GET(
  _req: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { news_id } = await params;

    const data = await serverApi(`/news/get/${news_id}/`);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.body ?? "Internal Server Error",
      },
      {
        status: error.status ?? 500,
      },
    );
  }
}