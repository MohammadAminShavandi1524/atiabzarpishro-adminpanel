export interface UpdateBrandPayload {
  name_en: string;
  name_fa: string;

  description_en: string;
  description_fa: string;

  image: string | null;
  catalog: string | null;
}

export const updateBrand = async (
  brandId: string,
  payload: UpdateBrandPayload,
) => {
  const response = await fetch(
    `/api/brand/update/${brandId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        payload,
      ),
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
        "Failed to update brand",
    );
  }

  return response
    .json()
    .catch(() => null);
};