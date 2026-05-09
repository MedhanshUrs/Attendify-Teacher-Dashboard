'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const historyData = [
  {
    date: '2024-03-15',
    sessions: [
      { id: '1', course: 'Machine Learning', code: 'CS401', room: 'Room 301', time: '09:00 - 10:30', present: 42, absent: 3, late: 2, total: 47 },
      { id: '2', course: 'Data Structures', code: 'CS402', room: 'Room 205', time: '11:00 - 12:30', present: 38, absent: 5, late: 2, total: 45 },
    ],
  },
  {
    date: '2024-03-14',
    sessions: [
      { id: '3', course: 'Machine Learning', code: 'CS401', room: 'Room 301', time: '09:00 - 10:30', present: 44, absent: 2, late: 1, total: 47 },
      { id: '4', course: 'Database Systems', code: 'CS404', room: 'Room 401', time: '14:00 - 15:30', present: 46, absent: 3, late: 1, total: 50 },
      { id: '5', course: 'Artificial Intelligence', code: 'CS403', room: 'Lab 102', time: '16:00 - 17:30', present: 13, absent: 1, late: 1, total: 15 },
    ],
  },
  {
    date: '2024-03-13',
    sessions: [
      { id: '6', course: 'Data Structures', code: 'CS402', room: 'Room 205', time: '09:00 - 10:30', present: 40, absent: 4, late: 1, total: 45 },
      { id: '7', course: 'Computer Networks', code: 'CS405', room: 'Room 302', time: '11:00 - 12:30', present: 35, absent: 3, late: 2, total: 40 },
    ],
  },
]

export function HistoryView() {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today'
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday'
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Attendance History</h2>
          <p className="text-sm text-muted-foreground">
            View and export past attendance records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Sessions (Week)</p>
            <p className="text-2xl font-bold text-foreground">24</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg. Attendance Rate</p>
            <p className="text-2xl font-bold text-primary">91.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Present</p>
            <p className="text-2xl font-bold text-foreground">1,847</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Absent</p>
            <p className="text-2xl font-bold text-destructive">156</p>
          </CardContent>
        </Card>
      </div>

      {/* History Timeline */}
      <div className="space-y-6">
        {historyData.map((day) => (
          <div key={day.date}>
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              {formatDate(day.date)}
            </h3>
            <div className="space-y-3">
              {day.sessions.map((session) => {
                const attendanceRate = Math.round((session.present / session.total) * 100)
                return (
                  <Card key={session.id} className="hover:border-primary/30 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{session.course}</h4>
                            <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                              {session.code}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {session.room} • {session.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              <span className="text-foreground">{session.present}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-warning" />
                              <span className="text-foreground">{session.late}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <XCircle className="h-4 w-4 text-destructive" />
                              <span className="text-foreground">{session.absent}</span>
                            </div>
                          </div>
                          <div className="w-24">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Attendance</span>
                              <span className={cn(
                                'font-medium',
                                attendanceRate >= 90 ? 'text-primary' : 
                                attendanceRate >= 75 ? 'text-warning' : 'text-destructive'
                              )}>
                                {attendanceRate}%
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  attendanceRate >= 90 ? 'bg-primary' : 
                                  attendanceRate >= 75 ? 'bg-warning' : 'bg-destructive'
                                )}
                                style={{ width: `${attendanceRate}%` }}
                              />
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
