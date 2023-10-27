import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { worker } from "@uidotdev/react-query-api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

const queryClient = new QueryClient();

new Promise((res) => setTimeout(res, 100))
  .then(() =>
    worker.start({
      quiet: true,
      onUnhandledRequest: "bypass",
    })
  )
  .then(() => {
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div className="container">
              <App />
            </div>
          </BrowserRouter>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </React.StrictMode>
    );
  });
