import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET() {
  try {
    const [brands, products, videos, news, requests] = await Promise.all([
      serverApi("/catalog/brand/get/"),
      serverApi("/catalog/category/get_all/"),
      serverApi("/video/get/"),
      serverApi("/blog/get_blogs/parent/staff/"),
      serverApi("/support/contact/get/"),
    ]);

    return NextResponse.json({
      brands: Array.isArray(brands) ? brands.length : 0,

      products: Array.isArray(products) ? products.length : 0,

      videos: Array.isArray(videos) ? videos.length : 0,

      news: Array.isArray(news) ? news.length : 0,

      requests: Array.isArray(requests) ? requests.length : 0,
    });
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
