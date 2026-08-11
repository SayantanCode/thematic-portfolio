import React from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { ArrowUpRight } from "lucide-react";
import golfPosImg from "../assets/projects/golf-pos.jpg";
import vayoImg from "../assets/projects/vayo.jpg";
import shopdesiImg from "../assets/projects/shopdesi.jpg";
import cliImg from "../assets/projects/create-structure-cli.jpg";

const PROJECTS = [
  {
    name: "Golf POS Multi-Tenancy",
    featured: true,
    image: golfPosImg,
    description:
      "Real-time golf course business management platform with multi-level access control (Admin → Business Owner → Golf Course), a recursive recurrence engine for tee-time bookings, and sub-100ms locking to prevent double-booking at peak demand.",
    tags: ["MERN Stack", "Socket.io", "Redis"],
    href: "https://www.linkedin.com/in/sayantan-chakraborty-code",
  },
  {
    name: "vayo (API Docs)",
    image: vayoImg,
    description:
      "Self-hosted, auto-generating API documentation for Express apps — statically captures routes and Zod schemas, compiles a live OpenAPI 3.1 spec, with a five-tab UI including a Postman-parity request client.",
    tags: ["TypeScript", "OpenAPI 3.1", "Socket.IO"],
    href: "https://github.com/SayantanCode/vayo",
  },
  {
    name: "ShopDesi E-Commerce",
    image: shopdesiImg,
    description:
      "Full-stack MERN e-commerce platform — customer storefront, admin panel, and REST API, covering cart, checkout, and order management end to end.",
    tags: ["MERN Stack", "React", "Node.js"],
    href: "https://github.com/SayantanCode/Full-Stack-Ecommerce-ShopDesi.in-Deploy",
  },
  {
    name: "create-structure-cli",
    image: cliImg,
    description:
      "Composable full-stack project scaffolder — pick a backend (Express, Fastify, or NestJS) and optionally a React+Vite frontend, then mix in auth, RBAC, a database, testing, Docker and CI. Published on npm.",
    tags: ["Node.js CLI", "npm"],
    href: "https://github.com/SayantanCode/cli-project-structure-builder",
  },
];

const ProjectCard = ({ project, index }) => (
  <motion.a
    href={project.href}
    target="_blank"
    rel="noreferrer"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
    className="interactive group glass-card rounded-2xl overflow-hidden border border-glass-border hover:border-accent/40 transition-colors duration-500 flex flex-col"
  >
    <div className="relative aspect-video overflow-hidden">
      <img
        src={project.image}
        alt={project.name}
        className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
      />
      {project.featured && (
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-bg text-[10px] font-mono font-bold uppercase tracking-widest">
          Featured
        </span>
      )}
    </div>

    <div className="p-5 sm:p-6 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-header font-bold text-lg text-primary">
          {project.name}
        </h3>
        <ArrowUpRight
          size={18}
          className="text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1"
        />
      </div>

      <p className="text-muted text-sm leading-relaxed mb-4 flex-1">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-surface/50 border border-glass-border rounded-full text-[10px] font-mono text-accent/80"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.a>
);

export const FeaturedProjects = () => {
  return (
    <section id="projects" className="container mx-auto px-6 md:px-12 py-12 md:py-24 text-primary border-b border-glass-border">
      <SectionHeader
        title="Featured Projects"
        subtitle="Real work — from production platforms to open source tools."
      />

      <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};
