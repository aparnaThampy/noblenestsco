/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client'
import { MockPropertyRepository, MockHomepageSectionRepository, MockTestimonialRepository, MockSettingsRepository } from '../src/backend/infrastructure/persistence/mock-repositories'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding initial data from mock repositories...')

  const mockProperties = new MockPropertyRepository();
  const mockHomepage = new MockHomepageSectionRepository();
  const mockTestimonials = new MockTestimonialRepository();
  const mockSettings = new MockSettingsRepository();

  // 1. Seed Properties
  const properties = await mockProperties.findAll();
  for (const p of properties) {
    await prisma.property.create({
      data: {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        investmentHighlights: p.investmentHighlights || null,
        price: p.price,
        type: p.type,
        status: p.status as any,
        builder: p.builder,
        area: p.area,
        rera: p.rera || null,
        bedrooms: p.bedrooms || null,
        bathrooms: p.bathrooms || null,
        parking: p.parking || null,
        isFeatured: p.isFeatured,
        city: p.city,
        availability: p.availability as any || null,
        amenities: p.amenities as any,
        financials: p.financials as any,
        location: p.location as any,
        media: p.media as any,
        seo: p.seo as any,
        contact: p.contact as any,
        images: p.images as any,
      }
    });
  }
  console.log(`Seeded ${properties.length} properties.`);

  // 2. Seed Homepage Sections
  const sections = await mockHomepage.findAll();
  for (const s of sections) {
    await prisma.homepageSection.create({
      data: s as any
    });
  }
  console.log(`Seeded ${sections.length} homepage sections.`);

  // 3. Seed Testimonials
  const testimonials = await mockTestimonials.findAll();
  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: t as any
    });
  }
  console.log(`Seeded ${testimonials.length} testimonials.`);

  // 4. Seed Settings
  const contact = await mockSettings.getContactSettings();
  if (contact) {
    await prisma.contactSetting.create({
      data: contact as any
    });
  }

  const socialLinks = await mockSettings.getSocialLinks();
  for (const l of socialLinks) {
    await prisma.socialLink.create({
      data: l as any
    });
  }
  console.log(`Seeded settings and ${socialLinks.length} social links.`);

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
