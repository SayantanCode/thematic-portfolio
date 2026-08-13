import { Component } from "react";

/**
 * This app had zero error boundary before this reorg — if WebGL init in
 * SplashCursor/SceneBackground (or anything else) threw, the whole app went
 * to a blank white screen with no recovery. Kept deliberately dependency-
 * light: plain React + CSS variables + pure-CSS animation, no
 * framer-motion/lucide/three import — it renders precisely when something
 * elsewhere may be broken, so it shouldn't risk a second failure by pulling
 * in more of the same libraries.
 *
 * `.cursor-restore` (globals.css) is load-bearing, not decorative: the app
 * hides the real OS cursor everywhere and relies on LiquidCursor to draw a
 * custom one — LiquidCursor lives in the same tree this boundary guards, so
 * when it crashes too, the cursor becomes fully invisible (though still
 * technically clickable) unless this class explicitly restores it.
 */
export class ErrorBoundary extends Component {
  state = { hasError: false, error: null, code: "" };

  static getDerivedStateFromError(error) {
    const code = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .toUpperCase()
      .padStart(6, "0");
    return { hasError: true, error, code };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled error:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const message = this.state.error?.message || "Unknown error";

    return (
      <div
        className="cursor-restore fixed inset-0 z-99999 flex items-center justify-center px-6 text-center overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, color-mix(in srgb, var(--accent) 10%, var(--bg)) 0%, var(--bg) 60%)",
          color: "var(--text)",
        }}
      >
        {/* Faint HUD grid, matching the space backdrop used elsewhere */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="error-scanline pointer-events-none" />

        <div className="relative z-10 max-w-lg w-full">
          <div
            className="glass-card relative rounded-2xl px-8 py-10 sm:px-12 sm:py-14"
            style={{ borderColor: "var(--glass-border)" }}
          >
            {/* Corner brackets — the same "target lock" motif as the
                custom cursor's hover state, scaled up */}
            <span
              className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 rounded-tl-lg"
              style={{ borderColor: "var(--accent)" }}
            />
            <span
              className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 rounded-tr-lg"
              style={{ borderColor: "var(--accent)" }}
            />
            <span
              className="absolute -bottom-px -left-px w-8 h-8 border-b-2 border-l-2 rounded-bl-lg"
              style={{ borderColor: "var(--accent)" }}
            />
            <span
              className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 rounded-br-lg"
              style={{ borderColor: "var(--accent)" }}
            />

            <p
              className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              System Fault // 0x{this.state.code}
            </p>

            {/* aria-label pins the accessible name explicitly — browsers
                include ::before/::after `content: attr(data-text)` in the
                "name from content" computation, which would otherwise read
                out as "Connection Lost" three times over to screen readers. */}
            <h1
              aria-label="CONNECTION LOST"
              data-text="CONNECTION LOST"
              className="glitch-heading font-header font-black text-3xl sm:text-4xl uppercase tracking-tight mb-4"
              style={{ color: "var(--accent)", textShadow: "0 0 24px var(--accent-glow)" }}
            >
              CONNECTION LOST
            </h1>

            <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              The page hit an unexpected error and had to stop rendering.
              Reloading usually fixes it.
            </p>

            <pre
              className="text-left font-mono text-[11px] rounded-lg px-4 py-3 mb-8 overflow-x-auto"
              style={{
                color: "var(--text-muted)",
                background: "color-mix(in srgb, var(--surface) 90%, transparent)",
                border: "1px solid var(--glass-border)",
              }}
            >
              {message}
            </pre>

            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-sm font-black uppercase tracking-widest text-xs hover:brightness-110 transition-[filter]"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                boxShadow: "0 0 24px var(--accent-glow)",
              }}
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
