export interface BrandDetails {
  id: number;

  name_en: string;
  name_fa: string;

  description_en: string;
  description_fa: string;

  image: string;
  catalog: string;

  created: string;
}

export const getBrand = async (
  brandId: string,
): Promise<BrandDetails> => {
  const response = await fetch(
    `/api/brand/get/${brandId}`,
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
        "Failed to get brand",
    );
  }

  return response.json();
};