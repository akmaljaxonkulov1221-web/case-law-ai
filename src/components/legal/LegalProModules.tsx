'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  FileText,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Plus,
  Zap,
  Target,
  Award,
  Clock,
  Calendar,
  Globe,
  Database,
  Server,
  Home,
  ShieldCheck,
  Cloud,
  Lock,
  Unlock,
  Key,
  Scale,
  Gavel,
  BookOpen,
  Users,
  Briefcase,
  Building,
  Handshake,
  FileCheck,
  FileSearch,
  FileWarning,
  FileX,
  Stamp,
  Signature,
  PenTool,
  Calculator,
  Receipt,
  CreditCard,
  Banknote,
  PiggyBank,
  TrendingUp as TrendingUpIcon,
  AlertCircle,
  Info,
  CheckCircle2
} from 'lucide-react'

interface ContractTemplate {
  id: string
  name: string
  category: string
  description: string
  fields: string[]
  clauses: string[]
  riskLevel: 'low' | 'medium' | 'high'
  usageCount: number
  lastUpdated: Date
  status: 'active' | 'draft' | 'archived'
}

interface ComplianceRule {
  id: string
  name: string
  category: string
  description: string
  applicableLaws: string[]
  requirements: string[]
  penaltyDescription: string
  checkFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  lastChecked: Date
  status: 'compliant' | 'warning' | 'violation'
  score: number
}

interface ContractAnalysis {
  id: string
  contractName: string
  uploadDate: Date
  status: 'analyzing' | 'completed' | 'error'
  riskScore: number
  issues: {
    type: 'critical' | 'warning' | 'info'
    description: string
    clause: string
    recommendation: string
  }[]
  complianceScore: number
  suggestedChanges: string[]
}

interface LegalProMetrics {
  totalContracts: number
  activeContracts: number
  complianceRate: number
  riskScore: number
  monthlyAnalyses: number
  averageProcessingTime: number
}

