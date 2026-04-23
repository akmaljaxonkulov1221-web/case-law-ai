'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  Home,
  FileText,
  GitBranch,
  PlayCircle,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Database,
  Search,
  Bell,
  User,
  ChevronRight,
  Trophy,
  Target,
  Flame,
  Clock,
  TrendingUp,
  Star,
  Zap,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  RotateCcw,
  ArrowRight
} from 'lucide-react'

export default function ProfessionalDashboard() {
  const [selectedStep, setSelectedStep] = useState(1)
  const [userAnswer, setUserAnswer] = useState('')
  const [zoomLevel, setZoomLevel] = useState(1)

  const recentCases = [
    {
      title: 'Shartnoma',
      difficulty: 'O\'rta',
      score: 85,
      status: 'completed',
      icon: FileText
    },
    {
      title: 'Ehtiyotsizlik',
      difficulty: 'Boshlang\'ich',
      score: 92,
      status: 'completed',
      icon: AlertCircle
    },
    {
      title: 'Intellektual mulk',
      difficulty: 'Yuqori',
      score: 78,
      status: 'completed',
      icon: Star
    }
  ]

  const achievements = [
    {
      title: 'Birinchi g\'alaba',
      description: 'Birinchi keysni muvaffaqiyatli yechish',
      icon: Trophy,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Mantiq ustasi',
      description: 'IRAC metodini mukammal o\'rganish',
      icon: Target,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Faol o\'quvchi',
      description: '7 kun ketma-ket o\'qish',
      icon: Flame,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const decisionTreeNodes = [
    {
      id: 'start',
      label: 'Shartnoma buzildi',
      type: 'start',
      x: 50,
      y: 50,
      connections: ['sud', 'muzokara']
    },
    {
      id: 'sud',
      label: 'Sudga murojaat',
      type: 'process',
      x: 150,
      y: 30,
      connections: ['sud-galaba', 'sud-xatolik']
    },
    {
      id: 'muzokara',
      label: 'Muzokara qilish',
      type: 'process',
      x: 150,
      y: 70,
      connections: ['muzokara-galaba', 'muzokara-xatolik']
    },
    {
      id: 'sud-galaba',
      label: 'G\'alaba',
      type: 'success',
      x: 250,
      y: 20,
      connections: []
    },
    {
      id: 'sud-xatolik',
      label: 'Xatolik',
      type: 'error',
      x: 250,
      y: 40,
      connections: []
    },
    {
      id: 'muzokara-galaba',
      label: 'G\'alaba',
      type: 'success',
      x: 250,
      y: 60,
      connections: []
    },
    {
      id: 'muzokara-xatolik',
      label: 'Xatolik',
      type: 'error',
      x: 250,
      y: 80,
      connections: []
    }
  ]

  const iracSteps = [
    { id: 1, title: 'Issue', label: 'Muammoni aniqlash' },
    { id: 2, title: 'Rule', label: 'Qoidani topish' },
    { id: 3, title: 'Application', label: 'Qoidani qo\'llash' },
    { id: 4, title: 'Conclusion', label: 'Xulosa' }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Boshlang\'ich': return 'bg-green-100 text-green-700'
      case 'O\'rta': return 'bg-yellow-100 text-yellow-700'
      case 'Yuqori': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'start': return 'bg-blue-500'
      case 'process': return 'bg-blue-600'
      case 'success': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chap yon menyu */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Case-Law AI</h2>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-600">
              <Home className="w-4 h-4 mr-2" />
              Bosh sahifa
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <FileText className="w-4 h-4 mr-2" />
              Case Solver
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <GitBranch className="w-4 h-4 mr-2" />
              Decision Tree
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <PlayCircle className="w-4 h-4 mr-2" />
              Simulyator
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <HelpCircle className="w-4 h-4 mr-2" />
              Test & Quiz
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Chat Assistant
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <BookOpen className="w-4 h-4 mr-2" />
              Mening kurslarim
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <Database className="w-4 h-4 mr-2" />
              Qonunlar bazasi
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Kundalik maqsad</span>
              <span className="text-sm font-medium text-gray-900">2/3 soat</span>
            </div>
            <Progress value={66} className="h-2" />
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Premium ga o'tish
            </Button>
          </div>
        </div>
      </div>

      {/* Markaziy ma'lumotlar bloki */}
      <div className="flex-1 flex flex-col">
        {/* Yuqori boshqaruv paneli */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Keyslar, qonunlar yoki mavzularni qidirish..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-gray-700">
                O'zbekcha
              </Button>
              <Button variant="ghost" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  SK
                </div>
                <span className="text-gray-700">Sarvar K.</span>
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" className="text-blue-600 border-blue-200">
              Umumiy
            </Button>
            <Button variant="ghost" className="text-gray-600">
              Amaliyot
            </Button>
            <Button variant="ghost" className="text-gray-600">
              O'rganish
            </Button>
            <Button variant="ghost" className="text-gray-600">
              Jamiyat
            </Button>
          </div>
        </div>

        {/* Statistika vidjetlari */}
        <div className="p-4">
          <div className="grid grid-cols-5 gap-4 mb-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">Level 8</div>
                <div className="text-sm text-gray-600">Daraja</div>
                <div className="text-xs text-gray-500 mt-1">2,450 XP</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="w-5 h-5 text-green-500" />
                  <span className="text-xs text-green-600">+5%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">87%</div>
                <div className="text-sm text-gray-600">G'alaba</div>
                <div className="text-xs text-gray-500 mt-1">45/52 keys</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-xs text-green-600">Aktiv</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">7 kun</div>
                <div className="text-sm text-gray-600">Seriya</div>
                <div className="text-xs text-gray-500 mt-1">Rekord: 15 kun</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="text-xs text-green-600">+3</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">#234</div>
                <div className="text-sm text-gray-600">Global reyting</div>
                <div className="text-xs text-gray-500 mt-1">Top 5%</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="text-xs text-green-600">+2h</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">156h</div>
                <div className="text-sm text-gray-600">Vaqt</div>
                <div className="text-xs text-gray-500 mt-1">Bu oy: 24h</div>
              </CardContent>
            </Card>
          </div>

          {/* "So'nggi ishlar" va "Yutuqlar" */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Keyslar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCases.map((case_, index) => {
                    const Icon = case_.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{case_.title}</div>
                            <div className="text-xs text-gray-500">{case_.difficulty}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{case_.score}</div>
                          <div className="text-xs text-gray-500">ball</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Yutuqlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${achievement.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{achievement.title}</div>
                          <div className="text-xs text-gray-500">{achievement.description}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pastki ishchi uskunalar */}
          <div className="grid grid-cols-2 gap-4">
            {/* Case Solver */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Case Solver (IRAC)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Bosqichlar */}
                  <div className="flex justify-between mb-4">
                    {iracSteps.map((step) => (
                      <div key={step.id} className="flex flex-col items-center">
                        <button
                          onClick={() => setSelectedStep(step.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                            selectedStep === step.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {step.id}
                        </button>
                        <span className="text-xs text-gray-600 mt-1">{step.title}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Savol-javob maydoni */}
                  <div>
                    <div className="mb-2">
                      <span className="font-medium text-gray-900">
                        {iracSteps.find(s => s.id === selectedStep)?.label}
                      </span>
                    </div>
                    <Textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Javobingizni kiriting..."
                      className="min-h-[100px] mb-3"
                    />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Javobni tekshirish
                    </Button>
                  </div>
                  
                  {/* Maslahat bloki */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">AI Maslahati</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Bu bosqichda muammoni aniq aniqlash muhim. Asosiy huquqiy masalani ajratib oling va uni qisqacha bayon eting.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Decision Tree Engine */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Decision Tree Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Boshqaruv */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium">{Math.round(zoomLevel * 100)}%</span>
                      <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button size="sm" variant="outline">
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Qayta boshlash
                    </Button>
                  </div>
                  
                  {/* Daraxt vizualizatsiyasi */}
                  <div className="relative h-64 bg-gray-50 rounded-lg overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 300 100">
                      {/* Chiziqlar */}
                      {decisionTreeNodes.map((node) => 
                        node.connections.map((targetId) => {
                          const target = decisionTreeNodes.find(n => n.id === targetId)
                          if (!target) return null
                          return (
                            <line
                              key={`${node.id}-${targetId}`}
                              x1={node.x}
                              y1={node.y}
                              x2={target.x}
                              y2={target.y}
                              stroke="#d1d5db"
                              strokeWidth="1"
                            />
                          )
                        })
                      )}
                      
                      {/* Tugunlar */}
                      {decisionTreeNodes.map((node) => (
                        <g key={node.id}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="8"
                            className={getNodeTypeColor(node.type)}
                          />
                          <text
                            x={node.x}
                            y={node.y - 12}
                            textAnchor="middle"
                            className="text-xs font-medium text-gray-700"
                          >
                            {node.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Boshlan\'gich</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-600">Jarayon</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">G\'alaba</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">Xatolik</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
