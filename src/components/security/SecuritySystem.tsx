'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Eye,
  EyeOff,
  UserCheck,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Activity,
  Globe,
  Server,
  Smartphone,
  Mail,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Ban,
  ShieldCheck,
  KeyRound,
  UserX,
  UserPlus,
  AlertCircle,
  Info,
  Zap,
  Database,
  Cloud,
  Wifi,
  WifiOff
} from 'lucide-react'

interface SecurityMetric {
  id: string
  name: string
  value: number
  status: 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  description: string
}

interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'permission_change' | 'suspicious_activity'
  user: string
  timestamp: Date
  ip: string
  location: string
  device: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  resolved: boolean
}

interface UserPermission {
  id: string
  userId: string
  userName: string
  role: 'admin' | 'teacher' | 'student' | 'premium' | 'guest'
  permissions: string[]
  lastActive: Date
  status: 'active' | 'suspended' | 'pending'
  twoFactorEnabled: boolean
  loginAttempts: number
}

interface SecuritySetting {
  id: string
  name: string
  description: string
  enabled: boolean
  category: 'authentication' | 'authorization' | 'encryption' | 'monitoring'
  priority: 'high' | 'medium' | 'low'
}

export default function SecuritySystem() {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([
    {
      id: '1',
      name: 'Overall Security Score',
      value: 92,
      status: 'good',
      trend: 'up',
      description: 'Platform security health indicator'
    },
    {
      id: '2',
      name: 'Authentication Success Rate',
      value: 98,
      status: 'good',
      trend: 'stable',
      description: 'Successful login attempts percentage'
    },
    {
      id: '3',
      name: 'Failed Login Attempts',
      value: 12,
      status: 'warning',
      trend: 'down',
      description: 'Failed login attempts in last 24 hours'
    },
    {
      id: '4',
      name: 'Active Sessions',
      value: 156,
      status: 'good',
      trend: 'up',
      description: 'Currently active user sessions'
    },
    {
      id: '5',
      name: 'Security Incidents',
      value: 3,
      status: 'warning',
      trend: 'down',
      description: 'Security incidents in last 7 days'
    },
    {
      id: '6',
      name: 'Encryption Coverage',
      value: 100,
      status: 'good',
      trend: 'stable',
      description: 'Data encryption coverage percentage'
    }
  ])

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'failed_login',
      user: 'admin@caselaw.ai',
      timestamp: new Date(Date.now() - 300000),
      ip: '192.168.1.100',
      location: 'Tashkent, Uzbekistan',
      device: 'Chrome / Windows',
      severity: 'medium',
      description: 'Multiple failed login attempts detected',
      resolved: false
    },
    {
      id: '2',
      type: 'login',
      user: 'sarvar.karimov',
      timestamp: new Date(Date.now() - 600000),
      ip: '192.168.1.101',
      location: 'Tashkent, Uzbekistan',
      device: 'Firefox / MacOS',
      severity: 'low',
      description: 'Successful login with 2FA',
      resolved: true
    },
    {
      id: '3',
      type: 'suspicious_activity',
      user: 'unknown',
      timestamp: new Date(Date.now() - 900000),
      ip: '192.168.1.200',
      location: 'Unknown',
      device: 'Unknown',
      severity: 'high',
      description: 'Suspicious access attempt from unknown IP',
      resolved: false
    },
    {
      id: '4',
      type: 'password_change',
      user: 'dilnoza.azimova',
      timestamp: new Date(Date.now() - 1800000),
      ip: '192.168.1.102',
      location: 'Samarkand, Uzbekistan',
      device: 'Safari / iPhone',
      severity: 'low',
      description: 'Password changed successfully',
      resolved: true
    }
  ])

  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([
    {
      id: '1',
      userId: '1',
      userName: 'admin@caselaw.ai',
      role: 'admin',
      permissions: ['all'],
      lastActive: new Date(Date.now() - 300000),
      status: 'active',
      twoFactorEnabled: true,
      loginAttempts: 0
    },
    {
      id: '2',
      userId: '2',
      userName: 'sarvar.karimov',
      role: 'student',
      permissions: ['read', 'write', 'comment'],
      lastActive: new Date(Date.now() - 600000),
      status: 'active',
      twoFactorEnabled: true,
      loginAttempts: 0
    },
    {
      id: '3',
      userId: '3',
      userName: 'dilnoza.azimova',
      role: 'teacher',
      permissions: ['read', 'write', 'comment', 'manage_class'],
      lastActive: new Date(Date.now() - 1800000),
      status: 'active',
      twoFactorEnabled: false,
      loginAttempts: 0
    },
    {
      id: '4',
      userId: '4',
      userName: 'bobur.toshmatov',
      role: 'student',
      permissions: ['read', 'comment'],
      lastActive: new Date(Date.now() - 3600000),
      status: 'suspended',
      twoFactorEnabled: false,
      loginAttempts: 5
    }
  ])

  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: '1',
      name: 'Two-Factor Authentication',
      description: 'Require 2FA for all users',
      enabled: true,
      category: 'authentication',
      priority: 'high'
    },
    {
      id: '2',
      name: 'Session Timeout',
      description: 'Auto-logout after 30 minutes of inactivity',
      enabled: true,
      category: 'authentication',
      priority: 'medium'
    },
    {
      id: '3',
      name: 'IP Whitelisting',
      description: 'Allow access only from whitelisted IPs',
      enabled: false,
      category: 'authorization',
      priority: 'medium'
    },
    {
      id: '4',
      name: 'Data Encryption',
      description: 'Encrypt all sensitive data at rest and in transit',
      enabled: true,
      category: 'encryption',
      priority: 'high'
    },
    {
      id: '5',
      name: 'Security Logging',
      description: 'Log all security events and access attempts',
      enabled: true,
      category: 'monitoring',
      priority: 'high'
    },
    {
      id: '6',
      name: 'Real-time Monitoring',
      description: 'Monitor security events in real-time',
      enabled: true,
      category: 'monitoring',
      priority: 'medium'
    }
  ])

  const [selectedTab, setSelectedTab] = useState<'overview' | 'events' | 'permissions' | 'settings'>('overview')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const eventTypes = [
    { value: 'login', label: 'Login', icon: UserCheck, color: 'bg-green-100 text-green-700' },
    { value: 'logout', label: 'Logout', icon: UserX, color: 'bg-gray-100 text-gray-700' },
    { value: 'failed_login', label: 'Failed Login', icon: XCircle, color: 'bg-red-100 text-red-700' },
    { value: 'password_change', label: 'Password Change', icon: Key, color: 'bg-blue-100 text-blue-700' },
    { value: 'permission_change', label: 'Permission Change', icon: Settings, color: 'bg-purple-100 text-purple-700' },
    { value: 'suspicious_activity', label: 'Suspicious Activity', icon: AlertTriangle, color: 'bg-orange-100 text-orange-700' }
  ]

  const roles = [
    { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-700' },
    { value: 'teacher', label: 'Teacher', color: 'bg-blue-100 text-blue-700' },
    { value: 'student', label: 'Student', color: 'bg-green-100 text-green-700' },
    { value: 'premium', label: 'Premium', color: 'bg-purple-100 text-purple-700' },
    { value: 'guest', label: 'Guest', color: 'bg-gray-100 text-gray-700' }
  ]

  const statuses = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
    { value: 'suspended', label: 'Suspended', color: 'bg-red-100 text-red-700' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' }
  ]

  const severities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' }
  ]

  const categories = [
    { value: 'authentication', label: 'Authentication', icon: Lock, color: 'bg-blue-100 text-blue-700' },
    { value: 'authorization', label: 'Authorization', icon: ShieldCheck, color: 'bg-green-100 text-green-700' },
    { value: 'encryption', label: 'Encryption', icon: KeyRound, color: 'bg-purple-100 text-purple-700' },
    { value: 'monitoring', label: 'Monitoring', icon: Activity, color: 'bg-orange-100 text-orange-700' }
  ]

  useEffect(() => {
    // Simulate real-time security monitoring
    const interval = setInterval(() => {
      setSecurityMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 5))
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />
      case 'stable': return <Activity className="w-4 h-4 text-gray-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getEventTypeIcon = (type: string) => {
    return eventTypes.find(t => t.value === type)?.icon || AlertCircle
  }

  const getEventTypeColor = (type: string) => {
    return eventTypes.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-700'
  }

  const getRoleColor = (role: string) => {
    return roles.find(r => r.value === role)?.color || 'bg-gray-100 text-gray-700'
  }

  const getStatusBadgeColor = (status: string) => {
    return statuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700'
  }

  const getSeverityColor = (severity: string) => {
    return severities.find(s => s.value === severity)?.color || 'bg-gray-100 text-gray-700'
  }

  const getCategoryIcon = (category: string) => {
    return categories.find(c => c.value === category)?.icon || Settings
  }

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-700'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
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

  const resolveEvent = (eventId: string) => {
    setSecurityEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, resolved: true } : event
    ))
  }

  const toggleSecuritySetting = (settingId: string) => {
    setSecuritySettings(prev => prev.map(setting =>
      setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting
    ))
  }

  const suspendUser = (userId: string) => {
    setUserPermissions(prev => prev.map(user =>
      user.userId === userId ? { ...user, status: 'suspended' } : user
    ))
  }

  const activateUser = (userId: string) => {
    setUserPermissions(prev => prev.map(user =>
      user.userId === userId ? { ...user, status: 'active' } : user
    ))
  }

  return (
    <div className="space-y-6">
      {/* Security Header */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Security System
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Settings className="w-4 h-4" />
                Advanced
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Security Score */}
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {securityMetrics[0].value}%
            </div>
            <div className="text-lg text-gray-700 mb-1">Overall Security Score</div>
            <div className="flex items-center justify-center gap-2">
              {getTrendIcon(securityMetrics[0].trend)}
              <span className="text-sm text-gray-600">Excellent security posture</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-2 border-b border-gray-200">
            <Button
              variant={selectedTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('overview')}
              className="border-b-2 border-transparent rounded-none"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={selectedTab === 'events' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('events')}
              className="border-b-2 border-transparent rounded-none"
            >
              <Activity className="w-4 h-4 mr-2" />
              Events
            </Button>
            <Button
              variant={selectedTab === 'permissions' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('permissions')}
              className="border-b-2 border-transparent rounded-none"
            >
              <Users className="w-4 h-4 mr-2" />
              Permissions
            </Button>
            <Button
              variant={selectedTab === 'settings' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('settings')}
              className="border-b-2 border-transparent rounded-none"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityMetrics.slice(1).map(metric => (
            <Card key={metric.id} className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                    {metric.name.includes('Rate') || metric.name.includes('Coverage') ? '%' : ''}
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{metric.name}</h3>
                <p className="text-sm text-gray-600">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Events Tab */}
      {selectedTab === 'events' && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Security Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityEvents.map(event => {
                const Icon = getEventTypeIcon(event.type)
                return (
                  <div key={event.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-gray-600 mt-1" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{event.user}</h4>
                          <Badge className={getEventTypeColor(event.type)}>
                            {eventTypes.find(t => t.value === event.type)?.label}
                          </Badge>
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                          {event.resolved && (
                            <Badge className="bg-green-100 text-green-700">Resolved</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(event.timestamp)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {event.ip}
                          </div>
                          <div className="flex items-center gap-1">
                            <Smartphone className="w-3 h-3" />
                            {event.device}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!event.resolved && (
                        <Button size="sm" onClick={() => resolveEvent(event.id)}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permissions Tab */}
      {selectedTab === 'permissions' && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>User Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userPermissions.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{user.userName}</h4>
                        <Badge className={getRoleColor(user.role)}>
                          {roles.find(r => r.value === user.role)?.label}
                        </Badge>
                        <Badge className={getStatusBadgeColor(user.status)}>
                          {statuses.find(s => s.value === user.status)?.label}
                        </Badge>
                        {user.twoFactorEnabled && (
                          <Badge className="bg-blue-100 text-blue-700">2FA</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last active: {formatTimeAgo(user.lastActive)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Permissions: {user.permissions.join(', ')}
                        </div>
                        {user.loginAttempts > 0 && (
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Failed attempts: {user.loginAttempts}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {user.status === 'active' ? (
                      <Button size="sm" variant="outline" onClick={() => suspendUser(user.userId)}>
                        <Ban className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => activateUser(user.userId)}>
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {selectedTab === 'settings' && (
        <div className="space-y-6">
          {categories.map(category => {
            const Icon = getCategoryIcon(category.value)
            const categorySettings = securitySettings.filter(setting => setting.category === category.value)
            
            return (
              <Card key={category.value} className="bg-white border-gray-200 rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    {category.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categorySettings.map(setting => (
                      <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{setting.name}</h4>
                            <Badge className={getPriorityColor(setting.priority)}>
                              {setting.priority}
                            </Badge>
                            {setting.enabled && (
                              <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{setting.description}</p>
                        </div>
                        
                        <Button
                          variant={setting.enabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSecuritySetting(setting.id)}
                        >
                          {setting.enabled ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
