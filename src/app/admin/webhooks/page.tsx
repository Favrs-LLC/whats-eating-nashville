import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Activity,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"

// Mock webhook logs data - will be replaced with real database queries
const webhookLogs = [
  {
    id: '1',
    source: 'gumloop',
    endpoint: '/api/hooks/gumloop/articles.create',
    statusCode: 201,
    ok: true,
    requestIdemKey: 'req_123456789',
    bodyJson: {
      title: "Prince's Hot Chicken: The Line Was Worth It",
      creator: { instagram_handle: 'nashfoodtours' },
      place: { name: "Prince's Hot Chicken" }
    },
    createdAt: new Date('2024-01-15T11:30:00'),
  },
  {
    id: '2',
    source: 'gumloop', 
    endpoint: '/api/hooks/gumloop/articles.create',
    statusCode: 202,
    ok: true,
    requestIdemKey: 'req_123456788',
    bodyJson: {
      title: "Another Hot Chicken Review",
      creator: { instagram_handle: 'eastnashbites' },
      place: { name: "Prince's Hot Chicken" }
    },
    createdAt: new Date('2024-01-15T10:15:00'),
  },
  {
    id: '3',
    source: 'gumloop',
    endpoint: '/api/hooks/gumloop/creators.upsert',
    statusCode: 200,
    ok: true,
    requestIdemKey: 'req_123456787',
    bodyJson: {
      instagram_handle: 'musiccityfoodie',
      display_name: 'Music City Foodie'
    },
    createdAt: new Date('2024-01-15T09:45:00'),
  },
  {
    id: '4',
    source: 'gumloop',
    endpoint: '/api/hooks/gumloop/articles.create',
    statusCode: 400,
    ok: false,
    requestIdemKey: 'req_123456786',
    bodyJson: {
      error: 'Missing required fields: place.google_place_id',
      code: 'MISSING_FIELDS'
    },
    createdAt: new Date('2024-01-14T16:20:00'),
  },
  {
    id: '5',
    source: 'gumloop',
    endpoint: '/api/hooks/gumloop/articles.merge',
    statusCode: 200,
    ok: true,
    requestIdemKey: 'req_123456785',
    bodyJson: {
      canonical_article_id: 'art_123',
      updated: true
    },
    createdAt: new Date('2024-01-14T14:30:00'),
  }
]

const stats = {
  total: webhookLogs.length,
  successful: webhookLogs.filter(log => log.ok).length,
  failed: webhookLogs.filter(log => !log.ok).length,
  today: webhookLogs.filter(log => {
    const today = new Date()
    const logDate = new Date(log.createdAt)
    return logDate.toDateString() === today.toDateString()
  }).length
}

export default function WebhookLogsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Webhook Logs</h1>
          <p className="text-gray-600">Monitor API requests and responses from Gumloop</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by endpoint, source, or idempotency key..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Webhook Requests</CardTitle>
          <CardDescription>
            Latest API requests from Gumloop integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {webhookLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {log.ok ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {log.endpoint.split('/').pop()?.replace('.', ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {log.createdAt.toLocaleString()} • {log.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={log.ok ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {log.statusCode}
                    </Badge>
                    {log.requestIdemKey && (
                      <Badge variant="outline" className="text-xs font-mono">
                        {log.requestIdemKey}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Request/Response Body:</p>
                  <pre className="text-xs text-gray-600 overflow-x-auto">
                    {JSON.stringify(log.bodyJson, null, 2)}
                  </pre>
                </div>

                <div className="text-xs text-gray-500">
                  <span className="font-medium">Endpoint:</span> {log.endpoint}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline">
              Load More Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
