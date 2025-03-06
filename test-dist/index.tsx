import React from "react";
import ReactDOM from "react-dom/client";
import TestComponent from "./TestComponent";

// Create root and render the test component
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    Test Component
    <TestComponent />
  </React.StrictMode>
);
