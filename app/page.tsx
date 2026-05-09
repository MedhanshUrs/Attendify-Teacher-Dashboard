'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { LiveSession } from '@/components/dashboard/live-session'
import { StudentsList } from '@/components/dashboard/students-list'
import { CamerasView } from '@/components/dashboard/cameras-view'
import { HistoryView } from '@/components/dashboard/history-view'
import { AnalyticsView } from '@/components/dashboard/analytics-view'

const pageConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Welcome back, Dr. Rajesh Kumar',
  },
  session: {
    title: 'Live Session',
    subtitle: 'Real-time attendance monitoring',
  },
  students: {
    title: 'Students',
    subtitle: 'Manage enrolled students',
  },
  cameras: {
    title: 'Cameras',
    subtitle: 'Classroom camera management',
  },
  history: {
    title: 'Attendance History',
    subtitle: 'Past session records',
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Attendance insights and trends',
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'System alerts and messages',
  },
  settings: {
    title: 'Settings',
    subtitle: 'System configuration',
  },
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const currentPage = pageConfig[activeTab] || pageConfig.dashboard

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />
      case 'session':
        return <LiveSession />
      case 'students':
        return <StudentsList />
      case 'cameras':
        return <CamerasView />
      case 'history':
        return <HistoryView />
      case 'analytics':
        return <AnalyticsView />
      case 'notifications':
        return (
          <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">Notifications coming soon</p>
          </div>
        )
      case 'settings':
        return (
          <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground">Settings coming soon</p>
          </div>
        )
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="ml-64">
        <Header title={currentPage.title} subtitle={currentPage.subtitle} />
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
