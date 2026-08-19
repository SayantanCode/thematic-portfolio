import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Download, Star, Lock, Lightbulb, Copy, Check, ExternalLink } from "lucide-react";
import { SectionHeader } from "@/shared/components/SectionHeader.jsx";
import { CardContent, CardTitle, CardDescription } from "@/shared/ui/Card.jsx";
import { Modal } from "@/shared/ui/Modal.jsx";
import { Button } from "@/shared/ui/Button.jsx";
import { projectService } from "@/services/projectService";

const getImage = (project) => project.image || null;

const Tags = ({ tags }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <span
        key={tag}
        className="px-2.5 py-1 bg-surface/50 border border-glass-border rounded-full text-[10px] font-mono text-accent/80"
      >
        {tag}
      </span>
    ))}
  </div>
);

const CardImage = ({ project, hero }) => {
  const image = getImage(project);
  if (!image) return null;
  return (
    <div className={`relative overflow-hidden ${hero ? "aspect-video lg:aspect-auto lg:h-full" : "aspect-video"}`}>
      <img
        src={image}
        alt={project.name}
        className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* COMPANY — no public link (can't demo a private enterprise app), so the     */
/* card opens a case-study modal instead of pretending to have one.           */
/* -------------------------------------------------------------------------- */

const CompanyCard = ({ project, index, hero, onOpen }) => (
  <motion.button
    onClick={onOpen}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    viewport={{ once: true, margin: "-50px" }}
    className={`interactive group text-left glass-card rounded-2xl overflow-hidden border border-glass-border hover:border-accent/40 transition-colors duration-500 flex flex-col ${
      hero ? "lg:grid lg:grid-cols-2" : ""
    }`}
  >
    <div className="relative">
      <CardImage project={project} hero={hero} />
      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg/80 border border-accent/30 text-accent text-[10px] font-mono font-bold uppercase tracking-widest">
        <Lock size={11} />
        Private / Enterprise
      </span>
    </div>

    <CardContent className="p-5 sm:p-6 flex flex-col flex-1 justify-center">
      <div className="flex items-start justify-between gap-3 mb-2">
        <CardTitle className={hero ? "text-xl lg:text-2xl" : ""}>{project.name}</CardTitle>
        <ArrowUpRight
          size={18}
          className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
        />
      </div>

      {project.company && (
        <p className="text-accent font-mono text-[10px] uppercase tracking-widest mb-3">
          {project.role ? `${project.role} · ` : ""}
          {project.company}
        </p>
      )}

      <CardDescription className="mb-4 flex-1">{project.description}</CardDescription>

      <Tags tags={project.tags} />
    </CardContent>
  </motion.button>
);

const CompanyCaseStudyModal = ({ project, onClose }) => (
  <Modal isOpen={Boolean(project)} onClose={onClose} title={project?.name}>
    {project && (
      <>
        {getImage(project) && (
          <img src={getImage(project)} alt={project.name} className="w-full aspect-video object-cover" />
        )}
        <div className="p-6">
          <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-surface border border-accent/30 text-accent text-[10px] font-mono font-bold uppercase tracking-widest">
            <Lock size={11} />
            Private / Enterprise
          </span>

          <h3 className="font-header font-black text-2xl text-primary mb-1">{project.name}</h3>
          {project.company && (
            <p className="text-accent font-mono text-xs uppercase tracking-widest mb-4">
              {project.role ? `${project.role} · ` : ""}
              {project.company}
            </p>
          )}

          <p className="text-muted text-sm leading-relaxed mb-5">{project.description}</p>

          <div className="mb-5">
            <Tags tags={project.tags} />
          </div>

          {project.companyUrl && (
            <a
              href={project.companyUrl}
              target="_blank"
              rel="noreferrer"
              className="interactive inline-flex items-center gap-2 text-accent font-mono text-xs uppercase tracking-widest hover:gap-3 transition-all"
            >
              Visit Company
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </>
    )}
  </Modal>
);

/* -------------------------------------------------------------------------- */
/* NPM — install command + curated download/star counts (admin-updated, not  */
/* live-fetched — same "periodically recounted" convention as GITHUB_STATS). */
/* -------------------------------------------------------------------------- */

const NpmCard = ({ project, index, hero }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`npm install ${project.npmPackageName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.a
      href={project.href || `https://www.npmjs.com/package/${project.npmPackageName}`}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`interactive group glass-card rounded-2xl overflow-hidden border border-glass-border hover:border-accent/40 transition-colors duration-500 flex flex-col ${
        hero ? "lg:grid lg:grid-cols-2" : ""
      }`}
    >
      <CardImage project={project} hero={hero} />

      <CardContent className="p-5 sm:p-6 flex flex-col flex-1 justify-center">
        <div className="flex items-start justify-between gap-3 mb-2">
          <CardTitle className={hero ? "text-xl lg:text-2xl" : ""}>{project.name}</CardTitle>
          <ArrowUpRight
            size={18}
            className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
          />
        </div>

        <CardDescription className="mb-4 flex-1">{project.description}</CardDescription>

        {(project.npmDownloads || project.githubStars != null) && (
          <div className="flex items-center gap-4 mb-4 text-[11px] font-mono text-muted">
            {project.npmDownloads && (
              <span className="inline-flex items-center gap-1.5">
                <Download size={12} className="text-accent" />
                {project.npmDownloads}
              </span>
            )}
            {project.githubStars != null && (
              <span className="inline-flex items-center gap-1.5">
                <Star size={12} className="text-accent" />
                {project.githubStars}
              </span>
            )}
          </div>
        )}

        {project.npmPackageName && (
          <button
            onClick={handleCopy}
            className="interactive mb-4 flex items-center justify-between gap-3 rounded-lg bg-bg/60 border border-glass-border px-3 py-2 text-left"
          >
            <code className="text-accent text-[12px] font-mono truncate">
              npm install {project.npmPackageName}
            </code>
            {copied ? <Check size={14} className="text-accent shrink-0" /> : <Copy size={14} className="text-muted shrink-0" />}
          </button>
        )}

        <div className="flex items-center justify-between">
          <Tags tags={project.tags} />
          {project.href && <Github size={16} className="text-muted group-hover:text-accent transition-colors shrink-0" />}
        </div>
      </CardContent>
    </motion.a>
  );
};

/* -------------------------------------------------------------------------- */
/* PRODUCT — earlier/self-directed work. Honest, not hidden: `learnings`     */
/* reframes it as a growth signal instead of pretending it's flawless.        */
/* -------------------------------------------------------------------------- */

const ProductCard = ({ project, index }) => (
  <motion.a
    href={project.href}
    target="_blank"
    rel="noreferrer"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.08 }}
    viewport={{ once: true, margin: "-50px" }}
    className="interactive group glass-card rounded-2xl overflow-hidden border border-glass-border hover:border-accent/40 transition-colors duration-500 flex flex-col"
  >
    <CardImage project={project} />

    <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-3 mb-2">
        <CardTitle>{project.name}</CardTitle>
        <ArrowUpRight
          size={18}
          className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
        />
      </div>

      <CardDescription className="mb-4 flex-1">{project.description}</CardDescription>

      {project.learnings && (
        <div className="mb-4 rounded-lg bg-bg/60 border border-glass-border px-3 py-2.5 flex gap-2">
          <Lightbulb size={14} className="text-accent shrink-0 mt-0.5" />
          <p className="text-muted text-xs leading-relaxed">{project.learnings}</p>
        </div>
      )}

      <Tags tags={project.tags} />
    </CardContent>
  </motion.a>
);

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

export const FeaturedProjects = () => {
  // "loading" | "error" | "ready" — this section is a permanent nav anchor
  // (Sidebar's "Projects" item scrolls to id="projects"), so it must never
  // fully disappear from the DOM the way an empty-content section elsewhere
  // reasonably could: a backend outage would silently break that nav click
  // along with hiding the section, with nothing on screen to explain why.
  const [status, setStatus] = useState("loading");
  const [projects, setProjects] = useState([]);
  const [openCompanyProject, setOpenCompanyProject] = useState(null);

  useEffect(() => {
    let mounted = true;
    projectService
      .listPublished()
      .then((result) => {
        if (!mounted) return;
        setProjects(result.data);
        setStatus("ready");
      })
      .catch(() => {
        if (mounted) setStatus("error");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const [hero, ...rest] = projects;

  const renderCard = (project, index, isHero) => {
    if (project.type === "company") {
      return (
        <CompanyCard
          key={project._id}
          project={project}
          index={index}
          hero={isHero}
          onOpen={() => setOpenCompanyProject(project)}
        />
      );
    }
    if (project.type === "npm") {
      return <NpmCard key={project._id} project={project} index={index} hero={isHero} />;
    }
    return <ProductCard key={project._id} project={project} index={index} />;
  };

  return (
    <section id="projects" className="container mx-auto px-6 md:px-12 py-12 md:py-24 text-primary border-b border-glass-border">
      <SectionHeader
        title="Featured Projects"
        subtitle="Real work — from production platforms to open source tools."
      />

      {status === "error" && (
        <p className="text-muted text-sm font-mono max-w-md">
          Projects couldn't be loaded right now — please check back shortly.
        </p>
      )}

      {status === "ready" && projects.length === 0 && (
        <p className="text-muted text-sm font-mono max-w-md">
          No projects published yet — check back soon.
        </p>
      )}

      {status === "ready" && projects.length > 0 && (
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
          <div className="grid gap-6 md:gap-8">{renderCard(hero, 0, true)}</div>

          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {rest.map((project, i) => renderCard(project, i + 1, false))}
            </div>
          )}
        </div>
      )}

      <CompanyCaseStudyModal project={openCompanyProject} onClose={() => setOpenCompanyProject(null)} />
    </section>
  );
};
