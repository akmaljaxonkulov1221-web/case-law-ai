'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Bookmark,
  Download,
  Share2,
  Calendar,
  FileText,
  Scale,
  Users,
  Clock,
  TrendingUp,
  Star,
  Hash,
  ChevronDown,
  X,
  Plus,
  Settings,
  Eye,
  ThumbsUp,
  MessageSquare
} from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  content: string
  type: 'case' | 'law' | 'article' | 'forum' | 'document'
  category: string
  tags: string[]
  author?: string
  date: string
  relevance: number
  views: number
  likes: number
  replies?: number
  bookmarked: boolean
}

interface SearchFilter {
  type: string[]
  category: string[]
  dateRange: string
  sortBy: string
}

interface BookmarkItem {
  id: string
  title: string
  type: string
  date: string
  tags: string[]
}

export default function SearchSystem() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [filters, setFilters] = useState<SearchFilter>({
    type: [],
    category: [],
    dateRange: 'all',
    sortBy: 'relevance'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [activeTab, setActiveTab] = useState<'search' | 'bookmarks'>('search')
  const [isSearching, setIsSearching] = useState(false)

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Shartnoma buzilishi bo\'yicha sud qarori',
      content: 'Toshkent shahar fuqarolik ishlari bo\'limining 2024-yil 15-yanvardagi qarori. Shartnoma shartlarini buzish to\'g\'risida FK 330-moddasi asosida...',
      type: 'case',
      category: 'Shartnoma huquqi',
      tags: ['shartnoma', 'buzilish', 'FK 330-moda', 'sud qarori'],
      author: 'Toshkent shahar sud',
      date: '2024-01-15',
      relevance: 0.95,
      views: 234,
      likes: 18,
      replies: 5,
      bookmarked: false
    },
    {
      id: '2',
      title: 'Fuqarolik kodeksi 330-moddasi',
      content: '330-moda. Shartnoma to\'lovlari. Shartnoma bo\'yicha to\'lovlar shartnomada belgilangan muddatda yoki shartnomada muddat belgilanmagan bo\'lsa...',
      type: 'law',
      category: 'Qonunchilik',
      tags: ['FK', '330-moda', 'shartnoma', 'to\'lov'],
      author: 'O\'zbekiston Respublikasi',
      date: '2023-12-01',
      relevance: 0.92,
      views: 567,
      likes: 45,
      bookmarked: true
    },
    {
      id: '3',
      title: 'Intellektual mulk huquqi: amaliy qo\'llanma',
      content: 'Intellektual mulk huquqini amaliy qo\'llanmasi. Patent olish, mualliflik huquqlari va ularni himoya qilish tartibi...',
      type: 'article',
      category: 'Intellektual mulk',
      tags: ['intellektual mulk', 'patent', 'mualliflik huquqi', 'himoya'],
      author: 'Dr. A. Karimov',
      date: '2024-01-10',
      relevance: 0.88,
      views: 123,
      likes: 12,
      bookmarked: false
    },
    {
      id: '4',
      title: 'Sud hujjatlarini notijoratlashtirish masalalari',
      content: 'Forum muhokamasi: Sud hujjatlarini notijoratlashtirishda qanday qiyinchiliklarga duch kelyapsiz? Men o\'zim quyidagi muammolarni kuzatyapman...',
      type: 'forum',
      category: 'Sud jarayoni',
      tags: ['notijoratlashtirish', 'sud hujjatlari', 'muammo', 'forum'],
      author: 'Bobur Toshmatov',
      date: '2024-01-20',
      relevance: 0.85,
      views: 89,
      likes: 8,
      replies: 6,
      bookmarked: false
    },
    {
      id: '5',
      title: 'Shartnoma shabloni (to\'lov shartlari)',
      content: 'Standart shartnoma shabloni. To\'lov shartlari, muddatlari, javobgarlik va boshqa muhim bandlar...',
      type: 'document',
      category: 'Shablonlar',
      tags: ['shablon', 'shartnoma', 'to\'lov', 'huquqiy'],
      date: '2023-11-15',
      relevance: 0.82,
      views: 456,
      likes: 23,
      bookmarked: true
    }
  ]

  const mockBookmarks: BookmarkItem[] = [
    {
      id: '2',
      title: 'Fuqarolik kodeksi 330-moddasi',
      type: 'law',
      date: '2024-01-15',
      tags: ['FK', '330-moda', 'shartnoma']
    },
    {
      id: '5',
      title: 'Shartnoma shabloni (to\'lov shartlari)',
      type: 'document',
      date: '2024-01-10',
      tags: ['shablon', 'shartnoma', 'to\'lov']
    }
  ]

  const contentTypes = [
    { value: 'case', label: 'Sud ishlari', icon: Scale, color: 'bg-red-100 text-red-700' },
    { value: 'law', label: 'Qonunlar', icon: FileText, color: 'bg-blue-100 text-blue-700' },
    { value: 'article', label: 'Maqolalar', icon: FileText, color: 'bg-green-100 text-green-700' },
    { value: 'forum', label: 'Forum', icon: MessageSquare, color: 'bg-purple-100 text-purple-700' },
    { value: 'document', label: 'Hujjatlar', icon: FileText, color: 'bg-orange-100 text-orange-700' }
  ]

  const categories = [
    'Shartnoma huquqi',
    'Qonunchilik',
    'Intellektual mulk',
    'Sud jarayoni',
    'Shablonlar',
    'Fuqarolik huquqi'
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Ahamiyat bo\'yicha' },
    { value: 'date', label: 'Sana bo\'yicha' },
    { value: 'popularity', label: 'Ommaboplik bo\'yicha' },
    { value: 'views', label: 'Ko\'rishlar bo\'yicha' }
  ]

  React.useEffect(() => {
    setBookmarks(mockBookmarks)
  }, [])

  const performSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    
    setTimeout(() => {
      const results = mockResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      
      setSearchResults(results)
      setIsSearching(false)
    }, 1000)
  }

  const toggleBookmark = (resultId: string) => {
    setSearchResults(results => 
      results.map(result => 
        result.id === resultId ? { ...result, bookmarked: !result.bookmarked } : result
      )
    )
  }

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId))
  }

  const getTypeColor = (type: string) => {
    const typeConfig = contentTypes.find(t => t.value === type)
    return typeConfig?.color || 'bg-gray-100 text-gray-700'
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = contentTypes.find(t => t.value === type)
    return typeConfig?.icon || FileText
  }

  const formatRelevance = (relevance: number) => {
    return `${Math.round(relevance * 100)}%`
  }

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.9) return 'text-green-600'
    if (relevance >= 0.8) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Advanced Search System
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Input */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Qonunlar, sud ishlari, maqolalar yoki hujjatlarni qidiring..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button onClick={performSearch} disabled={isSearching}>
              {isSearching ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Qidirilmoqda...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Qidirish
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              {/* Content Types */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Turlar</h4>
                <div className="flex flex-wrap gap-2">
                  {contentTypes.map(type => {
                    const Icon = type.icon
                    return (
                      <Button
                        key={type.value}
                        variant={filters.type.includes(type.value) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            type: prev.type.includes(type.value)
                              ? prev.type.filter(t => t !== type.value)
                              : [...prev.type, type.value]
                          }))
                        }}
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        {type.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Kategoriyalar</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={filters.category.includes(category) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          category: prev.category.includes(category)
                            ? prev.category.filter(c => c !== category)
                            : [...prev.category, category]
                        }))
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Saralash</h4>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setFilters({
                  type: [],
                  category: [],
                  dateRange: 'all',
                  sortBy: 'relevance'
                })}>
                  Filterlarni tozalash
                </Button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200">
            <Button
              variant={activeTab === 'search' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('search')}
              className="border-b-2 border-transparent rounded-none"
            >
              Qidirish natijalari
            </Button>
            <Button
              variant={activeTab === 'bookmarks' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('bookmarks')}
              className="border-b-2 border-transparent rounded-none"
            >
              Bookmarklar ({bookmarks.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            searchResults.map(result => {
              const TypeIcon = getTypeIcon(result.type)
              return (
                <Card key={result.id} className="bg-white border-gray-200 rounded-xl shadow-sm">
                  <CardContent className="p-6">
                    {/* Result Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <TypeIcon className="w-5 h-5 text-gray-600" />
                        <Badge className={getTypeColor(result.type)}>
                          {contentTypes.find(t => t.value === result.type)?.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {result.category}
                        </Badge>
                        <div className={`text-sm font-medium ${getRelevanceColor(result.relevance)}`}>
                          {formatRelevance(result.relevance)}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(result.id)}
                      >
                        <Bookmark className={`w-4 h-4 ${result.bookmarked ? 'fill-current text-blue-600' : ''}`} />
                      </Button>
                    </div>

                    {/* Result Content */}
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{result.title}</h3>
                      <p className="text-gray-700 line-clamp-3">{result.content}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {result.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Hash className="w-3 h-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Result Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {result.author && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {result.author}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {result.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {result.views}
                        </div>
                        {result.likes > 0 && (
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {result.likes}
                          </div>
                        )}
                        {result.replies !== undefined && result.replies > 0 && (
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {result.replies}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Hech narsa topilmadi</h3>
                <p className="text-gray-600">Qidiruv so\'rovingizni o\'zgartiring yoki filterlarni tozalang</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {bookmarks.length > 0 ? (
            bookmarks.map(bookmark => {
              const TypeIcon = getTypeIcon(bookmark.type)
              return (
                <Card key={bookmark.id} className="bg-white border-gray-200 rounded-xl shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <TypeIcon className="w-5 h-5 text-gray-600" />
                        <Badge className={getTypeColor(bookmark.type)}>
                          {contentTypes.find(t => t.value === bookmark.type)?.label}
                        </Badge>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBookmark(bookmark.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{bookmark.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {bookmark.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Hash className="w-3 h-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {bookmark.date}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-8 text-center">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bookmarklar yo\'q</h3>
                <p className="text-gray-600">Qidiruv natijalarini bookmarklang</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
