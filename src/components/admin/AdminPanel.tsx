'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Users,
  Settings,
  BarChart3,
  Database,
  Globe,
  Server,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Plus,
  Lock,
  Unlock,
  UserPlus,
  UserX,
  Ban,
  Crown,
  Star,
  Clock,
  Calendar,
  FileText,
  Mail,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
  Zap,
  Target,
  Award,
  Gift,
  ShoppingCart,
  CreditCard,
  Receipt,
  PieChart,
  LineChart,
  AreaChart,
  Hash,
  MessageSquare,
  Bell,
  Settings2,
  LogOut,
  LogIn,
  Key,
  Fingerprint,
  ShieldCheck
} from 'lucide-react'

interface SystemMetrics {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyRevenue: number
  serverUptime: number
  systemLoad: number
  storageUsage: number
  bandwidthUsage: number
  errorRate: number
  responseTime: number
}

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'moderator' | 'support'
  status: 'active' | 'suspended' | 'pending'
  lastLogin: Date
  permissions: string[]
  actions: number
  createdAt: Date
}

interface SystemAlert {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  message: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved: boolean
  assignedTo?: string
}

interface SystemLog {
  id: string
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical'
  message: string
  timestamp: Date
  source: string
  userId?: string
  ip?: string
  userAgent?: string
}

interface AdminAction {
  id: string
  adminId: string
  adminName: string
  action: string
  target: string
  timestamp: Date
  details: string
  ip: string
}

