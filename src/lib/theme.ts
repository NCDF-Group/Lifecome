const THEME_STORAGE_KEY = "lc_theme_preference";

export const themeInitScript = `
(() => {
  try {
    const preference = localStorage.getItem("${THEME_STORAGE_KEY}");
    const selected = preference === "light" || preference === "dark" || preference === "system"
      ? preference
      : "system";
    const dark = selected === "dark" ||
      (selected === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.dataset.themePreference = selected;
  } catch {
    document.documentElement.dataset.theme = "light";
    document.documentElement.dataset.themePreference = "system";
  }
})();
`;
