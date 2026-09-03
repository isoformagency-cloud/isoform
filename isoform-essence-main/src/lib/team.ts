export interface TeamMember {
  id: string;
  name: string;
  role: string;
  currentActivity: string; // What they are doing right now
  image?: string;
  instagram?: string;
  whatsapp?: string;
  linkedin?: string;
  location?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "person-1",
    name: "Person One",
    role: "Design Lead & Partner",
    currentActivity: "Leading interface systems, art direction, and brand identity explorations for upcoming studio releases.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/",
    linkedin: "https://linkedin.com/",
    location: "Berlin, DE",
  },
  {
    id: "person-2",
    name: "Person Two",
    role: "Creative Director",
    currentActivity: "Directing typographic hierarchy, creative positioning, and narrative strategy for international partners.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/",
    linkedin: "https://linkedin.com/",
    location: "London, UK",
  },
  {
    id: "person-3",
    name: "Person Three",
    role: "Technical Director",
    currentActivity: "Developing real-time WebGL shader visuals, high-performance animations, and headless CMS architectures.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/",
    linkedin: "https://linkedin.com/",
    location: "Stockholm, SE",
  },
];
