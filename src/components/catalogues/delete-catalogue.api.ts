export const deleteCatalogue = async (catalogueId: number | string) => {
  const response = await fetch(`/api/catalogue/delete/${catalogueId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error ?? "Failed to delete catalogue");
  }

  return response.json().catch(() => null);
};
