'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  MessageSquare,
  FileText,
  Shield,
  Target,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  Save,
  Download,
  Share2,
  BarChart3,
  TrendingUp,
  Zap,
  Lightbulb
} from 'lucide-react'

interface Argument {
  id: string
  type: 'premise' | 'evidence' | 'conclusion'
  content: string
  strength: number
  sources: string[]
  status: 'draft' | 'reviewed' | 'approved'
}

interface Evidence {
  id: string
  title: string
  type: 'document' | 'testimony' | 'expert' | 'precedent'
  relevance: number
  credibility: number
  description: string
  date: string
}

export default function ArgumentBuilder() {
  const [argumentList, setArgumentList] = useState<Argument[]>([
    {
      id: '1',
      type: 'premise',
      content: 'Shartnoma shartlari 2.1-bandga muvofiq ravishda to\'lov muddati 30 kun ichida amalga oshirilishi kerak.',
      strength: 0.85,
      sources: ['Shartnoma 2.1-band', 'Fuqarolik kodeksi 330-moda'],
      status: 'approved'
    },
    {
      id: '2',
      type: 'evidence',
      content: 'Bank to\'lov tasdiqlnomasi to\'lov 45 kundan keyin amalga oshirilganini ko\'rsatadi.',
      strength: 0.92,
      sources: ['Bank hujjati #12345'],
      status: 'approved'
    },
    {
      id: '3',
      type: 'conclusion',
      content: 'Shu sababli, mijoz tomonidan shartnoma shartlari buzilgan va javobgarlikka tortilishi kerak.',
      strength: 0.78,
      sources: ['FK 330-moda', 'Sud amaliyoti'],
      status: 'reviewed'
    }
  ])

  const [evidence, setEvidence] = useState<Evidence[]>([
    {
      id: '1',
      title: 'Bank to\'lov tasdiqlonomasi',
      type: 'document',
      relevance: 0.95,
      credibility: 0.98,
      description: 'Mijoz tomonidan amalga oshirilgan to\'lovning rasmiy hujjati',
      date: '2024-01-20'
    },
    {
      id: '2',
      title: 'Shartnoma nusxasi',
      type: 'document',
      relevance: 0.90,
      credibility: 0.95,
      description: 'Tomonlar o\'rtasida imzolangan asl shartnoma',
      date: '2023-12-01'
    },
    {
      id: '3',
      title: 'Ekspert xulosasi',
      type: 'expert',
      relevance: 0.75,
      credibility: 0.88,
      description: 'Huquq ekspertining shartnoma buzilishi to\'g\'risidagi xulosasi',
      date: '2024-01-25'
    }
  ])

  const [newArgument, setNewArgument] = useState('')
  const [selectedType, setSelectedType] = useState<'premise' | 'evidence' | 'conclusion'>('premise')
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const argumentTypes = [
    { value: 'premise', label: 'Gipoteza', icon: MessageSquare, color: 'bg-blue-100 text-blue-700' },
    { value: 'evidence', label: 'Dalil', icon: FileText, color: 'bg-green-100 text-green-700' },
    { value: 'conclusion', label: 'Xulosa', icon: Target, color: 'bg-purple-100 text-purple-700' }
  ]

  const evidenceTypes = [
    { value: 'document', label: 'Hujjat', color: 'bg-gray-100 text-gray-700' },
    { value: 'testimony', label: 'Guvohnoma', color: 'bg-blue-100 text-blue-700' },
    { value: 'expert', label: 'Ekspert xulosasi', color: 'bg-purple-100 text-purple-700' },
    { value: 'precedent', label: 'Pretsedent', color: 'bg-orange-100 text-orange-700' }
  ]

  const addArgument = () => {
    if (newArgument.trim()) {
      const newArg: Argument = {
        id: Date.now().toString(),
        type: selectedType,
        content: newArgument,
        strength: 0.5,
        sources: [],
        status: 'draft'
      }
      setArgumentList([...argumentList, newArg])
      setNewArgument('')
    }
  }

  const deleteArgument = (id: string) => {
    setArgumentList(argumentList.filter(arg => arg.id !== id))
  }

  const updateArgumentStatus = (id: string, status: 'draft' | 'reviewed' | 'approved') => {
    setArgumentList(argumentList.map(arg => 
      arg.id === id ? { ...arg, status } : arg
    ))
  }

  const analyzeArguments = () => {
    const totalStrength = argumentList.reduce((sum, arg) => sum + arg.strength, 0) / argumentList.length
    const approvedCount = argumentList.filter(arg => arg.status === 'approved').length
    
    setAnalysisResult({
      overallStrength: totalStrength,
      completeness: (approvedCount / argumentList.length) * 100,
      argumentCount: argumentList.length,
      evidenceCount: argumentList.filter(arg => arg.type === 'evidence').length,
      recommendations: [
        'Gipotezalarni kuchaytirish uchun qo\'shimcha dalillar keltiring',
        'Xulosani kuchliroq dalillar bilan mustahkamlang',
        'Pretsedentlarni qo\'shib dalillarni kuchaytiring'
      ]
    })
  }

  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return 'text-green-600'
    if (strength >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700'
      case 'reviewed': return 'bg-yellow-100 text-yellow-700'
      case 'draft': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.8) return 'bg-green-100 text-green-700'
    if (relevance >= 0.6) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Argument Builder */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            AI Argument Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Argument */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-2 mb-3">
              {argumentTypes.map(type => (
                <Button
                  key={type.value}
                  onClick={() => setSelectedType(type.value as any)}
                  variant={selectedType === type.value ? 'default' : 'outline'}
                  size="sm"
                >
                  <type.icon className="w-4 h-4 mr-1" />
                  {type.label}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={newArgument}
                onChange={(e) => setNewArgument(e.target.value)}
                placeholder={`${argumentTypes.find(t => t.value === selectedType)?.label} kiriting...`}
                className="min-h-[80px] flex-1"
              />
              <Button onClick={addArgument} className="self-end">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Arguments List */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Mantiqiy argumentlar</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {argumentList.map((argument: Argument) => {
                const TypeIcon = argumentTypes.find(t => t.value === argument.type)?.icon || MessageSquare
                return (
                  <div key={argument.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-gray-600" />
                        <Badge className={argumentTypes.find(t => t.value === argument.type)?.color}>
                          {argumentTypes.find(t => t.value === argument.type)?.label}
                        </Badge>
                        <Badge className={getStatusColor(argument.status)}>
                          {argument.status === 'draft' ? 'Qoralama' : 
                           argument.status === 'reviewed' ? 'Tekshirilgan' : 'Tasdiqlangan'}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteArgument(argument.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{argument.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-gray-400" />
                        <span className={`text-xs font-medium ${getStrengthColor(argument.strength)}`}>
                          Kuch: {Math.round(argument.strength * 100)}%
                        </span>
                      </div>
                      
                      {argument.status === 'draft' && (
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateArgumentStatus(argument.id, 'reviewed')}
                          >
                            Tekshirish
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateArgumentStatus(argument.id, 'approved')}
                          >
                            Tasdiqlash
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {argument.sources.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <strong>Manbalar:</strong> {argument.sources.join(', ')}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Analysis Button */}
          <Button onClick={analyzeArguments} className="w-full">
            <BarChart3 className="w-4 h-4 mr-2" />
            Argumentlarni tahlil qilish
          </Button>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Tahlil natijalari</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-800">Umumiy kuch:</span>
                  <span className="text-sm font-medium text-blue-900">
                    {Math.round(analysisResult.overallStrength * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-800">Tugallanlik:</span>
                  <span className="text-sm font-medium text-blue-900">
                    {Math.round(analysisResult.completeness)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-800">Argumentlar soni:</span>
                  <span className="text-sm font-medium text-blue-900">
                    {analysisResult.argumentCount}
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <h5 className="text-sm font-medium text-blue-900 mb-2">Tavsiyalar:</h5>
                <ul className="text-xs text-blue-800 space-y-1">
                  {analysisResult.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-1">
                      <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evidence Analyzer */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Evidence Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Evidence Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-900">{evidence.length}</div>
              <div className="text-sm text-green-700">Jami dalillar</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-900">
                {Math.round(evidence.reduce((sum, e) => sum + e.relevance, 0) / evidence.length * 100)}%
              </div>
              <div className="text-sm text-blue-700">O\'rtacha ahamiyat</div>
            </div>
          </div>

          {/* Evidence List */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Dalillar tahlili</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {evidence.map(item => (
                <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={evidenceTypes.find(t => t.value === item.type)?.color}>
                          {evidenceTypes.find(t => t.value === item.type)?.label}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Ahamiyat</span>
                        <span className={`text-xs font-medium ${getRelevanceColor(item.relevance)}`}>
                          {Math.round(item.relevance * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            item.relevance >= 0.8 ? 'bg-green-500' :
                            item.relevance >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.relevance * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Ishonch</span>
                        <span className={`text-xs font-medium ${getRelevanceColor(item.credibility)}`}>
                          {Math.round(item.credibility * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            item.credibility >= 0.8 ? 'bg-green-500' :
                            item.credibility >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.credibility * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Statistics */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-3">Dalillar statistikasi</h4>
            <div className="space-y-2">
              {evidenceTypes.map(type => {
                const count = evidence.filter(e => e.type === type.value).length
                const percentage = (count / evidence.length) * 100
                return (
                  <div key={type.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        type.value === 'document' ? 'bg-gray-500' :
                        type.value === 'testimony' ? 'bg-blue-500' :
                        type.value === 'expert' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                      <span className="text-xs text-gray-500">({Math.round(percentage)}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Export Options */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
