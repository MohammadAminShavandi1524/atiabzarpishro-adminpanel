export interface ProductDetails {
  id: number;

  name_en: string;
  name_fa: string;

  brand: {
    id: number;
    name_en: string;
    name_fa: string;

    description_en: string;
    description_fa: string;

    image: string;
    catalog: string;

    created: string;
  };

  image: string;
  brochure: string;

  created: string;
}

export const getProduct = async (
  productId: string,
): Promise<ProductDetails> => {
  const response = await fetch(`/api/product/get/${productId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error ?? "Failed to get product");
  }

  return response.json();
};
