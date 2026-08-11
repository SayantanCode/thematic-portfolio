import { Component } from "react";

/**
 * This app had zero error boundary before this reorg — if WebGL init in
 * SplashCursor/SceneBackground (or anything else) threw, the whole app went
 * to a blank white screen with no recovery. Kept deliberately minimal:
 * catch, log, offer a reload. Styled with raw CSS vars (not the `bg-bg`/
 * `text-primary` Tailwind utilities) since this renders precisely when
 * something elsewhere may be broken — it shouldn't depend on anything but
 * the CSS variables that are always defined on :root.
 */
export class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--bg)] text-[var(--text)] px-6 text-center">
        <p className="font-header font-black text-2xl uppercase tracking-tight">
          Something went wrong
        </p>
        <p className="text-sm text-[var(--text-muted)] max-w-sm">
          The page hit an unexpected error. Reloading usually fixes it.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-sm bg-[var(--accent)] text-[var(--bg)] font-black uppercase tracking-widest text-xs"
        >
          Reload
        </button>
      </div>
    );
  }
}
