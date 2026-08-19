// Single source of truth for both (a) what renders before the admin has
// ever saved anything for a section, and (b) what pre-fills the admin edit
// form the first time it loads. Keeps the two from drifting out of sync.

export const HERO_DEFAULTS = {
  greeting: "Hello, I'm 👋",
  firstName: "Sayantan",
  lastName: "Chakraborty",
  tagline: "Backend-Focused MERN Stack Developer",
  bio: "I build scalable, secure and real-time web applications with modern technologies — architecting high-concurrency SaaS solutions, complex scheduling engines, and robust API ecosystems.",
  availabilityBadge: "Open to Opportunities",
  email: "sayantan648@gmail.com",
};

export const ABOUT_DEFAULTS = {
  sectionSubtitle:
    "Backend developer who traded a classroom for a codebase — and loves clean, real-world solutions.",
  roleTitle: "Backend Developer",
  shortBio:
    "I love clean code and solving real-world problems — a career switcher who traded the classroom for backend architecture.",
  name: "Sayantan Chakraborty",
  role: "Backend-Focused MERN Stack Developer",
  company: "Hi7 Webtech Pvt Ltd",
  location: "Kolkata, West Bengal, India",
  since: "Nov 2024 — Present",
};

export const FOOTER_DEFAULTS = {
  name: "Sayantan Chakraborty",
  blurb: "Backend-focused MERN stack developer, building scalable and real-time web applications.",
  availability: "Currently available for specialized backend consulting & contract roles.",
  email: "sayantan648@gmail.com",
  location: "Kolkata, West Bengal, India",
  githubUrl: "https://github.com/SayantanCode",
  linkedinUrl: "https://www.linkedin.com/in/sayantan-chakraborty-code",
};
