'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  FileText,
  PenTool,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Share2,
  Clock,
  TrendingUp,
  Zap,
  BookOpen,
  Scale,
  Target,
  Lightbulb,
  Settings,
  Globe
} from 'lucide-react'

interface DocumentTemplate {
  id: string
  name: string
  type: 'claim' | 'contract' | 'petition' | 'agreement'
  description: string
  fields: string[]
}

interface WritingSuggestion {
  id: string
  type: 'grammar' | 'style' | 'legal' | 'structure'
  text: string
  suggestion: string
  priority: 'high' | 'medium' | 'low'
}

interface AutoUpdate {
  id: string
  title: string
  description: string
  date: string
  type: 'law_change' | 'precedent' | 'regulation'
  impact: 'high' | 'medium' | 'low'
}

export default function LegalWritingAssistant() {
  const [documentContent, setDocumentContent] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [autoUpdates, setAutoUpdates] = useState<AutoUpdate[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('uz')

  const templates: DocumentTemplate[] = [
    {
      id: '1',
      name: 'Da\'vo arizasi',
      type: 'claim',
      description: 'Fuqarolik da\'vosi uchun standart ariza shakli',
      fields: ['Da\'vogar', 'Javobgar', 'Da\'vo talablari', 'Dalillar']
    },
    {
      id: '2',
      name: 'Shartnoma',
      type: 'contract',
      description: 'Ikki tomonlama shartnoma shabloni',
      fields: ['Tomonlar', 'Shartlar', 'Javobgarlik', 'Hal etish tartibi']
    },
    {
      id: '3',
      name: 'Ariza',
      type: 'petition',
      description: 'Sudga ariza berish shakli',
      fields: ['Ariza beruvchi', 'Sud instansiyasi', 'Talablar', 'Asoslari']
    },
    {
      id: '4',
      name: 'Kelishuv',
      type: 'agreement',
      description: 'Tomonlar o\'rtasidagi kelishuv hujjati',
      fields: ['Tomonlar', 'Kelishuv shartlari', 'To\'lov', 'Muddatlar']
    }
  ]

  const mockSuggestions: WritingSuggestion[] = [
    {
      id: '1',
      type: 'grammar',
      text: 'shartnoma shartlari',
      suggestion: 'shartnomaning shartlari',
      priority: 'high'
    },
    {
      id: '2',
      type: 'legal',
      text: 'to\'lov muddati',
      suggestion: 'to\'lov muddati (FK 330-moda asosida)',
      priority: 'high'
    },
    {
      id: '3',
      type: 'style',
      text: 'juda ko\'p',
      suggestion: 'ko\'plab',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'structure',
      text: '3.1-band',
      suggestion: '3.1-band (Tomonlarning majburiyatlari)',
      priority: 'medium'
    }
  ]

  const mockUpdates: AutoUpdate[] = [
    {
      id: '1',
      title: 'Fuqarolik kodeksiga o\'zgartirish',
      description: 'FK 330-moddasiga to\'lov muddatlari bo\'yicha qo\'shimcha',
      date: '2024-01-25',
      type: 'law_change',
      impact: 'high'
    },
    {
      id: '2',
      title: 'Yangi sud amaliyoti',
      description: 'Shartnoma buzilishi bo\'yicha Oliy sud qarori',
      date: '2024-01-20',
      type: 'precedent',
      impact: 'medium'
    },
    {
      id: '3',
      title: 'Me\'yoriy hujjat',
      description: 'Shartnoma tuzish bo\'yicha yangi me\'yoriy yo\'riqnoma',
      date: '2024-01-18',
      type: 'regulation',
      impact: 'low'
    }
  ]

  const languages = [
    { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ]

  const documentTypes = [
    { value: 'claim', label: 'Da\'vo', icon: Scale, color: 'bg-red-100 text-red-700' },
    { value: 'contract', label: 'Shartnoma', icon: FileText, color: 'bg-blue-100 text-blue-700' },
    { value: 'petition', label: 'Ariza', icon: BookOpen, color: 'bg-green-100 text-green-700' },
    { value: 'agreement', label: 'Kelishuv', icon: Target, color: 'bg-purple-100 text-purple-700' }
  ]

  const suggestionTypes = [
    { value: 'grammar', label: 'Grammatika', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
    { value: 'style', label: 'Uslub', icon: PenTool, color: 'bg-blue-100 text-blue-700' },
    { value: 'legal', label: 'Huquqiy', icon: Scale, color: 'bg-purple-100 text-purple-700' },
    { value: 'structure', label: 'Tuzilma', icon: FileText, color: 'bg-green-100 text-green-700' }
  ]

  const updateTypes = [
    { value: 'law_change', label: 'Qonun o\'zgarishi', color: 'bg-red-100 text-red-700' },
    { value: 'precedent', label: 'Pretsedent', color: 'bg-blue-100 text-blue-700' },
    { value: 'regulation', label: 'Me\'yoriy hujjat', color: 'bg-purple-100 text-purple-700' }
  ]

  React.useEffect(() => {
    setSuggestions(mockSuggestions)
    setAutoUpdates(mockUpdates)
  }, [])

  const selectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
    const templateContent = generateTemplateContent(template)
    setDocumentContent(templateContent)
  }

  const generateTemplateContent = (template: DocumentTemplate): string => {
    const date = new Date().toLocaleDateString('uz-UZ')
    let content = `${date}\n\n`
    
    switch (template.type) {
      case 'claim':
        content += `TOSHKENT SHAHR\nFUQAROLIK ISHLARI BO'LIMIGA\n\n`
        content += `Da'vogar: _________________________\n`
        content += `Javobgar: _________________________\n\n`
        content += `DA'VO ARIZASI\n\n`
        content += `Men _________________________ (pasport seriyasi: _____) da'vo qilaman.\n\n`
        content += `Da'vo asoslari:\n`
        content += `1. _________________________\n`
        content += `2. _________________________\n`
        content += `3. _________________________\n\n`
        content += `Da'vo talablari:\n`
        content += `1. _________________________\n`
        content += `2. _________________________\n\n`
        content += `Dalillar:\n`
        content += `1. _________________________\n`
        content += `2. _________________________\n\n`
        content += `Sohragi:\n`
        content += `Da'vogar: _________________________\n`
        content += `Telefon: _________________________\n`
        content += `${date}\n`
        break
        
      case 'contract':
        content += `SHARTNOMA\n\n`
        content += `${date} yil ___________ kun\n`
        content += `Toshkent shahri\n\n`
        content += `Biz _________________________ (keyingi "Tomon 1")\n`
        content += `va _________________________ (keyingi "Tomon 2")\n`
        content += `quyidagi shartnoma tuzdik:\n\n`
        content += `1. SHARTNOMANING PREDMETI\n`
        content += `Tomon 1 Tomon 2 ga _________________________ beradi.\n\n`
        content += `2. NARX VA TO'LOV TARTIBI\n`
        content += `Narxi: _________________________ so\'m\n`
        content += `To\'lov muddati: _________________________ kun ichida.\n\n`
        content += `3. TOMONLARNING MAJBURIYATLARI\n`
        content += `3.1. Tomon 1 majburiyatlari:\n`
        content += `   - _________________________\n`
        content += `3.2. Tomon 2 majburiyatlari:\n`
        content += `   - _________________________\n\n`
        content += `4. JAVOBGARLIK\n`
        content += `Shartnomani buzish uchun javobgarlik _________________________\n\n`
        content += `5. HAL ETISH TARTIBI\n`
        content += `Nizolar _________________________ ko\'rib hal etiladi.\n\n`
        content += `Tomon 1: _________________________\n`
        content += `Tomon 2: _________________________\n`
        break
        
      case 'petition':
        content += `ARIZA\n\n`
        content += `${date} yil\n`
        content += `Toshkent shahri _________________________ tuman sudiga\n\n`
        content += `Ariza beruvchi: _________________________\n`
        content += `Manzil: _________________________\n\n`
        content += `SUDGA ARIZA\n\n`
        content += `Men _________________________ (pasport: _____) dan\n`
        content += `_________________________ haqida ariza beraman.\n\n`
        content += `Talablarim:\n`
        content += `1. _________________________\n`
        content += `2. _________________________\n`
        content += `3. _________________________\n\n`
        content += `Asoslari:\n`
        content += `1. _________________________\n`
        content += `2. _________________________\n\n`
        content += `Iltimos:\n`
        content += `Talablarimni qanoatlantiring.\n\n`
        content += `Ariza beruvchi: _________________________\n`
        content += `${date}\n`
        break
        
      case 'agreement':
        content += `KELISHUV\n\n`
        content += `${date} yil ___________ kun\n`
        content += `Toshkent shahri\n\n`
        content += `Biz _________________________ va _________________________\n`
        content += `quyidagi masalada kelishuv tuzdik:\n\n`
        content += `1. KELISHUVNING PREDMETI\n`
        content += `_________________________ masalasi bo\'yicha.\n\n`
        content += `2. KELISHUV SHARTLARI\n`
        content += `2.1. Tomon 1 majburiyatlari:\n`
        content += `   - _________________________\n`
        content += `2.2. Tomon 2 majburiyatlari:\n`
        content += `   - _________________________\n\n`
        content += `3. TO'LOV\n`
        content += `To\'lov miqdori: _________________________ so\'m\n`
        content += `To\'lov muddati: _________________________\n\n`
        content += `4. JARAYON\n`
        content += `Kelishuv _________________________ dan boshlanadi.\n\n`
        content += `Tomonlar:\n`
        content += `Tomon 1: _________________________\n`
        content += `Tomon 2: _________________________\n`
        break
    }
    
    return content
  }

  const analyzeDocument = () => {
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const newSuggestions: WritingSuggestion[] = [
        {
          id: Date.now().toString(),
          type: 'grammar',
          text: 'shartnoma',
          suggestion: 'shartnomaning',
          priority: 'high'
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'legal',
          text: 'javobgarlik',
          suggestion: 'javobgarlik (FK 330-moda asosida)',
          priority: 'high'
        }
      ]
      
      setSuggestions([...suggestions, ...newSuggestions])
      setIsAnalyzing(false)
    }, 2000)
  }

  const applySuggestion = (suggestion: WritingSuggestion) => {
    setDocumentContent(documentContent.replace(suggestion.text, suggestion.suggestion))
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Legal Writing Assistant */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-blue-600" />
            Legal Writing Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="flex items-center gap-4">
            <Globe className="w-4 h-4 text-gray-500" />
            <div className="flex gap-2">
              {languages.map(lang => (
                <Button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  variant={selectedLanguage === lang.code ? 'default' : 'outline'}
                  size="sm"
                >
                  {lang.flag} {lang.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Hujjat shablonlari</h3>
            <div className="grid grid-cols-2 gap-2">
              {templates.map(template => {
                const TypeIcon = documentTypes.find(t => t.value === template.type)?.icon || FileText
                return (
                  <Button
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    variant={selectedTemplate?.id === template.id ? 'default' : 'outline'}
                    className="flex items-center gap-2 p-3 h-auto"
                  >
                    <TypeIcon className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.type}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Document Editor */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Hujjat matni</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Textarea
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              placeholder="Hujjat matnini shu yerga yozing yoki shablon tanlang..."
              className="min-h-[300px]"
            />
          </div>

          {/* AI Analysis */}
          <Button onClick={analyzeDocument} className="w-full" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                AI tahlil qilayapti...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                AI bilan tahlil qilish
              </>
            )}
          </Button>

          {/* Writing Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Yozuv takliflari</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {suggestions.map(suggestion => {
                  const TypeIcon = suggestionTypes.find(t => t.value === suggestion.type)?.icon || AlertCircle
                  return (
                    <div key={suggestion.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="w-4 h-4 text-gray-600" />
                          <Badge className={suggestionTypes.find(t => t.value === suggestion.type)?.color}>
                            {suggestionTypes.find(t => t.value === suggestion.type)?.label}
                          </Badge>
                          <Badge className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority === 'high' ? 'Yuqori' : 
                             suggestion.priority === 'medium' ? 'O\'rta' : 'Past'}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                          className="text-xs"
                        >
                          Qo'llash
                        </Button>
                      </div>
                      
                      <div className="text-sm">
                        <div className="text-red-600 line-through">{suggestion.text}</div>
                        <div className="text-green-600">{suggestion.suggestion}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto Update System */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-green-600" />
            Auto Update System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Update Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <div className="text-lg font-bold text-red-900">2</div>
              <div className="text-xs text-red-700">Yuqori ta'sir</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-center">
              <div className="text-lg font-bold text-yellow-900">3</div>
              <div className="text-xs text-yellow-700">O\'rta ta'sir</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-lg font-bold text-green-900">1</div>
              <div className="text-xs text-green-700">Past ta'sir</div>
            </div>
          </div>

          {/* Update List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">So'nggi yangilanishlar</h3>
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {autoUpdates.map(update => (
                <div key={update.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{update.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={updateTypes.find(t => t.value === update.type)?.color}>
                          {updateTypes.find(t => t.value === update.type)?.label}
                        </Badge>
                        <Badge className={getImpactColor(update.impact)}>
                          {update.impact === 'high' ? 'Yuqori' : 
                           update.impact === 'medium' ? 'O\'rta' : 'Past'}
                        </Badge>
                        <span className="text-xs text-gray-500">{update.date}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Lightbulb className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{update.description}</p>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Batafsil
                    </Button>
                    <Button size="sm" className="flex-1">
                      Qo'llash
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Update Statistics */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">Yangilanishlar statistikasi</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-800">Oxirgi yangilanish:</span>
                <span className="text-sm font-medium text-blue-900">2 kun oldin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-800">Bu oy:</span>
                <span className="text-sm font-medium text-blue-900">6 ta yangilanish</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-800">Qo'llanilgan:</span>
                <span className="text-sm font-medium text-blue-900">3 ta</span>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-3">Bildirishnoma sozlamalari</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-purple-800">Yuqori ta'sirli yangilanishlar</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-purple-800">Qonun o'zgarishlari</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-purple-800">Pretsedentlar</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
