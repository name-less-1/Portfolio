export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
}

export interface Project {
  slug: string;
  index: string;
  title: string;
  kind: string;
  year: string;
  status: string;
  live: boolean;
  stack: string[];
  summary: string;
  repo?: string;
  liveUrl?: string;
  apiUrl?: string;
  lessons?: string[];
  features?: string[];
  endpoints?: ApiEndpoint[];
  team?: string;
  roadmap?: string[];
}

export const profile = {
  name: "Aryan",
  handle: "a.",
  role: "Full-stack developer · MERN · GenAI",
  heroLine: ["I build", "search & systems", "from scratch."],
  bio: "B.Tech CSE student building software across information retrieval, backend systems and AI experiments. Currently building the indexing pipeline for a Wikipedia search engine — starting with the Simple English dump and targeting the full ~25GB English dump.",
  status: "open to building",
  location: "India · IST",
  years: "2024 — 2028",
  coords: "LAT 127.0° / LON 0.1°",
  node: "NODE: DEV-01",
  email: "aryanbogia2004@gmail.com",
  github: "https://github.com/name-less-1",
  linkedin: "https://www.linkedin.com/in/aryan-a-14ab31337/",
  phone: "+91 90349 13773",
} as const;

export const projects: Project[] = [
  {
    slug: "wiki-search-engine",
    index: "01",
    title: "wiki-search-engine",
    kind: "information retrieval",
    year: "2026",
    status: "IN PROGRESS",
    live: true,
    stack: ["python", "inverted index", "tf-idf", "mwparserfromhell"],
    summary:
      "A search engine built from scratch over Wikipedia — no Elasticsearch, no Lucene. Development uses the Simple English dump, with the full ~25GB English dump as the eventual scale target.",
    repo: "https://github.com/name-less-1/search-engine",
    lessons: [
      "Wikipedia namespaces every dump tag — naive element lookups silently fail until you match the full namespaced string.",
      "Calling .clear() on every iterparse element wipes child data like <title> before you've read it; clear only the outer element you're done with.",
      "Wikitext nests, so regex-only cleanup breaks fast on things like captioned file embeds with links inside links.",
    ],
  },
  {
    slug: "kite",
    index: "02",
    title: "citizenpulse",
    kind: "civic technology · team of two",
    year: "2025–26",
    status: "SHIPPED",
    live: false,
    stack: ["react 18", "node / express", "mongodb atlas", "vercel + render"],
    summary:
      "A civic-tech platform bringing government schemes, laws, jobs and alerts together — with authentication, an admin panel and structured data modules.",
    repo: "https://github.com/name-less-1/Kite",
    liveUrl: "https://kite-orpin.vercel.app",
    apiUrl: "https://kite-3cun.onrender.com",
    features: [
      "Scheme Explorer — national and state-level schemes, filterable by category and state",
      "Scholarship Finder — active scholarships by state and category",
      "Legislative View — recent laws and acts",
      "Jan-Seva — civic complaint tracker with submission",
      "Antariksh — ISRO missions and India's space programme",
      "Raksha — defence spotlight and recruitment",
      "Jobs — government job listings, all persisted in MongoDB Atlas",
    ],
    endpoints: [
      {
        method: "GET",
        path: "/api/schemes",
        description: "All schemes — filter with ?state=Punjab&category=Students",
      },
      { method: "GET", path: "/api/jobs", description: "Government job listings" },
      { method: "GET", path: "/api/laws", description: "Recent laws and acts" },
      {
        method: "GET",
        path: "/api/complaints",
        description: "Civic complaint tracker",
      },
      {
        method: "POST",
        path: "/api/complaints",
        description: "Submit a new complaint",
      },
    ],
    team: "Two-person build — one on UI/UX and React views, one on the Express API, Mongo integration and deployment. React frontend talks to Express over fetch, backed by MongoDB Atlas.",
    roadmap: [
      "User authentication (JWT) — saved schemes, personalised feed",
      "Eligibility matcher",
      "Hindi / Punjabi / Hinglish language support",
      "Mobile app",
    ],
  },
  {
    slug: "detectiveai",
    index: "03",
    title: "detectiveai",
    kind: "LLM game · AI",
    year: "2026",
    status: "SHIPPED",
    live: false,
    stack: ["node.js", "express", "ejs", "groq"],
    summary:
      "A turn-based AI detective game where players interrogate an LLM-driven suspect. Suspect responses adapt to the player's line of questioning.",
    repo: "https://github.com/name-less-1/detective-sim",
  },
];

export interface ExperienceItem {
  period: string;
  role: string;
  org: string;
  note?: string;
  status: "ongoing" | "done";
  points: string[];
}

export const experience: ExperienceItem[] = [
  {
    period: "2026",
    role: "45-Day Summer Training in DSA",
    org: "Splen Technologies & Education Pvt. Ltd.",
    note: "Certificate",
    status: "done",
    points: [
      "Intensive data-structures-and-algorithms summer camp.",
      "Certified completion, 2026.",
    ],
  },
  {
    period: "Aug 2024 — 2028",
    role: "B.Tech · Computer Science & Engineering",
    org: "Lovely Professional University",
    note: "Expected 2028",
    status: "ongoing",
    points: [
      "Working close to the machinery: search, backend systems, Linux, and problems that don't come with a neat tutorial.",
      "Current rabbit hole is information retrieval — a from-scratch Wikipedia search engine.",
    ],
  },
];

export const skillGroups: Array<readonly [string, readonly string[]]> = [
  ["languages", ["C++", "C", "Python", "JavaScript", "Java"]],
  [
    "backend / web",
    ["Node.js", "Express", "React", "EJS", "REST APIs", "JWT", "Socket.IO"],
  ],
  ["data / retrieval", ["MongoDB / Mongoose", "PostgreSQL", "MySQL", "TF-IDF", "PageRank", "Redis"]],
  [
    "tools / platforms",
    ["Git / GitHub", "Linux", "Vercel", "Render", "GitHub Pages"],
  ],
] as const;

export const tickerItems = [
  "PYTHON",
  "C / C++",
  "LINUX",
  "INFORMATION RETRIEVAL",
  "DSA",
  "NODE.JS",
  "REACT",
  "MONGODB",
  "POSTGRESQL",
  "GIT",
  "PAGE RANK",
  "TF-IDF",
] as const;

export const nav = [
  { label: "Index", href: "#top", number: "00" },
  { label: "Work", href: "#work", number: "01" },
  { label: "About", href: "#about", number: "02" },
  { label: "Contact", href: "#contact", number: "03" },
];
