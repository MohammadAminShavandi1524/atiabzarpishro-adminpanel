import { serverApi } from "@/lib/server-api";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

  

    const data = await serverApi(`/blog/delete_blog/root/${id}/`, {
      method: "DELETE",
    });

  

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      {
        error: error.body ?? error.message ?? "Internal Server Error",
      },
      {
        status: error.status ?? 500,
      },
    );
  }
}
