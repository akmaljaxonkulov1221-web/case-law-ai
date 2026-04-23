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
  ArrowRight,
  BarChart3,
  Users,
  Settings,
  Award,
  Lightbulb,
  Scale,
  HelpCircle as HelpIcon
} from 'lucide-react'

export default function UltimateFinalDashboard() {
  const [selectedStep, setSelectedStep] = useState(1)
  const [userAnswer, setUserAnswer] = useState('')
  const [zoomLevel, setZoomLevel] = useState(0.8)

  const recentCases = [
    {
      title: 'Shartnoma',
      difficulty: 'O\'rta',
      score: 85,
      status: 'completed',
      icon: FileText,
      category: 'Shartnoma huquqi',
      timeAgo: '2 soat oldin'
    },
    {
      title: 'Ehtiyotsizlik',
      difficulty: 'Boshlang\'ich',
      score: 92,
      status: 'completed',
      icon: AlertCircle,
      category: 'Fuqarolik huquqi',
      timeAgo: '5 soat oldin'
    },
    {
      title: 'Intellektual mulk',
      difficulty: 'Yuqori',
      score: 78,
      status: 'completed',
      icon: Star,
      category: 'Intellektual mulk huquqi',
      timeAgo: '1 kun oldin'
    }
  ]

  const achievements = [
    {
      title: 'Birinchi g\'alaba',
      description: 'Birinchi keysni muvaffaqiyatli yechish',
      icon: Trophy,
      color: 'bg-yellow-100 text-yellow-600',
      status: 'Yangi'
    },
    {
      title: 'Mantiq ustasi',
      description: 'IRAC metodini mukammal o\'rganish',
      icon: Target,
      color: 'bg-blue-100 text-blue-600',
      status: 'Milestone'
    },
    {
      title: 'Faol o\'quvchi',
      description: '7 kun ketma-ket o\'qish',
      icon: Flame,
      color: 'bg-orange-100 text-orange-600',
      status: 'Exploration'
    }
  ]

  const decisionTreeNodes = [
    {
      id: 'start',
      label: 'Shartnoma buzildi',
      type: 'start',
      x: 60,
      y: 50,
      connections: ['sud', 'muzokara']
    },
    {
      id: 'sud',
      label: 'Sudga murojaat',
      type: 'process',
      x: 160,
      y: 30,
      connections: ['sud-galaba', 'sud-xatolik']
    },
    {
      id: 'muzokara',
      label: 'Muzokara qilish',
      type: 'process',
      x: 160,
      y: 70,
      connections: ['muzokara-galaba', 'muzokara-xatolik']
    },
    {
      id: 'sud-galaba',
      label: 'G\'alaba',
      type: 'success',
      x: 260,
      y: 20,
      connections: []
    },
    {
      id: 'sud-xatolik',
      label: 'Xatolik',
      type: 'error',
      x: 260,
      y: 40,
      connections: []
    },
    {
      id: 'muzokara-galaba',
      label: 'G\'alaba',
      type: 'success',
      x: 260,
      y: 60,
      connections: []
    },
    {
      id: 'muzokara-xatolik',
      label: 'Xatolik',
      type: 'error',
      x: 260,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Yangi': return 'bg-blue-100 text-blue-700'
      case 'Milestone': return 'bg-purple-100 text-purple-700'
      case 'Exploration': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chap yon menyu */}
      <div className="w-64 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Case-Law AI</h2>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Button className="w-full justify-start bg-blue-600 text-white">
              <Home className="w-4 h-4 mr-3" />
              Bosh sahifa
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <FileText className="w-4 h-4 mr-3 text-blue-500" />
              Case Solver
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <GitBranch className="w-4 h-4 mr-3 text-green-500" />
              Decision Tree
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <PlayCircle className="w-4 h-4 mr-3 text-purple-500" />
              Simulyator
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <HelpCircle className="w-4 h-4 mr-3 text-orange-500" />
              Test & Quiz
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <MessageSquare className="w-4 h-4 mr-3 text-pink-500" />
              AI Chat Assistant
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <BookOpen className="w-4 h-4 mr-3 text-indigo-500" />
              Mening kurslarim
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <Database className="w-4 h-4 mr-3 text-cyan-500" />
              Qonunlar bazasi
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <BarChart3 className="w-4 h-4 mr-3 text-teal-500" />
              Statistika
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <Users className="w-4 h-4 mr-3 text-lime-500" />
              Jamiyat
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <Settings className="w-4 h-4 mr-3 text-gray-500" />
              Pro vositalar
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Kundalik maqsad</span>
              <span className="text-sm font-bold text-gray-900">2/3 soat</span>
            </div>
            <Progress value={66} className="h-2 mb-2" />
            <div className="text-xs text-gray-600">550 XP keyingi darajagacha</div>
          </div>
          
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50">
              <Settings className="w-4 h-4 mr-3" />
              Sozlamalar
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50">
              <HelpIcon className="w-4 h-4 mr-3" />
              Yordam
            </Button>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold shadow-lg rounded-full">
            <Star className="w-4 h-4 mr-2" />
            Premium ga o'tish
          </Button>
        </div>
      </div>

      {/* Markaziy ma'lumotlar bloki */}
      <div className="flex-1 flex flex-col">
        {/* Yuqori boshqaruv paneli */}
        <div className="bg-white border-b border-gray-200 p-4 relative z-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Keyslar, qonunlar yoki mavzularni qidirish... ⌘ K"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-gray-700">
                O'zbekcha
              </Button>
              <Button variant="ghost" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </Button>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  SK
                </div>
                <div className="text-left">
                  <div className="text-gray-700">Sarvar K.</div>
                  <div className="text-xs text-gray-400">12-daraja</div>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" className="text-blue-600 border-blue-200 rounded-full">
              Umumiy
            </Button>
            <Button variant="ghost" className="text-gray-600 rounded-full">
              Amaliyot
            </Button>
            <Button variant="ghost" className="text-gray-600 rounded-full">
              O'rganish
            </Button>
            <Button variant="ghost" className="text-gray-600 rounded-full">
              Jamiyat
            </Button>
          </div>
        </div>

        {/* Statistika vidjetlari */}
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-5 gap-4 mb-8">
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                  <span className="text-sm font-medium text-green-600">+12%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">Level 8</div>
                <div className="text-sm text-gray-400 mb-3">Daraja</div>
                <div className="space-y-2">
                  <Progress value={75} className="h-3 rounded-full" />
                  <div className="text-xs text-gray-400">550 XP keyingi darajagacha</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-sm font-medium text-green-600">+5%</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">87%</div>
                <div className="text-sm text-gray-400 mb-3">G'alaba</div>
                <div className="text-xs text-gray-400">Davom eting!</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-sm font-medium text-green-600">Aktiv</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">7 kun</div>
                <div className="text-sm text-gray-400 mb-3">Seriya</div>
                <div className="text-xs text-gray-400">Qayta ishlang!</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-green-600">+3</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">#234</div>
                <div className="text-sm text-gray-400 mb-3">Global reyting</div>
                <div className="text-xs text-gray-400">Top 5%</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium text-green-600">+2h</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">156h</div>
                <div className="text-sm text-gray-400 mb-3">Vaqt</div>
                <div className="text-xs text-gray-400">Bu oy: 24h</div>
              </CardContent>
            </Card>
          </div>

          {/* "So'nggi ishlar" va "Yutuqlar" */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Keyslar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentCases.map((case_, index) => {
                    const Icon = case_.icon
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 mb-1">{case_.title}</div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                              <Badge className={getDifficultyColor(case_.difficulty)}>
                                {case_.difficulty}
                              </Badge>
                              <span>{case_.category}</span>
                            </div>
                            <div className="text-xs text-gray-600">{case_.timeAgo}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{case_.score}</div>
                          <div className="text-sm text-gray-500">Ball</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Yutuqlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon
                    return (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${achievement.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">{achievement.title}</div>
                          <div className="text-xs text-gray-500">{achievement.description}</div>
                        </div>
                        <Badge className={`${getStatusColor(achievement.status)} rounded-full px-3 py-1`}>
                          {achievement.status}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pastki ishchi uskunalar */}
          <div className="grid grid-cols-2 gap-6">
            {/* Case Solver */}
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Case Solver (IRAC)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Bosqichlar */}
                  <div className="flex justify-between mb-6">
                    {iracSteps.map((step, index) => (
                      <div key={step.id} className="flex flex-col items-center relative">
                        {index < iracSteps.length - 1 && (
                          <div className={`absolute top-6 left-12 w-20 h-1 ${
                            step.id < selectedStep ? 'bg-blue-600' : 'bg-gray-300'
                          }`} />
                        )}
                        <button
                          onClick={() => setSelectedStep(step.id)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-3 ${
                            selectedStep === step.id
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-600 border-gray-300'
                          }`}
                        >
                          {step.id}
                        </button>
                        <span className="text-xs text-gray-600 mt-2">{step.title}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Savol-javob maydoni */}
                  <div>
                    <div className="mb-4">
                      <span className="font-medium text-gray-900">
                        {iracSteps.find(s => s.id === selectedStep)?.label}
                      </span>
                    </div>
                    <div className="relative mb-3">
                      <Textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Javobingizni shu yerga yozing..."
                        className="min-h-[120px] pr-12 bg-white border-blue-200 focus:border-blue-500"
                      />
                      <Button size="sm" variant="ghost" className="absolute top-3 right-3">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                      </Button>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Maslahat
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Javobni tekshirish
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Decision Tree Engine */}
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Decision Tree Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
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
                  <div className="relative h-80 bg-gray-50 rounded-lg overflow-hidden">
                    <svg 
                      className="w-full h-full" 
                      viewBox="0 0 320 100"
                      style={{ transform: `scale(${zoomLevel})` }}
                    >
                      {/* Egilgan chiziqlar */}
                      {decisionTreeNodes.map((node) => 
                        node.connections.map((targetId) => {
                          const target = decisionTreeNodes.find(n => n.id === targetId)
                          if (!target) return null
                          const midX = (node.x + target.x) / 2
                          const midY = (node.y + target.y) / 2 + 8
                          return (
                            <path
                              key={`${node.id}-${targetId}`}
                              d={`M ${node.x} ${node.y} Q ${midX} ${midY} ${target.x} ${target.y}`}
                              stroke="#9ca3af"
                              strokeWidth="3"
                              fill="none"
                            />
                          )
                        })
                      )}
                      
                      {/* Rangli bloklar */}
                      <rect x="250" y="8" width="70" height="20" rx="4" className="fill-green-50 stroke-green-200" />
                      <rect x="250" y="38" width="70" height="20" rx="4" className="fill-red-50 stroke-red-200" />
                      <rect x="250" y="68" width="70" height="20" rx="4" className="fill-green-50 stroke-green-200" />
                      <rect x="250" y="98" width="70" height="20" rx="4" className="fill-red-50 stroke-red-200" />
                      
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
                            x={node.x + 15}
                            y={node.y + 3}
                            textAnchor="start"
                            className="text-xs font-medium text-gray-700"
                          >
                            {node.label}
                          </text>
                        </g>
                      ))}
                      
                      {/* Natijalar matnlari */}
                      <text x="285" y="25" textAnchor="middle" className="text-xs font-medium text-green-700">Sud qarori</text>
                      <text x="285" y="55" textAnchor="middle" className="text-xs font-medium text-red-700">Rad etish</text>
                      <text x="285" y="85" textAnchor="middle" className="text-xs font-medium text-green-700">Kelishuv</text>
                      <text x="285" y="115" textAnchor="middle" className="text-xs font-medium text-red-700">Bekor qilish</text>
                    </svg>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center gap-6 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Boshlan\'gich</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-600">Jarayon</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">G\'alaba</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
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
