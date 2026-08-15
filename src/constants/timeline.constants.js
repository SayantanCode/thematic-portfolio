// Real chronological history — sourced directly from LinkedIn + certificates,
// not invented. `start`/`end` are ISO dates for sorting; `end: null` marks
// the entry as still ongoing. Display order in JourneyTimeline is derived
// from these, not from this array's order — so this can later be replaced
// by an API/DB response in any order without breaking the sort.
export const TIMELINE = [
  {
    id: "ba",
    period: "2017 — 2020",
    start: "2017-01-01",
    end: "2020-01-01",
    title: "Bachelor of Arts (BA)",
    org: "Khalisani Mahavidyalaya",
    type: "education",
    description: "Undergraduate degree, ahead of a later pivot into software.",
    tags: [],
  },
  {
    id: "teacher",
    period: "Apr 2022 — May 2023",
    start: "2022-04-01",
    end: "2023-05-01",
    title: "School Teacher",
    org: "Lords International School",
    type: "work",
    description: "Taught English and Computer Science full-time.",
    tags: ["English", "Computer Science"],
  },
  {
    id: "transition",
    period: "Jun 2023 — Nov 2024",
    start: "2023-06-01",
    end: "2024-11-01",
    title: "Career Transition",
    org: "Self-directed",
    type: "education",
    description:
      "Pivoted into software development — completed a BCA at Dr. D.Y. Patil Vidyapeeth, Pune (June 2024) and the MERN Stack Developer certification at WebSkitters Academy.",
    tags: ["BCA · Dr. D.Y. Patil Vidyapeeth, Pune", "MERN Certification · WebSkitters Academy"],
    credentialUrl:
      "https://certificate.webskittersacademy.in/crtdls/sayantan-chakraborty-mern-stack-2-mern-stack-development-course/621-0/",
  },
  {
    id: "hih7",
    period: "Nov 2024 — Present",
    start: "2024-11-01",
    end: null,
    title: "MERN Stack Developer",
    org: "Hih7 Webtech Pvt Ltd",
    type: "work",
    description:
      "Building a real-time golf course business management platform with multi-level access control (Admin → Business Owner → Golf Course).",
    tags: ["Node.js", "MongoDB", "Express.js", "React.js"],
  },
];
