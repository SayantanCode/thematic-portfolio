import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectService } from "@/services/projectService";
import { Button } from "@/shared/ui/Button.jsx";
import { ROUTES } from "@/routes/routeRegistry.js";

export const AdminProjectsListPage = () => {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    projectService
      .listAllAdmin()
      .then((result) => setProjects(result.data))
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.name}"? This can't be undone.`)) return;
    try {
      await projectService.remove(project._id);
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-black uppercase tracking-widest text-text">Projects</h1>
        <Button asChild size="sm">
          <Link to={ROUTES.ADMIN_PROJECTS_NEW}>New Project</Link>
        </Button>
      </div>

      {error && <p className="mb-4 text-xs text-red-400">{error}</p>}
      {projects === null && <p className="text-sm text-text-muted">Loading...</p>}
      {projects?.length === 0 && <p className="text-sm text-text-muted">No projects yet.</p>}

      {projects?.length > 0 && (
        <div className="glass-card rounded-sm border border-glass-border divide-y divide-glass-border">
          {projects.map((project) => (
            <div key={project._id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-surface text-text-muted border border-glass-border">
                    {project.type}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted">Priority {project.priority}</span>
                  {!project.published && (
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-text truncate">{project.name}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`${ROUTES.ADMIN_PROJECTS}/${project._id}/edit`}
                  className="interactive text-xs uppercase tracking-widest text-accent hover:opacity-80"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(project)}
                  className="interactive text-xs uppercase tracking-widest text-red-400 hover:opacity-80"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
