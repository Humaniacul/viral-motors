'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye, Calendar, Tag, Image as ImageIcon, Settings, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import RichTextEditor from '@/components/RichTextEditor'

interface ArticleFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featured: boolean
  status: 'draft' | 'published'
  seo_title: string
  seo_description: string
  image_url: string
}

const CreateArticle = () => {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'News',
    tags: [],
    featured: false,
    status: 'draft',
    seo_title: '',
    seo_description: '',
    image_url: '',
  })
  const [tagInput, setTagInput] = useState('')
  const [previewMode, setPreviewMode] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const categories = [
    'Breaking News',
    'Reviews',
    'Technology',
    'Electric Vehicles',
    'Performance',
    'Classic Cars',
    'Industry News',
    'Racing',
    'Viral',
    'Guides'
  ]

  // Check if user can access admin
  const canAccessAdmin = profile?.role === 'admin' || profile?.role === 'editor'

  useEffect(() => {
    if (!loading && (!user || !canAccessAdmin)) {
      router.push('/')
    }
  }, [user, profile, loading, canAccessAdmin, router])

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, formData.slug])

  // Auto-generate SEO title from title
  useEffect(() => {
    if (formData.title && !formData.seo_title) {
      setFormData(prev => ({ 
        ...prev, 
        seo_title: formData.title.length > 60 
          ? formData.title.substring(0, 57) + '...' 
          : formData.title 
      }))
    }
  }, [formData.title, formData.seo_title])

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setAutoSaveStatus('unsaved')
  }

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveStatus === 'unsaved' && formData.title.trim() && formData.content.trim()) {
      const timer = setTimeout(() => {
        autoSaveDraft()
      }, 3000) // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timer)
    }
  }, [formData, autoSaveStatus])

  const autoSaveDraft = async () => {
    if (!user || !formData.title.trim()) return

    setAutoSaveStatus('saving')
    try {
      const articleData = {
        ...formData,
        status: 'draft' as const,
        author_id: user.id,
        reading_time: calculateReadingTime(formData.content),
        updated_at: new Date().toISOString()
      }

      // Check if this is an update (article already exists) or insert
      const { data: existingArticle } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', formData.slug)
        .eq('author_id', user.id)
        .single()

      if (existingArticle) {
        // Update existing draft
        await supabase
          .from('articles')
          .update(articleData)
          .eq('id', existingArticle.id)
      } else {
        // Create new draft
        await supabase
          .from('articles')
          .insert([{
            ...articleData,
            created_at: new Date().toISOString()
          }])
      }

      setAutoSaveStatus('saved')
      setLastSaved(new Date())
    } catch (error) {
      console.error('Auto-save error:', error)
      setAutoSaveStatus('unsaved')
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...prev.tags, tagInput.trim()] 
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const textContent = content.replace(/<[^>]*>/g, '')
    const wordCount = textContent.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!user || !formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in the required fields (title and content)')
      return
    }

    setSaving(true)
    try {
      let publishedAt = null
      if (status === 'published') {
        publishedAt = new Date().toISOString()
      }

      const articleData = {
        ...formData,
        status,
        author_id: user.id,
        reading_time: calculateReadingTime(formData.content),
        published_at: publishedAt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single()

      if (error) throw error

      const message = status === 'published' 
        ? 'Article published successfully!'
        : 'Draft saved successfully!'
      
      router.push(`/admin?saved=${status}&message=${encodeURIComponent(message)}`)
    } catch (error: any) {
      console.error('Error saving article:', error)
      alert('Error saving article: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-red border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!user || !canAccessAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="flex items-center text-gray-400 hover:text-primary-red transition-colors duration-200 mr-6"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-dark-text">
                  Create New Article
                </h1>
                <p className="text-dark-text-secondary mt-1">
                  Write and publish premium automotive content
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Auto-save Status */}
              <div className="flex items-center text-sm text-gray-400">
                {autoSaveStatus === 'saving' && (
                  <>
                    <div className="animate-spin w-3 h-3 border border-gray-400 border-t-primary-red rounded-full mr-2" />
                    Saving...
                  </>
                )}
                {autoSaveStatus === 'saved' && lastSaved && (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </>
                )}
                {autoSaveStatus === 'unsaved' && (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                    Unsaved changes
                  </>
                )}
              </div>

              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
              >
                <Eye size={18} className="mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </button>
              
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="flex items-center px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <Save size={18} className="mr-2" />
                Save Draft
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="flex items-center px-6 py-2 bg-primary-red hover:bg-primary-red-light text-white rounded-lg transition-all duration-200 hover:shadow-glow disabled:opacity-50"
                >
                  <Sparkles size={18} className="mr-2" />
                  {saving ? 'Publishing...' : 'Publish Now'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <label className="block text-sm font-semibold text-dark-text mb-3">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter a compelling title..."
                  className="w-full text-2xl font-bold bg-transparent text-dark-text placeholder-gray-500 border-none focus:outline-none resize-none"
                  maxLength={120}
                />
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <span>This will be the main headline for your article</span>
                  <span>{formData.title.length}/120</span>
                </div>
              </div>

              {/* Slug */}
              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <label className="block text-sm font-semibold text-dark-text mb-3">
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm">viralmotors.com/articles/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="flex-1 ml-2 bg-transparent text-dark-text focus:outline-none border-b border-gray-700 focus:border-primary-red transition-colors duration-200 pb-1"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <label className="block text-sm font-semibold text-dark-text mb-3">
                  Article Excerpt *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Write a compelling summary that will appear on the homepage and in previews..."
                  rows={3}
                  className="w-full bg-transparent text-dark-text placeholder-gray-500 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200 resize-none"
                  maxLength={300}
                />
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <span>This excerpt will appear in article previews and social shares</span>
                  <span>{formData.excerpt.length}/300</span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <label className="block text-sm font-semibold text-dark-text mb-3">
                  Featured Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-transparent text-dark-text placeholder-gray-500 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200"
                  />
                  <button className="flex items-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">
                    <ImageIcon size={18} className="mr-2" />
                    Upload
                  </button>
                </div>
                {formData.image_url && (
                  <div className="mt-4">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Content Editor */}
              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <label className="block text-sm font-semibold text-dark-text mb-3">
                  Article Content *
                </label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => handleInputChange('content', content)}
                  placeholder="Start writing your amazing automotive article..."
                />
                <div className="mt-3 text-xs text-gray-400">
                  Reading time: ~{calculateReadingTime(formData.content)} minutes
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Article Settings */}
              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <h3 className="flex items-center text-lg font-bold text-dark-text mb-4">
                  <Settings size={20} className="mr-2" />
                  Article Settings
                </h3>
                
                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-text mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full bg-gray-900 text-dark-text border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-semibold text-dark-text">
                        Featured Article
                      </label>
                      <p className="text-xs text-gray-400 mt-1">
                        Show in featured sections
                      </p>
                    </div>
                    <button
                      onClick={() => handleInputChange('featured', !formData.featured)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        formData.featured ? 'bg-primary-red' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          formData.featured ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <h3 className="flex items-center text-lg font-bold text-dark-text mb-4">
                  <Tag size={20} className="mr-2" />
                  Tags
                </h3>
                
                <div className="space-y-3">
                  <div className="flex">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a tag..."
                      className="flex-1 bg-gray-900 text-dark-text border border-gray-700 rounded-l-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 bg-primary-red hover:bg-primary-red-light text-white rounded-r-lg transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center bg-gray-700 text-dark-text px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <h3 className="flex items-center text-lg font-bold text-dark-text mb-4">
                  <Calendar size={20} className="mr-2" />
                  SEO Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark-text mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={(e) => handleInputChange('seo_title', e.target.value)}
                      placeholder="SEO optimized title..."
                      className="w-full bg-gray-900 text-dark-text border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200"
                      maxLength={60}
                    />
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {formData.seo_title.length}/60
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark-text mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.seo_description}
                      onChange={(e) => handleInputChange('seo_description', e.target.value)}
                      placeholder="Brief description for search engines..."
                      rows={3}
                      className="w-full bg-gray-900 text-dark-text border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200 resize-none"
                      maxLength={160}
                    />
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {formData.seo_description.length}/160
                    </div>
                  </div>
                </div>
              </div>

              {/* Scheduling removed to match schema; implement later if added to DB */}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateArticle
