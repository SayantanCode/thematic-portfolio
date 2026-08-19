import { projectService } from "../services/project.service.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator.js";

export const projectController = {
  async listPublished(req, res) {
    const projects = await projectService.listPublished();
    res.success(projects, "Projects fetched");
  },

  async listAllAdmin(req, res) {
    const projects = await projectService.listAllAdmin();
    res.success(projects, "Projects fetched");
  },

  async getByIdAdmin(req, res) {
    const project = await projectService.getByIdAdmin(req.params.id);
    res.success(project, "Project fetched");
  },

  async create(req, res) {
    const dto = createProjectSchema.parse(req.body);
    const project = await projectService.create(dto);
    res.created(project, "Project created");
  },

  async update(req, res) {
    const dto = updateProjectSchema.parse(req.body);
    const project = await projectService.update(req.params.id, dto);
    res.success(project, "Project updated");
  },

  async remove(req, res) {
    await projectService.remove(req.params.id);
    res.deleted(null, "Project deleted");
  },
};
