import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Force dark mode everywhere
  const [isDarkMode] = useState(true);

  useEffect(() => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
  }, []);

  // No-op toggle – light mode is disabled
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
