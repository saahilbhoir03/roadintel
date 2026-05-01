'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle } from 'lucide-react'

// ✅ FIXED: Hardcoded backend
const API_BASE = "https://roadintel-backend.onrender.com"

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // 🔥 wake backend (important for Render)
      await fetch(`${API_BASE}/health`)

      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('roadintel_user', JSON.stringify({
          email: data.email,
          role: data.role
        }))

        setSuccess('Login successful! Redirecting...')

        setTimeout(() => {
          router.push(data.role === 'admin' ? '/dashboard' : '/upload')
        }, 1200)

      } else {
        setError(data.error || 'Login failed')
      }

    } catch (err) {
      setError('Backend waking up... try again in 20 seconds')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await fetch(`${API_BASE}/health`)

      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          role: 'user',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Account created! Redirecting...')

        setTimeout(() => {
          router.push('/upload')
        }, 1200)

      } else {
        setError(data.error || 'Signup failed')
      }

    } catch (err) {
      setError('Backend waking up... try again in 20 seconds')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/80 backdrop-blur">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">RoadIntel</h1>
          <p className="text-slate-400 text-center mb-6">Pothole Detection System</p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="login" className="text-white">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-white">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-6">
              {error && (
                <Alert className="bg-red-500/10 border-red-500">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-500">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-500/10 border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-500">{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Creating...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}