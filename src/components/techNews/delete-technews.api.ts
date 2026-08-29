export const deleteTechNews = async (newsId: number | string) => {
  const response = await fetch(`/api/technews/delete/${newsId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error ?? "Failed to delete Tech News");
  }

  return response.json().catch(() => null);
};
