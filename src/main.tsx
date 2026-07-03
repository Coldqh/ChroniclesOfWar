import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import "./app/App.css";
import "./app/BlackTheme.css";

function renderBootError(error: unknown) {
  const rootElement = document.getElementById("root");
  const message = error instanceof Error ? error.message : String(error);

  if (!rootElement) return;

  rootElement.innerHTML = `
    <main style="min-height:100vh;display:grid;place-items:center;background:#050506;color:#f7ead0;font-family:system-ui;padding:24px;">
      <section style="max-width:760px;border:1px solid rgba(231,193,122,.28);background:rgba(8,8,9,.94);padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.55);">
        <div style="color:#d7b56d;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;">Ошибка запуска</div>
        <h1 style="margin:10px 0 12px;font-size:36px;">Приложение не стартовало</h1>
        <p style="color:rgba(247,234,208,.75);line-height:1.6;">Скопируй текст ошибки из Console в браузере или из блока ниже.</p>
        <pre style="white-space:pre-wrap;overflow:auto;background:rgba(255,255,255,.06);padding:16px;color:#ffb4b4;">${message}</pre>
      </section>
    </main>
  `;
}

window.addEventListener("error", (event) => renderBootError(event.error ?? event.message));
window.addEventListener("unhandledrejection", (event) => renderBootError(event.reason));

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found in index.html");
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  renderBootError(error);
}
