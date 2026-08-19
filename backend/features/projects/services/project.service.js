import { projectRepository } from "../repositories/project.repository.js";
import { NotFoundError } from "../../../shared/errors/index.js";

export const projectService = {
  listPublished: () => projectRepository.findPublished(),

  listAllAdmin: () => projectRepository.findAllAdmin(),

  async getByIdAdmin(id) {
    const project = await projectRepository.findById(id, { lean: true });
    if (!project) throw new NotFoundError("Project not found");
    return project;
  },

  create: (dto) => projectRepository.create(dto),

  async update(id, dto) {
    const updated = await projectRepository.updateById(id, dto, { lean: true });
    if (!updated) throw new NotFoundError("Project not found");
    return updated;
  },

  async remove(id) {
    const deleted = await projectRepository.deleteById(id);
    if (!deleted) throw new NotFoundError("Project not found");
  },
};
