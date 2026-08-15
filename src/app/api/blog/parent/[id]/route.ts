import { serverApi } from "@/lib/server-api";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const data = await serverApi(`/blog/get_blog/parent/staff/${id}/`, {
      method: "GET",
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET PARENT BLOG ERROR:", {
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
