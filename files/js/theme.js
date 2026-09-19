(function () {
  const storageKey = "nextag-theme";

  function getTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === "dark" || saved === "light") return saved;
    return "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    const button = document.getElementById("theme-toggle");
    if (!button) return;

    const icon = button.querySelector("i");
    const isDark = theme === "dark";

    button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    button.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");

    if (icon) {
      icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  }

  function addToggle() {
    if (document.getElementById("theme-toggle")) return;

    const container = document.getElementById("search-profile");
    if (!container) return;

    const button = document.createElement("button");
    button.type = "button";
    button.id = "theme-toggle";
    button.className = "theme-toggle";
    button.setAttribute("aria-label", "Switch to dark theme");
    button.innerHTML = '<i class="fa-solid fa-moon" aria-hidden="true"></i>';

    button.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(storageKey, next);
      applyTheme(next);
    });

    container.appendChild(button);
  }

  // Apply before the UI is ready so the selected theme is consistent across pages.
  applyTheme(getTheme());

  document.addEventListener("DOMContentLoaded", function () {
    addToggle();
    applyTheme(getTheme());
  });
})();