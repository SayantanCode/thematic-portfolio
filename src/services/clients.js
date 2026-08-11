import { createApiClient } from "./apiClient";
import { ENV } from "@/config/env.config.js";

/* Internal Private APIs */
export const api = createApiClient({
  baseURL: ENV.API_BASE_URL,
  withAuth: true,
});

/* Internal Public APIs (no auth) */
export const publicApi = createApiClient({
  baseURL: ENV.API_BASE_URL,
  withAuth: false,
});
// Here 3rd party APIs can be added 
// /* 3rd-party APIs */
// export const googleApi = createApiClient({
//   baseURL: "https://www.googleapis.com",
//   withAuth: false,
// });

// export const paymentApi = createApiClient({
//   baseURL: "https://api.stripe.com",
//   withAuth: false,
// });
