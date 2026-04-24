'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  Users,
  Share2,
  Gift,
  Award,
  Target,
  Zap,
  Rocket,
  Crown,
  Star,
  Heart,
  MessageSquare,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  Link,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Mail,
  Plus,
  Globe,
  Camera,
  Play,
  Send
} from 'lucide-react'

interface ReferralProgram {
  id: string
  name: string
  description: string
  rewardType: 'cash' | 'credit' | 'premium' | 'feature'
  rewardValue: number
  rewardCurrency: string
  conditions: string[]
  active: boolean
  participants: number
  totalRewards: number
  conversionRate: number
}

interface ReferralLink {
  id: string
  code: string
  url: string
  clicks: number
  conversions: number
  earnings: number
  currency: string
  createdAt: Date
  expiresAt: Date
  status: 'active' | 'expired' | 'paused'
}

interface ViralCampaign {
  id: string
  name: string
  type: 'challenge' | 'contest' | 'giveaway' | 'milestone'
  description: string
  startDate: Date
  endDate: Date
  participants: number
  completions: number
  rewards: {
    type: string
    value: number
    currency: string
  }[]
  status: 'active' | 'completed' | 'upcoming' | 'cancelled'
  viralCoefficient: number
}

interface GrowthMetrics {
  totalReferrals: number
  activeReferrers: number
  conversionRate: number
  averageEarnings: number
  viralCoefficient: number
  monthlyGrowth: number
  retentionRate: number
}

