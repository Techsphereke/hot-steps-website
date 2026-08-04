
export const site = {
  name: "Hotstep Holdings Ltd",
  tagline: "Your genuine property solution",
  email: "hotstepholdings@gmail.com",
  phones: ["+254 742 777 444", "+254 720 484 848"],
  logo: "/brand/hotstep-logo.png",
  office:
    "Shell petrol station RM B10 along Thogoto Mutarakwa road, 800 metres from the southern bypass at Thogoto junction, Gikambura.",
  vision:
    "To make land ownership accessible, affordable, and rewarding for all while transforming lives and communities through strategic real estate investments across the country.",
  mission:
    "To be the go-to partner for individuals seeking affordable, accessible land through honest, transparent transactions and expert guidance.",
};

export const nav = [
  { label: "Home", to: "/" },
  { label: "About us", to: "/about-us" },
  { label: "Diaspora", to: "/diaspora" },
  { label: "Properties", to: "/properties" },
  { label: "Information Center", to: "/blogs" },
  { label: "Awards & Titles", to: "/awards-titles" },
  { label: "Contact Us", to: "/contact-us" },
];

export type Property = {
  slug: string;
  title: string;
  location: string;
  price?: string;
  image: string;
  status: "On Sale" | "Sold Out";
  description: string;
  features: string[];
};

export const properties: Property[] = [
  {
    slug: "summit-gardens-phase-2",
    title: "SUMMIT GARDENS PHASE 2",
    location: "Kamangu, Kikuyu",
    price: "Kshs. 1,400,000",
    image: "/media/summit-2.jpg",
    status: "On Sale",
    description:
      "Prime residential plots in Kamangu, Kikuyu — an area growing fast thanks to tarmac access, water, and electricity. Ready title deeds and flexible payment plans available.",
    features: [
      "50x100 residential plots",
      "Ready title deeds",
      "Graded access roads",
      "Water and electricity on site",
      "Flexible payment plans up to 12 months",
    ],
  },
  {
    slug: "thogoto-gardens",
    title: "THOGOTO GARDENS",
    location: "Thogoto, Kikuyu",
    price: "Kshs. 4,800,000",
    image: "/media/Thogoto-Gardens.jpg",
    status: "On Sale",
    description:
      "Prime plots for sale in Thogoto, Kikuyu — minutes from the southern bypass, schools, hospitals and shopping centres. Ideal for immediate development.",
    features: [
      "Controlled residential development",
      "Ready title deeds",
      "Close to the southern bypass",
      "Piped water and power",
      "Perimeter access roads",
    ],
  },
  {
    slug: "sunrise-gardens-phase-2",
    title: "SUNRISE GARDENS PHASE 2",
    location: "Kamangu, Kikuyu",
    price: "Kshs. 1,100,000",
    image:
      "/media/PROPERTY-FEATURE-SUNRISE.jpg",
    status: "On Sale",
    description:
      "Affordable serviced plots in Kamangu with a quick appreciation record. A favourite for first-time buyers and diaspora investors.",
    features: [
      "50x100 plots",
      "Ready title deeds",
      "Water and electricity",
      "Gated neighbourhood",
      "Deposit and instalment options",
    ],
  },
  {
    slug: "ushindi-gardens",
    title: "USHINDI GARDENS",
    location: "Thigio, Kikuyu",
    price: "Kshs. 1,200,000",
    image: "/media/USHINDI.jpg",
    status: "On Sale",
    description:
      "Value plots in Thigio, a fast growing satellite of Kikuyu with fertile land, good roads and a strong rental market.",
    features: [
      "50x100 plots",
      "Ready title deeds",
      "Fertile red soil",
      "Access roads opened",
      "Flexible payment plans",
    ],
  },
  {
    slug: "eden-ridge",
    title: "EDEN RIDGE",
    location: "Kamangu, Kikuyu",
    price: "Kshs. 990,000",
    image: "/media/EDEN-RIDGE.jpg",
    status: "On Sale",
    description:
      "Our most affordable Kikuyu offering — plots from as low as 990K with ready title deeds and a friendly instalment plan.",
    features: [
      "From Kshs. 990,000",
      "Ready title deeds",
      "Water and electricity nearby",
      "Graded roads",
      "Up to 12-month payment plan",
    ],
  },
  {
    slug: "goshen-gardens",
    title: "GOSHEN GARDENS",
    location: "Gilgil, Nakuru",
    price: "Kshs. 550,000",
    image: "/media/GOSHEN-GARDENS.jpg",
    status: "On Sale",
    description:
      "Entry-level investment plots in Gilgil, Nakuru — a 550K cash offer along a growing corridor with strong long-term upside.",
    features: [
      "550K cash offer",
      "Ready title deeds",
      "Ideal for holiday homes or investment",
      "Accessible from the Nakuru highway",
      "Flexible payment plans",
    ],
  },
];

