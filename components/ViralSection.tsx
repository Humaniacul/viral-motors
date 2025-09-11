'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, TrendingUp, Flame, Eye } from 'lucide-react'

interface ViralArticle {
  id: string
  title: string
  image: string
  views: number
  trendingScore: number
  category: string
  slug: string
  isHot?: boolean
}

const ViralSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Sample viral articles - replace with real data
  const viralArticles: ViralArticle[] = [
    {
      id: '1',
      title: 'Tesla Cybertruck Spotted Towing a Broken Ford F-150',
      image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop',
      views: 2500000,
      trendingScore: 98,
      category: 'Viral',
      slug: 'tesla-cybertruck-towing-ford',
      isHot: true
    },
    {
      id: '2',
      title: 'Lamborghini Owner Parks in Disabled Space, Gets Ultimate Karma',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
      views: 1800000,
      trendingScore: 95,
      category: 'Viral',
      slug: 'lamborghini-karma-parking'
    },
    {
      id: '3',
      title: 'Budget Car Beats Supercar in Drag Race - You Won\'t Believe What Happens',
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop',
      views: 3200000,
      trendingScore: 97,
      category: 'Racing',
      slug: 'budget-car-beats-supercar'
    },
    {
      id: '4',
      title: 'Car Salesman\'s Honest Review Goes Viral: "Don\'t Buy This Car"',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      views: 4100000,
      trendingScore: 99,
      category: 'Industry',
      slug: 'honest-car-salesman-review',
      isHot: true
    },
    {
      id: '5',
      title: 'Electric Scooter vs Sports Car: The Race That Broke the Internet',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      views: 890000,
      trendingScore: 89,
      category: 'Electric',
      slug: 'scooter-vs-sports-car'
    },
    {
      id: '6',
      title: 'Mechanic Finds 100 iPhones Hidden Inside Car Engine Bay',
      image: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400&h=300&fit=crop',
      views: 1500000,
      trendingScore: 92,
      category: 'Weird',
      slug: 'iphones-in-engine-bay'
    },
    {
      id: '7',
      title: 'World\'s Fastest Pizza Delivery: 200 MPH Delivery Gone Wrong',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      views: 2200000,
      trendingScore: 94,
      category: 'Viral',
      slug: 'fastest-pizza-delivery'
    },
    {
      id: '8',
      title: 'Dad Builds Working Batmobile for Son\'s Birthday',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
      views: 750000,
      trendingScore: 87,
      category: 'DIY',
      slug: 'dad-builds-batmobile'
    }
  ]

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`
    return views.toString()
  }

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320 // Width of card + gap
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    checkScrollability()
    const handleResize = () => checkScrollability()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section className="py-16 bg-dark-bg/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-red rounded-lg flex items-center justify-center">
              <Flame size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-dark-text">
                Viral Now
              </h2>
              <p className="text-dark-text-secondary mt-1">
                The hottest automotive content trending right now
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? 'bg-dark-card hover:bg-primary-red text-dark-text hover:text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? 'bg-dark-card hover:bg-primary-red text-dark-text hover:text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Viral Articles Scroll */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
            onScroll={checkScrollability}
          >
            {viralArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="flex-shrink-0 w-80 group cursor-pointer"
              >
                <div className="relative">
                  {/* Card */}
                  <div className="bg-dark-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transform hover:scale-[1.02] transition-all duration-300">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="320px"
                      />
                      
                      {/* Trending Badge */}
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center space-x-2">
                          <span className="bg-primary-red text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                            <TrendingUp size={12} className="mr-1" />
                            #{index + 1}
                          </span>
                          {article.isHot && (
                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center animate-pulse">
                              <Flame size={10} className="mr-1" />
                              HOT
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Trending Score */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold">
                          {article.trendingScore}% 🔥
                        </div>
                      </div>

                      {/* Views Counter */}
                      <div className="absolute bottom-3 right-3">
                        <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <Eye size={12} className="mr-1" />
                          {formatViews(article.views)}
                        </div>
                      </div>

                      {/* Category */}
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-dark-text group-hover:text-primary-red mb-3 line-clamp-2 transition-colors duration-200 leading-tight">
                        {article.title}
                      </h3>

                      {/* Stats Bar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-xs text-gray-400">
                            <TrendingUp size={12} className="mr-1 text-primary-red" />
                            <span className="font-medium">Trending</span>
                          </div>
                        </div>
                        
                        {/* Trending Indicator */}
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-3 rounded-full ${
                                i < Math.floor(article.trendingScore / 20)
                                  ? 'bg-primary-red'
                                  : 'bg-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Glow Effect for Hot Articles */}
                  {article.isHot && (
                    <div className="absolute inset-0 bg-primary-red/20 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10"></div>
                  )}
                </div>
              </Link>
            ))}

            {/* "See All Viral" Card */}
            <Link
              href="/viral"
              className="flex-shrink-0 w-80 group cursor-pointer"
            >
              <div className="h-full bg-gradient-to-br from-primary-red to-primary-red-light rounded-xl flex items-center justify-center shadow-card hover:shadow-glow transform hover:scale-[1.02] transition-all duration-300">
                <div className="text-center text-white p-8">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flame size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    See All Viral
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    Discover more trending automotive content
                  </p>
                  <div className="flex items-center justify-center text-sm font-semibold">
                    Explore More
                    <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(Math.ceil((viralArticles.length + 1) / 3))].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gray-600 hover:bg-primary-red transition-colors duration-200 cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default ViralSection
