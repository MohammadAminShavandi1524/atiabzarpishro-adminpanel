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

    const body = await req.json();

    const data = await serverApi(`/blog/update_blog/root/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({
        title: body.title,
      }),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("UPDATE ROOT BLOG ERROR:", {
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
