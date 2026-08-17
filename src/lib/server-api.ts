import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

export async function serverApi(
  endpoint: string,
  options: RequestInit = {},
) {
  const token = (await cookies()).get("token")?.value;

  const isFormData = options.body instanceof FormData;

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", token);
  }

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  if (!response.ok) {
    throw {
      status: response.status,
      body: text,
    };
  }

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}