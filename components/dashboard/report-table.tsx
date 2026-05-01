'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Report {
  id: number
  location: string
  threat_level: string
  pothole_count: number
  severity_score: number
  status: string
  timestamp: string
}

interface ReportTableProps {
  reports: Report[]
  onStatusChange: (id: number, status: string) => void
  onLocationClick: (location: string) => void
}

const getThreatColor = (level: string) => {
  switch (level) {
    case 'Safe':
      return 'bg-green-500'
    case 'Low Risk':
      return 'bg-yellow-500'
    case 'Moderate Risk':
      return 'bg-orange-500'
    case 'High Risk':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ReportTable({ reports, onStatusChange, onLocationClick }: ReportTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700">
            <TableHead className="text-white">Location</TableHead>
            <TableHead className="text-white">Potholes</TableHead>
            <TableHead className="text-white">Severity</TableHead>
            <TableHead className="text-white">Threat</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Time</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow className="border-slate-700">
              <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                No reports found
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id} className="border-slate-700 hover:bg-slate-700/50">
                <TableCell className="text-white font-medium">
                  <button
                    onClick={() => onLocationClick(report.location)}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {report.location}
                  </button>
                </TableCell>
                <TableCell className="text-white">{report.pothole_count}</TableCell>
                <TableCell className="text-white">{report.severity_score.toFixed(1)}</TableCell>
                <TableCell>
                  <Badge className={`${getThreatColor(report.threat_level)} text-white text-xs`}>
                    {report.threat_level}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      report.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                    } text-white text-xs capitalize`}
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-white text-sm">{formatDate(report.timestamp)}</TableCell>
                <TableCell className="text-right">
                  {report.status === 'pending' ? (
                    <Button
                      onClick={() => onStatusChange(report.id, 'resolved')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      Mark Resolved
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onStatusChange(report.id, 'pending')}
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                    >
                      Reopen
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
