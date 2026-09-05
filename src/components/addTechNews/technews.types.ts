export interface CreateTechNewsPayload {
  name_en: string;

  name_fa: string;

  image: string;

  object_storage: boolean;

  url: string;
}

export interface UploadResponse {
  success: boolean;

  url: string;
}
