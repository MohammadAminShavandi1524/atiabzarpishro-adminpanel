export interface CatalogueBrand {
  id: number;

  name_en: string;
  name_fa: string;

  image: string;
  url: string;

  created: string;
}

export interface CatalogueDetails {
  id: number;

  brand: CatalogueBrand;

  name_en: string;
  name_fa: string;

  image: string;

  object_storage: boolean;

  url: string;

  created: string;
}

export const getCatalogue = async (
  catalogueId: string,
): Promise<CatalogueDetails> => {
  const response = await fetch(`/api/catalogue/get/${catalogueId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error ?? error?.detail ?? "Failed to get catalogue");
  }

  return response.json();
};
