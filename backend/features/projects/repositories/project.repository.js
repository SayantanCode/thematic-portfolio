import { BaseRepository } from "../../../shared/baseClasses/BaseRepository.js";
import { Project } from "../models/project.model.js";

class ProjectRepository extends BaseRepository {
  constructor() {
    super(Project);
  }

  findPublished() {
    return this.model.find({ published: true }).sort({ priority: 1 }).lean();
  }

  findAllAdmin() {
    return this.model.find({}).sort({ priority: 1 }).lean();
  }
}

export const projectRepository = new ProjectRepository();
