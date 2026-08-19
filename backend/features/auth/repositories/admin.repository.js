import { BaseRepository } from "../../../shared/baseClasses/BaseRepository.js";
import { Admin } from "../models/admin.model.js";

class AdminRepository extends BaseRepository {
  constructor() {
    super(Admin);
  }

  // Not .lean() — callers need the real document (bcrypt.compare against
  // passwordHash, or updateById follow-ups keyed off _id).
  findByUsername(username) {
    return this.model.findOne({ username });
  }
}

export const adminRepository = new AdminRepository();
