import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { worker } from "@uidotdev/react-query-api";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

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
        <BrowserRouter>
          <div className="container">
            <App />
          </div>
        </BrowserRouter>
      </React.StrictMode>
    );
  });
