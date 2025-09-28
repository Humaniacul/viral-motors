'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SectionBlock from '../../components/SectionBlock'
import ArticleCard from '../../components/ArticleCard'
import { getArticles } from '../../lib/supabase'
import { useEffect, useState } from 'react'

export default function TrendingPage() {
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getArticles({ limit: 24, status: 'published' })
        setArticles(
          (data || []).map((a) => ({
            id: a.id,
            title: a.title,
            excerpt: a.excerpt || '',
            image: a.image_url || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop',
            author: a.profiles?.full_name || a.profiles?.username || 'Viral Motors',
            publishedAt: a.published_at || a.created_at,
            category: a.category,
            readTime: `${a.reading_time} min`,
            views: a.view_count,
            likes: a.like_count,
            slug: a.slug,
            isTrending: a.featured || (a.viral_score ?? 0) > 90,
          }))
        )
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionBlock title="Trending" layout="default">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} layout="vertical" showStats={true} />
              ))}
            </div>
          </SectionBlock>
        </div>
      </main>
      <Footer />
    </div>
  )
}


