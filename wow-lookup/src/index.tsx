import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactNode } from "react";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App /> as ReactNode);
