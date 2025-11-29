import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import { LoadingProvider } from "./contexts/loading-context.tsx";
import { MessageProvider } from "./contexts/message-context.tsx";
import { BreadcrumbProvider } from "./contexts/breadcrumb-context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <BrowserRouter>
      <LoadingProvider>
        <MessageProvider>
          <Provider>
            <BreadcrumbProvider>
              <App />
            </BreadcrumbProvider>
          </Provider>
        </MessageProvider>
      </LoadingProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
