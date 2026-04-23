'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  BookOpen,
  BarChart3,
  FileText,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Target,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  level: number
  xp: number
  streak: number
  casesCompleted: number
  winRate: number
  lastActive: string
}

interface Assignment {
  id: string
  title: string
  description: string
  difficulty: string
  dueDate: string
  submissions: number
  totalStudents: number
  averageScore: number
  status: 'draft' | 'published' | 'closed'
}

interface Class {
  id: string
  name: string
  code: string
  students: number
  averageLevel: number
  activeAssignments: number
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const mockClasses: Class[] = [
    {
      id: '1',
      name: 'Contract Law 101',
      code: 'CL101-2024',
      students: 32,
      averageLevel: 8,
      activeAssignments: 3
    },
    {
      id: '2',
      name: 'Tort Law Advanced',
      code: 'TL301-2024',
      students: 18,
      averageLevel: 12,
      activeAssignments: 2
    }
  ]

  const mockAssignments: Assignment[] = [
    {
      id: '1',
      title: 'Breach of Contract Analysis',
      description: 'Analyze a software development contract breach case using IRAC method',
      difficulty: 'INTERMEDIATE',
      dueDate: '2024-04-25',
      submissions: 28,
      totalStudents: 32,
      averageScore: 82,
      status: 'published'
    },
    {
      id: '2',
      title: 'Negligence Case Study',
      description: 'Complete a personal injury negligence case with evidence analysis',
      difficulty: 'BEGINNER',
      dueDate: '2024-04-28',
      submissions: 15,
      totalStudents: 18,
      averageScore: 78,
      status: 'published'
    }
  ]

  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@university.edu',
      level: 15,
      xp: 1450,
      streak: 12,
      casesCompleted: 45,
      winRate: 89,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      email: 'michael.r@university.edu',
      level: 12,
      xp: 1180,
      streak: 7,
      casesCompleted: 38,
      winRate: 76,
      lastActive: '1 day ago'
    },
    {
      id: '3',
      name: 'Emma Thompson',
      email: 'emma.t@university.edu',
      level: 10,
      xp: 950,
      streak: 5,
      casesCompleted: 32,
      winRate: 71,
      lastActive: '3 days ago'
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-orange-100 text-orange-800'
      case 'EXPERT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'closed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportData = (type: 'students' | 'assignments' | 'analytics') => {
    // Mock export functionality
    console.log(`Exporting ${type} data...`)
    alert(`Exporting ${type} data to Excel/CSV...`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Teacher Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">50</div>
                  <p className="text-xs text-muted-foreground">
                    Across 2 classes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">
                    2 due this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Class Score</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">81%</div>
                  <p className="text-xs text-muted-foreground">
                    +3% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">
                    Active this week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        student: 'Sarah Chen',
                        assignment: 'Breach of Contract Analysis',
                        score: 92,
                        time: '2 hours ago',
                        status: 'graded'
                      },
                      {
                        student: 'Michael Rodriguez',
                        assignment: 'Negligence Case Study',
                        score: 85,
                        time: '4 hours ago',
                        status: 'graded'
                      },
                      {
                        student: 'Emma Thompson',
                        assignment: 'Breach of Contract Analysis',
                        score: null,
                        time: '6 hours ago',
                        status: 'pending'
                      }
                    ].map((submission, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{submission.student}</h4>
                          <p className="text-xs text-gray-600">{submission.assignment}</p>
                          <p className="text-xs text-gray-500">{submission.time}</p>
                        </div>
                        <div className="text-right">
                          {submission.score ? (
                            <>
                              <div className="text-lg font-bold text-green-600">{submission.score}%</div>
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                {submission.status}
                              </Badge>
                            </>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              {submission.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                </CardTitle>
                <CardTitle>Class Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockClasses.map((class_) => (
                      <div key={class_.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{class_.name}</h4>
                          <Badge variant="outline">{class_.code}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Students:</span>
                            <span className="font-medium ml-1">{class_.students}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Level:</span>
                            <span className="font-medium ml-1">{class_.averageLevel}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Assignments:</span>
                            <span className="font-medium ml-1">{class_.activeAssignments}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Classes</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Class
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockClasses.map((class_) => (
                <Card key={class_.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{class_.name}</CardTitle>
                        <p className="text-sm text-gray-600">{class_.code}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{class_.students}</div>
                          <div className="text-xs text-gray-600">Students</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{class_.averageLevel}</div>
                          <div className="text-xs text-gray-600">Avg Level</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{class_.activeAssignments}</div>
                          <div className="text-xs text-gray-600">Active</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Users className="w-4 h-4 mr-2" />
                          Manage Students
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Assignments</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </div>

            <div className="space-y-4">
              {mockAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{assignment.title}</h3>
                          <Badge className={getDifficultyColor(assignment.difficulty)}>
                            {assignment.difficulty}
                          </Badge>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{assignment.description}</p>
                        
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Due:</span>
                            <span className="font-medium ml-1">{assignment.dueDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Submissions:</span>
                            <span className="font-medium ml-1">
                              {assignment.submissions}/{assignment.totalStudents}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Score:</span>
                            <span className="font-medium ml-1">{assignment.averageScore}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Progress:</span>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={(assignment.submissions / assignment.totalStudents) * 100} 
                                className="flex-1 h-2" 
                              />
                              <span className="text-xs">
                                {Math.round((assignment.submissions / assignment.totalStudents) * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Students</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          XP
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Streak
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cases
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Win Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline">{student.level}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.xp}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm text-gray-900">{student.streak}</div>
                              <div className="ml-2">🔥</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.casesCompleted}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{student.winRate}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.lastActive}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