export const locations = [
  { label: "Plots for sale in Thigio", slug: "thigio" },
  { label: "Plots for sale in Kikuyu", slug: "kikuyu" },
  { label: "Plots for sale in Kamangu", slug: "kamangu" },
  { label: "Plots for sale in Gikambura", slug: "gikambura" },
];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "why-kamangu-is-becoming-the-new-karen",
    title: "WHY KAMANGU IS BECOMING THE NEW KAREN",
    excerpt:
      "When people think of Karen, images of elegant homes and green surroundings come to mind. Kamangu now offers that lifestyle at a fraction of the price.",
    image:
      "/media/kamangu-the-new-karen.jpg",
    body: [
      "When people think of Karen, images of elegant homes, green surroundings and quiet streets come to mind. Kamangu in Kikuyu is quickly earning the same reputation — leafy, spacious and calm, but still within easy reach of Nairobi.",
      "Tarmac roads, piped water, electricity and the southern bypass have opened the area up. Families who want space to build without giving up a city commute are moving in, and land values have followed.",
      "For buyers, the timing matters. Plots in Kamangu still trade well below comparable Nairobi suburbs, which is exactly why our Summit, Sunrise and Eden Ridge projects sell out phase after phase.",
    ],
  },
  {
    slug: "residential-plots-for-sale-in-kikuyu",
    title: "RESIDENTIAL PLOTS FOR SALE IN KIKUYU",
    excerpt:
      "Looking for residential plots for sale in Kikuyu? Whether you plan to build a home or invest in land, here is what to look for.",
    image: "/media/PLOTS.jpg",
    body: [
      "Looking for residential plots for sale in Kikuyu? Whether you are planning to build a home or invest in land, Kikuyu remains one of the strongest value locations around Nairobi.",
      "Check three things before you buy: a clean, ready title deed, genuine access roads, and utilities within reach. Every Hotstep project is vetted on all three before a single plot is offered.",
      "Talk to our team for a free site visit and we will walk you through the search, the transfer and the payment plan that fits you.",
    ],
  },
  {
    slug: "trusted-when-it-counts-hotstep-homeowners",
    title: "TRUSTED WHEN IT COUNTS: HOTSTEP HOMEOWNERS",
    excerpt:
      "Affordable plots for sale in Kikuyu — Eden Ridge from as low as 990K. In uncertain times, homeowners keep trusting HotStep.",
    image: "/media/trusted.jpg",
    body: [
      "Affordable plots for sale in Kikuyu — Eden Ridge starts from as low as 990K. In uncertain economic times, homeowners trust HotStep because the promise on the flyer is the promise at the site visit.",
      "Ready title deeds, transparent pricing and no hidden charges. That is why so much of our business comes from referrals by existing plot owners.",
    ],
  },
  {
    slug: "reason-to-invest-with-us",
    title: "REASONS TO INVEST WITH US",
    excerpt:
      "Finding a trustworthy partner for land investment matters more than ever. Here is what sets Hotstep Holdings apart.",
    image:
      "/media/REASONS-TO-INVEST-IN-KIKUYU.jpg",
    body: [
      "In today's fast-paced real estate market, finding a trustworthy partner for land investment is more important than ever.",
      "We only list land we have verified, we hand over ready title deeds, and we offer flexible payment plans so you can own without straining. Our team stays with you from the first site visit to the transfer.",
    ],
  },
  {
    slug: "why-investing-in-land-is-the-smartest-move-in-2025",
    title: "Why Investing in Land is the Smartest Move in 2025",
    excerpt:
      "Tired of market instability and risky ventures? Land remains one of the few assets that appreciates while you sleep.",
    image:
      "/media/WHAT-KENYANS-IN-DIASPORA-SHOULD-CONSIDER-BEFORE-BUYING-LAND.jpg",
    body: [
      "Tired of market instability and risky ventures? Land remains one of the few assets that appreciates while you sleep.",
      "Unlike shares or short-term ventures, land is finite, tangible and immune to most market noise. Around growth corridors such as Kikuyu, Kamangu and Thigio, value is driven by infrastructure and demand — both of which keep rising.",
      "Start with a plot you can comfortably pay for, secure the title, and let time do the rest.",
    ],
  },
  {
    slug: "understanding-zoning-laws-in-kenya-a-guide-for-land-buyers",
    title: "Understanding Zoning Laws in Kenya: A Guide for Land Buyers",
    excerpt:
      "Thinking of buying land in Kenya? Zoning is one of the most critical factors to check before you pay a deposit.",
    image:
      "/media/A-GUIDE-ON-ZONING-LAWS-IN-KENYA.jpg",
    body: [
      "Are you thinking of buying land in Kenya? One of the most critical factors to consider before making a purchase is zoning — the rules that determine what you may legally build on a parcel.",
      "County governments classify land as residential, commercial, agricultural, industrial or mixed use, and each class carries its own plot ratios and approval requirements.",
      "Always confirm the zoning classification with the county before you commit, and ask the seller for the approved subdivision scheme. Our team provides this documentation for every project we sell.",
    ],
  },
];

