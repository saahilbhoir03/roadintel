'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Report {
  id: number
  location: string
  pothole_count: number
  severity_score: number
  threat_level: string
  status: string
  timestamp: string
  image_path: string
}

interface ImageGalleryProps {
  images: Report[]
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

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No images found for this location</p>
      </div>
    )
  }

  const currentImage = images[selectedIndex]

  return (
    <>
      <div className="space-y-6">
        {/* Main Display */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div
              onClick={() => setShowLightbox(true)}
              className="relative bg-slate-700 rounded-lg overflow-hidden cursor-pointer aspect-square flex items-center justify-center"
            >
              <img
                src={currentImage.image_path}
                alt={currentImage.location}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="20"%3EImage not available%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Report Details</h3>
              <div className="space-y-3 bg-slate-700/50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="text-slate-400">Status:</span>
                  <Badge className={`${currentImage.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                    {currentImage.status}
                  </Badge>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-slate-400">Threat Level:</span>
                  <Badge className={`${getThreatColor(currentImage.threat_level)} text-white`}>
                    {currentImage.threat_level}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Potholes Found:</span>
                  <span className="text-white font-semibold">{currentImage.pothole_count}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Severity Score:</span>
                  <span className="text-white font-semibold">{currentImage.severity_score.toFixed(1)}/100</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Recorded:</span>
                  <span className="text-white text-sm">{formatDate(currentImage.timestamp)}</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-sm text-slate-400 mb-2">
                Image {selectedIndex + 1} of {images.length}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                  disabled={selectedIndex === 0}
                  size="sm"
                  className="bg-slate-600 hover:bg-slate-500 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex-1 flex gap-1">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedIndex(idx)}
                      className={`flex-1 h-2 rounded-full transition-colors ${
                        idx === selectedIndex ? 'bg-blue-500' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={() => setSelectedIndex(Math.min(images.length - 1, selectedIndex + 1))}
                  disabled={selectedIndex === images.length - 1}
                  size="sm"
                  className="bg-slate-600 hover:bg-slate-500 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="border-t border-slate-700 pt-6">
          <h4 className="text-sm font-medium text-white mb-3">Thumbnails</h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded border-2 transition-colors overflow-hidden ${
                  idx === selectedIndex ? 'border-blue-500' : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <img
                  src={img.image_path}
                  alt={`Thumbnail ${idx}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <img
              src={currentImage.image_path}
              alt={currentImage.location}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="20"%3EImage not available%3C/text%3E%3C/svg%3E'
              }}
            />
            <Button
              onClick={() => setShowLightbox(false)}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
