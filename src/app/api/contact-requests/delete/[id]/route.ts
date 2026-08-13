import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const data = await serverApi(`/support/contact/delete/${id}/`, {
      method: "DELETE",
    });

    return NextResponse.json(data ?? { success: true });
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