export const awards = [
  {
    title: "Hotstep CEO Award",
    image: "/media/Hotstep-CEO-Award-768x1024.jpg",
  },
  {
    title: "HotStep CEO Of the Year",
    image:
      "/media/HotStep-CEO-Of-the-Year-768x1024.jpg",
  },
  {
    title: "HotStep Starbrands",
    image:
      "/media/HotStep-Starbrands-scaled.jpg",
  },
];

export const team = [
  {
    name: "Stephen Kigathi",
    role: "Director, C.E.O & Founder",
    image:
      "/media/HOTSTEP-CEO-min-768x1063.jpg",
  },
  {
    name: "Patrick Kiongo",
    role: "Chairman",
    image: "/media/IMAGE-04-1024x1001.jpg",
  },
  {
    name: "Anthony Muhindi",
    role: "Manager",
    image: "/media/IMAGE-01-1024x1001.jpg",
  },
  {
    name: "Eliud Kahihu",
    role: "Manager",
    image: "/media/Kahihu-2-1024x1001.jpg",
  },
];

export const heroSlides = [
  {
    image: "/brand/goshen-slider.jpg",
    title: "GOSHEN GARDENS",
    subtitle: "Gilgil, Nakuru — 550K cash offer",
    to: "/properties/goshen-gardens",
    banner: true,
  },
  {
    image: "/brand/eden-ridge-slider.jpg",
    title: "EDEN RIDGE GARDENS",
    subtitle: "Kamangu, Kikuyu — 990K cash offer",
    to: "/properties/eden-ridge-gardens",
    banner: true,
  },
];


export const testimonials = [
  {
    name: "Grace W.",
    text: "I bought my first plot at Eden Ridge and got my title deed exactly as promised. The team followed up until everything was done.",
  },
  {
    name: "Joseph M.",
    text: "The site visit was well organised and nothing was hidden. Two years later my plot in Kamangu has almost doubled in value.",
  },
  {
    name: "Diaspora client, Dallas",
    text: "Buying from abroad felt risky until Hotstep walked me through every step with photos, documents and video calls.",
  },
];

/** Stable non-optional references for head() metadata. */
export const heroImage = "/media/summit-2.jpg";

export const ceoImage = team[0]!.image;
export const ceoName = team[0]!.name;

/** Approximate coordinates used by the interactive locations map. */
export const propertyCoords: Record<string, { lat: number; lng: number }> = {
  "summit-gardens-phase-2": { lat: -1.2536, lng: 36.6142 },
  "thogoto-gardens": { lat: -1.2471, lng: 36.6724 },
  "sunrise-gardens-phase-2": { lat: -1.2612, lng: 36.6068 },
  "ushindi-gardens": { lat: -1.2204, lng: 36.5751 },
  "eden-ridge": { lat: -1.2482, lng: 36.6031 },
  "goshen-gardens": { lat: -0.4931, lng: 36.3162 },
};
