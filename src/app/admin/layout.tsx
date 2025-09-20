import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { 
  Home, 
  FileText, 
  Users, 
  MapPin, 
  Settings, 
  Activity,
  LogOut,
  BarChart3
} from "lucide-react"

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Articles', href: '/admin/articles', icon: FileText },
  { name: 'Creators', href: '/admin/creators', icon: Users },
  { name: 'Places', href: '/admin/places', icon: MapPin },
  { name: 'Webhook Logs', href: '/admin/webhooks', icon: Activity },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="What's Eating Nashville"
                  width={120}
                  height={30}
                  className="h-6 w-auto"
                />
                <div>
                  <h1 className="font-semibold text-gray-900">Admin Panel</h1>
                </div>
              </Link>
              <Badge variant="secondary" className="ml-2">
                Admin
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/" target="_blank">
                  View Site
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="space-y-1">
              {adminNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
