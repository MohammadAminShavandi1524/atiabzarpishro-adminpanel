export interface CreateProductPayload {
  name_en: string;

  name_fa: string;

  description_en: string | null;

  description_fa: string | null;

  brand_id: number;

  image: string;
}