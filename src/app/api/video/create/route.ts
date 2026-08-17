import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Debug
    console.log("===== CREATE VIDEO API =====");

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, {
          name: value.name,
          type: value.type,
          size: value.size,
          sizeMB: `${(value.size / 1024 / 1024).toFixed(2)} MB`,
        });
      } else {
        console.log(key, value);
      }
    }

    const data = await serverApi("/video/create/", {
      method: "POST",
      body: formData,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("CREATE VIDEO API ERROR =>", error);

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
