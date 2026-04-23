'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  Crown,
  Star,
  Zap,
  Gift,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Settings,
  RefreshCw,
  Download,
  Upload,
  ShoppingCart,
  Package,
  Shield,
  Rocket,
  Flame,
  Gem,
  Coins,
  Wallet,
  Receipt,
  FileText,
  AlertCircle,
  Info,
  Lock,
  Unlock,
  Key,
  CreditCard as CardIcon,
  Banknote,
  PiggyBank
} from 'lucide-react'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  features: string[]
  limits: {
    cases: number
    storage: number
    aiQueries: number
    support: 'basic' | 'priority' | 'dedicated'
  }
  popular?: boolean
  discount?: number
}

interface Transaction {
  id: string
  type: 'subscription' | 'purchase' | 'refund' | 'credit'
  amount: number
  currency: string
  description: string
  date: Date
  status: 'completed' | 'pending' | 'failed'
  method: string
  userId: string
  userName: string
}

interface RevenueMetrics {
  totalRevenue: number
  monthlyRevenue: number
  activeSubscriptions: number
  churnRate: number
  averageRevenuePerUser: number
  conversionRate: number
  monthlyGrowth: number
}

interface PremiumFeature {
  id: string
  name: string
  description: string
  price: number
  type: 'one-time' | 'subscription'
  category: 'ai' | 'content' | 'tools' | 'support'
  active: boolean
  usersCount: number
  revenue: number
}

