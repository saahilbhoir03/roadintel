'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Report {
  id: number
  location: string
  latitude: number | null
  longitude: number | null
  threat_level: string
  pothole_count: number
}

interface MapContentProps {
  reports: Report[]
  center: number[]
  getThreatColor: (level: string) => string
}

export default function MapContent({ reports, center, getThreatColor }: MapContentProps) {
  const mapCenter = [center[0], center[1]] as LatLngExpression

  return (
    <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {reports.map((report) => {
        if (!report.latitude || !report.longitude) return null
        const markerPosition = [report.latitude, report.longitude] as LatLngExpression
        
        return (
          <CircleMarker
            key={report.id}
            center={markerPosition}
            radius={8}
            pathOptions={{
              fillColor: getThreatColor(report.threat_level),
              color: getThreatColor(report.threat_level),
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.7,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{report.location}</p>
                <p className="text-xs text-slate-600">Potholes: {report.pothole_count}</p>
                <p className="text-xs text-slate-600">{report.threat_level}</p>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
