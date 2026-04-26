import bse from "@/assets/news-bse.jpg";
import startup from "@/assets/news-startup.jpg";
import rbi from "@/assets/news-rbi.jpg";
import tech from "@/assets/news-tech.jpg";
import economy from "@/assets/news-economy.jpg";
import finance from "@/assets/news-finance.jpg";
import parliament from "@/assets/hero-parliament.jpg";
import p1 from "@/assets/person-1.jpg";
import p2 from "@/assets/person-2.jpg";
import p3 from "@/assets/person-3.jpg";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  readMin: number;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "sensex-scales-fresh-high-as-it-stocks-rally",
    title: "Sensex scales fresh high as IT stocks lead a broad-based rally",
    excerpt:
      "Benchmark indices closed at record highs led by Infosys, TCS and HCL Tech as foreign investors turned net buyers for the third straight session.",
    category: "Business",
    image: bse,
    author: "Aarav Mehta",
    date: "Apr 19, 2026",
    readMin: 4,
    body: [
      "Indian equities scaled a fresh peak on Friday, with the BSE Sensex closing above 86,400 for the first time, powered by a sharp rally in technology and banking stocks. The 30-share index gained 612 points or 0.71 per cent, while the broader Nifty 50 settled 184 points higher at 26,318.",
      "Foreign portfolio investors were net buyers worth ₹3,420 crore in cash markets, marking their third straight session of inflows. Analysts attributed the rally to easing US inflation data and renewed optimism around domestic earnings.",
      "“The macro setup remains constructive. With the RBI signalling comfort on inflation and corporate India guiding for double-digit earnings growth, the path of least resistance is up,” said a Mumbai-based fund manager.",
    ],
  },
  {
    slug: "rbi-holds-repo-rate-flags-food-inflation-risk",
    title: "RBI holds repo rate at 6.25%, flags upside risk to food inflation",
    excerpt:
      "The Monetary Policy Committee voted 5-1 to keep the benchmark rate unchanged, while revising FY27 GDP growth projection upward to 7.1 per cent.",
    category: "Economy",
    image: rbi,
    author: "Priya Iyer",
    date: "Apr 18, 2026",
    readMin: 5,
    body: [
      "The Reserve Bank of India on Thursday held the policy repo rate steady at 6.25 per cent for the second consecutive meeting, citing persistent upside risks to food inflation even as core price pressures continued to moderate.",
      "Governor Sanjay Malhotra said the MPC would remain ‘actively disinflationary’ and stay focused on aligning headline CPI with the 4 per cent target on a durable basis. The central bank revised its FY27 real GDP forecast upward to 7.1 per cent from 6.9 per cent earlier.",
      "Bond yields softened modestly after the announcement, with the 10-year benchmark closing at 6.78 per cent.",
    ],
  },
  {
    slug: "indian-startups-raise-2-1-billion-in-march",
    title: "Indian startups raise $2.1 billion in March, highest in 18 months",
    excerpt:
      "Late-stage funding rebounded sharply with three new unicorns minted across fintech, climate-tech and B2B SaaS sectors.",
    category: "Startups",
    image: startup,
    author: "Karan Shah",
    date: "Apr 17, 2026",
    readMin: 3,
    body: [
      "Indian startups collectively raised $2.1 billion across 142 deals in March 2026, the highest monthly tally in 18 months, according to data compiled by Bharat Standard Research.",
      "Late-stage rounds drove the surge, with three companies — a Bengaluru-based fintech, a Pune climate-tech firm and a Gurugram B2B SaaS platform — entering the unicorn club.",
      "Investors said improved public market sentiment and a healthier IPO pipeline were emboldening growth-stage funds to deploy capital after a prolonged winter.",
    ],
  },
  {
    slug: "india-semiconductor-mission-clears-three-fabs",
    title: "India Semiconductor Mission clears three new fabs worth ₹91,000 crore",
    excerpt:
      "Cabinet approval paves the way for fabrication units in Gujarat, Odisha and Uttar Pradesh, expected to create 27,000 direct jobs.",
    category: "Technology",
    image: tech,
    author: "Neha Krishnan",
    date: "Apr 16, 2026",
    readMin: 4,
    body: [
      "The Union Cabinet on Wednesday cleared three new semiconductor fabrication proposals worth a combined ₹91,000 crore, taking India’s cumulative chip-making investment commitments past ₹2.4 lakh crore.",
      "The new units, to be set up in Dholera (Gujarat), Jajpur (Odisha) and Jewar (Uttar Pradesh), are expected to commence commercial production between 2028 and 2030.",
      "Officials said the projects would create over 27,000 direct jobs and anchor a much larger ecosystem of design, packaging and testing companies.",
    ],
  },
  {
    slug: "rupee-ends-flat-against-dollar-amid-rbi-intervention",
    title: "Rupee ends flat against dollar amid suspected RBI intervention",
    excerpt:
      "The local currency closed at 83.42 per dollar after the central bank was seen selling greenbacks through state-run banks.",
    category: "Finance",
    image: finance,
    author: "Rohit Sengupta",
    date: "Apr 15, 2026",
    readMin: 3,
    body: [
      "The Indian rupee ended virtually unchanged against the US dollar on Tuesday at 83.42, after the Reserve Bank of India was seen intervening through state-run banks to cap volatility.",
      "Traders said dollar demand from oil importers was offset by inflows linked to the upcoming inclusion of Indian government bonds in a global bond index.",
    ],
  },
  {
    slug: "india-merchandise-exports-rise-9-percent-in-march",
    title: "India’s merchandise exports rise 9% in March on engineering goods boost",
    excerpt:
      "Outbound shipments touched $42.6 billion, narrowing the trade deficit to a six-month low even as oil imports stayed elevated.",
    category: "Economy",
    image: economy,
    author: "Meera Banerjee",
    date: "Apr 14, 2026",
    readMin: 4,
    body: [
      "India’s merchandise exports rose 9 per cent year-on-year in March 2026 to $42.6 billion, led by a 14 per cent jump in engineering goods and a sharp recovery in electronics shipments.",
      "The trade deficit narrowed to $17.8 billion — a six-month low — as services exports continued their secular climb and gold imports moderated.",
    ],
  },
];

