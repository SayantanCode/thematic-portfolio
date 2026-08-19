import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/services/authService";
import { useApi } from "@/shared/hooks/useApi";
import { Button } from "@/shared/ui/Button.jsx";
import { ROUTES } from "@/routes/routeRegistry.js";

const inputClasses =
  "w-full mb-4 rounded-sm border border-glass-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent";

export const AdminLoginPage = () => {
  const [step, setStep] = useState("credentials"); // "credentials" | "setup" | "verify"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [totpToken, setTotpToken] = useState("");
  const [preAuthToken, setPreAuthToken] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [secret, setSecret] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const loginApi = useApi(authService.login);
  const setupApi = useApi(authService.getTotpSetup);
  const confirmApi = useApi(authService.confirmTotpSetup);
  const verifyApi = useApi(authService.verifyTotp);

  const redirectTo = location.state?.from?.pathname || ROUTES.ADMIN;
  const finishLogin = (token) => {
    authService.storeToken(token);
    navigate(redirectTo, { replace: true });
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginApi.execute(username, password);
      const { preAuthToken: token, totpEnabled } = result.data;
      setPreAuthToken(token);

      if (totpEnabled) {
        setStep("verify");
      } else {
        const setup = await setupApi.execute(token);
        setQrDataUrl(setup.data.qrDataUrl);
        setSecret(setup.data.secret);
        setStep("setup");
      }
    } catch {
      // loginApi.error already holds the normalized message.
    }
  };

  const handleSetupConfirm = async (e) => {
    e.preventDefault();
    try {
      const result = await confirmApi.execute(preAuthToken, totpToken);
      finishLogin(result.data.token);
    } catch {
      // confirmApi.error already holds the normalized message.
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await verifyApi.execute(preAuthToken, totpToken);
      finishLogin(result.data.token);
    } catch {
      // verifyApi.error already holds the normalized message.
    }
  };

  return (
    <div className="cursor-restore min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="glass-card w-full max-w-sm rounded-sm border border-glass-border p-8">
        <h1 className="text-sm font-black uppercase tracking-widest text-accent mb-6">
          Admin Login
        </h1>

        {step === "credentials" && (
          <form onSubmit={handleCredentialsSubmit}>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              className={inputClasses}
            />

            <label className="block text-xs uppercase tracking-widest text-text-muted mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
            />

            {(loginApi.error || setupApi.error) && (
              <p className="mb-4 text-xs text-red-400">
                {(loginApi.error || setupApi.error).message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full justify-center"
              disabled={loginApi.loading || setupApi.loading}
            >
              {loginApi.loading || setupApi.loading ? "Checking..." : "Continue"}
            </Button>
          </form>
        )}

        {step === "setup" && (
          <form onSubmit={handleSetupConfirm}>
            <p className="mb-4 text-xs text-text-muted">
              Scan this QR code with your authenticator app (Google Authenticator, Authy,
              1Password, ...), then enter the 6-digit code it shows to finish setup.
            </p>

            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Authenticator setup QR code"
                className="mx-auto mb-4 w-40 h-40 rounded-sm border border-glass-border bg-white p-2"
              />
            )}

            {secret && (
              <p className="mb-4 break-all text-center text-[11px] tracking-widest text-text-muted">
                Manual entry key: {secret}
              </p>
            )}

            <label className="block text-xs uppercase tracking-widest text-text-muted mb-2">
              Authenticator Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={totpToken}
              onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              autoFocus
              className={`${inputClasses} tracking-widest`}
            />

            {confirmApi.error && (
              <p className="mb-4 text-xs text-red-400">{confirmApi.error.message}</p>
            )}

            <Button type="submit" className="w-full justify-center" disabled={confirmApi.loading}>
              {confirmApi.loading ? "Confirming..." : "Confirm & Log In"}
            </Button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerifySubmit}>
            <label className="block text-xs uppercase tracking-widest text-text-muted mb-2">
              Authenticator Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={totpToken}
              onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              autoFocus
              className={`${inputClasses} tracking-widest`}
            />

            {verifyApi.error && (
              <p className="mb-4 text-xs text-red-400">{verifyApi.error.message}</p>
            )}

            <Button type="submit" className="w-full justify-center" disabled={verifyApi.loading}>
              {verifyApi.loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
