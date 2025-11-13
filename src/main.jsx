import React, { useEffect, useState } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./components/Routes";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./contexts/ThemeContext";

// Wrapper component to apply the correct theme to ToastContainer based on system preference
function ThemedToastContainer() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial system theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    // Listen for system theme changes
    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDark ? "dark" : "light"}
    />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <ThemedToastContainer />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
