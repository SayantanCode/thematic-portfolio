import { z } from "zod";

const variablesSchema = z.record(z.string(), z.string());

export const createThemeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  config: z.object({ variables: variablesSchema }),
});

// PUT's body shape is dictated by the pre-existing frontend call
// (ThemeContext.jsx: `updateThemeApi.execute(nextTheme.config)`) — just the
// flattened config, no wrapper, and no name yet since nothing in the UI
// creates named custom themes today. `name` stays optional here for when
// that UI exists; until then the service defaults it (see theme.service.js).
export const updateThemeSchema = z.object({
  name: z.string().min(1).optional(),
  variables: variablesSchema,
});
