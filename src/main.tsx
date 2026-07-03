import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import "./app/App.css";
import "./app/ManuscriptTheme.css";
import "./app/ThemeModes.css";

function renderBootError(error: unknown) {
  const rootElement = document.getElementById("root");
  const message = error instanceof Error ? error.message : String(error);

  if (!rootElement) return;

  rootElement.innerHTML = `
    <main style="min-height:100vh;display:grid;place-items:center;background:#d9c292;color:#2a160c;font-family:Georgia,serif;padding:24px;">
      <section style="max-width:760px;border:2px solid rgba(110,68,27,.55);background:#efe0b8;padding:28px;box-shadow:0 24px 80px rgba(64,35,14,.35);">
        <div style="color:#8a1f17;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;">Ошибка запуска</div>
        <h1 style="margin:10px 0 12px;font-size:36px;">Приложение не стартовало</h1>
        <p style="color:rgba(42,22,12,.75);line-height:1.6;">Скопируй текст ошибки из Console в браузере или из блока ниже.</p>
        <pre style="white-space:pre-wrap;overflow:auto;background:rgba(79,39,13,.08);padding:16px;color:#8a1f17;">${message}</pre>
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
