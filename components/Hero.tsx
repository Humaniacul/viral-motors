'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, User, ArrowRight, Play } from 'lucide-react'

interface HeroArticle {
  id: string
  title: string
  excerpt: string
  image: string
  author: string
  publishedAt: string
  category: string
  readTime: string
  isVideo?: boolean
  slug: string
}

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Sample featured articles - replace with real data
  const featuredArticles: HeroArticle[] = [
    {
      id: '1',
      title: 'Tesla Model S Plaid Sets New Nürburgring Record',
      excerpt: 'The electric sedan dominates the legendary German track with unprecedented performance metrics.',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1600&h=900&fit=crop',
      author: 'Alex Rodriguez',
      publishedAt: '2024-01-15',
      category: 'Breaking News',
      readTime: '5 min',
      slug: 'tesla-model-s-plaid-nurburgring-record'
    },
    {
      id: '2',
      title: 'Ferrari Unveils Revolutionary Hybrid Engine Technology',
      excerpt: 'The Italian automaker reveals groundbreaking powertrain that promises to redefine supercar performance.',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&h=900&fit=crop',
      author: 'Maria Santos',
      publishedAt: '2024-01-14',
      category: 'Technology',
      readTime: '8 min',
      isVideo: true,
      slug: 'ferrari-hybrid-engine-technology'
    },
    {
      id: '3',
      title: 'Porsche 911 GT3 RS: Track-Focused Excellence Redefined',
      excerpt: 'Our comprehensive review of Porsche\'s most extreme street-legal sports car reveals why it\'s the ultimate driver\'s machine.',
      image: 'https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=1600&h=900&fit=crop',
      author: 'James Wilson',
      publishedAt: '2024-01-13',
      category: 'Reviews',
      readTime: '12 min',
      slug: 'porsche-911-gt3-rs-review'
    }
  ]

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredArticles.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredArticles.length])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const currentArticle = featuredArticles[currentSlide]

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {featuredArticles.map((article, index) => (
          <div
            key={article.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Category Badge */}
            <div className="inline-flex items-center mb-4">
              <span className="bg-primary-red/90 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
                {currentArticle.category}
              </span>
              {currentArticle.isVideo && (
                <div className="ml-3 flex items-center text-white/80">
                  <Play size={16} className="mr-1" />
                  <span className="text-sm">Video</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight animate-fadeIn">
              {currentArticle.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed animate-slideUp">
              {currentArticle.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-white/80">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span className="text-sm font-medium">{currentArticle.author}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span className="text-sm">{currentArticle.readTime} read</span>
              </div>
              <div className="text-sm">
                {formatDate(currentArticle.publishedAt)}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href={`/articles/${currentArticle.slug}`}
              className="inline-flex items-center bg-primary-red hover:bg-primary-red-light text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:shadow-glow group"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              Read Full Story
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {featuredArticles.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index)
                setIsAutoPlaying(false)
                setTimeout(() => setIsAutoPlaying(true), 3000)
              }}
              className={`w-12 h-1 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-primary-red shadow-glow'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <button
          onClick={() => {
            setCurrentSlide(prev => prev === 0 ? featuredArticles.length - 1 : prev - 1)
            setIsAutoPlaying(false)
            setTimeout(() => setIsAutoPlaying(true), 3000)
          }}
          className="w-12 h-12 bg-black/30 hover:bg-primary-red/80 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Previous slide"
        >
          <ArrowRight size={20} className="rotate-180" />
        </button>
      </div>
      
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <button
          onClick={() => {
            setCurrentSlide(prev => (prev + 1) % featuredArticles.length)
            setIsAutoPlaying(false)
            setTimeout(() => setIsAutoPlaying(true), 3000)
          }}
          className="w-12 h-12 bg-black/30 hover:bg-primary-red/80 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label="Next slide"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  )
}

export default Hero
