import mongoose from "mongoose";

// Exactly one document ever exists in this collection — there's a single
// site owner, not a user base. totpSecret/totpEnabled are null/false until
// the owner completes enrollment (features/auth/services/auth.service.js).
const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    totpSecret: { type: String, default: null },
    totpEnabled: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export const Admin = mongoose.model("Admin", adminSchema);