export const breakingNews: string[] = [
  "Sensex closes at record 86,432; Nifty tops 26,300",
  "RBI keeps repo rate unchanged at 6.25% in April policy",
  "India’s March WPI inflation eases to 1.8%",
  "Rupee ends at 83.42 against US dollar",
  "Cabinet approves three new semiconductor fabs worth ₹91,000 crore",
  "Brent crude slips below $84 a barrel on demand concerns",
];

export type Listicle = {
  slug: string;
  title: string;
  category: string;
  cover: string;
  intro: string;
  items: { name: string; role: string; image: string; description: string }[];
};

export const listicles: Listicle[] = [
  {
    slug: "top-10-entrepreneurs-india-2026",
    title: "Top 10 Entrepreneurs Shaping India in 2026",
    category: "Listicles",
    cover: p1,
    intro:
      "From climate-tech pioneers to fintech disruptors, these founders are redefining how India builds, invests and consumes.",
    items: [
      { name: "Ananya Rao", role: "Founder & CEO, Solstice Energy", image: p1, description: "Building India’s largest distributed solar storage network across Tier-2 and Tier-3 cities." },
      { name: "Vikram Joshi", role: "Co-founder, LedgerX Capital", image: p2, description: "Pioneering programmable credit infrastructure for India’s 60 million MSMEs." },
      { name: "Suresh Pillai", role: "Chairman, Pillai Group", image: p3, description: "Steering a fourth-generation industrial conglomerate into precision manufacturing and defence tech." },
      { name: "Ritika Bansal", role: "CEO, AarogyaAI", image: p1, description: "Deploying AI radiology across 1,200 district hospitals in partnership with state governments." },
      { name: "Devansh Patel", role: "Founder, Karya Logistics", image: p2, description: "Reimagining last-mile freight with electric small commercial vehicles." },
    ],
  },
  {
    slug: "top-5-startups-to-watch-2026",
    title: "Top 5 Indian Startups to Watch in 2026",
    category: "Listicles",
    cover: startup,
    intro:
      "Five high-growth ventures with the capital, talent and momentum to define the next chapter of Indian innovation.",
    items: [
      { name: "FinNudge", role: "Consumer fintech · Bengaluru", image: p2, description: "Behavioural savings app that has crossed 8 million users in 14 months." },
      { name: "GreenLoop", role: "Climate-tech · Pune", image: p1, description: "Industrial waste-to-hydrogen platform working with three Maharatna PSUs." },
      { name: "Kavach Defence", role: "Deep-tech · Hyderabad", image: p3, description: "Indigenous loitering munitions and counter-drone systems for Indian armed forces." },
    ],
  },
  {
    slug: "top-3-brands-india-2026",
    title: "Top 3 Most Trusted Indian Brands of 2026",
    category: "Listicles",
    cover: bse,
    intro: "An annual ranking of India’s most trusted consumer brands based on the Bharat Standard Trust Index.",
    items: [
      { name: "Tata Group", role: "Conglomerate", image: p3, description: "Retains the top slot for the seventh consecutive year on the back of its EV and semiconductor bets." },
      { name: "Asian Paints", role: "Consumer goods", image: p1, description: "Continues to score highest on quality perception across urban and rural cohorts." },
      { name: "HDFC Bank", role: "Financial services", image: p2, description: "India’s largest private lender remains the most trusted financial brand by a wide margin." },
    ],
  },
];

export const heroImage = parliament;

export const categories = ["Business", "Startups", "Finance", "Technology", "Economy"] as const;
