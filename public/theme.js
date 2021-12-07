// set a given theme
function setPageTheme(themeName) {
  document.documentElement.className = themeName;
}

// toggle between themes (light/dark)
function togglePageTheme() {
  var metaThemeColor = document.querySelector("meta[name=theme-color]");
  var currentTheme = document.documentElement.className;
  if (currentTheme === "light") {
    setPageTheme("dark");
    metaThemeColor.setAttribute("content", "#000000");
  } else {
    setPageTheme("light");
    metaThemeColor.setAttribute("content", "#ffffff");
  }
}
