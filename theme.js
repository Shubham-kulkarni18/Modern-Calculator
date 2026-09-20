const themeToggle = document.getElementById("theme-toggle");

const DARK_THEME = "dark";
const LIGHT_THEME = "light";

function applyTheme(theme) {
    if (theme === LIGHT_THEME) {
        document.body.classList.add("light-theme");
        if (themeToggle) {
            themeToggle.textContent = "🌙";
            themeToggle.setAttribute("title", "Switch to Dark Theme");
        }
    } else {
        document.body.classList.remove("light-theme");
        if (themeToggle) {
            themeToggle.textContent = "☀️";
            themeToggle.setAttribute("title", "Switch to Light Theme");
        }
    }
}

function saveTheme(theme) {
    localStorage.setItem("calculatorTheme", theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem("calculatorTheme");
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(DARK_THEME);
    }
}

function handleThemeToggle() {
    const isLight = document.body.classList.contains("light-theme");
    const newTheme = isLight ? DARK_THEME : LIGHT_THEME;
    applyTheme(newTheme);
    saveTheme(newTheme);
}

if (themeToggle) {
    themeToggle.addEventListener("click", handleThemeToggle);
}

loadTheme();