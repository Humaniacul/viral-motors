'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

export default function WritePage() {
  const { user } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('News')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const createSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Please sign in to publish.')
      return
    }
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.')
      return
    }

    setError('')
    setSaving(true)

    try {
      const slug = createSlug(title)
      const { data, error } = await supabase
        .from('articles')
        .insert({
          title: title.trim(),
          slug,
          excerpt: excerpt.trim() || content.trim().slice(0, 140) + '...',
          content: content.trim(),
          category,
          author_id: user.id,
          status: 'published',
          published_at: new Date().toISOString(),
          reading_time: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
          view_count: 0,
          like_count: 0,
          comment_count: 0,
          featured: false,
          viral_score: 0,
          tags: []
        })
        .select('id, slug')
        .single()

      if (error) throw error
      setMessage('Article published! Redirecting...')
      router.push(`/articles/${data.slug}`)
    } catch (err: any) {
      setError(err?.message || 'Failed to publish article')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-white mb-6">Write Article</h1>

          {!user && (
            <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-200 p-4 rounded mb-6">
              Please sign in to write and publish an article.
            </div>
          )}

          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-200 p-4 rounded mb-4">{error}</div>
          )}
          {message && (
            <div className="bg-green-900/40 border border-green-700 text-green-200 p-4 rounded mb-4">{message}</div>
          )}

          <form onSubmit={handlePublish} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-dark-card text-white rounded-lg border border-gray-700 focus:border-primary-red focus:outline-none"
                placeholder="Enter a descriptive headline"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Excerpt (optional)</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-3 bg-dark-card text-white rounded-lg border border-gray-700 focus:border-primary-red focus:outline-none"
                placeholder="Short summary to display on cards"
                rows={3}
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 bg-dark-card text-white rounded-lg border border-gray-700 focus:border-primary-red focus:outline-none"
                placeholder="Write your article here... (supports basic text for now)"
                rows={12}
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-dark-card text-white rounded-lg border border-gray-700 focus:border-primary-red focus:outline-none"
                disabled={saving}
              >
                <option>News</option>
                <option>Reviews</option>
                <option>Technology</option>
                <option>Viral</option>
                <option>Guides</option>
                <option>Videos</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !user}
                className="bg-primary-red hover:bg-primary-red-light text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}


