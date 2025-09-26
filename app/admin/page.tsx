'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('News')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [recentArticles, setRecentArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecentArticles()
  }, [])

  const loadRecentArticles = async () => {
    try {
      console.log('🔹 Loading recent articles from admin...')
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, category, created_at, status, author_id')
        .order('created_at', { ascending: false })
        .limit(10)

      console.log('🔹 Recent articles response:', { data, error })

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }
      
      setRecentArticles(data || [])
      console.log('🔹 Articles set in state:', data?.length || 0)
    } catch (error) {
      console.error('❌ Error loading recent articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim() || !content.trim()) {
      alert('Please fill in title and content')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const slug = createSlug(title)
      
      console.log('🔹 Creating article with data:', {
        title: title.trim(),
        slug,
        content: content.trim(),
        category,
        author_id: user.id,
        status: 'published',
        published_at: new Date().toISOString(),
        reading_time: Math.ceil(content.split(' ').length / 200)
      })

      const { data, error } = await supabase
        .from('articles')
        .insert({
          title: title.trim(),
          slug,
          content: content.trim(),
          excerpt: content.trim().substring(0, 150) + '...',
          category,
          author_id: user.id,
          status: 'published',
          published_at: new Date().toISOString(),
          reading_time: Math.ceil(content.split(' ').length / 200),
          view_count: 0,
          like_count: 0,
          comment_count: 0,
          viral_score: 0,
          featured: false,
          tags: []
        })
        .select()
        .single()

      console.log('🔹 Supabase response:', { data, error })

      if (error) throw error

      setMessage(`✅ Article created successfully! ID: ${data.id}`)
      setTitle('')
      setContent('')
      
      // Reload recent articles to show the new one
      loadRecentArticles()

      setTimeout(() => {
        alert(`Article created with ID: ${data.id}! Check the homepage and news page.`)
      }, 1500)

    } catch (error: any) {
      console.error('Error creating article:', error)
      setMessage('❌ Error: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="pt-24 text-center">
          <p className="text-white text-xl">Please sign in to access admin panel</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-8">📝 Create Article (SIMPLE)</h1>
          
          <div className="bg-dark-card rounded-xl p-8">
            {message && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.includes('✅') ? 'bg-green-600' : 'bg-red-600'
              } text-white`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-lg font-semibold mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-primary-red focus:outline-none"
                  placeholder="Enter article title..."
                  required
                />
              </div>

              <div>
                <label className="block text-white text-lg font-semibold mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-primary-red focus:outline-none"
                >
                  <option value="News">News</option>
                  <option value="Reviews">Reviews</option>
                  <option value="Guides">Guides</option>
                  <option value="Technology">Technology</option>
                  <option value="Viral">Viral</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-lg font-semibold mb-2">
                  Content *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={15}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-primary-red focus:outline-none resize-none"
                  placeholder="Write your article content here..."
                  required
                />
                <p className="text-gray-400 text-sm mt-2">
                  {content.split(' ').length} words
                </p>
              </div>

              <button
                type="submit"
                disabled={saving || !title.trim() || !content.trim()}
                className="w-full bg-primary-red hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                {saving ? '⏳ Creating Article...' : '🚀 Publish Article'}
              </button>
            </form>
          </div>

          <div className="mt-8 bg-dark-card rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">📚 Recent Articles</h2>
            {loading ? (
              <p className="text-gray-400">Loading articles...</p>
            ) : recentArticles.length === 0 ? (
              <p className="text-gray-400">No articles found. Create your first article above!</p>
            ) : (
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-white font-semibold">{article.title}</h3>
                    <div className="text-gray-400 text-sm mt-1">
                      <span className="bg-primary-red px-2 py-1 rounded text-xs text-white mr-2">
                        {article.category}
                      </span>
                      <span className="bg-green-600 px-2 py-1 rounded text-xs text-white mr-2">
                        {article.status}
                      </span>
                      <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      ID: {article.id} | Slug: {article.slug}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 bg-dark-card rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">🔧 Debug Info</h2>
            <div className="text-gray-300 space-y-2 text-sm">
              <p>User: {user?.email}</p>
              <p>Profile Role: {profile?.role || 'No role set'}</p>
              <p>User ID: {user?.id}</p>
              <p>Articles Found: {recentArticles.length}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
