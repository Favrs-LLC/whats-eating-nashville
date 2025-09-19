import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Users, 
  MapPin, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

// Mock data - will be replaced with real database queries
const stats = {
  totalArticles: 42,
  totalCreators: 12,
  totalPlaces: 38,
  totalWebhooks: 156,
  articlesThisWeek: 8,
  creatorsThisWeek: 2,
  placesThisWeek: 5,
  webhooksThisWeek: 23
}

const recentArticles = [
  {
    id: '1',
    title: "Prince's Hot Chicken: The Line Was Worth It",
    creator: 'Nash Food Tours',
    status: 'published',
    createdAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2', 
    title: "Hattie B's: The Midtown Experience",
    creator: 'East Nash Bites',
    status: 'published',
    createdAt: new Date('2024-01-14T15:45:00'),
  },
  {
    id: '3',
    title: "Monell's: Family Style Tradition",
    creator: 'Music City Foodie', 
    status: 'draft',
    createdAt: new Date('2024-01-13T09:15:00'),
  }
]

const recentWebhooks = [
  {
    id: '1',
    source: 'gumloop',
    endpoint: '/api/hooks/gumloop/articles.create',
    statusCode: 201,
    ok: true,
    createdAt: new Date('2024-01-15T11:30:00'),
  },
  {
    id: '2',
    source: 'gumloop', 
    endpoint: '/api/hooks/gumloop/articles.create',
    statusCode: 202,
    ok: true,
    createdAt: new Date('2024-01-15T10:15:00'),
  },
  {
    id: '3',
    source: 'gumloop',
    endpoint: '/api/hooks/gumloop/creators.upsert',
    statusCode: 200,
    ok: true,
    createdAt: new Date('2024-01-15T09:45:00'),
  },
  {
    id: '4',
    source: 'gumloop',
    endpoint: '/api/hooks/gumloop/articles.create',
    statusCode: 400,
    ok: false,
    createdAt: new Date('2024-01-14T16:20:00'),
  }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your Nashville food content platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.articlesThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCreators}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.creatorsThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Places</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlaces}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.placesThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhook Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWebhooks}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.webhooksThisWeek} this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Articles
            </CardTitle>
            <CardDescription>
              Latest content from your creators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <div key={article.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {article.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      by {article.creator} • {article.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={article.status === 'published' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {article.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/articles">View All Articles</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Webhook Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Webhook Activity
            </CardTitle>
            <CardDescription>
              Recent API requests from Gumloop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWebhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {webhook.endpoint.split('/').pop()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {webhook.createdAt.toLocaleTimeString()} • {webhook.source}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {webhook.ok ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <Badge 
                      variant={webhook.ok ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {webhook.statusCode}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/webhooks">View All Logs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild className="h-auto p-4 flex-col">
              <Link href="/admin/articles/new">
                <FileText className="h-6 w-6 mb-2" />
                Create Article
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/admin/creators">
                <Users className="h-6 w-6 mb-2" />
                Manage Creators
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col">
              <Link href="/admin/places">
                <MapPin className="h-6 w-6 mb-2" />
                Manage Places
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
