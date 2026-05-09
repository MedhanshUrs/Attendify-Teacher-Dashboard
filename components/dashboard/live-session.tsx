'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Play,
  Square,
  Video,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Bell,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockStudents, mockCameras, type Student } from '@/lib/mock-data'
import {
  endAttendanceSession,
  fetchCurrentSession,
  createQrSession,
  getQrImageDataUrl,
  startAttendanceSession,
  WebSocketService,
} from '@/lib/api'

type SessionStatus = 'idle' | 'starting' | 'active' | 'ending' | 'completed'

export function LiveSession() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('idle')
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [detectionProgress, setDetectionProgress] = useState(0)
  const [qrVerifyUrl, setQrVerifyUrl] = useState<string | null>(null)
  const [qrExpiresAt, setQrExpiresAt] = useState<string | null>(null)
  const [qrImageDataUrl, setQrImageDataUrl] = useState<string | null>(null)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (sessionStatus === 'active') {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [sessionStatus])

  // Simulated student detection effect (demo mode)
  useEffect(() => {
    let detectionInterval: NodeJS.Timeout
    if (sessionStatus === 'active') {
      detectionInterval = setInterval(() => {
        setStudents((prev) => {
          const pendingStudents = prev.filter((s) => s.status === 'pending')
          if (pendingStudents.length === 0) {
            clearInterval(detectionInterval)
            return prev
          }
          
          // Randomly pick a pending student to detect
          const randomIndex = Math.floor(Math.random() * pendingStudents.length)
          const studentToDetect = pendingStudents[randomIndex]
          
          // Determine if they're on time, late, or will remain pending (eventually absent)
          const random = Math.random()
          const newStatus: 'present' | 'late' | 'pending' = 
            random < 0.7 ? 'present' : random < 0.85 ? 'late' : 'pending'
          
          if (newStatus === 'pending') return prev // Skip this round
          
          const now = new Date()
          const detectedAt = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
          const confidence = 95 + Math.random() * 4.9 // 95-99.9%
          
          return prev.map((s) =>
            s.id === studentToDetect.id
              ? { ...s, status: newStatus, detectedAt, confidence }
              : s
          )
        })
      }, 2000) // Detect a student every 2 seconds
    }
    return () => clearInterval(detectionInterval)
  }, [sessionStatus])

  // WebSocket Integration
  useEffect(() => {
    const wsService = new WebSocketService('teacher', 'teacher')
    wsService.connect()

    const removeListener = wsService.addMessageListener((msg) => {
      if (msg.type === 'student_detected') {
        const { student_id, status, detected_at, confidence } = msg.data
        setStudents((prev) => 
          prev.map((s) => 
            s.id === student_id 
              ? { ...s, status, detectedAt: detected_at, confidence }
              : s
          )
        )
      } else if (msg.type === 'session_started') {
        setSessionStatus('active')
      } else if (msg.type === 'session_ended') {
        setStudents((prev) =>
          prev.map((s) => (s.status === 'pending' ? { ...s, status: 'absent' } : s))
        )
        setSessionStatus('completed')
      }
    })

    return () => {
      removeListener()
      wsService.disconnect()
    }
  }, [])

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetchCurrentSession()
        if (response?.current_session?.is_live) {
          setSessionStatus('active')
        }
      } catch {
        // Silently handle - mock fallback is already in place
      }
    }
    loadSession()
  }, [])

  // Update progress
  useEffect(() => {
    const present = students.filter((s) => s.status === 'present' || s.status === 'late').length
    setDetectionProgress((present / students.length) * 100)
  }, [students])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startSession = async () => {
    setSessionStatus('starting')
    setElapsedTime(0)
    setStudents(mockStudents.map((s) => ({ ...s, status: 'pending', detectedAt: undefined, confidence: undefined })))

    // Attempt backend call but don't block on it
    startAttendanceSession({
      subject: 'Artificial Intelligence',
      code: 'CS403',
      room: 'Lab 102',
      professor: 'Dr. Rajesh Kumar',
      start_time: '14:00 PM',
      end_time: '15:30 PM',
      total_strength: students.length,
    }).catch((error) => {
      console.error('Backend session start failed (continuing with mock):', error)
    })

    // Immediately transition to active state after brief loading
    setTimeout(() => {
      setSessionStatus('active')
    }, 800)
  }

  const endSession = async () => {
    setSessionStatus('ending')
    
    // Attempt backend call but don't block on it
    endAttendanceSession().catch((error) => {
      console.error('Backend session end failed (continuing with mock):', error)
    })

    // Mark remaining pending students as absent and complete session
    setTimeout(() => {
      setStudents((prev) =>
        prev.map((s) => (s.status === 'pending' ? { ...s, status: 'absent' } : s))
      )
      setQrVerifyUrl(null)
      setQrExpiresAt(null)
      setQrImageDataUrl(null)
      setSessionStatus('completed')
    }, 600)
  }

  const generateFallbackQr = async () => {
    try {
      const payload = await createQrSession()
      setQrVerifyUrl(payload.verify_url)
      setQrExpiresAt(payload.expires_at)
      const dataUrl = await getQrImageDataUrl(payload.verify_url)
      setQrImageDataUrl(dataUrl)
    } catch (error) {
      console.error('Unable to generate QR session', error)
    }
  }

  const resetSession = () => {
    setSessionStatus('idle')
    setElapsedTime(0)
    setStudents(mockStudents)
    setDetectionProgress(0)
  }

  const presentCount = students.filter((s) => s.status === 'present').length
  const lateCount = students.filter((s) => s.status === 'late').length
  const absentCount = students.filter((s) => s.status === 'absent').length
  const pendingCount = students.filter((s) => s.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Session Control */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Attendance Session
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                CS403 - Artificial Intelligence | Lab 102
              </p>
            </div>
            <div className="flex items-center gap-3">
              {sessionStatus === 'idle' && (
                <Button onClick={startSession} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Session
                </Button>
              )}
              {sessionStatus === 'starting' && (
                <Button disabled className="gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Initializing...
                </Button>
              )}
              {sessionStatus === 'active' && (
                <Button onClick={endSession} variant="destructive" className="gap-2">
                  <Square className="h-4 w-4" />
                  End Session
                </Button>
              )}
              {sessionStatus === 'ending' && (
                <Button disabled variant="destructive" className="gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Finalizing...
                </Button>
              )}
              {sessionStatus === 'completed' && (
                <Button onClick={resetSession} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  New Session
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Bar */}
          <div className="mb-6 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'h-2.5 w-2.5 rounded-full',
                  sessionStatus === 'active' ? 'animate-pulse bg-primary' : 
                  sessionStatus === 'completed' ? 'bg-primary' : 'bg-muted'
                )}
              />
              <span className="text-sm font-medium capitalize text-foreground">
                {sessionStatus === 'idle' ? 'Ready' : sessionStatus}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">{students.length} Students Enrolled</span>
            </div>
          </div>

          {/* Progress */}
          {sessionStatus !== 'idle' && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Detection Progress</span>
                <span className="font-medium text-foreground">{Math.round(detectionProgress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${detectionProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">{presentCount}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Present</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="text-2xl font-bold text-foreground">{lateCount}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Late</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-2xl font-bold text-foreground">{absentCount}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Absent</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className={cn('h-4 w-4 text-muted-foreground', sessionStatus === 'active' && 'animate-spin')} />
                <span className="text-2xl font-bold text-foreground">{pendingCount}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera Feeds & Student List */}
      <div className="grid grid-cols-3 gap-6">
        {/* Camera Feeds */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Camera Feeds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCameras.map((camera) => (
              <div
                key={camera.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="relative flex h-12 w-16 items-center justify-center rounded bg-background">
                  <Video className="h-5 w-5 text-muted-foreground" />
                  {camera.status === 'processing' && sessionStatus === 'active' && (
                    <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{camera.name}</p>
                  <p className="text-xs text-muted-foreground">{camera.location}</p>
                </div>
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    camera.status === 'online' || camera.status === 'processing'
                      ? 'bg-primary'
                      : 'bg-destructive'
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Real-time Student Detection */}
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Real-time Detection</CardTitle>
              {sessionStatus === 'active' && (
                <span className="flex items-center gap-1.5 text-xs text-primary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  Live
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 space-y-2 overflow-y-auto pr-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 transition-all',
                    student.status === 'present' && 'border-primary/30 bg-primary/5',
                    student.status === 'late' && 'border-warning/30 bg-warning/5',
                    student.status === 'absent' && 'border-destructive/30 bg-destructive/5',
                    student.status === 'pending' && 'border-border bg-secondary/30'
                  )}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-medium text-secondary-foreground">
                    {student.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      {student.status === 'present' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      {student.status === 'late' && <AlertCircle className="h-4 w-4 text-warning" />}
                      {student.status === 'absent' && <XCircle className="h-4 w-4 text-destructive" />}
                      {student.status === 'pending' && (
                        <Loader2 className={cn('h-4 w-4 text-muted-foreground', sessionStatus === 'active' && 'animate-spin')} />
                      )}
                      <span
                        className={cn(
                          'text-xs font-medium capitalize',
                          student.status === 'present' && 'text-primary',
                          student.status === 'late' && 'text-warning',
                          student.status === 'absent' && 'text-destructive',
                          student.status === 'pending' && 'text-muted-foreground'
                        )}
                      >
                        {student.status}
                      </span>
                    </div>
                    {student.detectedAt && (
                      <p className="text-xs text-muted-foreground">
                        {student.detectedAt} • {student.confidence?.toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Summary (when completed) */}
      {sessionStatus === 'completed' && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              Session Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{students.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-primary">{presentCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Late Arrivals</p>
                <p className="text-2xl font-bold text-warning">{lateCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-destructive">{absentCount}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Button className="gap-2">
                <Bell className="h-4 w-4" />
                Notify Absentees
              </Button>
              <Button variant="outline">Download Report</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sessionStatus === 'active' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>QR Fallback Verification</span>
              <Button variant="outline" onClick={generateFallbackQr}>
                Generate Dynamic QR
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {qrVerifyUrl ? (
              <div className="flex items-center gap-6">
                {qrImageDataUrl && (
                  <img
                    src={qrImageDataUrl}
                    alt="QR verify link"
                    className="h-44 w-44 rounded-lg border border-border bg-white p-2"
                  />
                )}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Students can scan to open the verify page and submit selfie verification.</p>
                  <p className="text-foreground break-all">{qrVerifyUrl}</p>
                  {qrExpiresAt && <p>Expires at: {new Date(qrExpiresAt).toLocaleTimeString()}</p>}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Generate a QR code for browser-based fallback verification.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
