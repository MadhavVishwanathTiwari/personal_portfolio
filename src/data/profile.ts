export const profile = {
  name: "Madhavendra Vishwanath Tiwari",
  shortName: "Madhavendra",
  initials: "MT",
  role: "Independent software engineer",
  location: "India, working remote",
  email: "madhav@autoreceptionist.io",
  phone: "+91 93100 92139",
  phoneHref: "tel:+919310092139",
  bookingUrl:
    "https://cal.com/madhavendra-vishwanath-tiwari-ypokxy/demo-meeting",
  availability: "Available for new projects",
  responseWindow: "Replies within a day, most days within a few hours.",
  /** One line under the name. This is the sentence that has to land. */
  headline:
    "I build production software end to end: the schema, the backend, the AI plumbing and the interface.",
  bio: [
    "I work alone on things that usually need a team. A booking system that has to get timezones right, a CMS a non-technical client can actually run, a voice agent that has to not make things up, a Postgres schema that refuses bad data before the UI ever sees it. Seven of them are in production right now.",
    "I also run AutoReceptionist, an AI phone receptionist for home-service businesses in the US. I built the product, the internal CRM that sells it and the pipeline that generates a working demo for every prospect. That is the fastest way to say what I am: someone who ships the whole thing and then has to live with it.",
  ],
} as const;
