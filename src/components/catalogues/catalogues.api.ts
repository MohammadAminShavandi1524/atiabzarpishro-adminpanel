export interface CatalogueBrand {
  id: number;

  name_en: string;
  name_fa: string;

  image: string;
}

export interface CatalogueItem {
  id: number;

  name_en: string;
  name_fa: string;

  image: string;

  url: string;

  object_storage: boolean;

  brand: CatalogueBrand;

  created: string;
}

export const getCatalogues = async (): Promise<CatalogueItem[]> => {
  const response = await fetch("/api/catalogue/get-all", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error ?? "Failed to get catalogues");
  }

  return response.json();
};
