import { publicApi } from "./clients";

const TOKEN_KEY = "authToken";

const withPreAuth = (preAuthToken) => ({
  headers: { Authorization: `Bearer ${preAuthToken}` },
});

export const authService = {
  // Step 1: credentials -> { preAuthToken, totpEnabled }.
  login: (username, password) => publicApi.post("/auth/login", { username, password }),

  // Step 2a (first login only): generate/re-fetch the pending QR + secret.
  getTotpSetup: (preAuthToken) => publicApi.get("/auth/totp/setup", withPreAuth(preAuthToken)),
  confirmTotpSetup: (preAuthToken, totpToken) =>
    publicApi.post("/auth/totp/confirm", { totpToken }, withPreAuth(preAuthToken)),

  // Step 2b (every login after enrollment).
  verifyTotp: (preAuthToken, totpToken) =>
    publicApi.post("/auth/totp/verify", { totpToken }, withPreAuth(preAuthToken)),

  storeToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
};
