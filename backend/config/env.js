import dotenv from "dotenv";
dotenv.config();

// Single source of truth for env access. Nothing else in the codebase
// should call process.env directly — that's how you end up with a typo'd
// var name failing silently in production three features later.
function required(key) {
  const value = process.env[key];
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 3000,

  mongoUri: required("MONGO_URI"),

  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    preAuthExpiresIn: process.env.JWT_PRE_AUTH_EXPIRES_IN || "5m",
  },

  // Seeds the single Admin document on boot (see app/bootstrap/adminBootstrap.js).
  // Only username + passwordHash are re-synced from env on every boot — TOTP
  // enrollment state lives exclusively in the DB from then on, since it's
  // mutated at runtime (setup/confirm) and must survive restarts.
  admin: {
    username: required("ADMIN_USERNAME"),
    passwordHash: required("ADMIN_PASSWORD_HASH"),
  },

  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
  },

  cloudinary: {
    cloudName: required("CLOUDINARY_CLOUD_NAME"),
    apiKey: required("CLOUDINARY_API_KEY"),
    apiSecret: required("CLOUDINARY_API_SECRET"),
  },
};
