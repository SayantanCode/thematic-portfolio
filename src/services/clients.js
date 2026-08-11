import { createApiClient } from "./createApiClient";

/* Internal Private APIs */
export const api = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withAuth: true,
});

/* Internal Public APIs (no auth) */
export const publicApi = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
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
