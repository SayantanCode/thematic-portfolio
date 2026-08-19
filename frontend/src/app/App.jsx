import { ErrorBoundary } from "./ErrorBoundary.jsx";
import { AppProviders } from "./AppProviders.jsx";
import { AppRouter } from "@/routes/AppRouter.jsx";

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
