export interface Brand {
  id: number;

  name_en: string;
  name_fa: string;
}

export type CatalogueSourceType = "upload" | "url";

export interface CreateCataloguePayload {
  brand_id: number;

  name_en: string;
  name_fa: string;

  description_en: string;
  description_fa: string;

  image: string;

  object_storage: boolean;

  url: string;
}

export interface UploadResponse {
  success: boolean;
  url: string;
}