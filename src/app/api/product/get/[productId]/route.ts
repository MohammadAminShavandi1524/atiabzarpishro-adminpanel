import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { productId } = await params;

    const data = await serverApi(`/catalog/category/get/${productId}/`);

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
