import { serverApi } from "@/lib/server-api";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const data = await serverApi("/support/get_requests/");

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to fetch requests",
        error: error.body,
      },
      {
        status: error.status ?? 500,
      },
    );
  }
}
