import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get the theme from localStorage or default to "dark"
    return localStorage.getItem("theme") || "dark";
  });

  const handleToggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // Save the new theme to localStorage
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    // Set the theme in localStorage when it changes
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, handleToggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
