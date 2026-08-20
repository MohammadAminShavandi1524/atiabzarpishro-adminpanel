import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = await serverApi("/catalog/brand/create/", {
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
