import { useRef, useCallback, useEffect } from "react";
import useSWR, { SWRResponse } from "swr";

function useAbortableSWR<T, E = Error>(
  key: string | null,
  minLoadTime: number = 1000
): SWRResponse<T, E> {
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetcher = useCallback(
    async (url: string): Promise<T> => {
      const startTime = Date.now();

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error("Network error");
      }
      const data = (await response.json()) as T;

      const elapsed = Date.now() - startTime;
      const remaining = minLoadTime - elapsed;
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      return data;
    },
    [minLoadTime]
  );

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return useSWR<T, E>(key, key ? fetcher : null);
}

export { useAbortableSWR };
