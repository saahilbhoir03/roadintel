'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Shield } from 'lucide-react'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('roadintel_user')
    if (user) {
      const userData = JSON.parse(user)
      setIsLoggedIn(true)
      setUserRole(userData.role)
    }
  }, [])

  const handleRoleSelect = (role: 'user' | 'admin') => {
    localStorage.setItem('roadintel_role', role)
    if (isLoggedIn) {
      router.push(role === 'admin' ? '/dashboard' : '/upload')
    } else {
      router.push('/auth')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('roadintel_user')
    localStorage.removeItem('roadintel_role')
    setIsLoggedIn(false)
    setUserRole(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-10 h-10 text-blue-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">RoadIntel</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Real-time pothole detection and monitoring system powered by AI
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* User Role Card */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur hover:bg-slate-800/70 transition-all cursor-pointer" onClick={() => handleRoleSelect('user')}>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Report Potholes</h2>
              <p className="text-slate-300 mb-6">
                Upload images and detect potholes in your area. Help keep roads safe.
              </p>
              <Button 
                onClick={() => handleRoleSelect('user')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue as User
              </Button>
            </div>
          </Card>

          {/* Admin Role Card */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur hover:bg-slate-800/70 transition-all cursor-pointer" onClick={() => handleRoleSelect('admin')}>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Monitor & Manage</h2>
              <p className="text-slate-300 mb-6">
                View reports, track repairs, and manage pothole data across locations.
              </p>
              <Button 
                onClick={() => handleRoleSelect('admin')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                Continue as Admin
              </Button>
            </div>
          </Card>
        </div>

        {/* Status Message */}
        {isLoggedIn && (
          <div className="text-center">
            <p className="text-slate-300 mb-4">
              Logged in as <span className="font-semibold text-white">{userRole}</span>
            </p>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Logout
            </Button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-4 text-center text-slate-300">
          <div>
            <div className="text-3xl font-bold text-blue-500 mb-2">AI-Powered</div>
            <p>Advanced detection using YOLOv8</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-500 mb-2">GPS Enabled</div>
            <p>Location tracking and mapping</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-500 mb-2">Real-Time</div>
            <p>Instant severity analysis</p>
          </div>
        </div>
      </div>
    </div>
  )
}
