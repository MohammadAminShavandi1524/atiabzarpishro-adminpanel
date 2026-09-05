export interface TechNewsDetails {
  id: number;

  name_en: string;
  name_fa: string;

  image: string;

  object_storage: boolean;

  url: string;

  created: string;
}

export const getTechNews = async (newsId: string): Promise<TechNewsDetails> => {
  const response = await fetch(`/api/technews/get/${newsId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error ?? error?.detail ?? "Failed to get Tech News");
  }

  return response.json();
};
