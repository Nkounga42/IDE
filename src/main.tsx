import "./App.css";
import { NotificationProvider } from "./context/NotificationContext";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Designer } from "./components/Designer/Designer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <NotificationProvider>
       
        <App />
      </NotificationProvider>
    </DndProvider>
  </React.StrictMode>
);
