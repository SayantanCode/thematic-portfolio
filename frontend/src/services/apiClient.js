import axios from "axios";

/**
 * Creates an instance of Axios with default settings
 * and interceptors for authentication and error handling.
 *
 * @param {Object} options - Options for the Axios instance.
 * @param {string} options.baseURL - The base URL for the Axios instance.
 * @param {boolean} [options.withAuth=true] - Whether to include an authentication header interceptor.
 * @note Additional options can be passed to Axios.
 *
 * @returns {AxiosInstance} - The created Axios instance.
 */
export function createApiClient({ baseURL, withAuth = true, ...options }) {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 15000,
    ...options,
  });

  /* REQUEST INTERCEPTOR */
  client.interceptors.request.use(
    (config) => {
      if (withAuth) {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  /* RESPONSE INTERCEPTOR */
  client.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const normalizedError = {
        status: error.response?.status,
        message:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
        data: error.response?.data,
      };

      /* Auto logout on 401 */
      if (normalizedError.status === 401) {
        localStorage.removeItem("authToken");
        // When actual authentication is implemented in the future this should redirect to the login page
        // window.location.href = "/login";
      }

      return Promise.reject(normalizedError);
    }
  );

  return client;
}
