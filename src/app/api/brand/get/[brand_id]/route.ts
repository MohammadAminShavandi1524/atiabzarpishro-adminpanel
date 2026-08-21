import {
  NextRequest,
  NextResponse,
} from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    brand_id: string;
  }>;
}

export async function GET(
  _req: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { brand_id } = await params;

    const data = await serverApi(
      `/catalog/brand/get/${brand_id}/`,
    );

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.body ??
          "Internal Server Error",
      },
      {
        status:
          error.status ?? 500,
      },
    );
  }
}