(() => {
  let theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  try {
    const savedTheme = window.localStorage.getItem("qitool-theme");
    if (savedTheme === "light" || savedTheme === "dark") theme = savedTheme;
  } catch {
    // Continue with the operating-system preference when storage is unavailable.
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
