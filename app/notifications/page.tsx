'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'

interface Notification {
  id: string
  title: string
  message: string
  type: 'patient' | 'appointment' | 'admission'
  read: boolean
  created_at: string
  link: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  async function fetchNotifications() {
    try {
      const response = await fetch('/api/notifications')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Link
            key={notification.id}
            href={notification.link || '#'}
            className="block"
          >
            <div className={`p-4 rounded-lg border ${
              notification.read ? 'bg-background' : 'bg-muted'
            }`}>
              <div className="space-y-2">
                <h4 className="text-lg font-medium">{notification.title}</h4>
                <p className="text-muted-foreground">{notification.message}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(notification.created_at), 'PPp')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 