export default function AdminPanel() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalUsers: 12345,
    activeUsers: 8923,
    totalRevenue: 45678000,
    monthlyRevenue: 3456000,
    serverUptime: 99.8,
    systemLoad: 45,
    storageUsage: 67,
    bandwidthUsage: 23,
    errorRate: 0.2,
    responseTime: 120
  })

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Super Admin',
      email: 'admin@caselaw.ai',
      role: 'super_admin',
      status: 'active',
      lastLogin: new Date(Date.now() - 3600000),
      permissions: ['all'],
      actions: 156,
      createdAt: new Date('2023-01-01')
    },
    {
      id: '2',
      name: 'System Administrator',
      email: 'sysadmin@caselaw.ai',
      role: 'admin',
      status: 'active',
      lastLogin: new Date(Date.now() - 7200000),
      permissions: ['user_management', 'system_settings', 'analytics'],
      actions: 89,
      createdAt: new Date('2023-02-15')
    },
    {
      id: '3',
      name: 'Content Moderator',
      email: 'moderator@caselaw.ai',
      role: 'moderator',
      status: 'active',
      lastLogin: new Date(Date.now() - 86400000),
      permissions: ['content_moderation', 'user_support'],
      actions: 234,
      createdAt: new Date('2023-03-20')
    },
    {
      id: '4',
      name: 'Support Agent',
      email: 'support@caselaw.ai',
      role: 'support',
      status: 'suspended',
      lastLogin: new Date(Date.now() - 172800000),
      permissions: ['user_support', 'ticket_management'],
      actions: 67,
      createdAt: new Date('2023-04-10')
    }
  ])

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'High Server Load',
      message: 'Server CPU usage is above 80%. Consider scaling up.',
      timestamp: new Date(Date.now() - 300000),
      severity: 'medium',
      resolved: false,
      assignedTo: 'sysadmin@caselaw.ai'
    },
    {
      id: '2',
      type: 'error',
      title: 'Database Connection Failed',
      message: 'Unable to connect to primary database. Using backup.',
      timestamp: new Date(Date.now() - 600000),
      severity: 'high',
      resolved: true,
      assignedTo: 'admin@caselaw.ai'
    },
    {
      id: '3',
      type: 'info',
      title: 'System Update Available',
      message: 'New system version 2.1.0 is available for deployment.',
      timestamp: new Date(Date.now() - 1800000),
      severity: 'low',
      resolved: false
    },
    {
      id: '4',
      type: 'success',
      title: 'Backup Completed',
      message: 'Daily backup completed successfully.',
      timestamp: new Date(Date.now() - 3600000),
      severity: 'low',
      resolved: true
    }
  ])

  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([
    {
      id: '1',
      level: 'info',
      message: 'User login successful',
      timestamp: new Date(Date.now() - 300000),
      source: 'auth',
      userId: '1',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    },
    {
      id: '2',
      level: 'warning',
      message: 'Failed login attempt',
      timestamp: new Date(Date.now() - 600000),
      source: 'auth',
      ip: '192.168.1.200',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    },
    {
      id: '3',
      level: 'error',
      message: 'Database query timeout',
      timestamp: new Date(Date.now() - 900000),
      source: 'database',
      userId: '2'
    },
    {
      id: '4',
      level: 'critical',
      message: 'System crash detected',
      timestamp: new Date(Date.now() - 1200000),
      source: 'system'
    }
  ])

  const [adminActions, setAdminActions] = useState<AdminAction[]>([
    {
      id: '1',
      adminId: '1',
      adminName: 'Super Admin',
      action: 'User Suspension',
      target: 'support@caselaw.ai',
      timestamp: new Date(Date.now() - 3600000),
      details: 'Suspended user account due to policy violation',
      ip: '192.168.1.100'
    },
    {
      id: '2',
      adminId: '2',
      adminName: 'System Administrator',
      action: 'System Update',
      target: 'System',
      timestamp: new Date(Date.now() - 7200000),
      details: 'Updated system to version 2.0.1',
      ip: '192.168.1.101'
    },
    {
      id: '3',
      adminId: '3',
      adminName: 'Content Moderator',
      action: 'Content Removal',
      target: 'Post #12345',
      timestamp: new Date(Date.now() - 86400000),
      details: 'Removed inappropriate content',
      ip: '192.168.1.102'
    }
  ])

  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'alerts' | 'logs' | 'actions'>('overview')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const logLevels = [
    { value: 'debug', label: 'Debug', color: 'bg-gray-100 text-gray-700' },
    { value: 'info', label: 'Info', color: 'bg-blue-100 text-blue-700' },
    { value: 'warning', label: 'Warning', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'error', label: 'Error', color: 'bg-red-100 text-red-700' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' }
  ]

  const alertTypes = [
    { value: 'error', label: 'Error', icon: XCircle, color: 'bg-red-100 text-red-700' },
    { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700' },
    { value: 'info', label: 'Info', icon: Info, color: 'bg-blue-100 text-blue-700' },
    { value: 'success', label: 'Success', icon: CheckCircle, color: 'bg-green-100 text-green-700' }
  ]

  const userRoles = [
    { value: 'super_admin', label: 'Super Admin', color: 'bg-red-100 text-red-700' },
    { value: 'admin', label: 'Admin', color: 'bg-blue-100 text-blue-700' },
    { value: 'moderator', label: 'Moderator', color: 'bg-green-100 text-green-700' },
    { value: 'support', label: 'Support', color: 'bg-purple-100 text-purple-700' }
  ]

  const userStatuses = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
    { value: 'suspended', label: 'Suspended', color: 'bg-red-100 text-red-700' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' }
  ]

  const alertSeverities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffInMinutes < 1) return 'hozirgina'
    if (diffInMinutes < 60) return `${diffInMinutes} daqiqa oldin`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} soat oldin`
    return `${Math.floor(diffInMinutes / 1440)} kun oldin`
  }

  const getLogLevelColor = (level: string) => {
    return logLevels.find(l => l.value === level)?.color || 'bg-gray-100 text-gray-700'
  }

  const getAlertTypeIcon = (type: string) => {
    return alertTypes.find(t => t.value === type)?.icon || Info
  }

  const getAlertTypeColor = (type: string) => {
    return alertTypes.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-700'
  }

  const getRoleColor = (role: string) => {
    return userRoles.find(r => r.value === role)?.color || 'bg-gray-100 text-gray-700'
  }

  const getStatusColor = (status: string) => {
    return userStatuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700'
  }

  const getSeverityColor = (severity: string) => {
    return alertSeverities.find(s => s.value === severity)?.color || 'bg-gray-100 text-gray-700'
  }

  const resolveAlert = (alertId: string) => {
    setSystemAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ))
  }

  const suspendUser = (userId: string) => {
    setAdminUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: 'suspended' } : user
    ))
  }

  const activateUser = (userId: string) => {
    setAdminUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: 'active' } : user
    ))
  }

  const getMetricColor = (value: number, type: string) => {
    if (type === 'uptime' || type === 'success_rate') {
      return value >= 95 ? 'text-green-600' : value >= 80 ? 'text-yellow-600' : 'text-red-600'
    }
    if (type === 'load' || type === 'error_rate') {
      return value <= 20 ? 'text-green-600' : value <= 50 ? 'text-yellow-600' : 'text-red-600'
    }
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Admin Panel
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
          {/* System Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className={`text-2xl font-bold ${getMetricColor(systemMetrics.serverUptime, 'uptime')}`}>
                {systemMetrics.serverUptime}%
              </div>
              <div className="text-sm text-gray-600">Server Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {systemMetrics.activeUsers}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(systemMetrics.monthlyRevenue)}
              </div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className={`text-2xl font-bold ${getMetricColor(systemMetrics.systemLoad, 'load')}`}>
                {systemMetrics.systemLoad}%
              </div>
              <div className="text-sm text-gray-600">System Load</div>
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
              variant={selectedTab === 'users' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('users')}
              className="border-b-2 border-transparent rounded-none"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </Button>
            <Button
              variant={selectedTab === 'alerts' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('alerts')}
              className="border-b-2 border-transparent rounded-none"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts
            </Button>
            <Button
              variant={selectedTab === 'logs' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('logs')}
              className="border-b-2 border-transparent rounded-none"
            >
              <FileText className="w-4 h-4 mr-2" />
              Logs
            </Button>
            <Button
              variant={selectedTab === 'actions' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('actions')}
              className="border-b-2 border-transparent rounded-none"
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Actions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">System Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium">{systemMetrics.responseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Error Rate</span>
                  <span className="text-sm font-medium text-red-600">{systemMetrics.errorRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Storage Usage</span>
                  <span className="text-sm font-medium">{systemMetrics.storageUsage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bandwidth Usage</span>
                  <span className="text-sm font-medium">{systemMetrics.bandwidthUsage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">User Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="text-sm font-medium">{systemMetrics.totalUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-medium">{systemMetrics.activeUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Admin Users</span>
                  <span className="text-sm font-medium">{adminUsers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Alerts</span>
                  <span className="text-sm font-medium text-red-600">
                    {systemAlerts.filter(a => !a.resolved).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="text-sm font-medium">{formatCurrency(systemMetrics.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                  <span className="text-sm font-medium">{formatCurrency(systemMetrics.monthlyRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Revenue/User</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(systemMetrics.monthlyRevenue / systemMetrics.activeUsers)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Growth Rate</span>
                  <span className="text-sm font-medium text-green-600">+15.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <Badge className={getRoleColor(user.role)}>
                          {userRoles.find(r => r.value === user.role)?.label}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {userStatuses.find(s => s.value === user.status)?.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last login: {formatTimeAgo(user.lastLogin)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          Actions: {user.actions}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {user.status === 'active' ? (
                      <Button size="sm" variant="outline" onClick={() => suspendUser(user.id)}>
                        <Ban className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => activateUser(user.id)}>
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts Tab */}
      {selectedTab === 'alerts' && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map(alert => {
                const Icon = getAlertTypeIcon(alert.type)
                return (
                  <div key={alert.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-gray-600 mt-1" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <Badge className={getAlertTypeColor(alert.type)}>
                            {alertTypes.find(t => t.value === alert.type)?.label}
                          </Badge>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          {alert.resolved && (
                            <Badge className="bg-green-100 text-green-700">Resolved</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(alert.timestamp)}
                          </div>
                          {alert.assignedTo && (
                            <div className="flex items-center gap-1">
                              <UserPlus className="w-3 h-3" />
                              {alert.assignedTo}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!alert.resolved && (
                        <Button size="sm" onClick={() => resolveAlert(alert.id)}>
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

      {/* Logs Tab */}
      {selectedTab === 'logs' && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemLogs.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getLogLevelColor(log.level)}>
                      {logLevels.find(l => l.value === log.level)?.label}
                    </Badge>
                    <div>
                      <p className="text-sm text-gray-900">{log.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(log.timestamp)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Server className="w-3 h-3" />
                          {log.source}
                        </div>
                        {log.userId && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            User {log.userId}
                          </div>
                        )}
                        {log.ip && (
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {log.ip}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions Tab */}
      {selectedTab === 'actions' && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminActions.map(action => (
                <div key={action.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {action.adminName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{action.adminName}</h4>
                        <Badge className="bg-blue-100 text-blue-700">
                          {action.action}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{action.details}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {action.target}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(action.timestamp)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {action.ip}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Metrics */}
      {showAdvanced && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Advanced Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">System Health</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CPU Usage</span>
                    <span className="text-sm font-medium">{systemMetrics.systemLoad}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Memory Usage</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Disk Usage</span>
                    <span className="text-sm font-medium">{systemMetrics.storageUsage}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Network</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bandwidth</span>
                    <span className="text-sm font-medium">{systemMetrics.bandwidthUsage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium">{systemMetrics.responseTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Error Rate</span>
                    <span className="text-sm font-medium text-red-600">{systemMetrics.errorRate}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Database</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Connections</span>
                    <span className="text-sm font-medium">45/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Query Time</span>
                    <span className="text-sm font-medium">23ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cache Hit Rate</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
