import { serverApi } from "@/lib/server-api";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    lang: string;
  }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { lang } = await params;

    const data = await serverApi(`/blog/get_category/${lang}/`);

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
