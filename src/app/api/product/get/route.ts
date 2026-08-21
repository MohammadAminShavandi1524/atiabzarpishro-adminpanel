import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET() {
  try {
    const data = await serverApi("/catalog/category/get_all/");

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
