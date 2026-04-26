import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  'Business',
  'Startups',
  'Finance',
  'Technology',
  'Economy'
];

const dummyArticles = {
  'Business': [
    {
      title: 'Reliance Industries Reports Record Quarterly Profit',
      excerpt: 'RIL shares surge as energy and retail divisions show robust growth in the latest fiscal quarter.',
      content: 'Reliance Industries Limited (RIL) has announced a significant increase in its quarterly profits, driven by strong performances in its retail and digital services segments. The energy giant reported a net profit of ₹17,265 crore for the quarter ending March 2026. Market analysts attribute this success to the strategic diversification and aggressive expansion in the green energy sector. Investors have responded positively, with the stock price hitting a new all-time high on the Bombay Stock Exchange.',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Global Supply Chain Disruptions Impact Indian Manufacturers',
      excerpt: 'Increased logistics costs and delayed shipments pose challenges for the local automotive and electronics sectors.',
      content: 'Indian manufacturing hubs are feeling the heat of global supply chain bottlenecks. Recent geopolitical shifts and congestion at major international ports have led to a 20% increase in lead times for critical components. The automotive industry, in particular, is facing delays in the delivery of advanced semiconductors, leading to longer waiting periods for popular car models. Experts suggest that localizing the supply chain could be the long-term solution to avoid such systemic risks.',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop'
    }
  ],
  'Startups': [
    {
      title: 'New Fintech Startup Aims to Revolutionize Rural Banking',
      excerpt: 'BharatPe and PhonePe face new competition as "GraminPay" launches localized micro-payment solutions.',
      content: 'GraminPay, a Bangalore-based fintech startup, has secured $50 million in Series A funding to expand its reach into tier-3 and tier-4 cities. Unlike traditional apps, GraminPay works offline using SMS-based verification and offers voice-assisted transactions in 12 regional languages. The startup claims to have onboarded over 5,000 local merchants in just two months. Investors believe that the next wave of digital transformation in India will come from serving the unbanked rural population.',
      imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Indian EdTech Sector Sees Consolidation Wave',
      excerpt: 'Major players acquire smaller startups to strengthen their K-12 and competitive exam portfolios.',
      content: 'The EdTech landscape in India is undergoing a significant transition. After the post-pandemic cooldown, larger companies are acquiring niche startups to fill gaps in their offerings. This consolidation is seen as a sign of maturity in the market, with a focus on sustainable growth and profitability over aggressive user acquisition. Analysts predict that only a few "super-apps" will dominate the online learning space by 2027.',
      imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2070&auto=format&fit=crop'
    }
  ],
  'Finance': [
    {
      title: 'RBI Keeps Interest Rates Unchanged Amid Inflation Concerns',
      excerpt: 'The central bank focuses on price stability while supporting economic growth in its latest policy meet.',
      content: 'The Reserve Bank of India (RBI) decided to maintain the status quo on the repo rate at 6.5% during its Monetary Policy Committee meeting. Governor Shaktikanta Das highlighted that while the economy is showing strong resilience, inflation remains a key monitorable factor. The decision aligns with market expectations as the central bank balances the need for liquidity with the goal of bringing down the consumer price index to the 4% target.',
      imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Mutual Fund Inflows Hit 5-Year High in March',
      excerpt: 'Retail investors continue to show faith in domestic equity markets despite global volatility.',
      content: 'Domestic institutional investors are providing a strong cushion to the Indian stock market. According to AMFI data, net inflows into equity mutual funds reached ₹25,000 crore in March 2026. SIP (Systematic Investment Plan) contributions have also seen a steady rise, reflecting a growing culture of long-term financial planning among Indian households. Financial advisors suggest that the "India story" remains intact for global and local investors alike.',
      imageUrl: 'https://images.unsplash.com/photo-1611974714851-48206138473c?q=80&w=2070&auto=format&fit=crop'
    }
  ],
  'Technology': [
    {
      title: 'India Becomes Global Hub for AI Research and Development',
      excerpt: 'Microsoft and Google expand their research centers in Hyderabad and Bangalore to focus on Generative AI.',
      content: 'India is no longer just a service provider for the tech world; it has become a core innovation hub. Major tech giants are doubling down on their R&D investments in the country, citing the vast pool of engineering talent and the growing ecosystem of AI startups. Projects ranging from large language models for Indian languages to AI-driven healthcare solutions are being developed entirely out of Indian labs.',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Local Chip Design Companies Gain Traction in Global Markets',
      excerpt: 'Fabless semiconductor startups in India secure contracts with international smartphone manufacturers.',
      content: 'Under the "India Semiconductor Mission," local fabless companies are making significant strides. A Chennai-based startup recently announced a partnership with a major global brand to supply specialized chips for budget smartphones. This move is seen as a major win for the "Design in India" initiative, reducing the country\'s reliance on imported intellectual property for hardware.',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop'
    }
  ],
  'Economy': [
    {
      title: 'India GDP Growth Projected at 7.5% for FY27',
      excerpt: 'World Bank and IMF upgrade India’s growth forecast citing strong domestic demand and policy reforms.',
      content: 'India continues to be the fastest-growing major economy in the world. The International Monetary Fund (IMF) has revised its growth projection for the country, pointing to the successful implementation of structural reforms and the massive infrastructure push by the government. The private sector is also showing signs of increased capital expenditure, which is expected to create millions of jobs in the coming years.',
      imageUrl: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Export Growth Hits Record Levels in Services and Manufacturing',
      excerpt: 'Software exports and mobile phone manufacturing drive the surge in India’s trade balance.',
      content: 'India’s trade figures for the last fiscal year show a healthy narrowing of the trade deficit. While software services remain the bedrock of exports, the manufacturing sector—specifically electronics and pharmaceuticals—has shown triple-digit growth in certain categories. The government’s PLI (Production Linked Incentive) schemes are credited with making Indian exports more competitive on the global stage.',
      imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop'
    }
  ]
};

