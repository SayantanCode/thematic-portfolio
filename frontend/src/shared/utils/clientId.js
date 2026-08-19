const STORAGE_KEY = "visitorId";

// A random id generated once per browser and persisted in localStorage —
// not real identity, just enough for the backend to dedupe anonymous
// view/like requests from the same visitor (see backend's
// postInteraction.model.js for the full reasoning).
export function getClientId() {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
