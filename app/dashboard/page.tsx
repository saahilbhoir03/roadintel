'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, LogOut, Map, BarChart3, Filter, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import SeverityChart from '@/components/dashboard/severity-chart'
import LocationMap from '@/components/dashboard/location-map'
import ReportTable from '@/components/dashboard/report-table'
import ImageGallery from '@/components/dashboard/image-gallery'

const API_BASE = "https://roadintel-backend.onrender.com";

console.log("API_BASE:", API_BASE)

interface Report {
  id: number
  user_email: string
  image_path: string
  location: string
  latitude: number | null
  longitude: number | null
  pothole_count: number
  severity_score: number
  threat_level: string
  status: string
  avg_confidence: number
  timestamp: string
}

interface Stats {
  threat_counts: Record<string, number>
  status_counts: Record<string, number>
  avg_severity: number
  total_reports: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('timestamp')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<Report[]>([])
  const [galleryLoading, setGalleryLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('roadintel_user')
    if (!userData) {
      router.push('/auth')
    } else {
      setUser(JSON.parse(userData))
      fetchData()
    }
  }, [router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [reportsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/all-reports`),
        fetch(`${API_BASE}/stats`),
      ])

      const reportsData = await reportsRes.json()
      const statsData = await statsRes.json()

      if (reportsRes.ok) {
        setReports(reportsData.reports || [])
      }
      if (statsRes.ok) {
        setStats(statsData)
      }
    } catch (err) {
      setError('Failed to load data. Make sure backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadLocationImages = async (location: string) => {
    setSelectedLocation(location)
    setGalleryLoading(true)

    try {
      const response = await fetch(`${API_BASE}/reports-by-location/${encodeURIComponent(location)}`)
      const data = await response.json()

      if (response.ok) {
        setGalleryImages(data.reports || [])
      } else {
        setError(data.error || 'Failed to load images')
      }
    } catch (err) {
      setError('Failed to load images')
      console.error(err)
    } finally {
      setGalleryLoading(false)
    }
  }

  const handleUpdateStatus = async (reportId: number, newStatus: string) => {
    try {
      const response = await fetch(`${API_BASE}/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r))
        fetchData() // Refresh stats
      }
    } catch (err) {
      setError('Failed to update status')
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('roadintel_user')
    localStorage.removeItem('roadintel_role')
    router.push('/')
  }

  const getFilteredReports = () => {
    let filtered = reports

    if (locationFilter) {
      filtered = filtered.filter(r => r.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      } else if (sortBy === 'location') {
        return a.location.localeCompare(b.location)
      } else if (sortBy === 'severity') {
        return b.severity_score - a.severity_score
      }
      return 0
    })

    return filtered
  }

  const filteredReports = getFilteredReports()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Logged in as: {user.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-600 text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {error && (
          <Alert className="bg-red-500/10 border-red-500 mb-6">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500">{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700 mb-6">
              <TabsTrigger value="overview" className="text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-white">
                Reports
              </TabsTrigger>
              <TabsTrigger value="map" className="text-white">
                <Map className="w-4 h-4 mr-2" />
                Map
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
                  <div className="text-sm text-slate-400 mb-2">Total Reports</div>
                  <div className="text-3xl font-bold text-white">{stats?.total_reports || 0}</div>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
                  <div className="text-sm text-slate-400 mb-2">Avg Severity</div>
                  <div className="text-3xl font-bold text-white">{stats?.avg_severity ? stats.avg_severity.toFixed(1) : "0.0"}</div>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
                  <div className="text-sm text-slate-400 mb-2">Pending</div>
                  <div className="text-3xl font-bold text-yellow-500">{stats?.status_counts?.pending || 0}</div>
                </Card>

                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
                  <div className="text-sm text-slate-400 mb-2">Resolved</div>
                  <div className="text-3xl font-bold text-green-500">{stats?.status_counts?.resolved || 0}</div>
                </Card>
              </div>

              {/* Severity Chart */}
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Severity Distribution</h2>
                {stats && <SeverityChart data={stats.threat_counts} />}
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              {/* Filters */}
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Filters & Sorting</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Location</label>
                    <Input
                      type="text"
                      placeholder="Search location..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="timestamp">Time (Latest)</SelectItem>
                        <SelectItem value="location">Location (A-Z)</SelectItem>
                        <SelectItem value="severity">Severity (Highest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Reports Table */}
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Reports ({filteredReports.length})
                </h3>
                <ReportTable
                  reports={filteredReports}
                  onStatusChange={handleUpdateStatus}
                  onLocationClick={handleLoadLocationImages}
                />
              </Card>
            </TabsContent>

            {/* Map Tab */}
            <TabsContent value="map" className="space-y-6">
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Pothole Locations</h2>
                <LocationMap reports={reports} />
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Image Gallery Modal */}
        {selectedLocation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl border-slate-700 bg-slate-800/95 backdrop-blur max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-slate-800/95 border-b border-slate-700 p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Images: {selectedLocation}</h2>
                <Button
                  onClick={() => setSelectedLocation(null)}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6">
                {galleryLoading ? (
                  <div className="flex justify-center py-12">
                    <Spinner />
                  </div>
                ) : (
                  <ImageGallery images={galleryImages} />
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
