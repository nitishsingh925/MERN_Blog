import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App";
import { UserContextProviderComponent } from "./src/components/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserContextProviderComponent>
    <App />
  </UserContextProviderComponent>
);
