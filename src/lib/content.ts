export type NavLink = { label: string; href: string; children?: { label: string; href: string; note: string }[] };

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Plans", href: "/plans" },
  {
    label: "Dentists",
    href: "/dentists",
    children: [
      { label: "Restorative", href: "/dentists#restorative", note: "Crowns, implants, bridges" },
      { label: "Cosmetic", href: "/dentists#cosmetic", note: "Veneers & smile design" },
      { label: "Orthodontics", href: "/dentists#orthodontics", note: "Clear aligners" },
    ],
  },
  { label: "Treatments", href: "/treatments" },
  { label: "About Us", href: "/about" },
];

export const CLINIC = {
  name: "Lumina Dental",
  phone: "+1 (415) 555-0142",
  phoneHref: "tel:+14155550142",
  email: "hello@luminadental.com",
  address: "220 Harbor Lane, Suite 4, San Francisco, CA",
  hours: "Mon–Sat · 8:00 – 19:00",
};

/** The four stages of the "live lab" sequence, in the order the reel shows them. */
export const LAB_STAGES = [
  {
    id: "scan",
    eyebrow: "Stage 01 · 3D Scan",
    title: ["What if your dental", "website was a", "LIVE LAB?"],
    body: "A sub-micron intraoral scan maps every surface of your tooth in under 90 seconds — no putty, no guesswork.",
    status: "Scanning",
  },
  {
    id: "design",
    eyebrow: "Stage 02 · Digital Design",
    title: ["Precision", "Design"],
    body: "Our CAD suite sculpts your restoration to the scan, matching bite, contour and shade before anything is milled.",
    status: "Modelling",
  },
  {
    id: "finish",
    eyebrow: "Stage 03 · Robotic Milling",
    title: ["Precision", "Finish"],
    body: "In-house robotic milling and hand polishing deliver a same-day crown accurate to 20 microns.",
    status: "Polishing",
  },
  {
    id: "smile",
    eyebrow: "Stage 04 · Fitted",
    title: ["Smile", "Complete"],
    body: "One visit. One seamless fit. A restoration engineered to feel like it was always yours.",
    status: "Scan complete",
  },
] as const;

export type LabStageId = (typeof LAB_STAGES)[number]["id"];

export const SCAN_CALLOUTS = [
  { label: "3D Scan", side: "left", top: "34%" },
  { label: "Enamel", side: "right", top: "40%" },
  { label: "Enamel", side: "left", top: "60%" },
  { label: "Alignment", side: "right", top: "68%" },
] as const;

export const HERO_SLIDES = [
  {
    kicker: "Same-day restorations",
    headline: ["Your smile.", "Engineered", "with precision"],
    highlight: "precision",
    body: "Digital scanning, robotic milling and expert hands — your new crown designed, made and fitted in a single visit.",
    visual: "smile",
  },
  {
    kicker: "Clear aligner therapy",
    headline: ["Straighter teeth.", "Mapped", "to the micron"],
    highlight: "micron",
    body: "We simulate every stage of your alignment before you begin, so you see the final result on day one.",
    visual: "tooth",
  },
  {
    kicker: "Cosmetic smile design",
    headline: ["Your new smile.", "Previewed", "before it's real"],
    highlight: "real",
    body: "Try your veneers digitally, adjust shape and shade with your dentist, then wear the exact design you approved.",
    visual: "aligner",
  },
] as const;

export const TREATMENTS = [
  {
    slug: "same-day-crowns",
    name: "Same-Day Crowns",
    summary: "Scanned, designed and milled in-house — fitted before you leave.",
    duration: "1 visit · ~2 hrs",
    from: 890,
    icon: "Crown",
  },
  {
    slug: "precision-smile-restoration",
    name: "Precision Smile Restoration",
    summary: "Full-arch rehabilitation planned digitally from bite to shade.",
    duration: "2–4 visits",
    from: 4200,
    icon: "Sparkles",
  },
  {
    slug: "next-smile-design",
    name: "Next Smile Design",
    summary: "Porcelain veneers you preview on screen before a single tooth is touched.",
    duration: "2 visits",
    from: 1150,
    icon: "Wand",
  },
  {
    slug: "clear-aligners",
    name: "Clear Aligners",
    summary: "Invisible trays with a simulated treatment path you can watch.",
    duration: "6–14 months",
    from: 3400,
    icon: "Scan",
  },
  {
    slug: "dental-implants",
    name: "Guided Implants",
    summary: "3D-printed surgical guides place each implant to the planned millimetre.",
    duration: "2–3 visits",
    from: 2600,
    icon: "Drill",
  },
  {
    slug: "laser-whitening",
    name: "Laser Whitening",
    summary: "Up to eight shades brighter in a single, sensitivity-controlled session.",
    duration: "1 visit · 60 min",
    from: 420,
    icon: "Sun",
  },
] as const;

export type Treatment = (typeof TREATMENTS)[number];

export const PLANS = [
  {
    name: "Essential",
    price: 29,
    tagline: "Preventive care, done properly.",
    features: ["Two checkups & cleans a year", "Digital X-rays and 3D scan", "10% off all treatments", "Emergency triage line"],
    featured: false,
  },
  {
    name: "Precision",
    price: 59,
    tagline: "Our most chosen plan.",
    features: [
      "Everything in Essential",
      "Annual whitening session",
      "20% off crowns & restorations",
      "Priority same-day appointments",
      "Smile design consultation",
    ],
    featured: true,
  },
  {
    name: "Lab Pro",
    price: 99,
    tagline: "For complete smile transformations.",
    features: [
      "Everything in Precision",
      "30% off implants & aligners",
      "Night guard included",
      "Dedicated care coordinator",
      "Family members at 50%",
    ],
    featured: false,
  },
] as const;

export const DENTISTS = [
  { name: "Dr. Amara Okafor", role: "Clinical Director · Restorative", group: "restorative", years: 16, initials: "AO" },
  { name: "Dr. Lucas Brennan", role: "Prosthodontist · Implants", group: "restorative", years: 12, initials: "LB" },
  { name: "Dr. Mei Tanaka", role: "Cosmetic Lead · Veneers", group: "cosmetic", years: 10, initials: "MT" },
  { name: "Dr. Rafael Ortiz", role: "Smile Design Specialist", group: "cosmetic", years: 8, initials: "RO" },
  { name: "Dr. Hannah Weiss", role: "Orthodontist · Aligners", group: "orthodontics", years: 14, initials: "HW" },
  { name: "Dr. Samir Haddad", role: "Paediatric Orthodontics", group: "orthodontics", years: 9, initials: "SH" },
] as const;

export const DENTIST_GROUPS = [
  { id: "restorative", title: "Restorative", body: "Crowns, bridges and implants designed digitally and milled on site." },
  { id: "cosmetic", title: "Cosmetic", body: "Veneers, bonding and whitening previewed before treatment begins." },
  { id: "orthodontics", title: "Orthodontics", body: "Clear aligners with a simulated path from first tray to final smile." },
] as const;

export const STATS = [
  { value: 20, suffix: "µm", label: "milling accuracy" },
  { value: 90, suffix: "s", label: "full-arch scan" },
  { value: 12000, suffix: "+", label: "smiles restored" },
  { value: 4.9, suffix: "★", label: "patient rating", decimals: 1 },
] as const;
