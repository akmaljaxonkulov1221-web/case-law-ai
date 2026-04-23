'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Plus,
  Filter,
  Calendar,
  MessageSquare,
  Award,
  BookOpen,
  Users,
  Zap,
  TrendingUp,
  Eye,
  Archive,
  Trash2,
  Volume2,
  VolumeX
} from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder' | 'achievement' | 'social'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'high' | 'medium' | 'low'
  category: string
  action?: {
    text: string
    url: string
  }
  metadata?: {
    relatedId?: string
    relatedType?: string
    sender?: string
  }
}

interface NotificationSettings {
  email: boolean
  push: boolean
  inApp: boolean
  sound: boolean
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
  categories: {
    achievements: boolean
    reminders: boolean
    social: boolean
    system: boolean
    learning: boolean
  }
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'Yangi yutuq ochdingiz!',
      message: 'Tabriklaymiz! Siz "Mantiq ustasi" yutuqini ochdingiz. IRAC metodini mukammal o\'rgandingiz.',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      priority: 'high',
      category: 'achievements',
      action: {
        text: 'Yutuqni ko\'rish',
        url: '/achievements'
      }
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Kundalik o\'qish eslatmasi',
      message: 'Bugun 2 soat o\'qishingiz kerak. Siz hozircha 45 daqiqa o\'qib bo\'ldingiz.',
      timestamp: new Date(Date.now() - 600000),
      read: false,
      priority: 'medium',
      category: 'reminders'
    },
    {
      id: '3',
      type: 'social',
      title: 'Javob berildi',
      message: 'Dilnoza Azimova sizning "Shartnoma buzilishi" mavzuingizga javob berdi.',
      timestamp: new Date(Date.now() - 900000),
      read: true,
      priority: 'medium',
      category: 'social',
      metadata: {
        sender: 'Dilnoza Azimova',
        relatedId: 'forum-post-123',
        relatedType: 'forum'
      },
      action: {
        text: 'Javobni o\'qish',
        url: '/forum/post-123'
      }
    },
    {
      id: '4',
      type: 'info',
      title: 'Yangi kontent qo\'shildi',
      message: 'Intellektual mulk bo\'yicha 5 ta yangi video dars qo\'shildi.',
      timestamp: new Date(Date.now() - 1800000),
      read: true,
      priority: 'low',
      category: 'learning',
      action: {
        text: 'Kontentni ko\'rish',
        url: '/learning/intellectual-property'
      }
    },
    {
      id: '5',
      type: 'success',
      title: 'Test muvaffaqiyatli yakunlandi',
      message: 'Siz Shartnoma huquqi bo\'yicha testni 85% ball bilan yakunladingiz.',
      timestamp: new Date(Date.now() - 3600000),
      read: true,
      priority: 'medium',
      category: 'learning',
      action: {
        text: 'Natijalarni ko\'rish',
        url: '/test/results/123'
      }
    }
  ])

  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    inApp: true,
    sound: true,
    frequency: 'immediate',
    categories: {
      achievements: true,
      reminders: true,
      social: true,
      system: true,
      learning: true
    }
  })

  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showSettings, setShowSettings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const notificationTypes = [
    { value: 'all', label: 'Barchasi', icon: Bell, color: 'bg-gray-100 text-gray-700' },
    { value: 'achievement', label: 'Yutuqlar', icon: Award, color: 'bg-green-100 text-green-700' },
    { value: 'reminder', label: 'Eslatmalar', icon: Clock, color: 'bg-blue-100 text-blue-700' },
    { value: 'social', label: 'Ijtimoiy', icon: Users, color: 'bg-purple-100 text-purple-700' },
    { value: 'learning', label: 'O\'qish', icon: BookOpen, color: 'bg-orange-100 text-orange-700' },
    { value: 'system', label: 'Tizim', icon: Settings, color: 'bg-gray-100 text-gray-700' }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return Award
      case 'reminder': return Clock
      case 'social': return Users
      case 'learning': return BookOpen
      case 'success': return CheckCircle
      case 'warning': return AlertCircle
      case 'error': return AlertCircle
      case 'info': return Info
      default: return Bell
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-green-100 text-green-700 border-green-200'
      case 'reminder': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'social': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'learning': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'success': return 'bg-green-100 text-green-700 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'error': return 'bg-red-100 text-red-700 border-red-200'
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-red-500'
      case 'medium': return 'border-l-4 border-l-yellow-500'
      case 'low': return 'border-l-4 border-l-green-500'
      default: return 'border-l-4 border-l-gray-500'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffInMinutes < 1) return 'hozirgina'
    if (diffInMinutes < 60) return `${diffInMinutes} daqiqa oldin`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} soat oldin`
    return `${Math.floor(diffInMinutes / 1440)} kun oldin`
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId))
  }

  const archiveNotification = (notificationId: string) => {
    deleteNotification(notificationId)
  }

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings({ ...settings, ...newSettings })
  }

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true
    return notification.category === selectedFilter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Notification Header */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Notification System
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  Hammasini o\'qilgan deb belgilash
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {notificationTypes.map(type => {
              const Icon = type.icon
              return (
                <Button
                  key={type.value}
                  variant={selectedFilter === type.value ? 'default' : 'ghost'}
                  onClick={() => setSelectedFilter(type.value)}
                  className="border-b-2 border-transparent rounded-none"
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {type.label}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Delivery Methods */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Yetkazish usullari</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.email}
                    onChange={(e) => updateSettings({ email: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Email bildirishnomalari</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.push}
                    onChange={(e) => updateSettings({ push: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Push bildirishnomalari</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.inApp}
                    onChange={(e) => updateSettings({ inApp: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Ilova ichidagi bildirishnomalar</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.sound}
                    onChange={(e) => updateSettings({ sound: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Ovozli bildirishnomalar</span>
                </label>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tezlik</h4>
              <select
                value={settings.frequency}
                onChange={(e) => updateSettings({ frequency: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="immediate">Darhol</option>
                <option value="hourly">Soatda bir</option>
                <option value="daily">Kuniga bir</option>
                <option value="weekly">Haftada bir</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Kategoriyalar</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.categories.achievements}
                    onChange={(e) => updateSettings({
                      categories: { ...settings.categories, achievements: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Yutuqlar</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.categories.reminders}
                    onChange={(e) => updateSettings({
                      categories: { ...settings.categories, reminders: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Eslatmalar</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.categories.social}
                    onChange={(e) => updateSettings({
                      categories: { ...settings.categories, social: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Ijtimoiy</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.categories.system}
                    onChange={(e) => updateSettings({
                      categories: { ...settings.categories, system: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Tizim</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.categories.learning}
                    onChange={(e) => updateSettings({
                      categories: { ...settings.categories, learning: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">O\'qish</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => {
            const Icon = getTypeIcon(notification.type)
            return (
              <Card
                key={notification.id}
                className={`bg-white border-gray-200 rounded-xl shadow-sm ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'font-medium' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-2">{notification.message}</p>
                        
                        {notification.metadata?.sender && (
                          <div className="text-sm text-gray-500 mb-2">
                            From: {notification.metadata.sender}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(notification.timestamp)}
                          </div>
                          
                          {notification.action && (
                            <Button size="sm" variant="outline">
                              {notification.action.text}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => archiveNotification(notification.id)}
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirishnomalar yo\'q</h3>
              <p className="text-gray-600">Hozircha hech qanday bildirishnoma yo\'q</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notification Stats */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Bildirishnomalar statistikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <div className="text-sm text-gray-600">O\'qilmagan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
              <div className="text-sm text-gray-600">O\'qilgan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{notifications.filter(n => n.priority === 'high').length}</div>
              <div className="text-sm text-gray-600">Yuqori prioritet</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">24</div>
              <div className="text-sm text-gray-600">So\'nggi 24 soat</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
