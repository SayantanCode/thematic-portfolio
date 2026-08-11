import React from "react";
import {
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiReact,
  SiTypescript,
  SiRedis,
  SiSocketdotio,
  SiGit,
  SiGithub,
  SiNpm,
  SiVite,
  SiEslint,
  SiPostman,
  SiJsonwebtokens,
} from "react-icons/si";
import { Workflow } from "lucide-react";

// Flat list — used by the Hero's compact tech-stack row and tooltips.
export const SKILLS = [
  {
    name: "Node.js",
    description: "Runtime environment",
    color: "#339933",
    icon: <SiNodedotjs size={20} />,
  },
  {
    name: "Express.js",
    description: "Web framework",
    color: "#e8e8e8",
    icon: <SiExpress size={20} />,
  },
  {
    name: "MongoDB",
    description: "NoSQL database",
    color: "#47A248",
    icon: <SiMongodb size={20} />,
  },
  {
    name: "React.js",
    description: "Frontend framework",
    color: "#61DAFB",
    icon: <SiReact size={20} />,
  },
  {
    name: "TypeScript",
    description: "Type-safe JavaScript",
    color: "#3178C6",
    icon: <SiTypescript size={20} />,
  },
  {
    name: "Redis",
    description: "In-memory cache",
    color: "#DC382D",
    icon: <SiRedis size={20} />,
  },
  {
    name: "Socket.io",
    description: "Real-time engine",
    color: "#e8e8e8",
    icon: <SiSocketdotio size={20} />,
  },
];

// Categorized structure — used by the SkillsGrid circuit-board diagram.
export const SKILL_CATEGORIES = [
  {
    id: "frontend",
    label: "Frontend",
    color: "#22d3ee",
    items: [
      { name: "React.js", description: "UI Library", color: "#61DAFB", icon: <SiReact size={26} /> },
      { name: "TypeScript", description: "Type Safety", color: "#3178C6", icon: <SiTypescript size={26} /> },
    ],
  },
  {
    id: "backend",
    label: "Backend Core",
    color: "#4ade80",
    core: true,
    items: [
      { name: "Node.js", description: "Runtime", color: "#339933", icon: <SiNodedotjs size={30} /> },
      { name: "Express.js", description: "Web Framework", color: "#e8e8e8", icon: <SiExpress size={30} /> },
    ],
  },
  {
    id: "data",
    label: "Data, Real-time & Jobs",
    color: "#f472b6",
    items: [
      { name: "MongoDB", description: "Document DB · Mongoose ODM", color: "#47A248", icon: <SiMongodb size={26} /> },
      { name: "Redis", description: "Cache & Memory", color: "#DC382D", icon: <SiRedis size={26} /> },
      { name: "Socket.io", description: "Real-time Comm", color: "#e8e8e8", icon: <SiSocketdotio size={26} /> },
      { name: "BullMQ", description: "Job Queues", color: "#fb923c", icon: <Workflow size={26} /> },
    ],
  },
];

// Real, verifiable tools — Git/GitHub/npm from the actual repo history,
// Vite/ESLint from this project's own package.json.
export const TOOLS = [
  { name: "Git", color: "#F05032", icon: <SiGit size={20} /> },
  { name: "GitHub", color: "#e8e8e8", icon: <SiGithub size={20} /> },
  { name: "npm", color: "#CB3837", icon: <SiNpm size={20} /> },
  { name: "Vite", color: "#BD34FE", icon: <SiVite size={20} /> },
  { name: "ESLint", color: "#4B32C3", icon: <SiEslint size={20} /> },
  { name: "Postman", color: "#FF6C37", icon: <SiPostman size={20} /> },
  { name: "JWT", color: "#e8e8e8", icon: <SiJsonwebtokens size={20} /> },
];
