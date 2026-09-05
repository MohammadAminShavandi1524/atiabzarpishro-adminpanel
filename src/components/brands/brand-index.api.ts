export const increaseBrandIndex = async (brandId: number) => {
  const response = await fetch(`/api/brand/increase-index/${brandId}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.error?.detail ??
        error?.error ??
        error?.detail ??
        error?.message ??
        "Failed to increase brand index",
    );
  }

  return response.json().catch(() => null);
};

export const reduceBrandIndex = async (brandId: number) => {
  const response = await fetch(`/api/brand/reduce-index/${brandId}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.error?.detail ??
        error?.error ??
        error?.detail ??
        error?.message ??
        "Failed to reduce brand index",
    );
  }

  return response.json().catch(() => null);
};
