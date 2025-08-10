import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css"; // Import your standard CSS file
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <App />
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>

);
