export const deleteVideo = async (
  videoId: number | string,
) => {
  const response = await fetch(
    `/api/video/delete/${videoId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => null);

    throw new Error(
      error?.error ?? "Failed to delete video",
    );
  }

  return response
    .json()
    .catch(() => null);
};