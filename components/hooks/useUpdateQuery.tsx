import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useUpdateQuery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      params.set("page", "0");

      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return updateQuery;
};
