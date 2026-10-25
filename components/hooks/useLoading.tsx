import { useState } from "react";

export function useLoading(): {
  loading: boolean;
  startLoading: (fun: () => Promise<any>) => any;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const startLoading = (fun: () => Promise<any>) => {
    setLoading(true);
    fun().finally(() => {
      setLoading(false);
    });
  };
  return { loading, startLoading };
}
