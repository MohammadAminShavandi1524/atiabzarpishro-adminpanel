import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    news_id: string;
  }>;
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { news_id } = await params;

    const body = await req.json();

    const data = await serverApi(`/news/update/${news_id}/`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

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
