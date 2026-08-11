import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import { NotFound } from "./components/NotFound";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Content changes rarely — avoid refetch storms and make navigation instant.
        staleTime: 5 * 60_000,
        gcTime: 30 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Prefetch route data on hover/touch so clicks feel instant.
    defaultPreload: "intent",
    defaultPreloadStaleTime: 60_000,
    defaultNotFoundComponent: NotFound,
  });

  return router;
};

