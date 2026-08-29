export interface UpdateTechNewsPayload {
  name_en: string;

  name_fa: string;

  description_en: string;

  description_fa: string;

  image: string | null;

  object_storage: boolean;

  url: string | null;
}

export const updateTechNews = async (
  newsId: string,
  payload: UpdateTechNewsPayload,
) => {
  const response = await fetch(`/api/technews/update/${newsId}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.error?.detail ??
        error?.error ??
        error?.detail ??
        error?.message ??
        "Failed to update Tech News",
    );
  }

  return response.json().catch(() => null);
};
