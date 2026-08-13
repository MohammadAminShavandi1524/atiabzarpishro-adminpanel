import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

export async function serverApi(endpoint: string, options: RequestInit = {}) {
  const token = (await cookies()).get("token")?.value;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `${token}`,
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  // console.log("STATUS:", response.status);
  // console.log("BODY:", text);

  if (!response.ok) {
    throw {
      status: response.status,
      body: text,
    };
  }

  // اگر پاسخ خالی بود (مثل 204 No Content)
  if (!text.trim()) {
    return null;
  }

  // اگر JSON بود، Parse کن
  try {
    return JSON.parse(text);
  } catch {
    // اگر JSON نبود، همان متن را برگردان
    return text;
  }
}
