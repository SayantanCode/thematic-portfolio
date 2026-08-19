import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import { generateSecret, generateURI, verify as verifyTotpCode } from "otplib";
import { adminRepository } from "../repositories/admin.repository.js";
import { issueAdminToken } from "../../../platform/auth/issueAdminToken.js";
import { issuePreAuthToken } from "../../../platform/auth/issuePreAuthToken.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../shared/errors/index.js";

const TOTP_ISSUER = "Thematic Portfolio Admin";

export const authService = {
  // Step 1: credentials. Never issues a full session token directly —
  // always routes through the TOTP step (setup or verify), even though
  // there's exactly one admin. Keeping this separate is what makes the
  // enrollment flow (QR shown once, then required forever after) possible.
  async login(username, password) {
    const admin = await adminRepository.findByUsername(username);
    if (!admin) {
      throw new UnauthorizedError("Incorrect username or password");
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError("Incorrect username or password");
    }

    return {
      preAuthToken: issuePreAuthToken(admin._id),
      totpEnabled: admin.totpEnabled,
    };
  },

  // Step 2a (first-time only): generates a fresh secret every call while
  // enrollment is still pending — abandoning a scan and logging in again
  // just re-rolls it, no stale half-confirmed secrets pile up.
  async getTotpSetup(adminId) {
    const admin = await adminRepository.findById(adminId, { lean: false });
    if (!admin) throw new NotFoundError("Admin not found");
    if (admin.totpEnabled) {
      throw new BadRequestError("Authenticator is already set up");
    }

    const secret = generateSecret();
    admin.totpSecret = secret;
    await admin.save();

    const otpauthUrl = generateURI({ issuer: TOTP_ISSUER, label: admin.username, secret });
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl);

    return { qrDataUrl, secret };
  },

  // Step 2a confirm: first code entered against the freshly-scanned secret
  // both proves the scan worked AND flips the account into "enabled".
  async confirmTotpSetup(adminId, totpToken) {
    const admin = await adminRepository.findById(adminId, { lean: false });
    if (!admin) throw new NotFoundError("Admin not found");
    if (admin.totpEnabled || !admin.totpSecret) {
      throw new BadRequestError("No pending authenticator setup");
    }

    const { valid } = await verifyTotpCode({ secret: admin.totpSecret, token: totpToken });
    if (!valid) {
      throw new UnauthorizedError("Invalid or expired authenticator code");
    }

    admin.totpEnabled = true;
    await admin.save();

    return { token: issueAdminToken() };
  },

  // Step 2b: the normal path on every login after enrollment.
  async verifyTotp(adminId, totpToken) {
    const admin = await adminRepository.findById(adminId, { lean: false });
    if (!admin) throw new NotFoundError("Admin not found");
    if (!admin.totpEnabled) {
      throw new BadRequestError("Authenticator is not set up yet");
    }

    const { valid } = await verifyTotpCode({ secret: admin.totpSecret, token: totpToken });
    if (!valid) {
      throw new UnauthorizedError("Invalid or expired authenticator code");
    }

    return { token: issueAdminToken() };
  },
};
