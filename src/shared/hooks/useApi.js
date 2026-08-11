import { useCallback, useState } from "react";

/**
 * useApi hook
 * @param {function} apiFn - function to be executed
 * @returns {object} - {data, error, loading, execute}
 * @description - A hook that wraps an API function and provides state for data, error, and loading.
 * The execute function is memoized and will only recreate when the apiFn changes.
 * The hook will handle setting the data, error, and loading state based on the result of the apiFn.
 * If the apiFn throws an error, the error will be caught and set to the error state.
 * If the apiFn resolves successfully, the result will be set to the data state.
 * The loading state will be set to true while the apiFn is executing and false when it is finished.
 * The execute function will throw the error if it is caught so that it can be caught higher up in the component tree.
 * @example
 * import { useEffect } from "react";
 * import { useApi } from "@/hooks/useApi";
 * import { userService } from "@/api/services/user.service";

 * const { data, error, loading, execute } = useApi(userService.fetchUsers);
 * useEffect(() => {
 *   execute();
 * }, [execute]);
 * ...
 * return (
 *   <div>
 *     {loading && <p>Loading...</p>}
 *     {error && <p>Error: {error.message}</p>}
 *     {data && <p>Users: {data.length}</p>}
 *   </div>
 * );

 */
export function useApi(apiFn) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return {
    data,
    error,
    loading,
    execute,
  };
}