export default function MonetizationSystem() {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'Basic',
      price: 0,
      currency: 'UZS',
      billingCycle: 'monthly',
      features: [
        'Basic case access',
        'Limited AI queries (50/month)',
        'Community forum access',
        'Basic support'
      ],
      limits: {
        cases: 50,
        storage: 1024 * 1024 * 100, // 100MB
        aiQueries: 50,
        support: 'basic'
      }
    },
    {
      id: '2',
      name: 'Premium',
      price: 99000,
      currency: 'UZS',
      billingCycle: 'monthly',
      features: [
        'Unlimited case access',
        'Advanced AI queries (500/month)',
        'Premium content library',
        'Priority support',
        'Offline mode',
        'Advanced analytics'
      ],
      limits: {
        cases: -1, // unlimited
        storage: 1024 * 1024 * 1024 * 2, // 2GB
        aiQueries: 500,
        support: 'priority'
      },
      popular: true
    },
    {
      id: '3',
      name: 'Professional',
      price: 249000,
      currency: 'UZS',
      billingCycle: 'monthly',
      features: [
        'Everything in Premium',
        'Unlimited AI queries',
        'Custom content creation',
        'Dedicated support',
        'API access',
        'White-label options',
        'Team collaboration tools'
      ],
      limits: {
        cases: -1,
        storage: 1024 * 1024 * 1024 * 10, // 10GB
        aiQueries: -1,
        support: 'dedicated'
      }
    },
    {
      id: '4',
      name: 'Enterprise',
      price: 999000,
      currency: 'UZS',
      billingCycle: 'monthly',
      features: [
        'Everything in Professional',
        'Unlimited everything',
        'Custom integrations',
        'On-premise deployment',
        'SLA guarantee',
        'Training sessions',
        'Custom features development'
      ],
      limits: {
        cases: -1,
        storage: -1,
        aiQueries: -1,
        support: 'dedicated'
      }
    }
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'subscription',
      amount: 99000,
      currency: 'UZS',
      description: 'Premium subscription - Monthly',
      date: new Date(Date.now() - 86400000),
      status: 'completed',
      method: 'Credit Card',
      userId: '1',
      userName: 'Sarvar Karimov'
    },
    {
      id: '2',
      type: 'purchase',
      amount: 49000,
      currency: 'UZS',
      description: 'Advanced course bundle',
      date: new Date(Date.now() - 172800000),
      status: 'completed',
      method: 'PayMe',
      userId: '2',
      userName: 'Dilnoza Azimova'
    },
    {
      id: '3',
      type: 'subscription',
      amount: 249000,
      currency: 'UZS',
      description: 'Professional subscription - Monthly',
      date: new Date(Date.now() - 259200000),
      status: 'pending',
      method: 'Bank Transfer',
      userId: '3',
      userName: 'Bobur Toshmatov'
    },
    {
      id: '4',
      type: 'refund',
      amount: -99000,
      currency: 'UZS',
      description: 'Premium subscription refund',
      date: new Date(Date.now() - 345600000),
      status: 'completed',
      method: 'Credit Card',
      userId: '4',
      userName: 'Azizbek Saidov'
    }
  ])

  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics>({
    totalRevenue: 12450000,
    monthlyRevenue: 3450000,
    activeSubscriptions: 234,
    churnRate: 3.2,
    averageRevenuePerUser: 145000,
    conversionRate: 12.5,
    monthlyGrowth: 15.8
  })

  const [premiumFeatures, setPremiumFeatures] = useState<PremiumFeature[]>([
    {
      id: '1',
      name: 'AI Legal Assistant Pro',
      description: 'Advanced AI-powered legal analysis and consultation',
      price: 99000,
      type: 'subscription',
      category: 'ai',
      active: true,
      usersCount: 156,
      revenue: 15444000
    },
    {
      id: '2',
      name: 'Expert Course Bundle',
      description: 'Complete collection of expert-led legal courses',
      price: 199000,
      type: 'one-time',
      category: 'content',
      active: true,
      usersCount: 89,
      revenue: 17711000
    },
    {
      id: '3',
      name: 'Case Simulator Pro',
      description: 'Advanced case simulation and practice tools',
      price: 149000,
      type: 'subscription',
      category: 'tools',
      active: true,
      usersCount: 67,
      revenue: 11983000
    },
    {
      id: '4',
      name: 'Priority Support',
      description: '24/7 priority support from legal experts',
      price: 79000,
      type: 'subscription',
      category: 'support',
      active: false,
      usersCount: 0,
      revenue: 0
    }
  ])

  const [selectedPlan, setSelectedPlan] = useState<string>('2')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const transactionTypes = [
    { value: 'subscription', label: 'Subscription', icon: CreditCard, color: 'bg-blue-100 text-blue-700' },
    { value: 'purchase', label: 'Purchase', icon: ShoppingCart, color: 'bg-green-100 text-green-700' },
    { value: 'refund', label: 'Refund', icon: RefreshCw, color: 'bg-red-100 text-red-700' },
    { value: 'credit', label: 'Credit', icon: Coins, color: 'bg-yellow-100 text-yellow-700' }
  ]

  const transactionStatuses = [
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-700' }
  ]

  const featureCategories = [
    { value: 'ai', label: 'AI Features', icon: Zap, color: 'bg-purple-100 text-purple-700' },
    { value: 'content', label: 'Content', icon: FileText, color: 'bg-blue-100 text-blue-700' },
    { value: 'tools', label: 'Tools', icon: Settings, color: 'bg-green-100 text-green-700' },
    { value: 'support', label: 'Support', icon: Shield, color: 'bg-orange-100 text-orange-700' }
  ]

  const formatCurrency = (amount: number, currency: string = 'UZS') => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === -1) return 'Unlimited'
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getTransactionTypeIcon = (type: string) => {
    return transactionTypes.find(t => t.value === type)?.icon || CreditCard
  }

  const getTransactionTypeColor = (type: string) => {
    return transactionTypes.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-700'
  }

  const getTransactionStatusColor = (status: string) => {
    return transactionStatuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700'
  }

  const getFeatureCategoryIcon = (category: string) => {
    return featureCategories.find(c => c.value === category)?.icon || Settings
  }

  const getFeatureCategoryColor = (category: string) => {
    return featureCategories.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-700'
  }

  const calculateYearlyPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8 // 20% discount for yearly
  }

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Basic': return <Shield className="w-6 h-6" />
      case 'Premium': return <Crown className="w-6 h-6" />
      case 'Professional': return <Rocket className="w-6 h-6" />
      case 'Enterprise': return <Gem className="w-6 h-6" />
      default: return <Star className="w-6 h-6" />
    }
  }

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'Basic': return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'Premium': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'Professional': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'Enterprise': return 'bg-orange-100 text-orange-700 border-orange-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Monetization Header */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Monetization System
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {billingCycle === 'monthly' ? 'Yearly' : 'Monthly'}
              </Button>
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
          {/* Revenue Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(revenueMetrics.totalRevenue)}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {revenueMetrics.activeSubscriptions}
              </div>
              <div className="text-sm text-gray-600">Active Subscriptions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {revenueMetrics.conversionRate}%
              </div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {revenueMetrics.monthlyGrowth}%
              </div>
              <div className="text-sm text-gray-600">Monthly Growth</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Plans */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Subscription Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptionPlans.map(plan => (
                <div
                  key={plan.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getPlanColor(plan.name)}`}>
                        {getPlanIcon(plan.name)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{plan.name}</h3>
                        {plan.popular && (
                          <Badge className="bg-blue-100 text-blue-700">Popular</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(plan.price)}
                      </div>
                      <div className="text-sm text-gray-600">/{plan.billingCycle}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Cases</div>
                        <div className="font-medium">
                          {plan.limits.cases === -1 ? 'Unlimited' : plan.limits.cases}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Storage</div>
                        <div className="font-medium">{formatBytes(plan.limits.storage)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">AI Queries</div>
                        <div className="font-medium">
                          {plan.limits.aiQueries === -1 ? 'Unlimited' : plan.limits.aiQueries}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Support</div>
                        <div className="font-medium capitalize">{plan.limits.support}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-green-600" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map(transaction => {
                const Icon = getTransactionTypeIcon(transaction.type)
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getTransactionTypeColor(transaction.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{transaction.userName}</h4>
                          <Badge className={getTransactionStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{transaction.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {transaction.date.toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <CardIcon className="w-3 h-3" />
                            {transaction.method}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-sm text-gray-600">{transaction.currency}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Features */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {premiumFeatures.map(feature => {
              const Icon = getFeatureCategoryIcon(feature.category)
              return (
                <div key={feature.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getFeatureCategoryColor(feature.category)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.name}</h4>
                        <Badge className={feature.type === 'subscription' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                          {feature.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(feature.price)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {feature.type === 'subscription' ? '/month' : 'one-time'}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{feature.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{feature.usersCount} users</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{formatCurrency(feature.revenue)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {feature.active ? (
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
                      )}
                      <Button size="sm" variant="outline">
                        {feature.active ? 'Manage' : 'Activate'}
                      </Button>
                    </div>
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
                <h4 className="font-medium text-gray-900 mb-3">Revenue Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subscriptions</span>
                    <span className="text-sm font-medium">{formatCurrency(revenueMetrics.monthlyRevenue * 0.7)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">One-time purchases</span>
                    <span className="text-sm font-medium">{formatCurrency(revenueMetrics.monthlyRevenue * 0.3)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">User Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ARPU</span>
                    <span className="text-sm font-medium">{formatCurrency(revenueMetrics.averageRevenuePerUser)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Churn Rate</span>
                    <span className="text-sm font-medium">{revenueMetrics.churnRate}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Growth Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Growth</span>
                    <span className="text-sm font-medium text-green-600">+{revenueMetrics.monthlyGrowth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-sm font-medium">{revenueMetrics.conversionRate}%</span>
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
