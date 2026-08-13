import { serverApi } from "@/lib/server-api";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    requestId: string;
  }>;
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { requestId } = await params;

    const data = await serverApi(`/support/delete_request/${requestId}/`, {
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
