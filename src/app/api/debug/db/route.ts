import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test database connection and count records using Supabase client
    const [creatorsResult, placesResult, articlesResult] = await Promise.all([
      supabase.from('Creator').select('*', { count: 'exact', head: true }),
      supabase.from('Place').select('*', { count: 'exact', head: true }),
      supabase.from('Article').select('*', { count: 'exact', head: true }),
    ]);

    if (creatorsResult.error) throw creatorsResult.error;
    if (placesResult.error) throw placesResult.error;
    if (articlesResult.error) throw articlesResult.error;

    // Get a sample creator to verify data structure
    const { data: sampleCreator, error: creatorError } = await supabase
      .from('Creator')
      .select('id, displayName, instagramHandle, isActive')
      .eq('isActive', true)
      .limit(1)
      .single();

    if (creatorError && creatorError.code !== 'PGRST116') {
      throw creatorError;
    }

    return NextResponse.json({
      status: 'success',
      database: 'connected',
      client: 'supabase',
      counts: {
        creators: creatorsResult.count || 0,
        places: placesResult.count || 0,
        articles: articlesResult.count || 0,
      },
      sampleCreator: sampleCreator || null,
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
