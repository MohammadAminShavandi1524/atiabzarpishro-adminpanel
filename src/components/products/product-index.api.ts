interface ProductIndexResult {
  success: boolean;
  message?: string;
}

export const increaseProductIndex = async (
  productId: number,
): Promise<ProductIndexResult> => {
  const response = await fetch(`/api/product/increase-index/${productId}`, {
    method: "PATCH",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      success: false,
      message:
        result?.error?.detail ??
        result?.error ??
        result?.detail ??
        result?.message ??
        "Failed to increase product index",
    };
  }

  return {
    success: true,
  };
};

export const reduceProductIndex = async (
  productId: number,
): Promise<ProductIndexResult> => {
  const response = await fetch(`/api/product/reduce-index/${productId}`, {
    method: "PATCH",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      success: false,
      message:
        result?.error?.detail ??
        result?.error ??
        result?.detail ??
        result?.message ??
        "Failed to reduce product index",
    };
  }

  return {
    success: true,
  };
};
