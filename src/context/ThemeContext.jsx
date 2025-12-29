// import { createContext, useContext, useEffect, useState } from 'react';

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   // 1. Get initial theme from localStorage or default to 'default'
//   const [theme, setTheme] = useState(() => {
//     return localStorage.getItem('app-theme') || 'default';
//   });

//   // 2. Update the HTML attribute whenever the theme changes
//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', theme);
//     localStorage.setItem('app-theme', theme);
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// Custom hook for easy usage
// eslint-disable-next-line react-refresh/only-export-components
// export const useTheme = () => useContext(ThemeContext);




// import { createContext, useContext, useEffect, useState } from "react";
// import { useApi } from "@/hooks/useApi";
// import { themeService } from "@/api/services/theme.service";

// const ThemeContext = createContext(null);

// /* ---------------- THEME ENGINE ---------------- */

// function applyPresetTheme(theme) {
//   const root = document.documentElement;
//   root.setAttribute("data-theme", theme);
//   root.removeAttribute("style");
//   localStorage.setItem("app-theme", theme);
// }

// function applyCustomTheme(config) {
//   const root = document.documentElement;
//   root.setAttribute("data-theme", "custom");

//   Object.entries(config.variables).forEach(([key, value]) => {
//     root.style.setProperty(`--${key}`, value);
//   });

//   localStorage.setItem(
//     "app-theme",
//     JSON.stringify({ type: "custom", config })
//   );
// }

// function applyTheme(theme) {
//   if (!theme) return;
//   if (theme.type === "preset") applyPresetTheme(theme.name);
//   if (theme.type === "custom") applyCustomTheme(theme.config);
// }

// /* ---------------- PROVIDER ---------------- */

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState(null);
//   const [ready, setReady] = useState(false);

//   const fetchThemeApi = useApi(themeService.fetchTheme);
//   const createThemeApi = useApi(themeService.createTheme);
//   const updateThemeApi = useApi(themeService.updateTheme);
//   const deleteThemeApi = useApi(themeService.deleteTheme);

//   /* -------- INITIAL LOAD (NEVER BLOCK UI) -------- */

//   useEffect(() => {
//     let mounted = true;

//     fetchThemeApi.execute()
//       .then((serverTheme) => {
//         if (!mounted) return;
//         applyTheme(serverTheme);
//         setTheme(serverTheme);
//       })
//       .catch(() => {
//         // SAFE LOCAL FALLBACK
//         const fallbackTheme = {
//           type: "preset",
//           name: "default",
//         };

//         applyTheme(fallbackTheme);
//         setTheme(fallbackTheme);
//       })
//       .finally(() => {
//         if (mounted) setReady(true);
//       });

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   /* ---------------- PUBLIC API ---------------- */

//   async function setAndPersistTheme(nextTheme) {
//     applyTheme(nextTheme);
//     setTheme(nextTheme);

//     // API optional for now
//     if (nextTheme.type === "custom") {
//       try {
//         await updateThemeApi.execute(nextTheme.config);
//       } catch {
//         // ignore in dev
//       }
//     }
//   }

//   const value = {
//     theme,
//     ready,

//     // theme switching
//     setTheme: setAndPersistTheme,

//     // CRUD for admin/playground
//     fetchThemes: fetchThemeApi.execute,
//     createTheme: createThemeApi.execute,
//     updateTheme: updateThemeApi.execute,
//     deleteTheme: deleteThemeApi.execute,
//     // every api call will return { data, error, loading, execute }
//     apiState: {
//       fetch: fetchThemeApi, 
//       create: createThemeApi,
//       update: updateThemeApi,
//       delete: deleteThemeApi,
//     },
//   };

//   // not blocking rendering UI as its may break the app
//   return (
//     <ThemeContext.Provider value={value}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// /* ---------------- HOOK ---------------- */

// export const useTheme = () => {
//   const ctx = useContext(ThemeContext);
//   if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
//   return ctx;
// };

import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { themeService } from "@/api/services/theme.service";

const ThemeContext = createContext(null);

/* ---------------- THEME ENGINE ---------------- */

const LOCAL_STORAGE_KEY = "app-theme";

// Helper to safely parse stored theme
function getStoredTheme() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return { type: "preset", name: "default" };
    return JSON.parse(stored);
  } catch {
    // If it's a plain string from your old version, wrap it
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
  useEffect(() => {
    let mounted = true;

    fetchThemeApi.execute()
      .then((data) => {
        if (!mounted) return;
        // Assume API returns array of theme objects [{type, name, config}, ...]
        setAvailableThemes(data); 
      })
      .finally(() => {
        if (mounted) setReady(true);
      });

    return () => { mounted = false; };
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
    theme,           // Currently active theme
    availableThemes, // List for your Selectable List UI
    ready,
    setTheme: setAndPersistTheme,
    apiState: { fetch: fetchThemeApi },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}