export default function GrowthSystem() {
  const [referralPrograms, setReferralPrograms] = useState<ReferralProgram[]>([
    {
      id: '1',
      name: 'Student Referral Program',
      description: 'Invite friends and earn rewards for each successful signup',
      rewardType: 'credit',
      rewardValue: 50000,
      rewardCurrency: 'UZS',
      conditions: [
        'Friend must sign up with your referral link',
        'Friend must complete first lesson',
        'Both accounts must be active for 30 days'
      ],
      active: true,
      participants: 1234,
      totalRewards: 61700000,
      conversionRate: 15.8
    },
    {
      id: '2',
      name: 'Teacher Ambassador Program',
      description: 'Become a teacher ambassador and earn premium features',
      rewardType: 'premium',
      rewardValue: 3,
      rewardCurrency: 'months',
      conditions: [
        'Must be an active teacher',
        'Refer at least 5 new students',
        'Maintain 4.5+ average rating'
      ],
      active: true,
      participants: 89,
      totalRewards: 267,
      conversionRate: 23.4
    },
    {
      id: '3',
      name: 'Premium Sharing Bonus',
      description: 'Share premium content and earn commission on sales',
      rewardType: 'cash',
      rewardValue: 20,
      rewardCurrency: '%',
      conditions: [
        'Must have active premium subscription',
        'Share tracked referral links',
        'Minimum 10 conversions per month'
      ],
      active: false,
      participants: 45,
      totalRewards: 2340000,
      conversionRate: 8.2
    }
  ])

  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([
    {
      id: '1',
      code: 'CASELAW2024',
      url: 'https://caselaw.ai/ref/CASELAW2024',
      clicks: 234,
      conversions: 37,
      earnings: 1850000,
      currency: 'UZS',
      createdAt: new Date(Date.now() - 86400000 * 30),
      expiresAt: new Date(Date.now() - 86400000 * 60),
      status: 'active'
    },
    {
      id: '2',
      code: 'STUDENT25',
      url: 'https://caselaw.ai/ref/STUDENT25',
      clicks: 156,
      conversions: 23,
      earnings: 1150000,
      currency: 'UZS',
      createdAt: new Date(Date.now() - 86400000 * 45),
      expiresAt: new Date(Date.now() - 86400000 * 15),
      status: 'active'
    },
    {
      id: '3',
      code: 'TEACHER2024',
      url: 'https://caselaw.ai/ref/TEACHER2024',
      clicks: 89,
      conversions: 12,
      earnings: 600000,
      currency: 'UZS',
      createdAt: new Date(Date.now() - 86400000 * 60),
      expiresAt: new Date(Date.now() - 86400000 * 30),
      status: 'expired'
    }
  ])

  const [viralCampaigns, setViralCampaigns] = useState<ViralCampaign[]>([
    {
      id: '1',
      name: 'Legal Knowledge Challenge',
      type: 'challenge',
      description: 'Complete 100 cases and win premium subscription',
      startDate: new Date(Date.now() - 86400000 * 7),
      endDate: new Date(Date.now() + 86400000 * 23),
      participants: 1567,
      completions: 234,
      rewards: [
        { type: 'premium', value: 3, currency: 'months' },
        { type: 'credit', value: 100000, currency: 'UZS' }
      ],
      status: 'active',
      viralCoefficient: 2.3
    },
    {
      id: '2',
      name: 'Study Group Contest',
      type: 'contest',
      description: 'Create study groups and invite friends to win prizes',
      startDate: new Date(Date.now() - 86400000 * 14),
      endDate: new Date(Date.now() + 86400000 * 16),
      participants: 892,
      completions: 156,
      rewards: [
        { type: 'premium', value: 6, currency: 'months' },
        { type: 'merchandise', value: 1, currency: 'item' }
      ],
      status: 'active',
      viralCoefficient: 1.8
    },
    {
      id: '3',
      name: 'Back to School Giveaway',
      type: 'giveaway',
      description: 'Win free premium subscriptions for your entire class',
      startDate: new Date(Date.now() - 86400000 * 30),
      endDate: new Date(Date.now() - 86400000 * 15),
      participants: 2341,
      completions: 567,
      rewards: [
        { type: 'premium', value: 12, currency: 'months' },
        { type: 'credit', value: 500000, currency: 'UZS' }
      ],
      status: 'completed',
      viralCoefficient: 3.1
    }
  ])

  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics>({
    totalReferrals: 1234,
    activeReferrers: 567,
    conversionRate: 15.8,
    averageEarnings: 145000,
    viralCoefficient: 2.1,
    monthlyGrowth: 23.4,
    retentionRate: 78.9
  })

  const [selectedProgram, setSelectedProgram] = useState<string>('1')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const rewardTypes = [
    { value: 'cash', label: 'Cash', icon: Gift, color: 'bg-green-100 text-green-700' },
    { value: 'credit', label: 'Credit', icon: Star, color: 'bg-blue-100 text-blue-700' },
    { value: 'premium', label: 'Premium', icon: Crown, color: 'bg-purple-100 text-purple-700' },
    { value: 'feature', label: 'Feature', icon: Zap, color: 'bg-orange-100 text-orange-700' }
  ]

  const campaignTypes = [
    { value: 'challenge', label: 'Challenge', icon: Target, color: 'bg-red-100 text-red-700' },
    { value: 'contest', label: 'Contest', icon: Award, color: 'bg-blue-100 text-blue-700' },
    { value: 'giveaway', label: 'Giveaway', icon: Gift, color: 'bg-green-100 text-green-700' },
    { value: 'milestone', label: 'Milestone', icon: Rocket, color: 'bg-purple-100 text-purple-700' }
  ]

  const campaignStatuses = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-700' },
    { value: 'upcoming', label: 'Upcoming', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700' }
  ]

  const linkStatuses = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
    { value: 'expired', label: 'Expired', color: 'bg-red-100 text-red-700' },
    { value: 'paused', label: 'Paused', color: 'bg-yellow-100 text-yellow-700' }
  ]

  const socialPlatforms = [
    { name: 'Facebook', icon: Globe, color: 'bg-blue-600' },
    { name: 'Twitter', icon: Mail, color: 'bg-sky-500' },
    { name: 'LinkedIn', icon: Users, color: 'bg-blue-700' },
    { name: 'Instagram', icon: Camera, color: 'bg-pink-600' },
    { name: 'YouTube', icon: Play, color: 'bg-red-600' },
    { name: 'Telegram', icon: Send, color: 'bg-blue-400' },
    { name: 'WhatsApp', icon: Mail, color: 'bg-green-500' }
  ]

  const formatCurrency = (amount: number, currency: string = 'UZS') => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: currency,
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

  const getRewardTypeIcon = (type: string) => {
    return rewardTypes.find(t => t.value === type)?.icon || Gift
  }

  const getRewardTypeColor = (type: string) => {
    return rewardTypes.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-700'
  }

  const getCampaignTypeIcon = (type: string) => {
    return campaignTypes.find(t => t.value === type)?.icon || Target
  }

  const getCampaignTypeColor = (type: string) => {
    return campaignTypes.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-700'
  }

  const getCampaignStatusColor = (status: string) => {
    return campaignStatuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700'
  }

  const getLinkStatusColor = (status: string) => {
    return linkStatuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700'
  }

  const copyReferralLink = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const generateNewLink = () => {
    const newCode = `CASELAW${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    const newLink: ReferralLink = {
      id: Date.now().toString(),
      code: newCode,
      url: `https://caselaw.ai/ref/${newCode}`,
      clicks: 0,
      conversions: 0,
      earnings: 0,
      currency: 'UZS',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000 * 90),
      status: 'active'
    }
    setReferralLinks([newLink, ...referralLinks])
  }

  const shareOnSocial = (platform: string, url: string) => {
    const shareUrls = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      Twitter: `https://twitter.com/intent/tweet?url=${url}`,
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      Telegram: `https://t.me/share/url?url=${url}`
    }
    
    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank')
    }
  }

  return (
    <div className="space-y-6">
      {/* Growth Header */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-purple-600" />
              Growth System
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Growth Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {growthMetrics.totalReferrals}
              </div>
              <div className="text-sm text-gray-600">Total Referrals</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {growthMetrics.conversionRate}%
              </div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {growthMetrics.viralCoefficient}x
              </div>
              <div className="text-sm text-gray-600">Viral Coefficient</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {growthMetrics.monthlyGrowth}%
              </div>
              <div className="text-sm text-gray-600">Monthly Growth</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Programs */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Referral Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referralPrograms.map(program => {
                const Icon = getRewardTypeIcon(program.rewardType)
                return (
                  <div
                    key={program.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedProgram === program.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProgram(program.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getRewardTypeColor(program.rewardType)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{program.name}</h3>
                          <Badge className={program.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {program.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {program.rewardType === 'cash' ? `${program.rewardValue}%` : 
                           program.rewardType === 'credit' ? formatCurrency(program.rewardValue) :
                           program.rewardType === 'premium' ? `${program.rewardValue} months` :
                           `${program.rewardValue} features`}
                        </div>
                        <div className="text-sm text-gray-600">Reward</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{program.description}</p>

                    <div className="space-y-1 mb-3">
                      {program.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-gray-600">{condition}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{program.participants} participants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{program.conversionRate}% conversion</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Referral Links */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5 text-green-600" />
                Referral Links
              </CardTitle>
              <Button size="sm" onClick={generateNewLink}>
                <Plus className="w-4 h-4 mr-2" />
                Generate New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referralLinks.map(link => (
                <div key={link.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{link.code}</h4>
                        <Badge className={getLinkStatusColor(link.status)}>
                          {link.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">{link.url}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => copyReferralLink(link.url)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Clicks</div>
                      <div className="font-medium">{link.clicks}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Conversions</div>
                      <div className="font-medium">{link.conversions}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Earnings</div>
                      <div className="font-medium">{formatCurrency(link.earnings)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Rate</div>
                      <div className="font-medium">
                        {link.clicks > 0 ? Math.round((link.conversions / link.clicks) * 100) : 0}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-gray-500">
                      Created: {formatTimeAgo(link.createdAt)} • 
                      Expires: {formatTimeAgo(link.expiresAt)}
                    </div>
                    <div className="flex gap-2">
                      {socialPlatforms.slice(0, 3).map(platform => {
                        const Icon = platform.icon
                        return (
                          <Button
                            key={platform.name}
                            size="sm"
                            variant="outline"
                            onClick={() => shareOnSocial(platform.name, link.url)}
                            className={`p-1 ${platform.color} text-white`}
                          >
                            <Icon className="w-3 h-3" />
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Viral Campaigns */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            Viral Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viralCampaigns.map(campaign => {
              const Icon = getCampaignTypeIcon(campaign.type)
              return (
                <div key={campaign.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getCampaignTypeColor(campaign.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                        <Badge className={getCampaignStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{campaign.description}</p>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Participants</span>
                      <span className="font-medium">{campaign.participants}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completions</span>
                      <span className="font-medium">{campaign.completions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Viral Coefficient</span>
                      <span className="font-medium text-green-600">{campaign.viralCoefficient}x</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    {campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}
                  </div>

                  <div className="space-y-1">
                    {campaign.rewards.slice(0, 2).map((reward, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Gift className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {reward.value} {reward.currency} {reward.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics */}
      {showAdvanced && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Advanced Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Referral Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Referrers</span>
                    <span className="text-sm font-medium">{growthMetrics.activeReferrers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Earnings</span>
                    <span className="text-sm font-medium">{formatCurrency(growthMetrics.averageEarnings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Retention Rate</span>
                    <span className="text-sm font-medium">{growthMetrics.retentionRate}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Campaign Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Campaigns</span>
                    <span className="text-sm font-medium">
                      {viralCampaigns.filter(c => c.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Participants</span>
                    <span className="text-sm font-medium">
                      {viralCampaigns.reduce((sum, c) => sum + c.participants, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="text-sm font-medium">
                      {Math.round(
                        (viralCampaigns.reduce((sum, c) => sum + c.completions, 0) /
                        viralCampaigns.reduce((sum, c) => sum + c.participants, 0)) * 100
                      )}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Growth Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Growth</span>
                    <span className="text-sm font-medium text-green-600">+{growthMetrics.monthlyGrowth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Viral Coefficient</span>
                    <span className="text-sm font-medium text-blue-600">{growthMetrics.viralCoefficient}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-sm font-medium">{growthMetrics.conversionRate}%</span>
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
