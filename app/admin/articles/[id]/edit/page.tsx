'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Sparkles, Tag, Image as ImageIcon, Settings } from 'lucide-react'
import Navbar from '@/components/Navbar'
import RichTextEditor from '@/components/RichTextEditor'
import { useAuth } from '@/contexts/AuthContext'
import { getArticleById, updateArticleById } from '@/lib/supabase'

interface ArticleFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  seo_title: string
  seo_description: string
  image_url: string
}

const EditArticlePage = () => {
  const params = useParams()
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [saving, setSaving] = useState(false)
  const [loadingArticle, setLoadingArticle] = useState(true)
  const [tagInput, setTagInput] = useState('')
  const [formData, setFormData] = useState<ArticleFormData | null>(null)

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

  const canAccessAdmin = profile?.role === 'admin' || profile?.role === 'editor'

  useEffect(() => {
    if (!loading && (!user || !canAccessAdmin)) {
      router.push('/')
    }
  }, [user, profile, loading, canAccessAdmin, router])

  useEffect(() => {
    const id = params.id as string
    if (!id) return
    const load = async () => {
      try {
        setLoadingArticle(true)
        const article = await getArticleById(id)
        setFormData({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || '',
          content: article.content || '',
          category: article.category,
          tags: article.tags || [],
          featured: !!article.featured,
          status: article.status,
          seo_title: article.seo_title || '',
          seo_description: article.seo_description || '',
          image_url: article.image_url || ''
        })
      } catch (e) {
        console.error('Failed to load article', e)
      } finally {
        setLoadingArticle(false)
      }
    }
    load()
  }, [params.id])

  const handleInputChange = (field: keyof ArticleFormData, value: any) => {
    if (!formData) return
    setFormData(prev => ({ ...(prev as ArticleFormData), [field]: value }))
  }

  const handleAddTag = () => {
    if (!formData) return
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...(prev as ArticleFormData), tags: [...(prev as ArticleFormData).tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (!formData) return
    setFormData(prev => ({ ...(prev as ArticleFormData), tags: (prev as ArticleFormData).tags.filter(t => t !== tagToRemove) }))
  }

  const handleSave = async (publish: boolean) => {
    if (!formData) return
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in the required fields (title and content)')
      return
    }
    const id = params.id as string
    setSaving(true)
    try {
      const updates = {
        ...formData,
        status: publish ? 'published' as const : 'draft' as const,
        seo_title: formData.seo_title || formData.title.slice(0, 60),
        seo_description: formData.seo_description || formData.excerpt.slice(0, 160)
      }
      await updateArticleById(id, updates)
      router.push('/admin')
    } catch (e: any) {
      alert('Failed to save article: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading || loadingArticle || !formData) {
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link href="/admin" className="flex items-center text-gray-400 hover:text-primary-red transition-colors duration-200 mr-6">
                <ArrowLeft size={20} className="mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-dark-text">Edit Article</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button onClick={() => handleSave(false)} disabled={saving} className="flex items-center px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50">
                <Save size={18} className="mr-2" />
                Save Draft
              </button>
              <button onClick={() => handleSave(true)} disabled={saving} className="flex items-center px-6 py-2 bg-primary-red hover:bg-primary-red-light text-white rounded-lg transition-all duration-200 hover:shadow-glow disabled:opacity-50">
                <Sparkles size={18} className="mr-2" />
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <label className="block text-sm font-semibold text-dark-text mb-3">Article Title *</label>
                <input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="Enter a compelling title..." className="w-full text-2xl font-bold bg-transparent text-dark-text placeholder-gray-500 border-none focus:outline-none resize-none" maxLength={120} />
              </div>

              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <label className="block text-sm font-semibold text-dark-text mb-3">URL Slug</label>
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm">viralmotors.com/articles/</span>
                  <input type="text" value={formData.slug} onChange={(e) => handleInputChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} className="flex-1 ml-2 bg-transparent text-dark-text focus:outline-none border-b border-gray-700 focus:border-primary-red transition-colors duration-200 pb-1" />
                </div>
              </div>

              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <label className="block text-sm font-semibold text-dark-text mb-3">Article Excerpt *</label>
                <textarea value={formData.excerpt} onChange={(e) => handleInputChange('excerpt', e.target.value)} placeholder="Write a compelling summary..." rows={3} className="w-full bg-transparent text-dark-text placeholder-gray-500 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200 resize-none" maxLength={300} />
              </div>

              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <label className="block text-sm font-semibold text-dark-text mb-3">Featured Image</label>
                <div className="flex items-center space-x-4">
                  <input type="url" value={formData.image_url} onChange={(e) => handleInputChange('image_url', e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="flex-1 bg-transparent text-dark-text placeholder-gray-500 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200" />
                  <button className="flex items-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">
                    <ImageIcon size={18} className="mr-2" />
                    Upload
                  </button>
                </div>
              </div>

              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <label className="block text-sm font-semibold text-dark-text mb-3">Article Content *</label>
                <RichTextEditor content={formData.content} onChange={(content) => handleInputChange('content', content)} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <h3 className="flex items-center text-lg font-bold text-dark-text mb-4">
                  <Settings size={20} className="mr-2" />
                  Article Settings
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark-text mb-2">Category</label>
                    <select value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} className="w-full bg-gray-900 text-dark-text border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200">
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-semibold text-dark-text">Featured Article</label>
                    </div>
                    <button onClick={() => handleInputChange('featured', !formData.featured)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${formData.featured ? 'bg-primary-red' : 'bg-gray-600'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${formData.featured ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <h3 className="flex items-center text-lg font-bold text-dark-text mb-4">
                  <Tag size={20} className="mr-2" />
                  Tags
                </h3>
                <div className="space-y-3">
                  <div className="flex">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag..." className="flex-1 bg-gray-900 text-dark-text border border-gray-700 rounded-l-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200" />
                    <button onClick={handleAddTag} className="px-4 bg-primary-red hover:bg-primary-red-light text-white rounded-r-lg transition-colors duration-200">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center bg-gray-700 text-dark-text px-3 py-1 rounded-full text-sm">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="ml-2 text-gray-400 hover:text-red-400 transition-colors duration-200">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-dark-card rounded-xl p-6 shadow-card">
                <h3 className="text-lg font-bold text-dark-text mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark-text mb-2">SEO Title</label>
                    <input type="text" value={formData.seo_title} onChange={(e) => handleInputChange('seo_title', e.target.value)} className="w-full bg-gray-900 text-dark-text border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200" maxLength={60} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark-text mb-2">Meta Description</label>
                    <textarea value={formData.seo_description} onChange={(e) => handleInputChange('seo_description', e.target.value)} rows={3} className="w-full bg-gray-900 text-dark-text border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-primary-red transition-colors duration-200 resize-none" maxLength={160} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EditArticlePage


