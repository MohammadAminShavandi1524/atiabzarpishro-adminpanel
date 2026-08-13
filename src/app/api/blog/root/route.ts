import { serverApi } from "@/lib/server-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await serverApi("/blog/get_blogs/root/");
    // console.log("ROOT BLOGS:", data);
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = await serverApi("/blog/create_blog/root/", {
      method: "POST",
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
