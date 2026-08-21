export interface UpdateProductPayload {
  name_en: string;
  name_fa: string;

  brand_id: number;

  image: string | null;
  brochure: string | null;
}

export const updateProduct = async (
  productId: string,
  payload: UpdateProductPayload,
) => {
  const response = await fetch(`/api/product/update/${productId}`, {
    method: "PUT",

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
        "Failed to update product",
    );
  }

  return response.json().catch(() => null);
};
