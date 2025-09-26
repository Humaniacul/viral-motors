'use client'

import { useState } from 'react'
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
      
      const { data, error } = await supabase
        .from('articles')
        .insert({
          title: title.trim(),
          slug,
          content: content.trim(),
          category,
          author_id: user.id,
          status: 'published',
          published_at: new Date().toISOString(),
          reading_time: Math.ceil(content.split(' ').length / 200)
        })
        .select()
        .single()

      if (error) throw error

      setMessage('✅ Article created successfully!')
      setTitle('')
      setContent('')
      
      setTimeout(() => {
        alert('Article created! Check the homepage.')
      }, 1000)

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
            <h2 className="text-2xl font-bold text-white mb-4">Debug Info</h2>
            <div className="text-gray-300 space-y-2 text-sm">
              <p>User: {user?.email}</p>
              <p>Profile Role: {profile?.role || 'No role set'}</p>
              <p>User ID: {user?.id}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
