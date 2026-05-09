'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from './stats-card'
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Calendar,
  Video,
  AlertCircle,
} from 'lucide-react'
import {
  mockSessions,
  mockStudents,
  weeklyAttendanceData,
  courseAttendanceData,
} from '@/lib/mock-data'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export function DashboardOverview() {
  const todayStats = {
    totalStudents: 185,
    presentToday: 168,
    absentToday: 12,
    lateToday: 5,
    attendanceRate: 90.8,
    activeSessions: 1,
    completedSessions: 2,
  }

  const pieData = [
    { name: 'Present', value: todayStats.presentToday, color: 'var(--primary)' },
    { name: 'Late', value: todayStats.lateToday, color: 'var(--warning)' },
    { name: 'Absent', value: todayStats.absentToday, color: 'var(--destructive)' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={todayStats.totalStudents}
          subtitle="Across all courses"
          icon={Users}
          variant="default"
        />
        <StatsCard
          title="Present Today"
          value={todayStats.presentToday}
          subtitle={`${todayStats.attendanceRate}% attendance rate`}
          icon={CheckCircle2}
          variant="success"
          trend={{ value: 2.5, isPositive: true }}
        />
        <StatsCard
          title="Late Arrivals"
          value={todayStats.lateToday}
          subtitle="After 10 min threshold"
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Absent Today"
          value={todayStats.absentToday}
          subtitle="Notifications sent"
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Weekly Attendance Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Weekly Attendance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyAttendanceData}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                  }}
                />
                <Bar dataKey="present" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="var(--warning)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="var(--destructive)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Today's Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{"Today's Distribution"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions & Activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Today's Sessions */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" />
              {"Today's Sessions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{session.courseName}</h4>
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        {session.courseCode}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.classroom} • {session.startTime}
                      {session.endTime && ` - ${session.endTime}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        session.status === 'active'
                          ? 'bg-primary/10 text-primary'
                          : session.status === 'completed'
                          ? 'bg-secondary text-muted-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {session.status === 'active' && (
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      )}
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </div>
                    {session.status !== 'scheduled' && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {session.presentCount}/{session.totalStudents} present
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-warning" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm font-medium text-foreground">Vikram Singh - Absent</p>
                <p className="text-xs text-muted-foreground">CS403 - 3rd consecutive absence</p>
                <p className="mt-1 text-xs text-destructive">2 min ago</p>
              </div>
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <p className="text-sm font-medium text-foreground">Rahul Kumar - Late</p>
                <p className="text-xs text-muted-foreground">CS403 - Arrived 15 min late</p>
                <p className="mt-1 text-xs text-warning">5 min ago</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-3">
                <p className="text-sm font-medium text-foreground">Camera CAM-02 Reconnected</p>
                <p className="text-xs text-muted-foreground">Lab 102 - Rear View</p>
                <p className="mt-1 text-xs text-muted-foreground">12 min ago</p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <p className="text-sm font-medium text-foreground">Session CS401 Completed</p>
                <p className="text-xs text-muted-foreground">42/47 students present</p>
                <p className="mt-1 text-xs text-primary">1 hour ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
