/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./route.js";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement as HTMLElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
