import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Toaster } from "./components/ui/sonner";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReduxProvider from "./redus";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReduxProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </ReduxProvider>
    </BrowserRouter>
  </React.StrictMode>
);
