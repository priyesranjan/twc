const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Commencing Apex Wedding Database Seeding...");

  // 1. Create Core Categories
  console.log("Seeding Categories...");
  const catVenues = await prisma.category.upsert({
    where: { name: 'Venues' },
    update: {},
    create: { name: 'Venues', iconUrl: '🏰' },
  });
  
  const catPhoto = await prisma.category.upsert({
    where: { name: 'Photographers' },
    update: {},
    create: { name: 'Photographers', iconUrl: '📸' },
  });

  // 2. Create Super Admin & Content
  console.log("Seeding Admin User...");
  const admin = await prisma.user.upsert({
    where: { email: 'admin@weddingbanquets.in' },
    update: {},
    create: {
      name: 'Super Admin',
      phone: '0000000000',
      email: 'admin@weddingbanquets.in',
      role: 'ADMIN'
    }
  });

  console.log("Seeding Test SEO Blog...");
  await prisma.blogPost.upsert({
    where: { slug: 'top-10-banquet-halls' },
    update: {},
    create: {
      title: 'Top 10 Elegant Banquet Halls for Royal Nuptials',
      slug: 'top-10-banquet-halls',
      excerpt: 'Discover the most luxurious venues that guarantee a breathtaking wedding experience.',
      content: '<p>Getting married is a grand affair...</p>',
      imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      authorId: admin.id
    }
  });

  // 3. Create Sample Vendor & Venues
  console.log("Seeding Luxury Vendors & Venues...");
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@royalpalace.in' },
    update: {},
    create: {
      name: 'Royal Palace Management',
      phone: '9876543210',
      email: 'vendor@royalpalace.in',
      role: 'VENDOR',
      vendors: {
        create: {
          businessName: 'The Royal Palace Management Co.',
          description: 'Premium curators of world-class weddings.',
          address: 'Bailey Road',
          city: 'Patna',
          verified_status: true,
        }
      }
    }
  });

  const theVendor = await prisma.vendor.findUnique({ where: { userId: vendorUser.id }});

  // Inject High-End Venue
  if (theVendor) {
    await prisma.venue.createMany({
      skipDuplicates: true,
      data: [
        {
          vendorId: theVendor.id,
          venueType: 'BANQUET_HALL',
          pricePerPlate: 1200.00,
          capacity: 1500,
          location: 'Central Patna',
          city: 'Patna',
          images: JSON.stringify(["https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]),
          details: 'An exquisite pillarless hall designed for grandeur.',
          rating: 4.8
        },
        {
          vendorId: theVendor.id,
          venueType: 'FARMHOUSE',
          pricePerPlate: 2500.00,
          capacity: 3000,
          location: 'Outer Ring Road, Delhi',
          city: 'Delhi',
          images: JSON.stringify(["https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]),
          details: 'Lush green 5-acre farmhouse perfect for open-air winter weddings.',
          rating: 4.9
        }
      ]
    });
  }

  console.log("✅ Seeding completed! Real-world data is injected.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
