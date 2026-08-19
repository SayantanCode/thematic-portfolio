import { useEffect, useState } from "react";
import { siteContentService } from "@/services/siteContentService";

/**
 * Fetches a site-content section and merges it over `defaults`, so any
 * field not yet saved in the DB (or the whole section, pre-migration) still
 * renders correctly. A 404 (nothing saved for this key yet) is expected,
 * not an error — it just means "use the defaults", silently.
 */
export function useSiteContent(key, defaults) {
  const [content, setContent] = useState(defaults);

  useEffect(() => {
    let mounted = true;

    siteContentService
      .fetchByKey(key)
      .then((result) => {
        if (!mounted) return;
        setContent({ ...defaults, ...result.data });
      })
      .catch(() => {
        // 404 (not seeded) or network error — defaults are already the
        // initial state, nothing to do.
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return content;
}
