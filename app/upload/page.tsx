'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, CheckCircle, MapPin, ImagePlus, LogOut } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface DetectionResult {
  report_id: number
  pothole_count: number
  severity_score: number
  threat_level: string
  avg_confidence: number
  location: string
  latitude: number | null
  longitude: number | null
  status: string
}

export default function UploadPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [location, setLocation] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('roadintel_user')
    if (!userData) {
      router.push('/auth')
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleGetGPS = () => {
    setGpsLoading(true)
    setError('')

    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser')
      setGpsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setGpsLoading(false)
        setSuccess('GPS coordinates captured')
      },
      () => {
        setError('Unable to get GPS location. Please enable location services.')
        setGpsLoading(false)
      }
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!image || !location || !user) {
      setError('Please select an image and enter a location')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('email', user.email)
      formData.append('location', location)
      if (latitude !== null) formData.append('latitude', latitude.toString())
      if (longitude !== null) formData.append('longitude', longitude.toString())

      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setSuccess('Detection completed successfully!')
        setImage(null)
        setPreview('')
        setLocation('')
      } else {
        setError(data.error || 'Detection failed')
      }
    } catch (err) {
      setError('Connection error. Make sure backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('roadintel_user')
    localStorage.removeItem('roadintel_role')
    router.push('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Report Pothole</h1>
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

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upload Form */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Upload Image</h2>

              {error && (
                <Alert className="bg-red-500/10 border-red-500 mb-4">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-500">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-500/10 border-green-500 mb-4">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-500">{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleUpload} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Select Image
                  </label>
                  <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors">
                    <div className="text-center">
                      <ImagePlus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        {image ? image.name : 'Click to upload image'}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Location Input */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Location Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Main Street, Downtown Area"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    required
                  />
                </div>

                {/* GPS Coordinates */}
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      GPS Coordinates
                    </label>
                    <Button
                      type="button"
                      onClick={handleGetGPS}
                      disabled={gpsLoading}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {gpsLoading ? 'Getting GPS...' : 'Get GPS'}
                    </Button>
                  </div>

                  {latitude !== null && longitude !== null && (
                    <div className="space-y-2 text-sm">
                      <p className="text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Latitude: {latitude.toFixed(6)}
                      </p>
                      <p className="text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Longitude: {longitude.toFixed(6)}
                      </p>
                    </div>
                  )}

                  {latitude === null && (
                    <p className="text-slate-400 text-sm">Click &quot;Get GPS&quot; to capture coordinates</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !image}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    'Upload & Detect'
                  )}
                </Button>
              </form>
            </div>
          </Card>

          {/* Preview & Results */}
          <div className="space-y-6">
            {/* Image Preview */}
            {preview && (
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur overflow-hidden">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-white mb-3">Preview</h3>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </Card>
            )}

            {/* Results */}
            {result && (
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Detection Results</h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-slate-300">Status:</span>
                      <Badge className="bg-yellow-500 text-white capitalize">
                        {result.status}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-start">
                      <span className="text-slate-300">Threat Level:</span>
                      <Badge className={`${getThreatColor(result.threat_level)} text-white`}>
                        {result.threat_level}
                      </Badge>
                    </div>

                    <div className="pt-3 border-t border-slate-600 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Potholes Found:</span>
                        <span className="text-white font-semibold">{result.pothole_count}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Severity Score:</span>
                        <span className="text-white font-semibold">{result.severity_score.toFixed(1)}/100</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="text-white font-semibold">{(result.avg_confidence * 100).toFixed(1)}%</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span className="text-white font-semibold text-right">{result.location}</span>
                      </div>

                      {result.latitude !== null && result.longitude !== null && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Coordinates:</span>
                          <span className="text-white">
                            {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-600">
                      <p className="text-xs text-slate-400">
                        Report ID: {result.report_id}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
