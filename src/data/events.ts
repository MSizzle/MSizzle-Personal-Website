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
  //   title: "NYC Tech Week",
  //   date: "2026-06-10",
  //   location: "New York, NY",
  //   url: "https://example.com",
  // },
];
