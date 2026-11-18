export type BaseElement = {
  id: string;
  name: string;
  locked: boolean;
  visible?: boolean;
  opacity?: number;
  rotation?: number;
};

export type TextElement = BaseElement & {
  type: "text";
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  fontWeight?: string;
  letterSpacing?: number;
  fontFamily?: string;
  textAnchor?: "start" | "middle" | "end";
};

export type ShapeElement = BaseElement & {
  type: "circle" | "rect";
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  rx?: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
};

export type DesignElement = TextElement | ShapeElement;

export const DEFAULT_ELEMENTS: DesignElement[] = [
  {
    id: "brand-logo",
    name: "NOVA Wordmark",
    type: "text",
    text: "NOVA",
    x: 60,
    y: 110,
    fontSize: 44,
    fill: "#1A1918",
    fontWeight: "700",
    letterSpacing: 2,
    locked: true,
    visible: true,
    opacity: 1,
    rotation: 0,
  },
  {
    id: "event-tag",
    name: "Event Category",
    type: "text",
    text: "THE CREATIVE SUMMIT • KOLKATA 2026",
    x: 60,
    y: 145,
    fontSize: 10,
    fill: "#66615B",
    fontWeight: "600",
    letterSpacing: 3,
    locked: true,
    visible: true,
    opacity: 1,
    rotation: 0,
  },
  {
    id: "geo-sun",
    name: "Geometric Sun (Orb)",
    type: "circle",
    x: 440,
    y: 300,
    radius: 95,
    fill: "#EA580C",
    opacity: 0.92,
    locked: false,
    visible: true,
    rotation: 0,
  },
  {
    id: "geo-accent",
    name: "Arch Pillar Form",
    type: "rect",
    x: 260,
    y: 220,
    width: 130,
    height: 210,
    rx: 65,
    fill: "#0D9488",
    opacity: 0.85,
    locked: false,
    visible: true,
    rotation: 0,
  },
  {
    id: "headline",
    name: "Main Headline",
    type: "text",
    text: "DESIGN FUTURES",
    x: 60,
    y: 520,
    fontSize: 34,
    fill: "#1A1918",
    fontWeight: "800",
    letterSpacing: -0.5,
    locked: false,
    visible: true,
    opacity: 1,
    rotation: 0,
  },
  {
    id: "subhead",
    name: "Sub-headline",
    type: "text",
    text: "REIMAGINING THE VISUAL SPECTRUM",
    x: 60,
    y: 565,
    fontSize: 14,
    fill: "#66615B",
    fontWeight: "500",
    letterSpacing: 1.5,
    locked: false,
    visible: true,
    opacity: 1,
    rotation: 0,
  },
  {
    id: "date-venue",
    name: "Date & Venue Stamp",
    type: "text",
    text: "SCIENCE CITY AUDITORIUM • 21 NOVEMBER 2026",
    x: 60,
    y: 740,
    fontSize: 11,
    fill: "#EA580C",
    fontWeight: "700",
    letterSpacing: 2,
    locked: true,
    visible: true,
    opacity: 1,
    rotation: 0,
  },
];

export const LOCAL_STORAGE_KEY = "brieflock_studio_poster_v2";
