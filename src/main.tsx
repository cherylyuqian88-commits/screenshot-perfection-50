import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Create a dedicated container so external scripts injecting into #root
// don't conflict with React's DOM reconciliation.
const container = document.getElementById("root")!;
const appRoot = document.createElement("div");
appRoot.id = "app-root";
container.appendChild(appRoot);

createRoot(appRoot).render(<App />);
