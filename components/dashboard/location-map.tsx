'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'

interface Report {
  id: number
  location: string
  latitude: number | null
  longitude: number | null
  threat_level: string
  pothole_count: number
}

interface LocationMapProps {
  reports: Report[]
}

const getThreatColor = (level: string): string => {
  switch (level) {
    case 'Safe':
      return '#10b981'
    case 'Low Risk':
      return '#eab308'
    case 'Moderate Risk':
      return '#f97316'
    case 'High Risk':
      return '#ef4444'
    default:
      return '#6b7280'
  }
}

// Dynamic import to avoid SSR issues with leaflet
const MapContent = dynamic(() => import('./map-content'), { ssr: false })

export default function LocationMap({ reports }: LocationMapProps) {
  const validReports = reports.filter(r => r.latitude !== null && r.longitude !== null)

  const mapCenter = useMemo(() => {
    if (validReports.length === 0) return [40.7128, -74.0060] // Default to NYC
    
    const avgLat = validReports.reduce((sum, r) => sum + (r.latitude || 0), 0) / validReports.length
    const avgLng = validReports.reduce((sum, r) => sum + (r.longitude || 0), 0) / validReports.length
    return [avgLat, avgLng]
  }, [validReports])

  if (validReports.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-700 rounded-lg flex items-center justify-center">
        <p className="text-slate-300">No location data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-slate-600">
      <MapContent reports={validReports} center={mapCenter} getThreatColor={getThreatColor} />
    </div>
  )
}
