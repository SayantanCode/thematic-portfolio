import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { themeService } from "@/api/services/theme.service";
import { PRESET_THEMES } from "@/constants/ThemeConstants";

const ThemeContext = createContext(null);

/* ---------------- THEME ENGINE ---------------- */

const LOCAL_STORAGE_KEY = "app-theme";

// Helper to safely parse stored theme
function getStoredTheme() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return PRESET_THEMES.find((t) => t.name === "default");
    return JSON.parse(stored);
  } catch {
    // If it's a plain string from old version of app
    const plain = localStorage.getItem(LOCAL_STORAGE_KEY);
    return { type: "preset", name: plain || "default" };
  }
}

function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;

  if (theme.type === "preset") {
    root.setAttribute("data-theme", theme.name);
    root.removeAttribute("style"); // Clear custom variables
  } else if (theme.type === "custom") {
    root.setAttribute("data-theme", "custom");
    Object.entries(theme.config.variables).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(theme));
}

function toThemeLabel(name = "") {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const validateConfig = (config) => {
  if (!config || !config.variables) return false;
  else if (!config.variables.primary && !config.variables.accent) return false;
  return true;
}
function extractThemeColor(config) {
  const isValidConfig = validateConfig(config);
  if (!isValidConfig) return "#6366f1";
  return (
    config?.variables?.primary || config?.variables?.accent || "#6366f1" // fallback highlight
  );
}

export const ThemeProvider = ({ children }) => {
  // 1. IMMEDIATE LOAD: Get from storage before anything else
  const [theme, setTheme] = useState(() => {
    const saved = getStoredTheme();
    applyTheme(saved); // Apply CSS variables immediately
    return saved;
  });

  const [availableThemes, setAvailableThemes] = useState([]); // Preset + Custom list
  const [ready, setReady] = useState(false);

  const fetchThemeApi = useApi(themeService.fetchTheme);
  const updateThemeApi = useApi(themeService.updateTheme);

  // 2. SYNC LOAD: Fetch the list of themes for the UI
  // useEffect(() => {
  //   let mounted = true;

  //   fetchThemeApi.execute()
  //     .then((data) => {
  //       if (!mounted) return;
  //       // Assume API returns array of theme objects [{type, name, config}, ...]
  //       setAvailableThemes(data);
  //     })
  //     .finally(() => {
  //       if (mounted) setReady(true);
  //     });

  //   return () => { mounted = false; };
  // }, []);
  useEffect(() => {
    let mounted = true;

    fetchThemeApi
      .execute()
      .then((customThemes) => {
        if (!mounted) return;

        const normalizedCustomThemes = customThemes.map((t) => ({
          ...t,
          type: "custom",
          label: toThemeLabel(t.name),
          color: extractThemeColor(t.config),
        }));

        setAvailableThemes([...PRESET_THEMES, ...normalizedCustomThemes]);
      })
      .catch((err) => {
        if (!mounted) return;
        setAvailableThemes([...PRESET_THEMES]);
      })
      .finally(() => mounted && setReady(true));

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------- PUBLIC API ---------------- */

  const setAndPersistTheme = async (nextTheme) => {
    // UI Update (Instant)
    setTheme(nextTheme);
    applyTheme(nextTheme);

    // API Update (Background)
    if (nextTheme.type === "custom") {
      try {
        await updateThemeApi.execute(nextTheme.config);
      } catch (err) {
        console.error("Failed to sync theme to server", err);
      }
    }
  };

  const value = {
    theme, // Currently active theme
    availableThemes, // List for your Selectable List UI
    ready,
    setTheme: setAndPersistTheme,
    apiState: { fetch: fetchThemeApi },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