async function main() {
  console.log('Starting seeding...');

  // 1. Get or Create an Admin User
  let admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!admin) {
    console.log('No admin found, creating a default admin...');
    admin = await prisma.user.create({
      data: {
        email: 'admin@bharatstandard.com',
        name: 'Super Admin',
        password: 'adminpassword123', // In a real app, this should be hashed!
        role: 'ADMIN'
      }
    });
  }

  const userId = admin.id;

  // 2. Create Categories and Articles
  for (const catName of categories) {
    console.log(`Processing category: ${catName}`);
    
    const category = await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: {
        name: catName,
        description: `Authoritative news and analysis on the ${catName} sector in India.`,
        userId: userId
      }
    });

    const articlesToCreate = dummyArticles[catName as keyof typeof dummyArticles] || [];

    for (const artData of articlesToCreate) {
      // Check if article with this title already exists in this category to avoid duplicates
      const existing = await prisma.article.findFirst({
        where: { title: artData.title, categoryId: category.id }
      });

      if (!existing) {
        await prisma.article.create({
          data: {
            ...artData,
            categoryId: category.id,
            userId: userId,
            author: 'Staff Writer',
            published: true
          }
        });
        console.log(`  - Created article: ${artData.title}`);
      } else {
        console.log(`  - Article already exists: ${artData.title}`);
      }
    }
    
    // Add 3 more simple articles per category to reach the 5-7 target
    for (let i = 3; i <= 6; i++) {
        const title = `${catName} Insights: Weekly Briefing Vol. ${i}`;
        const existing = await prisma.article.findFirst({
            where: { title, categoryId: category.id }
        });
        
        if (!existing) {
            await prisma.article.create({
                data: {
                    title,
                    excerpt: `A summary of the most important developments in ${catName} this week.`,
                    content: `In this week's briefing, we cover the top trends shaping the ${catName} landscape. From regulatory changes to market shifts, stay ahead of the curve with our curated analysis. Full report coming soon.`,
                    imageUrl: `https://images.unsplash.com/photo-1611974714851-48206138473c?q=80&w=2070&auto=format&fit=crop`,
                    categoryId: category.id,
                    userId: userId,
                    author: 'Bharat Standard Team',
                    published: true
                }
            });
            console.log(`  - Created extra article: ${title}`);
        }
    }
  }

  // 3. Create 10 Dummy Listicles
  console.log('Seeding Listicles...');
  const dummyListicles = [
    {
      title: 'Top 10 Indian Startups Shaping the Future in 2026',
      intro: 'From AI-driven healthcare to sustainable logistics, these startups are redefining the Indian tech ecosystem.',
      coverUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074&auto=format&fit=crop',
      items: [
        { title: 'Zomato AI', body: 'Revolutionizing food delivery with hyper-local prediction models.', imageUrl: 'https://images.unsplash.com/photo-1526367790999-0150786486a9?q=80&w=2071&auto=format&fit=crop' },
        { title: 'Skyroot Aerospace', body: 'India\'s leading private space-tech company reaching new heights.', imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2070&auto=format&fit=crop' },
        { title: 'Ola Electric', body: 'Dominating the two-wheeler EV market with sustainable mobility.', imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072&auto=format&fit=crop' }
      ]
    },
    {
      title: 'Top 5 Most Trusted Indian Brands of the Decade',
      intro: 'Consistency, quality, and legacy — these brands have earned the trust of over a billion people.',
      coverUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
      items: [
        { title: 'Tata Group', body: 'The salt-to-software conglomerate known for its ethical leadership.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop' },
        { title: 'Amul', body: 'The Taste of India that revolutionized the dairy sector.', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=2038&auto=format&fit=crop' },
        { title: 'HDFC Bank', body: 'Setting the gold standard in Indian private sector banking.', imageUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=2070&auto=format&fit=crop' }
      ]
    },
    {
      title: 'Top 3 Visionary Founders in Indian Fintech',
      intro: 'Meet the architects of India\'s digital payment revolution.',
      coverUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop',
      items: [
        { title: 'Nithin Kamath', body: 'Co-founder of Zerodha, making investing accessible to everyone.', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' },
        { title: 'Vijay Shekhar Sharma', body: 'The man behind Paytm\'s massive impact on small merchants.', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop' }
      ]
    },
    {
      title: '10 Rising Stars in Indian SaaS for 2026',
      intro: 'India is becoming the SaaS capital of the world. Here are the companies leading the charge.',
      coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
      items: [
        { title: 'Freshworks', body: 'The poster child for Indian SaaS going global.', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop' },
        { title: 'Postman', body: 'The essential tool for API development worldwide.', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop' }
      ]
    }
  ];

  // Adding 6 more to reach 10
  for (let i = 5; i <= 10; i++) {
    dummyListicles.push({
      title: `Top ${i+2} Business Leaders to Watch in Q${(i%4)+1} 2026`,
      intro: `Analyzing the strategies of India's most influential executives this quarter.`,
      coverUrl: `https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop`,
      items: [
        { title: 'Executive Insight 1', body: 'Leading through digital transformation and sustainable practices.', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop' },
        { title: 'Executive Insight 2', body: 'Expansion into global markets and strategic acquisitions.', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' }
      ]
    });
  }

  for (const lData of dummyListicles) {
    const existing = await prisma.listicle.findFirst({
      where: { title: lData.title }
    });

    if (!existing) {
      await prisma.listicle.create({
        data: {
          ...lData,
          userId: userId,
          published: true
        }
      });
      console.log(`  - Created listicle: ${lData.title}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
