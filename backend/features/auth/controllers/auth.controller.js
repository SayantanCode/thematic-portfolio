import { authService } from "../services/auth.service.js";
import { loginSchema, totpTokenSchema } from "../validators/auth.validator.js";

// Controllers stay thin: validate input shape, delegate to the service,
// format the response.
export const authController = {
  async login(req, res) {
    const dto = loginSchema.parse(req.body);
    const result = await authService.login(dto.username, dto.password);
    res.success(result, "Password verified");
  },

  async getTotpSetup(req, res) {
    const result = await authService.getTotpSetup(req.adminId);
    res.success(result, "Scan this QR code in your authenticator app");
  },

  async confirmTotpSetup(req, res) {
    const dto = totpTokenSchema.parse(req.body);
    const result = await authService.confirmTotpSetup(req.adminId, dto.totpToken);
    res.success(result, "Authenticator enabled, logged in");
  },

  async verifyTotp(req, res) {
    const dto = totpTokenSchema.parse(req.body);
    const result = await authService.verifyTotp(req.adminId, dto.totpToken);
    res.success(result, "Logged in");
  },
};
