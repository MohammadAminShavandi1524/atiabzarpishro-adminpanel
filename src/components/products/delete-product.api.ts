export const deleteProduct = async (productId: string) => {
  const response = await fetch(`/api/product/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error ?? "Failed to delete product");
  }

  return response.json().catch(() => null);
};
