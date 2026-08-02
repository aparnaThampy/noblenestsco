-- database/seed.sql

-- Seed data for contact_settings
INSERT INTO contact_settings (id, whatsapp_number, phone_number, email, office_address, google_maps_url)
VALUES (
  'contact-1', 
  '+919876543210', 
  '+918041234567', 
  'invest@noblenests.co', 
  'Noble Nests Co. Headquarters, UB City, Vittal Mallya Road, Bangalore 560001, Karnataka, India', 
  'https://maps.google.com/?q=UB+City'
);

-- Seed data for social_links
INSERT INTO social_links (id, platform, url, display_name, icon, sort_order)
VALUES 
  ('social-1', 'Instagram', 'https://instagram.com/noblenestsco', '@noblenestsco', 'instagram', 1),
  ('social-2', 'LinkedIn', 'https://linkedin.com/company/noblenestsco', 'Noble Nests Co', 'linkedin', 2),
  ('social-3', 'WhatsApp', 'https://wa.me/919876543210', 'WhatsApp', 'whatsapp', 3),
  ('social-4', 'Facebook', 'https://facebook.com/noblenestsco', 'Noble Nests Co', 'facebook', 4);

-- Seed data for testimonials
INSERT INTO testimonials (id, name, designation, company, city, investor_type, rating, testimonial, is_verified, is_active, sort_order, property_purchased, purchase_year)
VALUES 
  (
    'test-1', 
    'Rajesh Kumar', 
    'CEO', 
    'Tech Innovators', 
    'Bangalore', 
    'HNI Investor', 
    5, 
    'Noble Nests Co provided an exceptionally curated list of luxury properties. Their advisory approach helped me secure a high-yield asset without the usual hassle.', 
    TRUE, 
    TRUE, 
    1,
    'Prestige Golfshire Villas',
    2023
  ),
  (
    'test-2', 
    'Anita Desai', 
    'Director', 
    'Global Enterprises', 
    'Dubai', 
    'NRI Investor', 
    5, 
    'Living in Dubai, I needed a trusted partner for my investments in India. The team at Noble Nests Co was transparent, highly professional, and secured an off-market deal for me.', 
    TRUE, 
    TRUE, 
    2,
    'Sattva Aeropolis',
    2024
  );

-- Seed data for homepage_sections
INSERT INTO homepage_sections (id, section_id, title, subtitle, description, cta_text, cta_link, is_visible, sort_order)
VALUES 
  ('hs-1', 'hero', 'Curated Wealth in Brick & Mortar', 'Exclusive Luxury Real Estate Advisory', 'Discover Bangalore''s most exclusive high-yield luxury properties, handpicked for discerning investors.', 'Explore Investments', '/noblenestsco/properties', TRUE, 1),
  ('hs-2', 'insights', 'Market Insights', 'Data-Driven Decisions', 'Leverage our deep market intelligence to maximize your capital appreciation.', 'Read Report', '/noblenestsco/insights', TRUE, 2),
  ('hs-3', 'why-us', 'The Noble Nests Advantage', 'Why Partner With Us', 'We are not brokers; we are your investment partners focused on capital preservation and growth.', 'Book Consultation', '/noblenestsco/contact', TRUE, 3),
  ('hs-4', 'featured-properties', 'Curated For You', 'Investment Opportunities', 'Explore our hand-picked selection of luxury assets available for immediate acquisition.', 'View All Properties', '/noblenestsco/properties', TRUE, 4),
  ('hs-5', 'prime-hubs', 'Strategic Locations', 'Prime Investment Hubs', 'Invest in high-growth corridors engineered for significant appreciation.', '', '', TRUE, 5),
  ('hs-6', 'testimonials', 'Trusted by Discerning Investors', 'Client Success', 'Hear from our global clientele about their investment journeys with us.', '', '', TRUE, 6),
  ('hs-7', 'cta', 'Ready to Build Your Legacy?', 'Take the Next Step', 'Connect with our advisory team for a private consultation tailored to your wealth goals.', 'Talk to an Advisor', '/noblenestsco/contact', TRUE, 7);
