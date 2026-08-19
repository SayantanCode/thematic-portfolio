import { Admin } from "../../features/auth/models/admin.model.js";
import { env } from "../../config/index.js";

// Keeps username/passwordHash in sync with env on every boot (change the
// .env values, restart, done — no admin-management UI needed for that).
// totpSecret/totpEnabled are deliberately NOT touched here once the document
// exists — that state is mutated at runtime by the enrollment flow
// (features/auth/services/auth.service.js) and must survive restarts.
export async function bootstrapAdmin() {
  await Admin.findOneAndUpdate(
    {},
    {
      $set: { username: env.admin.username, passwordHash: env.admin.passwordHash },
      $setOnInsert: { totpSecret: null, totpEnabled: false },
    },
    { upsert: true, new: true }
  );

  console.log("[bootstrap] Admin account synced");
}