export default function LegalProModules() {
  const [contractTemplates, setContractTemplates] = useState<ContractTemplate[]>([
    {
      id: '1',
      name: 'Employment Agreement',
      category: 'Employment',
      description: 'Standard employment contract with all necessary clauses',
      fields: ['Employee Name', 'Position', 'Salary', 'Start Date', 'Duration'],
      clauses: ['Termination', 'Confidentiality', 'Non-compete', 'Benefits'],
      riskLevel: 'medium',
      usageCount: 156,
      lastUpdated: new Date(Date.now() - 86400000 * 7),
      status: 'active'
    },
    {
      id: '2',
      name: 'Service Agreement',
      category: 'Services',
      description: 'Service provider contract with deliverables and payment terms',
      fields: ['Service Provider', 'Client', 'Services', 'Payment Terms', 'Duration'],
      clauses: ['Scope of Work', 'Payment Schedule', 'Liability', 'Termination'],
      riskLevel: 'low',
      usageCount: 89,
      lastUpdated: new Date(Date.now() - 86400000 * 3),
      status: 'active'
    },
    {
      id: '3',
      name: 'NDA Template',
      category: 'Confidentiality',
      description: 'Non-disclosure agreement for protecting sensitive information',
      fields: ['Parties', 'Confidential Information', 'Duration', 'Permitted Use'],
      clauses: ['Definition of Confidential Information', 'Obligations', 'Exclusions', 'Term'],
      riskLevel: 'low',
      usageCount: 234,
      lastUpdated: new Date(Date.now() - 86400000 * 14),
      status: 'active'
    },
    {
      id: '4',
      name: 'Partnership Agreement',
      category: 'Business',
      description: 'Comprehensive partnership agreement with profit sharing',
      fields: ['Partners', 'Capital Contribution', 'Profit Sharing', 'Management'],
      clauses: ['Capital', 'Profit Distribution', 'Management', 'Dissolution'],
      riskLevel: 'high',
      usageCount: 45,
      lastUpdated: new Date(Date.now() - 86400000 * 21),
      status: 'draft'
    }
  ])

  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([
    {
      id: '1',
      name: 'Labor Law Compliance',
      category: 'Employment',
      description: 'Ensures employment contracts comply with labor regulations',
      applicableLaws: ['Labor Code', 'Social Security Law', 'Minimum Wage Regulation'],
      requirements: [
        'Minimum wage compliance',
        'Working hour limits',
        'Social security contributions',
        'Termination procedures'
      ],
      penaltyDescription: 'Fines up to 100x minimum wage per violation',
      checkFrequency: 'monthly',
      lastChecked: new Date(Date.now() - 86400000 * 5),
      status: 'compliant',
      score: 95
    },
    {
      id: '2',
      name: 'Data Protection Compliance',
      category: 'Privacy',
      description: 'Ensures data handling complies with privacy laws',
      applicableLaws: ['Personal Data Protection Law', 'Cybersecurity Regulations'],
      requirements: [
        'Consent management',
        'Data encryption',
        'Breach notification',
        'Data retention policies'
      ],
      penaltyDescription: 'Fines up to 1% of annual revenue',
      checkFrequency: 'weekly',
      lastChecked: new Date(Date.now() - 86400000 * 2),
      status: 'warning',
      score: 78
    },
    {
      id: '3',
      name: 'Tax Compliance',
      category: 'Financial',
      description: 'Ensures proper tax reporting and payments',
      applicableLaws: ['Tax Code', 'VAT Regulations', 'Corporate Tax Law'],
      requirements: [
        'Tax registration',
        'Monthly tax returns',
        'Annual tax filings',
        'Tax payment records'
      ],
      penaltyDescription: 'Penalties up to 50% of unpaid taxes',
      checkFrequency: 'monthly',
      lastChecked: new Date(Date.now() - 86400000 * 10),
      status: 'compliant',
      score: 88
    }
  ])

  const [contractAnalyses, setContractAnalyses] = useState<ContractAnalysis[]>([
    {
      id: '1',
      contractName: 'Employment Agreement - John Doe',
      uploadDate: new Date(Date.now() - 86400000),
      status: 'completed',
      riskScore: 25,
      issues: [
        {
          type: 'warning',
          description: 'Non-compete clause may be too broad',
          clause: 'Section 5.2',
          recommendation: 'Narrow the scope to reasonable geographic and time limits'
        },
        {
          type: 'info',
          description: 'Missing arbitration clause',
          clause: 'Dispute Resolution',
          recommendation: 'Consider adding arbitration clause for faster dispute resolution'
        }
      ],
      complianceScore: 92,
      suggestedChanges: [
        'Add specific performance metrics',
        'Include force majeure clause',
        'Update termination notice period'
      ]
    },
    {
      id: '2',
      contractName: 'Service Agreement - ABC Corp',
      uploadDate: new Date(Date.now() - 86400000 * 2),
      status: 'completed',
      riskScore: 15,
      issues: [
        {
          type: 'critical',
          description: 'Missing liability limitation clause',
          clause: 'Liability',
          recommendation: 'Add clear liability limitation clause'
        }
      ],
      complianceScore: 85,
      suggestedChanges: [
        'Add indemnification clause',
        'Specify payment terms more clearly',
        'Include service level agreements'
      ]
    },
    {
      id: '3',
      contractName: 'NDA - Startup Project',
      uploadDate: new Date(Date.now() - 86400000 * 3),
      status: 'analyzing',
      riskScore: 0,
      issues: [],
      complianceScore: 0,
      suggestedChanges: []
    }
  ])

  const [legalProMetrics, setLegalProMetrics] = useState<LegalProMetrics>({
    totalContracts: 1234,
    activeContracts: 890,
    complianceRate: 87.5,
    riskScore: 23.4,
    monthlyAnalyses: 156,
    averageProcessingTime: 45
  })

  const [selectedTab, setSelectedTab] = useState<'templates' | 'compliance' | 'analyzer' | 'metrics'>('templates')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const contractCategories = [
    { value: 'Employment', label: 'Employment', icon: Users, color: 'bg-blue-100 text-blue-700' },
    { value: 'Services', label: 'Services', icon: Briefcase, color: 'bg-green-100 text-green-700' },
    { value: 'Business', label: 'Business', icon: Building, color: 'bg-purple-100 text-purple-700' },
    { value: 'Confidentiality', label: 'Confidentiality', icon: Lock, color: 'bg-red-100 text-red-700' },
    { value: 'Real Estate', label: 'Real Estate', icon: Home, color: 'bg-orange-100 text-orange-700' }
  ]

  const riskLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-700' }
  ]

  const complianceStatuses = [
    { value: 'compliant', label: 'Compliant', color: 'bg-green-100 text-green-700' },
    { value: 'warning', label: 'Warning', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'violation', label: 'Violation', color: 'bg-red-100 text-red-700' }
  ]

  const analysisStatuses = [
    { value: 'analyzing', label: 'Analyzing', color: 'bg-blue-100 text-blue-700' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
    { value: 'error', label: 'Error', color: 'bg-red-100 text-red-700' }
  ]

  const issueTypes = [
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' },
    { value: 'warning', label: 'Warning', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'info', label: 'Info', color: 'bg-blue-100 text-blue-700' }
  ]

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffInMinutes < 1) return 'hozirgina'
    if (diffInMinutes < 60) return `${diffInMinutes} daqiqa oldin`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} soat oldin`
    return `${Math.floor(diffInMinutes / 1440)} kun oldin`
  }

  const getCategoryIcon = (category: string) => {
    return contractCategories.find(c => c.value === category)?.icon || FileText
  }

  const getCategoryColor = (category: string) => {
    return contractCategories.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-700'
  }

  const getRiskLevelColor = (riskLevel: string) => {
    return riskLevels.find(r => r.value === riskLevel)?.color || 'bg-gray-100 text-gray-700'
  }

  const getComplianceStatusColor = (status: string) => {
    return complianceStatuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700'
  }

  const getAnalysisStatusColor = (status: string) => {
    return analysisStatuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700'
  }

  const getIssueTypeColor = (type: string) => {
    return issueTypes.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-700'
  }

  const getRiskScoreColor = (score: number) => {
    if (score <= 20) return 'text-green-600'
    if (score <= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getComplianceScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const analyzeContract = (contractFile: File) => {
    const newAnalysis: ContractAnalysis = {
      id: Date.now().toString(),
      contractName: contractFile.name,
      uploadDate: new Date(),
      status: 'analyzing',
      riskScore: 0,
      issues: [],
      complianceScore: 0,
      suggestedChanges: []
    }
    
    setContractAnalyses([newAnalysis, ...contractAnalyses])
    
    // Simulate analysis completion
    setTimeout(() => {
      setContractAnalyses(prev => prev.map(analysis =>
        analysis.id === newAnalysis.id ? {
          ...analysis,
          status: 'completed',
          riskScore: Math.floor(Math.random() * 50),
          complianceScore: Math.floor(Math.random() * 30) + 70,
          issues: [
            {
              type: Math.random() > 0.5 ? 'warning' : 'info',
              description: 'Sample issue detected',
              clause: 'Section ' + Math.floor(Math.random() * 10),
              recommendation: 'Review and update clause'
            }
          ]
        } : analysis
      ))
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Legal Pro Header */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Legal Pro Modules
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
          {/* Legal Pro Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {legalProMetrics.totalContracts}
              </div>
              <div className="text-sm text-gray-600">Total Contracts</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {legalProMetrics.complianceRate}%
              </div>
              <div className="text-sm text-gray-600">Compliance Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className={`text-2xl font-bold ${getRiskScoreColor(legalProMetrics.riskScore)}`}>
                {legalProMetrics.riskScore}
              </div>
              <div className="text-sm text-gray-600">Risk Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {legalProMetrics.monthlyAnalyses}
              </div>
              <div className="text-sm text-gray-600">Monthly Analyses</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-2 border-b border-gray-200">
            <Button
              variant={selectedTab === 'templates' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('templates')}
              className="border-b-2 border-transparent rounded-none"
            >
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button
              variant={selectedTab === 'compliance' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('compliance')}
              className="border-b-2 border-transparent rounded-none"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Compliance
            </Button>
            <Button
              variant={selectedTab === 'analyzer' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('analyzer')}
              className="border-b-2 border-transparent rounded-none"
            >
              <Search className="w-4 h-4 mr-2" />
              Analyzer
            </Button>
            <Button
              variant={selectedTab === 'metrics' ? 'default' : 'ghost'}
              onClick={() => setSelectedTab('metrics')}
              className="border-b-2 border-transparent rounded-none"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Metrics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates Tab */}
      {selectedTab === 'templates' && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Contract Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contractTemplates.map(template => {
                const Icon = getCategoryIcon(template.category)
                return (
                  <div key={template.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getCategoryColor(template.category)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <Badge className={getRiskLevelColor(template.riskLevel)}>
                            {template.riskLevel} risk
                          </Badge>
                        </div>
                      </div>
                      <Badge className={template.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {template.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{template.description}</p>

                    <div className="space-y-2 mb-3">
                      <div className="text-sm text-gray-600">
                        <strong>Fields:</strong> {template.fields.join(', ')}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Clauses:</strong> {template.clauses.join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <TrendingUpIcon className="w-3 h-3" />
                          {template.usageCount} uses
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(template.lastUpdated)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Tab */}
      {selectedTab === 'compliance' && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Compliance Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceRules.map(rule => (
                <div key={rule.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        <Badge className={getComplianceStatusColor(rule.status)}>
                          {rule.status}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-700">
                          {rule.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{rule.description}</p>
                      <div className={`text-lg font-bold ${getComplianceScoreColor(rule.score)}`}>
                        Score: {rule.score}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="text-sm text-gray-600">
                      <strong>Applicable Laws:</strong> {rule.applicableLaws.join(', ')}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Requirements:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {rule.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm text-red-600">
                      <strong>Penalty:</strong> {rule.penaltyDescription}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Check: {rule.checkFrequency}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Last: {formatTimeAgo(rule.lastChecked)}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analyzer Tab */}
      {selectedTab === 'analyzer' && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-600" />
                Contract Analyzer
              </CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Analyze Contract
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contractAnalyses.map(analysis => (
                <div key={analysis.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{analysis.contractName}</h4>
                        <Badge className={getAnalysisStatusColor(analysis.status)}>
                          {analysis.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatTimeAgo(analysis.uploadDate)}
                        </div>
                        {analysis.status === 'completed' && (
                          <>
                            <div className={`flex items-center gap-1 ${getRiskScoreColor(analysis.riskScore)}`}>
                              <AlertTriangle className="w-3 h-3" />
                              Risk: {analysis.riskScore}
                            </div>
                            <div className={`flex items-center gap-1 ${getComplianceScoreColor(analysis.complianceScore)}`}>
                              <CheckCircle2 className="w-3 h-3" />
                              Compliance: {analysis.complianceScore}%
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {analysis.status === 'completed' && (
                    <>
                      {analysis.issues.length > 0 && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-900 mb-2">Issues Found</h5>
                          <div className="space-y-2">
                            {analysis.issues.map((issue, index) => (
                              <div key={index} className="p-2 bg-white rounded border-l-4 border-red-500">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={getIssueTypeColor(issue.type)}>
                                    {issue.type}
                                  </Badge>
                                  <span className="text-sm font-medium">{issue.clause}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-1">{issue.description}</p>
                                <p className="text-sm text-blue-600">
                                  <strong>Recommendation:</strong> {issue.recommendation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysis.suggestedChanges.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Suggested Changes</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {analysis.suggestedChanges.map((change, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {analysis.status === 'analyzing' && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span className="ml-3 text-gray-600">Analyzing contract...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Tab */}
      {selectedTab === 'metrics' && (
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              Legal Pro Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contract Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Contracts</span>
                    <span className="text-sm font-medium">{legalProMetrics.totalContracts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Contracts</span>
                    <span className="text-sm font-medium">{legalProMetrics.activeContracts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Analyses</span>
                    <span className="text-sm font-medium">{legalProMetrics.monthlyAnalyses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Processing Time</span>
                    <span className="text-sm font-medium">{legalProMetrics.averageProcessingTime}min</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Risk & Compliance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Compliance Rate</span>
                    <span className="text-sm font-medium text-green-600">{legalProMetrics.complianceRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Risk Score</span>
                    <span className="text-sm font-medium text-yellow-600">{legalProMetrics.riskScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">High Risk Contracts</span>
                    <span className="text-sm font-medium text-red-600">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Compliance Violations</span>
                    <span className="text-sm font-medium text-red-600">3</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                <h4 className="font-medium text-gray-900 mb-3">Template Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Most Used</span>
                    <span className="text-sm font-medium">NDA Template</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Highest Risk</span>
                    <span className="text-sm font-medium text-red-600">Partnership Agreement</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Recently Updated</span>
                    <span className="text-sm font-medium">Service Agreement</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Compliance Overview</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Compliant Rules</span>
                    <span className="text-sm font-medium text-green-600">2/3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Warning Rules</span>
                    <span className="text-sm font-medium text-yellow-600">1/3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Violations</span>
                    <span className="text-sm font-medium text-red-600">0/3</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Analysis Trends</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Risk Score</span>
                    <span className="text-sm font-medium text-yellow-600">23.4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Compliance Score</span>
                    <span className="text-sm font-medium text-green-600">88.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Issues per Contract</span>
                    <span className="text-sm font-medium">2.3</span>
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
