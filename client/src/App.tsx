import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/home-page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: Infinity,
      cacheTime: 0,
    },
  },
});

export function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
