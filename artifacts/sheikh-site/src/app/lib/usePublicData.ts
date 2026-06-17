import { useEffect, useState } from "react";

type State<T> = {
  data: T | null;
  loading: boolean;
  error: boolean;
};

/**
 * Minimal data-fetching hook for the public pages. Runs the given loader once
 * on mount and exposes loading/error flags so pages can render placeholders.
 * `loader` must be stable (define it at module scope, e.g. publicApi.getSeries).
 */
export function usePublicData<T>(loader: () => Promise<T>): State<T> {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let active = true;

    loader()
      .then((data) => {
        if (active) setState({ data, loading: false, error: false });
      })
      .catch(() => {
        if (active) setState({ data: null, loading: false, error: true });
      });

    return () => {
      active = false;
    };
  }, [loader]);

  return state;
}
