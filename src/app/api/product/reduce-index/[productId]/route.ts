import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    productId: string;
  }>;
}

export async function PATCH(_req: Request, { params }: RouteContext) {
  try {
    const { productId } = await params;

    const data = await serverApi(
      `/catalog/category/reduce_index/${productId}/`,
      {
        method: "PATCH",
      },
    );

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
