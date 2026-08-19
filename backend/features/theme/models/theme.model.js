import mongoose from "mongoose";

// Matches the contract the frontend (ThemeContext.jsx/themeService.js,
// written before this backend existed) already assumes: a named theme with
// a `config.variables` map of CSS custom property values.
const themeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    config: {
      variables: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  },
  { timestamps: true, versionKey: false }
);

export const Theme = mongoose.model("Theme", themeSchema);
