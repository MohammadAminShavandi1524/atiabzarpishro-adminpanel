import { serverApi } from "@/lib/server-api";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const body = await req.json();

    const data = await serverApi(`/blog/update_blog/child/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("UPDATE CHILD BLOG ERROR:", {
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
