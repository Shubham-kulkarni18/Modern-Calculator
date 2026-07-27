const themeToggle =
    document.getElementById("theme-toggle");

const DARK_THEME = "dark";

const LIGHT_THEME = "light";

function applyTheme(theme){

    if(theme === DARK_THEME){

        document.body.classList.add("dark-theme");

    }
    else{

        document.body.classList.remove("dark-theme");

    }

}

function saveTheme(theme){

    localStorage.setItem(
        "calculatorTheme",
        theme
    );

}

function loadTheme(){

    const savedTheme =
        localStorage.getItem("calculatorTheme");

    if(savedTheme){

        applyTheme(savedTheme);

    }

}

function handleThemeToggle(){

    const isDark =
        document.body.classList.contains("dark-theme");

    if(isDark){

        applyTheme(LIGHT_THEME);

        saveTheme(LIGHT_THEME);

    }
    else{

        applyTheme(DARK_THEME);

        saveTheme(DARK_THEME);

    }

}

themeToggle.addEventListener(
    "click",
    handleThemeToggle
);

loadTheme();