export const deleteBrand = async (brandId: number | string) => {
  const response = await fetch(`/api/brand/delete/${brandId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error ?? "Failed to delete brand");
  }

  return response.json().catch(() => null);
};
