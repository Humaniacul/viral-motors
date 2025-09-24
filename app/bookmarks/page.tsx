'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../contexts/AuthContext'
import ArticleCard from '../../components/ArticleCard'
import { supabase } from '../../lib/supabase'

export default function BookmarksPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [bookmarkedArticles, setBookmarkedArticles] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      if (!user) return
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          id,
          articles:article_id (
            id,
            title,
            slug,
            excerpt,
            image_url,
            category,
            reading_time,
            view_count,
            like_count,
            published_at,
            created_at,
            profiles:author_id (
              full_name,
              username,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setBookmarkedArticles(data.map((b: any) => b.articles).filter(Boolean))
      }
      setLoading(false)
    }
    load()
  }, [user])

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-black text-dark-text mb-8">Saved Articles</h1>
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : bookmarkedArticles.length === 0 ? (
            <div className="bg-dark-card rounded-xl p-8 text-center text-gray-400">
              No bookmarks yet. <Link href="/" className="text-primary-red">Explore articles</Link>.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bookmarkedArticles.map((article) => (
                <ArticleCard key={article.id} article={{
                  id: article.id,
                  title: article.title,
                  excerpt: article.excerpt || '',
                  image: article.image_url,
                  author: article.profiles?.full_name || article.profiles?.username || 'Viral Motors',
                  publishedAt: article.published_at || article.created_at,
                  category: article.category,
                  readTime: `${article.reading_time} min`,
                  views: article.view_count ?? 0,
                  likes: article.like_count ?? 0,
                  slug: article.slug,
                }} layout="vertical" showStats={false} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}


