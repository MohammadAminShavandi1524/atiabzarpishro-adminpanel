export interface CreateVideoPayload {
  name_en: string;
  name_fa: string;

  description_en: string;
  description_fa: string;

  video: string;
}

export const createVideo = async (payload: CreateVideoPayload) => {
  const response = await fetch("/api/video/create", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.error?.detail ??
        error?.error ??
        error?.detail ??
        error?.message ??
        "Failed to create video",
    );
  }

  return response.json().catch(() => null);
};
