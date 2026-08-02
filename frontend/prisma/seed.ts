import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding initial data to PostgreSQL...')

  // Clear existing data (optional, but good for fresh seeds)
  await prisma.siteVisit.deleteMany();
  await prisma.siteVisitSlot.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.property.deleteMany();
  await prisma.homepageSection.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.contactSetting.deleteMany();
  await prisma.companySetting.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.investmentHub.deleteMany();
  await prisma.salesTarget.deleteMany();

  // 1. Seed Properties
  const properties = [
    {
      id: "1",
      title: "Prestige Golfshire Villas",
      slug: "prestige-golfshire-villas",
      price: "₹12.5 Cr onwards",
      location: {
        address: "Nandi Hills",
        city: "Bangalore",
        coordinates: { lat: 13.235, lng: 77.683 },
        nearbyPlaces: [{ name: "Airport", distance: "20 Mins" }]
      },
      city: "Bangalore",
      area: "7,500 sq.ft",
      type: "Luxury Villa",
      builder: "Prestige Group",
      financials: {
        roi: "14% p.a.",
        appreciation: "22% in 3 years"
      },
      status: "Published",
      description: "Ultra-luxury villas with a championship 18-hole golf course.",
      investmentHighlights: "Set against the picturesque Nandi Hills, Prestige Golfshire is Bangalore's most premium golf resort development. Designed for those who appreciate the finer things in life, these ultra-luxury villas offer unparalleled views, a championship 18-hole golf course, and a 5-star Marriott hotel on campus. The perfect asset for capital preservation and high rental yields targeting expat executives.",
      rera: "PRM/KA/RERA/1251/309/PR/170915/000155",
      bedrooms: 4,
      bathrooms: 5,
      parking: 2,
      images: [
        { id: "img1", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop", isPrimary: true, order: 1 },
        { id: "img2", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop", isPrimary: false, order: 2 },
        { id: "img3", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop", isPrimary: false, order: 3 }
      ],
      media: {
        videos: [],
        floorPlans: [],
        brochures: []
      },
      contact: {
        contactName: "Noble Nests Advisor",
        phone: "+91 98765 43210",
        whatsapp: "1234567890",
        email: "invest@noblenests.co"
      },
      seo: {
        metaTitle: "Prestige Golfshire Villas | Luxury Real Estate Bangalore",
        metaDescription: "Invest in ultra-luxury villas at Prestige Golfshire, Bangalore. 18-hole golf course, premium amenities, high ROI.",
        keywords: ["luxury villas", "bangalore real estate", "prestige golfshire", "investment"]
      },
      amenities: ["18-Hole Golf Course", "Private Pool", "Clubhouse", "Helipad", "Concierge Service", "Spa & Wellness"],
      isFeatured: true,
      availability: "Available"
    }
  ];

  for (const p of properties) {
    await prisma.property.create({
      data: p
    });
  }
  console.log(`Seeded ${properties.length} properties.`);

  // 2. Seed Homepage Sections (with jsonContent!)
  const sections = [
    { sectionId: 'hero', title: 'Curated Wealth in Brick & Mortar', subtitle: 'Exclusive Luxury Real Estate Advisory', description: 'Discover Bangalore\'s most exclusive high-yield luxury properties, handpicked for discerning investors.', ctaText: 'Explore Investments', ctaLink: '/noblenestsco/properties', isVisible: true, sortOrder: 1, theme: 'dark', jsonContent: null },
    { sectionId: 'market-insights', title: 'Where Smart Money Is Moving', subtitle: 'Market Intelligence', description: 'Leverage our deep market intelligence to maximize your capital appreciation.', ctaText: 'Read Report', ctaLink: '/noblenestsco/insights', isVisible: true, sortOrder: 2, theme: 'light', 
      jsonContent: {
        stats: [
          { icon: "TrendingUp", value: "₹480 Cr+", label: "Assets Under Advisory" },
          { icon: "Building", value: "42", label: "Curated Projects" },
          { icon: "Users", value: "310+", label: "Investors Served" },
          { icon: "Award", value: "13.2%", label: "Average Annual ROI" }
        ],
        trends: [
          { title: "North Bangalore Rising", category: "Macro Trend", excerpt: "With KIAL Phase 2 operational and Devanahalli business district expanding, North Bangalore corridors are seeing 22–28% capital appreciation over 36 months.", tag: "Residential + Commercial" },
          { title: "Kochi: India's Emerging Smart City", category: "Emerging Market", excerpt: "GIFT City-equivalent infrastructure investments, METRO Phase 2, and a growing expat population are driving Kochi residential demand to a 5-year high.", tag: "High Demand" },
          { title: "NRI Repatriation Tailwind", category: "Macro Signal", excerpt: "RBI FEMA liberalisation and a weaker rupee-dollar spread is making luxury property acquisition increasingly attractive for the NRI diaspora.", tag: "NRI Investment" }
        ]
      }
    },
    { sectionId: 'why-choose-us', title: 'The Noble Nests Advantage', subtitle: 'Why Partner With Us', description: 'We are not brokers; we are your investment partners focused on capital preservation and growth.', ctaText: 'Book Consultation', ctaLink: '/noblenestsco/contact', isVisible: true, sortOrder: 3, theme: 'dark', 
      jsonContent: {
        reasons: [
          { title: "Verified Opportunities", description: "Every property undergoes strict due diligence before it is presented to our investors.", icon: "CheckCircle" },
          { title: "Transparent Pricing", description: "No hidden charges or unexpected fees. We believe in complete financial clarity.", icon: "Search" },
          { title: "Dedicated Advisor", description: "A single point of contact for personalized investment guidance and portfolio management.", icon: "Handshake" },
          { title: "Legal Due Diligence", description: "Comprehensive legal checks ensuring secure titles and hassle-free ownership.", icon: "FileText" },
          { title: "Builder Verification", description: "We partner exclusively with Grade-A developers with a proven track record of delivery.", icon: "Shield" },
          { title: "Personal Site Visits", description: "Curated property tours arranged at your convenience with our local experts.", icon: "MapPin" }
        ]
      }
    },
    { sectionId: 'featured-properties', title: 'Curated For You', subtitle: 'Investment Opportunities', description: 'Explore our hand-picked selection of luxury assets available for immediate acquisition.', ctaText: 'View All Properties', ctaLink: '/noblenestsco/properties', isVisible: true, sortOrder: 4, theme: 'dark', jsonContent: null },
    { sectionId: 'featured-locations', title: 'Prime Investment Hubs', subtitle: 'Strategic Locations', description: 'Invest in high-growth corridors engineered for significant appreciation.', ctaText: '', ctaLink: '', isVisible: true, sortOrder: 5, theme: 'light', 
      jsonContent: {
        locations: [
          { city: "Bangalore", subtitle: "The Silicon Valley", roi: "12-15%", potential: "High Growth", popularAreas: ["North Bangalore", "Whitefield", "Sarjapur"], imageUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2000&auto=format&fit=crop" },
          { city: "Kochi", subtitle: "The Emerging Hub", roi: "10-14%", potential: "Steady Appreciation", popularAreas: ["Marine Drive", "Kakkanad", "Edappally"], imageUrl: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=2000&auto=format&fit=crop" }
        ]
      }
    },
    { sectionId: 'testimonials', title: 'Trusted by Discerning Investors', subtitle: 'Client Success', description: 'Hear from our global clientele about their investment journeys with us.', ctaText: '', ctaLink: '', isVisible: true, sortOrder: 6, theme: 'dark', jsonContent: null },
    { sectionId: 'home-cta', title: 'Ready to Build Your Legacy?', subtitle: 'Take the Next Step', description: 'Connect with our advisory team for a private consultation tailored to your wealth goals.', ctaText: 'Talk to an Advisor', ctaLink: '/noblenestsco/contact', isVisible: true, sortOrder: 7, theme: 'gold', jsonContent: null },
  ];

  for (const s of sections) {
    await prisma.homepageSection.create({
      data: s
    });
  }
  console.log(`Seeded ${sections.length} homepage sections.`);

  // 3. Seed Testimonials
  const testimonials = [
    { name: 'Rajesh Kumar', designation: 'CEO', company: 'Tech Innovators', city: 'Bangalore', investorType: 'HNI Investor', rating: 5, testimonial: 'Noble Nests Co provided an exceptionally curated list of luxury properties. Their advisory approach helped me secure a high-yield asset without the usual hassle.', propertyPurchased: 'Prestige Golfshire Villas', purchaseYear: 2023, isVerified: true, isActive: true, sortOrder: 1 },
    { name: 'Anita Desai', designation: 'Director', company: 'Global Enterprises', city: 'Dubai', investorType: 'NRI Investor', rating: 5, testimonial: 'Living in Dubai, I needed a trusted partner for my investments in India. The team at Noble Nests Co was transparent, highly professional, and secured an off-market deal for me.', propertyPurchased: 'Sattva Aeropolis', purchaseYear: 2024, isVerified: true, isActive: true, sortOrder: 2 },
  ];
  
  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: t
    });
  }
  console.log(`Seeded ${testimonials.length} testimonials.`);

  // 4. Seed Settings
  await prisma.contactSetting.create({
    data: {
      whatsappNumber: '+919876543210',
      phoneNumber: '+918041234567',
      email: 'invest@noblenests.co',
      officeAddress: 'Noble Nests Co. Headquarters, UB City, Vittal Mallya Road, Bangalore 560001, Karnataka, India',
      googleMapsUrl: 'https://maps.google.com/?q=UB+City',
    }
  });

  const socialLinks = [
    { platform: 'Instagram', url: 'https://instagram.com/noblenestsco', displayName: '@noblenestsco', icon: 'instagram', isVisible: true, sortOrder: 1 },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/noblenestsco', displayName: 'Noble Nests Co', icon: 'linkedin', isVisible: true, sortOrder: 2 },
    { platform: 'WhatsApp', url: 'https://wa.me/919876543210', displayName: 'WhatsApp', icon: 'whatsapp', isVisible: true, sortOrder: 3 },
    { platform: 'Facebook', url: 'https://facebook.com/noblenestsco', displayName: 'Noble Nests Co', icon: 'facebook', isVisible: true, sortOrder: 4 }
  ];
  
  for (const l of socialLinks) {
    await prisma.socialLink.create({
      data: l
    });
  }
  console.log(`Seeded settings and ${socialLinks.length} social links.`);

  // 5. Seed FAQ
  await prisma.faq.createMany({
    data: [
      { question: "What is Noble Nests Co?", answer: "We are a premium real estate investment advisory.", category: "General", sortOrder: 1 },
      { question: "Do you charge brokerage?", answer: "We charge an advisory fee upon successful acquisition.", category: "Financial", sortOrder: 2 }
    ]
  });

  // 6. Seed CRM
  const lead = await prisma.lead.create({
    data: { name: "John Doe", phone: "+91 9876543210", email: "john@example.com", budget: "10Cr+", city: "Bangalore", purpose: "Investment", status: "New" }
  });
  
  await prisma.siteVisit.create({
    data: {
      leadId: lead.id,
      propertyId: properties[0].id,
      date: new Date().toISOString().split('T')[0],
      time: "10:00 AM",
      numberOfVisitors: 2,
      status: "Confirmed",
      notes: "High priority lead"
    }
  });

  await prisma.salesTarget.create({
    data: {
      period: "Monthly",
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      targetRevenue: 50000000,
      targetBookings: 10,
      targetVisits: 50,
      achievedRevenue: 12500000,
      achievedBookings: 2,
      achievedVisits: 14
    }
  });

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
