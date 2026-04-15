"use client";

import { useEffect } from "react";

function getTimeBasedTheme(): "light" | "dark" {
  const hour = new Date().getHours();
  // Dark theme from 7 PM to 7 AM
  // TODO: restore time-based theme. return hour >= 19 || hour < 7 ? "dark" : "light";
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const apply = () => {
      const theme = getTimeBasedTheme();
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.style.colorScheme = theme;
    };

    apply();
    // Re-check every 5 minutes in case the hour changes
    const interval = setInterval(apply, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
