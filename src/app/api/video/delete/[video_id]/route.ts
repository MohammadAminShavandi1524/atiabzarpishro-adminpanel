import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    video_id: string;
  }>;
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { video_id } = await params;

    const data = await serverApi(`/video/delete/${video_id}/`, {
      method: "DELETE",
    });

    return NextResponse.json(
      data ?? {
        success: true,
      },
    );
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
