export interface DashboardStats {
  brands: number;
  products: number;
  videos: number;
  news: number;
  requests: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch("/api/dashboard", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error ?? "Failed to get dashboard statistics");
  }

  return response.json();
};
