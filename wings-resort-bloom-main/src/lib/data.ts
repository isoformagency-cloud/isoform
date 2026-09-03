import heroImg from "@/assets/hero-resort.jpg";
import cottageWarm from "@/assets/gallery-dining.jpg";
import lounge from "@/assets/about-lobby.jpg";
import roomKing from "@/assets/room-deluxe.jpg";
import cottageNeon from "@/assets/gallery-pool.jpg";
import cottageAframe from "@/assets/room-cottage.jpg";
import roomLove from "@/assets/gallery-garden.jpg";
import roomBlue from "@/assets/gallery-spa.jpg";
import roomGreen from "@/assets/room-suite.jpg";
import roomSwan from "@/assets/room-villa.jpg";

export type Room = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  guests: number;
  image: string;
  features: string[];
  description?: string;
  size?: string;
  bedType?: string;
};

export const ROOMS: Room[] = [
  {
    id: "a-frame-cottage",
    name: "A-Frame Heritage Cottage",
    tagline: "Steep-roof wooden chalet tucked into the pines",
    price: 6800,
    guests: 2,
    image: cottageAframe,
    features: ["King bed", "Private porch", "Mountain view"],
    description: "Our signature A-frame structure crafted from locally seasoned timber. Features sweeping hillside windows and a private mist-facing balcony.",
    size: "420 sq.ft",
    bedType: "King Bed",
  },
  {
    id: "pinewood-deluxe",
    name: "Pinewood Deluxe Suite",
    tagline: "Warm cedar ceilings and a sculpted king platform",
    price: 9200,
    guests: 3,
    image: roomKing,
    features: ["Vaulted ceiling", "Lounge nook", "Rainfall shower"],
    description: "Spacious luxury suite with hand-carved pinewood panels, reading corner, and an en-suite rain shower overlooking eucalyptus treetops.",
    size: "550 sq.ft",
    bedType: "California King + Daybed",
  },
  {
    id: "emerald-suite",
    name: "Emerald Headboard Suite",
    tagline: "Botanical wallpaper, deep green velvet, terracotta throw",
    price: 8400,
    guests: 2,
    image: roomGreen,
    features: ["Queen bed", "Reading corner", "Valley view"],
    description: "Inspired by the lush Nilgiri biodiversity, with soothing forest green accents, bespoke furniture, and private sunset views across the valley.",
    size: "480 sq.ft",
    bedType: "Queen Bed",
  },
  {
    id: "garden-view",
    name: "Garden View Room",
    tagline: "Bright bay-window room overlooking the tea gardens",
    price: 5400,
    guests: 2,
    image: roomLove,
    features: ["Bay window", "Tea garden view", "Free breakfast"],
    description: "Wake up to rolling tea plantations through expansive bay windows. Ideal for quiet morning contemplations with Nilgiri estate brew.",
    size: "380 sq.ft",
    bedType: "Queen Bed",
  },
  {
    id: "mist-room",
    name: "Mist Room",
    tagline: "Soft blues, terracotta accents, quiet mornings",
    price: 4900,
    guests: 2,
    image: roomBlue,
    features: ["Queen bed", "Work desk", "Complimentary tea"],
    description: "Cozy retreat with serene pastel hues, plush bedding, and dedicated writing desk for artists, thinkers, and unwinding souls.",
    size: "350 sq.ft",
    bedType: "Queen Bed",
  },
  {
    id: "honeymoon-cabin",
    name: "Honeymoon Cabin",
    tagline: "Curated turn-down with swan towel art and river blanket",
    price: 7600,
    guests: 2,
    image: roomSwan,
    features: ["Turn-down service", "Champagne on arrival", "Late checkout"],
    description: "Private secluded cottage with romantic fireplace ambience, complimentary hill wine, artisanal chocolates, and personalized candlelight service.",
    size: "460 sq.ft",
    bedType: "Plush King Bed",
  },
];

export type GalleryItem = {
  src: string;
  alt: string;
  category: "all" | "cottages" | "interiors" | "landscape";
  title: string;
  span?: string;
};

export const GALLERY_IMAGES: GalleryItem[] = [
  {
    src: heroImg,
    alt: "Wings Resort exterior and Nilgiri hill vistas",
    category: "landscape",
    title: "Resort Heritage Estate",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: cottageAframe,
    alt: "A-frame cottage facade in the mist",
    category: "cottages",
    title: "A-Frame Wooden Chalet",
  },
  {
    src: roomKing,
    alt: "Pinewood king deluxe bedroom",
    category: "interiors",
    title: "Pinewood Deluxe Bedroom",
  },
  {
    src: lounge,
    alt: "Heritage lounge with triangular gable window",
    category: "interiors",
    title: "The Heritage Stone Lounge",
  },
  {
    src: cottageWarm,
    alt: "Cozy wooden cottage illuminated at dusk",
    category: "cottages",
    title: "Cottage at Twilight",
  },
  {
    src: roomGreen,
    alt: "Emerald botanical suite with artisan headboard",
    category: "interiors",
    title: "Emerald Forest Suite",
  },
  {
    src: roomSwan,
    alt: "Honeymoon cabin curated turn-down setup",
    category: "interiors",
    title: "Romantic Turn-down Setup",
  },
  {
    src: cottageNeon,
    alt: "Cottage exterior at night with festive lights",
    category: "cottages",
    title: "Evening Bonfire & Cabins",
  },
  {
    src: roomBlue,
    alt: "Mist room with peaceful decor",
    category: "interiors",
    title: "Mist Room Sanctuary",
  },
  {
    src: roomLove,
    alt: "Tea garden panorama from bedroom bay window",
    category: "landscape",
    title: "Tea Garden Bay Window",
  },
];
