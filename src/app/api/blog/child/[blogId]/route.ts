import { serverApi } from "@/lib/server-api";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{
    blogId: string;
  }>;
}

export async function GET(_: Request, { params }: Props) {
  try {
    const { blogId } = await params;

    const data = await serverApi(`/blog/get_blogs/child/staff/${blogId}/`, {
      method: "GET",
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
