export interface Brand {
  id: number;

  name_en: string;
  name_fa: string;

  description_en: string;
  description_fa: string;

  image: string;
  catalog: string;

  created: string;
}

export const getBrands = async (): Promise<Brand[]> => {
  const response = await fetch("/api/brand/get", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to get brands");
  }

  return response.json();
};
