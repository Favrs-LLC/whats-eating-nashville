'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import TipTapEditor from "@/components/editor/TipTapEditor"
import InstagramEmbed from "@/components/embeds/InstagramEmbed"
import { 
  Save, 
  Eye, 
  Globe, 
  Instagram,
  MapPin,
  User,
  Calendar,
  ExternalLink,
  Sparkles
} from "lucide-react"
import { useParams } from 'next/navigation'

// Mock article data - will be replaced with real API call
const mockArticle = {
  id: '1',
  slug: 'princes-hot-chicken-line-worth-it',
  title: "Prince's Hot Chicken: The Line Was Worth It",
  excerpt: "A spicy pilgrimage on Nolensville Pike that delivers on every promise.",
  bodyHtml: `<h2>The Legend Lives On</h2><p>Walking up to Prince's Hot Chicken on Nolensville Pike, you can't help but feel the weight of history. This isn't just any hot chicken joint – this is where it all began.</p><p>The line stretches around the building, but trust me when I say it's worth every minute of the wait.</p><h2>The Heat is Real</h2><p>I ordered the medium, thinking I could handle it. I was wrong. Deliciously, perfectly wrong.</p><blockquote><p>"This is what hot chicken is supposed to be like." - Every bite confirmed it.</p></blockquote><p>The chicken arrives with that signature dark red coating that promises pain and delivers pleasure. Each bite is a perfect balance of heat, flavor, and that unmistakable Prince's magic.</p>`,
  status: 'published',
  sourcePlatform: 'instagram',
  sourcePostUrl: 'https://www.instagram.com/p/example123/',
  publishedAt: new Date('2024-01-15T10:30:00'),
  creator: {
    displayName: 'Nash Food Tours',
    instagramHandle: 'nashfoodtours',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'
  },
  place: {
    name: "Prince's Hot Chicken",
    address: '5814 Nolensville Pike, Nashville, TN 37211',
    neighborhood: 'Nolensville Pike',
    mapsUrl: 'https://maps.google.com/?cid=123456789'
  }
}

export default function ArticleEditorPage() {
  const [article, setArticle] = useState(mockArticle)
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastSaved(new Date())
    setIsSaving(false)
  }

  const handleAutoSave = async (content: string) => {
    setArticle(prev => ({ ...prev, bodyHtml: content }))
    // Auto-save to API
    setLastSaved(new Date())
  }

  const handlePublishToggle = async () => {
    const newStatus = article.status === 'published' ? 'draft' : 'published'
    setArticle(prev => ({ ...prev, status: newStatus }))
    await handleSave()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
          <p className="text-gray-600">
            {lastSaved ? `Last saved ${lastSaved.toLocaleTimeString()}` : 'Not saved'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant={article.status === 'published' ? 'destructive' : 'default'}
            onClick={handlePublishToggle}
          >
            <Globe className="h-4 w-4 mr-2" />
            {article.status === 'published' ? 'Unpublish' : 'Publish'}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {!isPreview ? (
            <>
              {/* Article Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Article Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={article.title}
                      onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                      className="text-lg font-semibold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={article.slug}
                      onChange={(e) => setArticle(prev => ({ ...prev, slug: e.target.value }))}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={article.excerpt}
                      onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                  <CardDescription>
                    Write your article content using the rich text editor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TipTapEditor
                    content={article.bodyHtml}
                    onChange={(content) => setArticle(prev => ({ ...prev, bodyHtml: content }))}
                    autoSave={true}
                    onAutoSave={handleAutoSave}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            /* Preview Mode */
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  How your article will appear to readers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <article className="prose prose-lg max-w-none">
                  <h1>{article.title}</h1>
                  {article.excerpt && (
                    <p className="lead text-gray-600">{article.excerpt}</p>
                  )}
                  <div dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
                </article>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={article.status === 'published' ? 'default' : 'secondary'}
                >
                  {article.status}
                </Badge>
                {article.status === 'published' && (
                  <Button asChild variant="ghost" size="sm">
                    <a href={`/articles/${article.slug}`} target="_blank">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
              <div className="text-sm text-gray-500">
                <Calendar className="h-4 w-4 inline mr-1" />
                Published {article.publishedAt.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* Source */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {article.creator.avatarUrl && (
                  <img
                    src={article.creator.avatarUrl}
                    alt={article.creator.displayName}
                    className="h-10 w-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{article.creator.displayName}</p>
                  <p className="text-sm text-gray-500">@{article.creator.instagramHandle}</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href={article.sourcePostUrl} target="_blank">
                  <Instagram className="h-4 w-4 mr-2" />
                  View Original Post
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Place */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Place</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{article.place.name}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {article.place.neighborhood}
                </p>
                <p className="text-xs text-gray-500">{article.place.address}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href={article.place.mapsUrl} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Maps
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* AI Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Tools</CardTitle>
              <CardDescription>
                Enhance your content with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Excerpt
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Improve SEO
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Enhance Content
              </Button>
            </CardContent>
          </Card>

          {/* Instagram Embed Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instagram Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <InstagramEmbed url={article.sourcePostUrl} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
