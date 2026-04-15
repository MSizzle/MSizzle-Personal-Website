export interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  url?: string;
}

export const EVENTS: Event[] = [
  // Add your events here. Example:
  // {
  //   id: "1",
  //   title: "AI Builders Summit",
  //   date: "2026-06-10",
  //   location: "San Francisco, CA",
  //   url: "https://example.com",
  // },
];
