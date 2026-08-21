export interface VideoItem {
  id: number;

  name_en: string;
  name_fa: string;

  description_en: string;
  description_fa: string;

  video: string;

  created: string;
}

export const getVideos = async (): Promise<VideoItem[]> => {
  const response = await fetch("/api/video/get", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.error ?? "Failed to get videos",
    );
  }

  return response.json();
};