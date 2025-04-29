import { ChakraProvider, theme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import { initializeCSRF } from "./api";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize CSRF token when app starts
    initializeCSRF();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
