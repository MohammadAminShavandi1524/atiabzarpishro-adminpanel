export interface ProductBrand {
  id: number;

  name_en: string;
  name_fa: string;

  description_en: string;
  description_fa: string;

  image: string;

  url: string;

  created: string;
}

export interface Product {
  id: number;

  name_en: string;
  name_fa: string;

  description_en: string | null;
  description_fa: string | null;

  brand: ProductBrand;

  image: string;

  index: number;

  created: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch("/api/product/get", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error ?? error?.detail ?? "Failed to get products");
  }

  return response.json();
};
