'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Eye, Heart, Share2, Bookmark, User, Tag, TrendingUp, MessageCircle } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { getArticleBySlug, incrementArticleViews, toggleBookmark, toggleLike } from '../../../lib/supabase'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image_url: string | null
  category: string
  tags: string[]
  featured: boolean
  viral_score: number
  view_count: number
  like_count: number
  comment_count: number
  reading_time: number
  seo_title?: string | null
  seo_description?: string | null
  created_at: string
  updated_at: string
  published_at: string | null
  profiles?: {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
    bio: string | null
  }
}

const ArticlePage = () => {
  const params = useParams()
  const slug = params.slug as string
  const { user } = useAuth()
  
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)

  useEffect(() => {
    loadArticle()
  }, [slug])

  useEffect(() => {
    if (article) {
      // Increment view count after article loads
      incrementArticleViews(article.id)
      setLikeCount(article.like_count)
      // GA event
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        ;(window as any).gtag('event', 'article_view', {
          event_category: 'engagement',
          event_label: article.slug,
          value: 1,
        })
      }
    }
  }, [article])

  const loadArticle = async () => {
    try {
      setLoading(true)
      const data = await getArticleBySlug(slug)
      setArticle(data)
    } catch (error: any) {
      setError(error.message)
      console.error('Error loading article:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = async () => {
    if (!user || !article || bookmarkLoading) return
    
    setBookmarkLoading(true)
    try {
      const bookmarked = await toggleBookmark(user.id, article.id)
      setIsBookmarked(bookmarked)
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setBookmarkLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user || !article || likeLoading) return
    
    setLikeLoading(true)
    try {
      const liked = await toggleLike(user.id, article.id)
      setIsLiked(liked)
      setLikeCount(prev => liked ? prev + 1 : prev - 1)
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setLikeLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      // Could show a toast notification here
    }
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function' && article) {
      ;(window as any).gtag('event', 'share', {
        method: 'native_or_copy',
        content_type: 'article',
        item_id: article.slug,
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="pt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Loading skeleton */}
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-800 rounded w-3/4"></div>
              <div className="h-64 bg-gray-800 rounded"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                <div className="h-4 bg-gray-800 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="pt-24 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-dark-text mb-4">Article Not Found</h1>
            <p className="text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/"
              className="inline-flex items-center bg-primary-red hover:bg-primary-red-light text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <article className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="relative">
          {article.image_url && (
            <div className="relative h-96 mb-8 overflow-hidden">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Category Badge */}
              <div className="absolute top-6 left-6">
                <span className="bg-primary-red/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                  {article.category}
                </span>
              </div>

              {/* Featured Badge */}
              {article.featured && (
                <div className="absolute top-6 right-6">
                  <span className="bg-yellow-500/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    Featured
                  </span>
                </div>
              )}
            </div>
          )}
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Article Header */}
            <header className="mb-8">
              {!article.image_url && (
                <div className="flex items-center space-x-3 mb-6">
                  <span className="bg-primary-red text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                    {article.category}
                  </span>
                  {article.featured && (
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      Featured
                    </span>
                  )}
                </div>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark-text mb-6 leading-tight">
                {article.title}
              </h1>

              <p className="text-xl text-dark-text-secondary mb-6 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                {/* Author */}
                {article.profiles && (
                  <div className="flex items-center">
                    {article.profiles.avatar_url ? (
                      <Image
                        src={article.profiles.avatar_url}
                        alt={article.profiles.full_name || 'Author'}
                        width={48}
                        height={48}
                        className="rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-dark-text font-medium">
                        {article.profiles.full_name || article.profiles.username}
                      </p>
                      <p className="text-gray-400 text-sm">Author</p>
                    </div>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center text-gray-400">
                  <Calendar size={16} className="mr-2" />
                  <span className="text-sm">
                    {formatDate(article.published_at || article.created_at)}
                  </span>
                </div>

                {/* Reading Time */}
                <div className="flex items-center text-gray-400">
                  <Clock size={16} className="mr-2" />
                  <span className="text-sm">{article.reading_time} min read</span>
                </div>

                {/* Views */}
                <div className="flex items-center text-gray-400">
                  <Eye size={16} className="mr-2" />
                  <span className="text-sm">{article.view_count.toLocaleString()} views</span>
                </div>
              </div>

              {/* Social Actions */}
              <div className="flex items-center justify-between border-t border-gray-700 pt-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    disabled={!user || likeLoading}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isLiked 
                        ? 'bg-primary-red text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    } disabled:opacity-50`}
                  >
                    {likeLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                    )}
                    <span className="text-sm font-medium">{likeCount}</span>
                  </button>

                  <button
                    onClick={handleBookmark}
                    disabled={!user || bookmarkLoading}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isBookmarked 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    } disabled:opacity-50`}
                  >
                    {bookmarkLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                    )}
                    <span className="text-sm font-medium">Save</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200"
                  >
                    <Share2 size={18} />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>

                {/* Comments Count */}
                <div className="flex items-center text-gray-400">
                  <MessageCircle size={16} className="mr-2" />
                  <span className="text-sm">{article.comment_count} comments</span>
                </div>
              </div>
            </header>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-dark-text leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-700">
              <div className="flex items-center flex-wrap gap-2">
                <Tag size={18} className="text-gray-400 mr-2" />
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-gray-800 text-gray-300 hover:bg-primary-red hover:text-white px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {article.profiles && article.profiles.bio && (
            <div className="mt-12 p-6 bg-dark-card rounded-xl shadow-card">
              <div className="flex items-start">
                {article.profiles.avatar_url ? (
                  <Image
                    src={article.profiles.avatar_url}
                    alt={article.profiles.full_name || 'Author'}
                    width={64}
                    height={64}
                    className="rounded-full mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary-red rounded-full flex items-center justify-center mr-4">
                    <User size={24} className="text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-dark-text mb-2">
                    {article.profiles.full_name || article.profiles.username}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {article.profiles.bio}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Comments Section Placeholder */}
          <div className="mt-16">
            <div className="bg-dark-card rounded-xl p-8 text-center">
              <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-text mb-2">Join the Discussion</h3>
              <p className="text-gray-400 mb-4">
                Comments system coming soon! Share your thoughts on this article.
              </p>
              {!user && (
                <p className="text-sm text-gray-500">
                  Sign in to be notified when comments are available.
                </p>
              )}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}

export default ArticlePage
