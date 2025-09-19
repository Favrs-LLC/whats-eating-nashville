import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      include: {
        creator: {
          select: {
            displayName: true,
            instagramHandle: true,
          },
        },
        place: {
          select: {
            name: true,
            neighborhood: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: 50, // Latest 50 articles
    })

    const rssItems = articles.map((article) => {
      const pubDate = article.publishedAt.toUTCString()
      const link = `${baseUrl}/articles/${article.slug}`
      
      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt || article.title}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <author><![CDATA[${article.creator.displayName} (@${article.creator.instagramHandle})]]></author>
      <category><![CDATA[${article.place.neighborhood || 'Nashville'}]]></category>
      <category><![CDATA[${article.place.name}]]></category>
    </item>`
    }).join('')

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>What's Eating Nashville</title>
    <description>Discover Nashville's incredible food scene through the eyes of local creators</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <managingEditor>hello@whatseatingnashville.com (What's Eating Nashville)</managingEditor>
    <webMaster>hello@whatseatingnashville.com (What's Eating Nashville)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>What's Eating Nashville</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>${rssItems}
  </channel>
</rss>`

    return new Response(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })

  } catch (error) {
    console.error('Error generating RSS feed:', error)
    
    // Return minimal RSS feed if database is not available
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>What's Eating Nashville</title>
    <description>Discover Nashville's incredible food scene through the eyes of local creators</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`

    return new Response(fallbackRss, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }
}
