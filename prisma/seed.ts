import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const neighborhoods = [
  'Downtown', 'The Gulch', 'SoBro', 'Midtown', 'Music Row', 'East Nashville',
  '12 South', 'Germantown', 'Sylvan Park', 'Hillsboro Village', 'West End',
  'Wedgewood-Houston', 'Edgehill', 'Green Hills', 'Donelson', 'Opry/Music Valley',
  'Berry Hill', 'Antioch', 'Bellevue', 'Melrose', 'The Nations', 'Nolensville Pike'
]

const cuisines = [
  'Hot Chicken', 'BBQ', 'Southern', 'Meat & Three', 'American', 'Burgers',
  'Tacos', 'Mexican', 'Tex-Mex', 'Italian', 'Pizza', 'Sushi', 'Japanese',
  'Chinese', 'Thai', 'Indian', 'Mediterranean', 'Middle Eastern', 'Korean',
  'Vietnamese', 'Seafood', 'Brunch', 'Coffee', 'Bakery', 'Dessert', 'Vegan',
  'Vegetarian', 'Food Truck'
]

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample creators
  const creators = await Promise.all([
    prisma.creator.upsert({
      where: { instagramHandle: 'nashfoodtours' },
      update: {},
      create: {
        displayName: 'Nash Food Tours',
        instagramHandle: 'nashfoodtours',
        instagramUrl: 'https://instagram.com/nashfoodtours',
        avatarUrl: 'https://example.com/avatar1.jpg',
        bio: 'Exploring Nashville\'s incredible food scene one bite at a time! 🍴',
        isActive: true,
      },
    }),
    prisma.creator.upsert({
      where: { instagramHandle: 'eastnashbites' },
      update: {},
      create: {
        displayName: 'East Nash Bites',
        instagramHandle: 'eastnashbites',
        instagramUrl: 'https://instagram.com/eastnashbites',
        avatarUrl: 'https://example.com/avatar2.jpg',
        bio: 'Covering the best eats in East Nashville and beyond! 🌮',
        isActive: true,
      },
    }),
    prisma.creator.upsert({
      where: { instagramHandle: 'musiccityfoodie' },
      update: {},
      create: {
        displayName: 'Music City Foodie',
        instagramHandle: 'musiccityfoodie',
        instagramUrl: 'https://instagram.com/musiccityfoodie',
        avatarUrl: 'https://example.com/avatar3.jpg',
        bio: 'Your guide to Nashville\'s hottest restaurants and hidden gems! 🔥',
        isActive: true,
      },
    }),
  ])

  // Create sample places
  const places = await Promise.all([
    prisma.place.upsert({
      where: { googlePlaceId: 'ChIJ_example_princes' },
      update: {},
      create: {
        googlePlaceId: 'ChIJ_example_princes',
        name: 'Prince\'s Hot Chicken',
        address: '5814 Nolensville Pike, Nashville, TN 37211',
        city: 'Nashville',
        lat: 36.12345,
        lng: -86.76543,
        mapsUrl: 'https://maps.google.com/?cid=123456789',
        avgRating: 4.5,
        reviewCount: 2190,
        neighborhood: 'Nolensville Pike',
        cuisines: ['Hot Chicken', 'Southern'],
      },
    }),
    prisma.place.upsert({
      where: { googlePlaceId: 'ChIJ_example_hattie' },
      update: {},
      create: {
        googlePlaceId: 'ChIJ_example_hattie',
        name: 'Hattie B\'s Hot Chicken',
        address: '112 19th Ave S, Nashville, TN 37203',
        city: 'Nashville',
        lat: 36.14567,
        lng: -86.79876,
        mapsUrl: 'https://maps.google.com/?cid=987654321',
        avgRating: 4.3,
        reviewCount: 3456,
        neighborhood: 'Midtown',
        cuisines: ['Hot Chicken', 'Southern'],
      },
    }),
    prisma.place.upsert({
      where: { googlePlaceId: 'ChIJ_example_monell' },
      update: {},
      create: {
        googlePlaceId: 'ChIJ_example_monell',
        name: 'Monell\'s Dining & Catering',
        address: '1235 6th Ave N, Nashville, TN 37208',
        city: 'Nashville',
        lat: 36.16789,
        lng: -86.78234,
        mapsUrl: 'https://maps.google.com/?cid=456789123',
        avgRating: 4.2,
        reviewCount: 1890,
        neighborhood: 'Germantown',
        cuisines: ['Southern', 'Meat & Three'],
      },
    }),
  ])

  // Add some sample review quotes
  await Promise.all([
    prisma.reviewQuote.create({
      data: {
        placeId: places[0].id,
        author: 'Jane D.',
        rating: 5,
        text: 'Life-changing heat! This is what hot chicken is all about.',
        reviewedAt: new Date('2024-08-15'),
        source: 'google',
      },
    }),
    prisma.reviewQuote.create({
      data: {
        placeId: places[0].id,
        author: 'Mike R.',
        rating: 4,
        text: 'The line was worth it. Crispy, spicy perfection.',
        reviewedAt: new Date('2024-08-20'),
        source: 'google',
      },
    }),
    prisma.reviewQuote.create({
      data: {
        placeId: places[1].id,
        author: 'Sarah L.',
        rating: 4,
        text: 'Great atmosphere and solid hot chicken. A Nashville staple!',
        reviewedAt: new Date('2024-08-18'),
        source: 'google',
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created ${creators.length} creators and ${places.length} places`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
