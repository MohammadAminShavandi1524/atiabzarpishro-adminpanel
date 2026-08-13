import { serverApi } from "@/lib/server-api";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const data = await serverApi(`/blog/publish_blog/${id}/`, {
      method: "PATCH",
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("PUBLISH ERROR:", {
      status: error.status,
      body: error.body,
    });

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
