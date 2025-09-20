import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection and count records
    const [creatorCount, placeCount, articleCount] = await Promise.all([
      prisma.creator.count(),
      prisma.place.count(),
      prisma.article.count(),
    ]);

    // Get a sample creator to verify data structure
    const sampleCreator = await prisma.creator.findFirst({
      select: {
        id: true,
        displayName: true,
        instagramHandle: true,
        isActive: true,
      }
    });

    return NextResponse.json({
      status: 'success',
      database: 'connected',
      counts: {
        creators: creatorCount,
        places: placeCount,
        articles: articleCount,
      },
      sampleCreator,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Database debug error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    }, { status: 500 });
  }
}
