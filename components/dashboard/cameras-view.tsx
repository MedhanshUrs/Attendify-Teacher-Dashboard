'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Video,
  Settings,
  RefreshCw,
  Maximize2,
  Power,
  Wifi,
  WifiOff,
  Cpu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockCameras } from '@/lib/mock-data'

export function CamerasView() {
  const cameraStats = {
    total: mockCameras.length,
    online: mockCameras.filter((c) => c.status === 'online' || c.status === 'processing').length,
    offline: mockCameras.filter((c) => c.status === 'offline').length,
    processing: mockCameras.filter((c) => c.status === 'processing').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Camera Management</h2>
          <p className="text-sm text-muted-foreground">
            Monitor and configure classroom cameras
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </Button>
          <Button className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Video className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{cameraStats.total}</p>
              <p className="text-xs text-muted-foreground">Total Cameras</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Wifi className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{cameraStats.online}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <WifiOff className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{cameraStats.offline}</p>
              <p className="text-xs text-muted-foreground">Offline</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{cameraStats.processing}</p>
              <p className="text-xs text-muted-foreground">Processing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-2 gap-6">
        {mockCameras.map((camera) => (
          <Card key={camera.id} className="overflow-hidden">
            <div className="relative aspect-video bg-background">
              {/* Simulated camera feed */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Video className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {camera.status === 'processing' ? 'AI Processing Active' : 'Camera Feed'}
                  </p>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Status Badge */}
              <div className="absolute left-4 top-4">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                    camera.status === 'online' && 'bg-primary/20 text-primary',
                    camera.status === 'processing' && 'bg-primary/20 text-primary',
                    camera.status === 'offline' && 'bg-destructive/20 text-destructive'
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      camera.status === 'online' && 'bg-primary',
                      camera.status === 'processing' && 'animate-pulse bg-primary',
                      camera.status === 'offline' && 'bg-destructive'
                    )}
                  />
                  {camera.status === 'processing' ? 'Processing' : camera.status}
                </span>
              </div>

              {/* Actions */}
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Camera Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-medium text-white">{camera.name}</h3>
                <p className="text-sm text-white/70">{camera.location}</p>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>1080p</span>
                  <span>30 FPS</span>
                  <span>Lab 102</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Power className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Processing Info */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Cpu className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">AI Face Recognition Active</h3>
            <p className="text-sm text-muted-foreground">
              Processing video feeds in real-time for automatic student detection and attendance marking
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">98.5%</p>
            <p className="text-xs text-muted-foreground">Accuracy Rate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
