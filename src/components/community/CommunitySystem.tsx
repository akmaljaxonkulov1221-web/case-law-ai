'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Eye,
  Star,
  Award,
  Calendar,
  Hash,
  Plus,
  Edit3,
  Trash2,
  Bell,
  Settings,
  Globe,
  Heart
} from 'lucide-react'

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    level: number
    badges: string[]
  }
  category: string
  tags: string[]
  likes: number
  dislikes: number
  replies: number
  views: number
  timestamp: Date
  isPinned: boolean
  isLocked: boolean
}

interface Discussion {
  id: string
  postId: string
  author: {
    name: string
    avatar: string
    level: number
  }
  content: string
  likes: number
  timestamp: Date
  isAnswer: boolean
}

interface CommunityMember {
  id: string
  name: string
  avatar: string
  level: number
  points: number
  badges: string[]
  joinDate: Date
  isActive: boolean
  reputation: number
}

export default function CommunitySystem() {
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: '1',
      title: 'Shartnoma buzilishi bo\'yicha sud amaliyoti',
      content: 'Hurmatli hamkasblar, men shartnoma buzilishi bo\'yicha sud qarorini topishda yordam so\'rayman. FK 330-moddasiga qarab, to\'lov muddati 30 kun ichida amalga oshirilishi kerak, ammo mijoz 45 kundan keyin to\'lov qildi...',
      author: {
        name: 'Sarvar Karimov',
        avatar: 'SK',
        level: 12,
        badges: ['Expert', 'Helper']
      },
      category: 'Shartnoma huquqi',
      tags: ['shartnoma', 'to\'lov', 'FK 330-moda'],
      likes: 24,
      dislikes: 2,
      replies: 8,
      views: 156,
      timestamp: new Date(Date.now() - 3600000),
      isPinned: true,
      isLocked: false
    },
    {
      id: '2',
      title: 'Intellektual mulk huquqi: yangi o\'zgarishlar',
      content: 'O\'zbekiston Respublikasining Intellektual mulk to\'g\'risidagi qonuniga so\'nggi o\'zgarishlar kiritildi. Asosiy yangiliklar: 1) Patent muddati 20 yildan 25 yilgacha uzaytirildi...',
      author: {
        name: 'Dilnoza Azimova',
        avatar: 'DA',
        level: 15,
        badges: ['Moderator', 'Expert']
      },
      category: 'Intellektual mulk',
      tags: ['intellektual mulk', 'patent', 'qonun o\'zgarishi'],
      likes: 45,
      dislikes: 1,
      replies: 12,
      views: 289,
      timestamp: new Date(Date.now() - 7200000),
      isPinned: false,
      isLocked: false
    },
    {
      id: '3',
      title: 'Sud hujjatlarini notijoratlashtirish masalasi',
      content: 'Sud hujjatlarini notijoratlashtirishda qanday qiyinchiliklarga duch kelyapsiz? Men o\'zim quyidagi muammolarni kuzatyapman: 1) Notijoratlash jarayoni uzoq davom etadi...',
      author: {
        name: 'Bobur Toshmatov',
        avatar: 'BT',
        level: 8,
        badges: ['Newcomer']
      },
      category: 'Sud jarayoni',
      tags: ['notijoratlashtirish', 'sud hujjatlari', 'muammo'],
      likes: 18,
      dislikes: 3,
      replies: 6,
      views: 98,
      timestamp: new Date(Date.now() - 10800000),
      isPinned: false,
      isLocked: false
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState('barchasi')
  const [searchTerm, setSearchTerm] = useState('')
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '', tags: '' })
  const [showNewPost, setShowNewPost] = useState(false)
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null)

  const categories = [
    { value: 'barchasi', label: 'Barchasi', icon: Globe },
    { value: 'shartnoma', label: 'Shartnoma huquqi', icon: MessageSquare },
    { value: 'fuqarolik', label: 'Fuqarolik huquqi', icon: Users },
    { value: 'intellektual', label: 'Intellektual mulk', icon: Star },
    { value: 'sud', label: 'Sud jarayoni', icon: Award },
    { value: 'boshqa', label: 'Boshqa', icon: Settings }
  ]

  const mockMembers: CommunityMember[] = [
    {
      id: '1',
      name: 'Sarvar Karimov',
      avatar: 'SK',
      level: 12,
      points: 2840,
      badges: ['Expert', 'Helper', 'Top Contributor'],
      joinDate: new Date('2023-01-15'),
      isActive: true,
      reputation: 892
    },
    {
      id: '2',
      name: 'Dilnoza Azimova',
      avatar: 'DA',
      level: 15,
      points: 3560,
      badges: ['Moderator', 'Expert', 'Mentor'],
      joinDate: new Date('2022-11-20'),
      isActive: true,
      reputation: 1245
    },
    {
      id: '3',
      name: 'Bobur Toshmatov',
      avatar: 'BT',
      level: 8,
      points: 890,
      badges: ['Newcomer'],
      joinDate: new Date('2023-08-10'),
      isActive: false,
      reputation: 234
    }
  ]

  const mockDiscussions: Discussion[] = [
    {
      id: '1',
      postId: '1',
      author: {
        name: 'Dilnoza Azimova',
        avatar: 'DA',
        level: 15
      },
      content: 'FK 330-moddasiga ko\'ra, to\'lov muddati 30 kun ichida amalga oshirilishi kerak. Agar to\'lov 45 kundan keyin amalga oshirilgan bo\'lsa, bu shartnomani buzish hisoblanadi. Siz 15 kunlik kechikish uchun foiz to\'lovi talab qilishingiz mumkin.',
      likes: 12,
      timestamp: new Date(Date.now() - 1800000),
      isAnswer: true
    },
    {
      id: '2',
      postId: '1',
      author: {
        name: 'Bobur Toshmatov',
        avatar: 'BT',
        level: 8
      },
      content: 'Shu bilan birga, sudga murojaat etishdan oldin mijoz bilan muzokara qilishni tavsiya etaman. Ko\'pincha, muzokara orqali muammoni tinch yo\'l bilan hal qilish mumkin.',
      likes: 8,
      timestamp: new Date(Date.now() - 900000),
      isAnswer: false
    }
  ]

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffInMinutes < 60) return `${diffInMinutes} daqiqa oldin`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} soat oldin`
    return `${Math.floor(diffInMinutes / 1440)} kun oldin`
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Shartnoma huquqi': return 'bg-blue-100 text-blue-700'
      case 'Fuqarolik huquqi': return 'bg-green-100 text-green-700'
      case 'Intellektual mulk': return 'bg-purple-100 text-purple-700'
      case 'Sud jarayoni': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Expert': return 'bg-purple-100 text-purple-700'
      case 'Moderator': return 'bg-red-100 text-red-700'
      case 'Helper': return 'bg-green-100 text-green-700'
      case 'Newcomer': return 'bg-gray-100 text-gray-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  const createNewPost = () => {
    if (newPost.title && newPost.content) {
      const post: ForumPost = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        author: {
          name: 'Sarvar Karimov',
          avatar: 'SK',
          level: 12,
          badges: ['Expert']
        },
        category: newPost.category,
        tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        likes: 0,
        dislikes: 0,
        replies: 0,
        views: 0,
        timestamp: new Date(),
        isPinned: false,
        isLocked: false
      }
      
      setPosts([post, ...posts])
      setNewPost({ title: '', content: '', category: '', tags: '' })
      setShowNewPost(false)
    }
  }

  const likePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'barchasi' || 
                          post.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Forum */}
      <div className="lg:col-span-2 space-y-6">
        {/* Forum Header */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Huquqiy Jamiyat Forumi
              </CardTitle>
              <Button onClick={() => setShowNewPost(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Yangi mavzu
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Mavzular, teglar yoki foydalanuvchilarni qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    variant={selectedCategory === category.value ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {category.label}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* New Post Modal */}
        {showNewPost && (
          <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>Yangi mavzu yaratish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="text"
                placeholder="Mavzu sarlavhasi"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Kategoriyani tanlang</option>
                {categories.slice(1).map(cat => (
                  <option key={cat.value} value={cat.label}>{cat.label}</option>
                ))}
              </select>
              
              <Textarea
                placeholder="Mavzu mazmuni"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="min-h-[150px]"
              />
              
              <input
                type="text"
                placeholder="Teglar (vergul bilan ajrating)"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="flex gap-2">
                <Button onClick={createNewPost} className="flex-1">
                  Yuborish
                </Button>
                <Button variant="outline" onClick={() => setShowNewPost(false)}>
                  Bekor qilish
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <Card key={post.id} className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {post.author.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{post.author.name}</span>
                        <span className="text-sm text-gray-500">Level {post.author.level}</span>
                        {post.author.badges.map(badge => (
                          <Badge key={badge} className={getBadgeColor(badge)}>
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(post.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {post.isPinned && <div className="text-red-500">📌</div>}
                    {post.isLocked && <div className="text-gray-500">🔒</div>}
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-700 line-clamp-3">{post.content}</p>
                </div>

                {/* Tags and Category */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Hash className="w-3 h-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likePost(post.id)}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {post.replies}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Top Contributors */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Top Foydalanuvchilar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMembers.map(member => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{member.name}</span>
                      {member.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Level {member.level}</span>
                      <span>•</span>
                      <span>{member.points} ball</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{member.reputation}</div>
                    <div className="text-xs text-gray-500">Reyting</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending Topics */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trending Mavzular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">#shartnoma</span>
                <span className="text-xs text-gray-500">24 ta muhokama</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">#sud</span>
                <span className="text-xs text-gray-500">18 ta muhokama</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">#intellektual_mulk</span>
                <span className="text-xs text-gray-500">12 ta muhokama</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">#notijoratlash</span>
                <span className="text-xs text-gray-500">8 ta muhokama</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Jamiyat Statistikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1,234</div>
                <div className="text-sm text-gray-600">Foydalanuvchilar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">5,678</div>
                <div className="text-sm text-gray-600">Mavzular</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">12,345</div>
                <div className="text-sm text-gray-600">Javoblar</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">89</div>
                <div className="text-sm text-gray-600">Bugun faol</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
