"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const stamped = document.documentElement.getAttribute("data-theme");
  if (stamped === "dark" || stamped === "light") return stamped;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle({ className }: { className?: string }) {
  // Starts null so the server-rendered markup and the first client render
  // match exactly (theme depends on localStorage/matchMedia, neither
  // available during SSR) - the icon fills in a tick after mount instead of
  // risking a hydration mismatch.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  function toggle() {
    const next: Theme = (theme ?? currentTheme()) === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 bg-surface text-ink-600 transition-colors hover:border-primary-300 hover:text-primary-700",
        className
      )}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" strokeWidth={2} /> : <Moon className="h-4 w-4" strokeWidth={2} />}
    </button>
  );
}
