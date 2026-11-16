// URL変更時はHTMLの静的リンクも更新する（JavaScript無効時の入口）。
const FORM_CONFIG = {
  joinFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfnMeaPvfsD2d7tkTASsmJzb2HqKz71x0CBqUqwjffnBrkVyA/viewform",
  contactFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLScc3NugrwZ7gzb8aY_9ALtX08g7vlMm2H734OMPPmi0vHldWA/viewform",
};

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initFormLinks();
});

function initNav() {
  const button = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (!button || !nav) return;
  document.documentElement.classList.add("js");
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
    button.textContent = open ? "閉じる" : "メニュー";
  };
  button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });
}

function initFormLinks() {
  document.querySelectorAll("a[data-form]").forEach(link => {
    const url = link.dataset.form === "join" ? FORM_CONFIG.joinFormUrl
      : link.dataset.form === "contact" ? FORM_CONFIG.contactFormUrl : "";
    if (isValidGoogleFormsUrl(url)) {
      link.href = url;
      return;
    }
    const entry = link.closest(".form-entry");
    const status = entry && entry.querySelector(".form-status");
    if (status) status.textContent = "フォームを準備しています";
    const note = document.createElement("p");
    note.textContent = "受付開始までお待ちください。";
    link.replaceWith(note);
  });
}

function isValidGoogleFormsUrl(value) {
  if (typeof value !== "string" || !value) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
    if (url.hostname === "docs.google.com") {
      return /^\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform\/?$/.test(url.pathname);
    }
    return url.hostname === "forms.gle" && /^\/[A-Za-z0-9_-]+$/.test(url.pathname);
  } catch (_) {
    return false;
  }
}
