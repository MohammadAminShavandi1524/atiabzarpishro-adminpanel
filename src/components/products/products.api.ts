export interface ProductBrand {
  id: number;
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  image: string;
  catalog: string;
  created: string;
}

export interface Product {
  id: number;

  name_en: string;
  name_fa: string;

  brand: ProductBrand;

  image: string;
  brochure: string;

  created: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch("/api/product/get", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to get products");
  }

  return response.json();
};
