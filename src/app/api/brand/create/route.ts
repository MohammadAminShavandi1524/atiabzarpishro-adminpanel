import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("========== CREATE BRAND ==========");
    console.log("REQUEST BODY =>", body);
    console.log("==================================");

    const data = await serverApi("/catalog/brand/create/", {
      method: "POST",
      body: JSON.stringify(body),
    });

    console.log("CREATE BRAND SUCCESS =>", data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.log("========== CREATE BRAND ERROR ==========");
    console.log("STATUS =>", error?.status);
    console.log("BODY =>", error?.body);
    console.log("MESSAGE =>", error?.message);
    console.log("FULL ERROR =>", error);
    console.log("========================================");

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