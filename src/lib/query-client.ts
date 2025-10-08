import { QueryClient } from "@tanstack/react-query";
import {
  enableStaticPrefetch,
  queryGcTime,
  queryRefetchOnWindowFocus,
  queryStaleTime,
} from "@/config/env";
import { getLocalCatalogItems, getLocalKnowledgeBaseSummaries } from "@/lib/local-data";

export const createQueryClient = (): QueryClient => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: queryStaleTime,
        gcTime: queryGcTime,
        refetchOnWindowFocus: queryRefetchOnWindowFocus,
        retry: 1,
      },
    },
  });

  if (enableStaticPrefetch) {
    client.setQueryData(["catalog"], getLocalCatalogItems());
    client.setQueryData(["kb", ""], getLocalKnowledgeBaseSummaries());
  }

  return client;
};
