export interface UpdateVideoPayload {
  name_en: string;
  name_fa: string;

  description_en: string;
  description_fa: string;

  video: string | null;
}

export const updateVideo = async (
  videoId: string,
  payload: UpdateVideoPayload,
) => {
  const response = await fetch(
    `/api/video/update/${videoId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.error?.detail ??
        error?.error ??
        error?.detail ??
        error?.message ??
        "Failed to update video",
    );
  }

  return response
    .json()
    .catch(() => null);
};