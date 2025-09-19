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

    const atomEntries = articles.map((article) => {
      const link = `${baseUrl}/articles/${article.slug}`
      const published = article.publishedAt.toISOString()
      const updated = article.updatedAt.toISOString()
      
      return `
    <entry>
      <title type="html"><![CDATA[${article.title}]]></title>
      <link href="${link}" />
      <id>${link}</id>
      <published>${published}</published>
      <updated>${updated}</updated>
      <summary type="html"><![CDATA[${article.excerpt || article.title}]]></summary>
      <content type="html"><![CDATA[${article.bodyHtml}]]></content>
      <author>
        <name>${article.creator.displayName}</name>
        <uri>${baseUrl}/creators/${article.creator.instagramHandle}</uri>
      </author>
      <category term="${article.place.neighborhood || 'Nashville'}" />
      <category term="${article.place.name}" />
    </entry>`
    }).join('')

    const atomXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>What's Eating Nashville</title>
  <subtitle>Discover Nashville's incredible food scene through the eyes of local creators</subtitle>
  <link href="${baseUrl}/atom.xml" rel="self" />
  <link href="${baseUrl}" />
  <id>${baseUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>What's Eating Nashville</name>
    <uri>${baseUrl}</uri>
  </author>
  <icon>${baseUrl}/favicon.ico</icon>
  <logo>${baseUrl}/logo.png</logo>${atomEntries}
</feed>`

    return new Response(atomXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/atom+xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })

  } catch (error) {
    console.error('Error generating Atom feed:', error)
    
    // Return minimal Atom feed if database is not available
    const fallbackAtom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>What's Eating Nashville</title>
  <subtitle>Discover Nashville's incredible food scene through the eyes of local creators</subtitle>
  <link href="${baseUrl}/atom.xml" rel="self" />
  <link href="${baseUrl}" />
  <id>${baseUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
</feed>`

    return new Response(fallbackAtom, {
      status: 200,
      headers: {
        'Content-Type': 'application/atom+xml',
      },
    })
  }
}
