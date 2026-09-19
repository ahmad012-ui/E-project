(function () {
  const storageKey = "nextag-theme";

  function getTheme() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "dark" || saved === "light") return saved;
    } catch (_) {
      // Continue with the default when storage is unavailable.
    }
    return "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    const button = document.getElementById("theme-toggle");
    if (!button) return;

    const isDark = theme === "dark";
    const icon = button.querySelector("i");

    button.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );
    button.setAttribute(
      "title",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );

    if (icon) {
      icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (_) {
      // Theme still works for the current page when storage is unavailable.
    }
  }

  function addToggle() {
    if (document.getElementById("theme-toggle")) return;

    const container = document.getElementById("search-profile");
    const button = document.createElement("button");

    button.type = "button";
    button.id = "theme-toggle";
    button.className = "theme-toggle" + (container ? "" : " theme-toggle-floating");
    button.innerHTML = '<i class="fa-solid fa-moon" aria-hidden="true"></i>';

    button.addEventListener("click", function () {
      const current =
        document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";

      saveTheme(next);
      applyTheme(next);
    });

    (container || document.body).appendChild(button);
    applyTheme(getTheme());
  }

  // Apply the saved theme as soon as this script loads.
  applyTheme(getTheme());

  document.addEventListener("DOMContentLoaded", addToggle);
})();