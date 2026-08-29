import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    catalog_id: string;
  }>;
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { catalog_id } = await params;

    const data = await serverApi(`/catalog/catalog/delete/${catalog_id}/`, {
      method: "DELETE",
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
