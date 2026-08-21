import { NextResponse } from "next/server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.ARVAN_REGION!,

  endpoint: process.env.ARVAN_ENDPOINT!,

  forcePathStyle: true,

  credentials: {
    accessKeyId: process.env.ARVAN_ACCESS_KEY!,

    secretAccessKey: process.env.ARVAN_SECRET_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          message: "No catalog uploaded",
        },
        {
          status: 400,
        },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          message: "Only PDF files are allowed",
        },
        {
          status: 400,
        },
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const fileName = `${crypto.randomUUID()}.pdf`;

    const key = `brands/catalogs/${fileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.ARVAN_BUCKET!,

        Key: key,

        Body: buffer,

        ContentType: "application/pdf",

        ACL: "public-read",
      }),
    );

    const url = `${process.env.ARVAN_BUCKET_URL}/${key}`;

    return NextResponse.json({
      success: true,
      url,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Catalog upload failed",
      },
      {
        status: 500,
      },
    );
  }
}
