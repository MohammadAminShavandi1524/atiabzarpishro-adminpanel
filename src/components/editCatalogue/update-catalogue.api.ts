export interface UpdateCataloguePayload {
  brand_id: number;

  name_en: string;
  name_fa: string;

  image: string | null;

  object_storage: boolean;

  url: string;
}

export const updateCatalogue = async (
  catalogueId: string,
  payload: UpdateCataloguePayload,
) => {
  const response = await fetch(`/api/catalogue/update/${catalogueId}`, {
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
        "Failed to update catalogue",
    );
  }

  return response.json().catch(() => null);
};
