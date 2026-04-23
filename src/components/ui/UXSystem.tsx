'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sun,
  Moon,
  Palette,
  Settings,
  Zap,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  Tablet,
  Volume2,
  VolumeX,
  RefreshCw,
  Download,
  Upload,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Grid3x3,
  Layout,
  Type,
  Image,
  Video,
  Music,
  Bell,
  Wifi,
  WifiOff,
  Cloud,
  CloudOff
} from 'lucide-react'

interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto'
  primaryColor: string
  accentColor: string
  fontSize: 'small' | 'medium' | 'large'
  fontFamily: 'inter' | 'roboto' | 'opensans'
  borderRadius: 'sharp' | 'rounded' | 'very-rounded'
  animations: boolean
  transitions: boolean
  hoverEffects: boolean
}

interface AccessibilitySettings {
  highContrast: boolean
  reducedMotion: boolean
  largeText: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  focusVisible: boolean
  colorBlindFriendly: boolean
  dyslexicFont: boolean
}

interface DisplaySettings {
  density: 'compact' | 'comfortable' | 'spacious'
  sidebarWidth: 'small' | 'medium' | 'large'
  showGrid: boolean
  showRulers: boolean
  showMinimap: boolean
  customCSS: string
}

export default function UXSystem() {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    mode: 'light',
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    fontSize: 'medium',
    fontFamily: 'inter',
    borderRadius: 'rounded',
    animations: true,
    transitions: true,
    hoverEffects: true
  })

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
    focusVisible: true,
    colorBlindFriendly: false,
    dyslexicFont: false
  })

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    density: 'comfortable',
    sidebarWidth: 'medium',
    showGrid: false,
    showRulers: false,
    showMinimap: false,
    customCSS: ''
  })

  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isOnline, setIsOnline] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const colorPresets = [
    { name: 'Classic Blue', primary: '#3b82f6', accent: '#8b5cf6' },
    { name: 'Modern Purple', primary: '#8b5cf6', accent: '#ec4899' },
    { name: 'Nature Green', primary: '#10b981', accent: '#14b8a6' },
    { name: 'Sunset Orange', primary: '#f97316', accent: '#ef4444' },
    { name: 'Professional Gray', primary: '#6b7280', accent: '#374151' }
  ]

  const fontFamilies = [
    { value: 'inter', label: 'Inter', style: 'font-sans' },
    { value: 'roboto', label: 'Roboto', style: 'font-sans' },
    { value: 'opensans', label: 'Open Sans', style: 'font-sans' }
  ]

  const borderRadii = [
    { value: 'sharp', label: 'O\'tkir', style: 'rounded-none' },
    { value: 'rounded', label: 'Yumaloq', style: 'rounded-lg' },
    { value: 'very-rounded', label: 'Juda yumaloq', style: 'rounded-2xl' }
  ]

  const densities = [
    { value: 'compact', label: 'Zich', spacing: 'space-y-2' },
    { value: 'comfortable', label: 'Qulay', spacing: 'space-y-4' },
    { value: 'spacious', label: 'Keng', spacing: 'space-y-6' }
  ]

  useEffect(() => {
    // Apply theme settings
    const root = document.documentElement
    root.style.setProperty('--primary-color', themeSettings.primaryColor)
    root.style.setProperty('--accent-color', themeSettings.accentColor)
    
    // Apply theme mode
    if (themeSettings.mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Apply accessibility settings
    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast')
    }
    if (accessibilitySettings.reducedMotion) {
      root.classList.add('reduced-motion')
    }
    if (accessibilitySettings.largeText) {
      root.classList.add('large-text')
    }
    if (accessibilitySettings.dyslexicFont) {
      root.classList.add('dyslexic-font')
    }
  }, [themeSettings, accessibilitySettings])

  const applyThemePreset = (preset: typeof colorPresets[0]) => {
    setThemeSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      accentColor: preset.accent
    }))
  }

  const resetToDefaults = () => {
    setThemeSettings({
      mode: 'light',
      primaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
      fontSize: 'medium',
      fontFamily: 'inter',
      borderRadius: 'rounded',
      animations: true,
      transitions: true,
      hoverEffects: true
    })
    
    setAccessibilitySettings({
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      screenReader: false,
      keyboardNavigation: true,
      focusVisible: true,
      colorBlindFriendly: false,
      dyslexicFont: false
    })
    
    setDisplaySettings({
      density: 'comfortable',
      sidebarWidth: 'medium',
      showGrid: false,
      showRulers: false,
      showMinimap: false,
      customCSS: ''
    })
  }

  const exportSettings = () => {
    const settings = {
      theme: themeSettings,
      accessibility: accessibilitySettings,
      display: displaySettings
    }
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'case-law-ai-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string)
          setThemeSettings(settings.theme || themeSettings)
          setAccessibilitySettings(settings.accessibility || accessibilitySettings)
          setDisplaySettings(settings.display || displaySettings)
        } catch (error) {
          console.error('Failed to import settings:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'w-full max-w-sm'
      case 'tablet': return 'w-full max-w-2xl'
      case 'desktop': return 'w-full max-w-6xl'
      default: return 'w-full'
    }
  }

  return (
    <div className="space-y-6">
      {/* UX System Header */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              UI/UX System
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOnline(!isOnline)}
              >
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={exportSettings}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Preview Mode Selector */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">Preview:</span>
            <div className="flex gap-2">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4 mr-1" />
                Desktop
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="w-4 h-4 mr-1" />
                Tablet
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4 mr-1" />
                Mobile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Settings */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Theme Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Mode */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Theme Mode</label>
              <div className="flex gap-2">
                <Button
                  variant={themeSettings.mode === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setThemeSettings(prev => ({ ...prev, mode: 'light' }))}
                >
                  <Sun className="w-4 h-4 mr-1" />
                  Light
                </Button>
                <Button
                  variant={themeSettings.mode === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setThemeSettings(prev => ({ ...prev, mode: 'dark' }))}
                >
                  <Moon className="w-4 h-4 mr-1" />
                  Dark
                </Button>
                <Button
                  variant={themeSettings.mode === 'auto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setThemeSettings(prev => ({ ...prev, mode: 'auto' }))}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Auto
                </Button>
              </div>
            </div>

            {/* Color Presets */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Color Presets</label>
              <div className="space-y-2">
                {colorPresets.map(preset => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyThemePreset(preset)}
                    className="w-full justify-start"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.primary }}
                        ></div>
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: preset.accent }}
                        ></div>
                      </div>
                      {preset.name}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Custom Colors</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 w-20">Primary:</label>
                  <input
                    type="color"
                    value={themeSettings.primaryColor}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={themeSettings.primaryColor}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 w-20">Accent:</label>
                  <input
                    type="color"
                    value={themeSettings.accentColor}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-12 h-8 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={themeSettings.accentColor}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Typography</label>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Font Size</label>
                  <select
                    value={themeSettings.fontSize}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, fontSize: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Font Family</label>
                  <select
                    value={themeSettings.fontFamily}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, fontFamily: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {fontFamilies.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Border Radius</label>
              <div className="flex gap-2">
                {borderRadii.map(radius => (
                  <Button
                    key={radius.value}
                    variant={themeSettings.borderRadius === radius.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setThemeSettings(prev => ({ ...prev, borderRadius: radius.value as any }))}
                  >
                    {radius.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Animations */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Animations</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={themeSettings.animations}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, animations: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Enable animations</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={themeSettings.transitions}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, transitions: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Enable transitions</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={themeSettings.hoverEffects}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, hoverEffects: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Enable hover effects</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.highContrast}
                  onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, highContrast: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">High contrast mode</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.reducedMotion}
                  onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, reducedMotion: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Reduced motion</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.largeText}
                  onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, largeText: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Large text</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.screenReader}
                  onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, screenReader: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Screen reader support</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.keyboardNavigation}
                  onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, keyboardNavigation: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Keyboard navigation</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.focusVisible}
                  onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, focusVisible: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Focus visible</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.colorBlindFriendly}
                  onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, colorBlindFriendly: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Color blind friendly</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.dyslexicFont}
                  onChange={(e) => setAccessibilitySettings(prev => ({ ...prev, dyslexicFont: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Dyslexic friendly font</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5" />
              Display Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Density */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Layout Density</label>
              <div className="flex gap-2">
                {densities.map(density => (
                  <Button
                    key={density.value}
                    variant={displaySettings.density === density.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDisplaySettings(prev => ({ ...prev, density: density.value as any }))}
                  >
                    {density.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sidebar Width */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Sidebar Width</label>
              <div className="flex gap-2">
                <Button
                  variant={displaySettings.sidebarWidth === 'small' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDisplaySettings(prev => ({ ...prev, sidebarWidth: 'small' }))}
                >
                  Small
                </Button>
                <Button
                  variant={displaySettings.sidebarWidth === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDisplaySettings(prev => ({ ...prev, sidebarWidth: 'medium' }))}
                >
                  Medium
                </Button>
                <Button
                  variant={displaySettings.sidebarWidth === 'large' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDisplaySettings(prev => ({ ...prev, sidebarWidth: 'large' }))}
                >
                  Large
                </Button>
              </div>
            </div>

            {/* Display Options */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Display Options</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={displaySettings.showGrid}
                    onChange={(e) => setDisplaySettings(prev => ({ ...prev, showGrid: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show grid</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={displaySettings.showRulers}
                    onChange={(e) => setDisplaySettings(prev => ({ ...prev, showRulers: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show rulers</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={displaySettings.showMinimap}
                    onChange={(e) => setDisplaySettings(prev => ({ ...prev, showMinimap: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show minimap</span>
                </label>
              </div>
            </div>

            {/* Custom CSS */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Custom CSS</label>
              <textarea
                value={displaySettings.customCSS}
                onChange={(e) => setDisplaySettings(prev => ({ ...prev, customCSS: e.target.value }))}
                placeholder="Add custom CSS rules..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono min-h-[100px]"
              />
            </div>

            {/* Import/Export */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Import/Export Settings</label>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Settings
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                  />
                </Button>
                <Button variant="outline" size="sm" onClick={exportSettings} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <Card className="bg-white border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className={`${getPreviewWidth()} border border-gray-200 rounded-lg overflow-hidden`}>
              {/* Sample Dashboard Preview */}
              <div className="bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: themeSettings.primaryColor }}>
                      CL
                    </div>
                    <span className="font-bold" style={{ color: themeSettings.primaryColor }}>Case-Law AI</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-300"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg" style={{ borderRadius: themeSettings.borderRadius === 'sharp' ? '0' : themeSettings.borderRadius === 'rounded' ? '0.5rem' : '1rem' }}>
                    <div className="text-2xl font-bold mb-1" style={{ color: themeSettings.primaryColor }}>Level 8</div>
                    <div className="text-sm text-gray-600">Current Level</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg" style={{ borderRadius: themeSettings.borderRadius === 'sharp' ? '0' : themeSettings.borderRadius === 'rounded' ? '0.5rem' : '1rem' }}>
                    <div className="text-2xl font-bold mb-1" style={{ color: themeSettings.accentColor }}>87%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button className="w-full" style={{ backgroundColor: themeSettings.primaryColor }}>
                    Start Learning
                  </Button>
                  <Button variant="outline" className="w-full" style={{ borderColor: themeSettings.accentColor, color: themeSettings.accentColor }}>
                    View Progress
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
