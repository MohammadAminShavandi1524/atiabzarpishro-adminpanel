export interface VideoDetails {
  id: number;

  name_en: string;
  name_fa: string;

  description_en: string;
  description_fa: string;

  video: string;

  created: string;
}

export const getVideo = async (
  videoId: string,
): Promise<VideoDetails> => {
  const response = await fetch(
    `/api/video/get/${videoId}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.error ??
        "Failed to get video",
    );
  }

  return response.json();
};