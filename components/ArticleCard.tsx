'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, User, Eye, Heart, Share2, Bookmark } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toggleBookmark, toggleLike } from '../lib/supabase'

interface ArticleCardProps {
  article: {
    id: string
    title: string
    excerpt: string
    image: string
    author: string
    publishedAt: string
    category: string
    readTime: string
    views: number
    likes: number
    slug: string
    isSponsored?: boolean
    isTrending?: boolean
  }
  layout?: 'vertical' | 'horizontal' | 'minimal' | 'large'
  showStats?: boolean
  className?: string
}

const ArticleCard = ({ 
  article, 
  layout = 'vertical', 
  showStats = true, 
  className = '' 
}: ArticleCardProps) => {
  console.log('🔹 ArticleCard rendering:', article.title, 'Layout:', layout)
  
  // Make auth optional for public viewing
  let user = null
  let profile = null
  try {
    const auth = useAuth()
    user = auth.user
    profile = auth.profile
  } catch (error) {
    // No auth context - this is fine for public viewing
    console.log('🔹 ArticleCard: No auth context, rendering in public mode')
  }

  // Safety check - if article is missing required fields, render a fallback
  if (!article || !article.title) {
    console.error('🔹 ArticleCard: Missing required article data:', article)
    return (
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-white">Article data missing</p>
      </div>
    )
  }
  
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(article.likes)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user || likeLoading) return
    
    setLikeLoading(true)
    try {
      const liked = await toggleLike(user.id, article.id)
      setIsLiked(liked)
      setLikes(prev => liked ? prev + 1 : prev - 1)
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setLikeLoading(false)
    }
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user || bookmarkLoading) return
    
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

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: `/articles/${article.slug}`,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(`${window.location.origin}/articles/${article.slug}`)
    }
  }

  // Vertical Layout (Default)
  if (layout === 'vertical') {
    return (
      <article className={`bg-dark-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group cursor-pointer ${className}`}>
        <Link href={`/articles/${article.slug}`}>
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-primary-red text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                {article.category}
              </span>
              {article.isSponsored && (
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
                  Sponsored
                </span>
              )}
              {article.isTrending && (
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Trending
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleBookmark}
                  disabled={!user || bookmarkLoading}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isBookmarked 
                      ? 'bg-primary-red text-white' 
                      : 'bg-black/30 text-white hover:bg-primary-red/80'
                  }`}
                  aria-label="Bookmark article"
                >
                  {bookmarkLoading ? (
                    <div className="animate-spin w-4 h-4 border border-white/30 border-t-white rounded-full" />
                  ) : (
                    <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="w-8 h-8 bg-black/30 hover:bg-primary-red/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-200"
                  aria-label="Share article"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-dark-text group-hover:text-primary-red mb-3 line-clamp-2 transition-colors duration-200">
              {article.title}
            </h3>
            <p className="text-dark-text-secondary mb-4 line-clamp-3 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <User size={14} className="mr-1" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>{article.readTime}</span>
                </div>
              </div>
              
              {showStats && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleLike}
                    disabled={!user || likeLoading}
                    className={`flex items-center space-x-1 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isLiked ? 'text-primary-red' : 'text-gray-400 hover:text-primary-red'
                    }`}
                  >
                    {likeLoading ? (
                      <div className="animate-spin w-3 h-3 border border-current border-t-transparent rounded-full" />
                    ) : (
                      <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                    )}
                    <span>{likes}</span>
                  </button>
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <Eye size={14} />
                    <span>{formatViews(article.views)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Date */}
            <div className="mt-3 text-xs text-gray-500">
              {formatDate(article.publishedAt)}
            </div>
          </div>
        </Link>
      </article>
    )
  }

  // Horizontal Layout
  if (layout === 'horizontal') {
    return (
      <article className={`bg-dark-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group cursor-pointer ${className}`}>
        <Link href={`/articles/${article.slug}`} className="flex">
          {/* Image */}
          <div className="relative w-1/3 h-32 overflow-hidden flex-shrink-0">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <span className="absolute top-2 left-2 bg-primary-red text-white px-2 py-1 rounded text-xs font-semibold">
              {article.category}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <h3 className="text-lg font-bold text-dark-text group-hover:text-primary-red mb-2 line-clamp-2 transition-colors duration-200">
              {article.title}
            </h3>
            <p className="text-dark-text-secondary text-sm mb-3 line-clamp-2">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-3">
                <span>{article.author}</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              {showStats && (
                <div className="flex items-center space-x-2">
                  <span>{formatViews(article.views)} views</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </article>
    )
  }

  // Large Layout (Featured)
  if (layout === 'large') {
    return (
      <article className={`bg-dark-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group cursor-pointer ${className}`}>
        <Link href={`/articles/${article.slug}`}>
          {/* Large Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-primary-red text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide mb-4 inline-block">
                {article.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary-red-light transition-colors duration-200">
                {article.title}
              </h3>
              <p className="text-white/90 mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-white/80">
                  <span>{article.author}</span>
                  <span>{article.readTime}</span>
                </div>
                {showStats && (
                  <div className="flex items-center space-x-3 text-sm text-white/80">
                    <span>{formatViews(article.views)} views</span>
                    <span>{likes} likes</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  // Minimal Layout
  return (
    <article className={`group cursor-pointer ${className}`}>
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="flex items-start space-x-4">
          {/* Small Image */}
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <span className="text-primary-red text-xs font-semibold uppercase tracking-wide">
              {article.category}
            </span>
            <h3 className="text-base font-bold text-dark-text group-hover:text-primary-red mb-1 line-clamp-2 transition-colors duration-200">
              {article.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

// Add a simple test component to see if it renders
const TestArticleCard = ({ article }: { article: any }) => {
  console.log('🔹 TestArticleCard rendering:', article.title)
  return (
    <div className="bg-red-500 text-white p-4 m-2">
      <h3>TEST: {article.title}</h3>
      <p>{article.excerpt}</p>
    </div>
  )
}

export default ArticleCard
