/**
 * Hard-coded uses data for the /uses route (D-05, D-06).
 *
 * Four groups: AI & Development, Productivity, Communication, Hardware.
 * Hardware items use TODO placeholder strings — Monty to fill in before v3 launch.
 *
 * Pattern: mirrors src/lib/photos.ts (static typed array, no Notion dependency).
 * No helper function needed — page iterates USES_DATA directly.
 */

export type UsesItem = {
  term: string;
  detail: string;
};

export type UsesGroup = {
  heading: string;
  items: UsesItem[];
};

export const USES_DATA: UsesGroup[] = [
  {
    heading: "AI & Development",
    items: [
      { term: "LLM", detail: "Claude (Anthropic) for code, thinking, and research" },
      { term: "IDE", detail: "Cursor AI — VS Code with native AI editing" },
      { term: "Version Control", detail: "Git + GitHub for all projects" },
      { term: "Workflow", detail: "GSD (Get Shit Done) — AI-native project planning system" },
    ],
  },
  {
    heading: "Productivity",
    items: [
      { term: "Knowledge", detail: "Notion — notes, projects, writing, and content pipeline" },
      { term: "Calendar", detail: "Google Calendar + Fantastical for scheduling" },
      { term: "Tasks", detail: "Notion databases for task management" },
    ],
  },
  {
    heading: "Communication",
    items: [
      { term: "Email", detail: "Gmail — primary inbox" },
      { term: "Messaging", detail: "Slack for async team communication" },
      { term: "Video", detail: "Zoom and Google Meet for calls" },
    ],
  },
  {
    heading: "Hardware",
    items: [
      { term: "Laptop", detail: "TODO: [Monty to fill in]" },
      { term: "Phone", detail: "TODO: [Monty to fill in]" },
      { term: "Headphones", detail: "TODO: [Monty to fill in]" },
    ],
  },
];
