// React Query setup and provider for AI-Mi
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Create a query client with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
      // Global error handling for mutations
      onError: (error: any) => {
        console.error('Mutation error:', error);
        // You can add global error handling here (toast notifications, etc.)
      },
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

// Export useQueryClient hook from react-query
export { useQueryClient } from 'react-query';

// Utility functions for cache management
export const queryUtils = {
  // Clear all cached data
  clearCache: () => {
    queryClient.clear();
  },

  // Invalidate all queries for a specific entity
  invalidateEntity: (entityType: string) => {
    queryClient.invalidateQueries([entityType]);
  },

  // Remove specific query from cache
  removeQuery: (queryKey: any[]) => {
    queryClient.removeQueries(queryKey);
  },

  // Prefetch data
  prefetch: async (queryKey: any[], queryFn: () => Promise<any>) => {
    await queryClient.prefetchQuery(queryKey, queryFn);
  },

  // Set query data manually
  setQueryData: (queryKey: any[], data: any) => {
    queryClient.setQueryData(queryKey, data);
  },
};

export default QueryProvider;