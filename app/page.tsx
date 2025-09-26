'use client'

import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ArticleCard from '../components/ArticleCard'
import SectionBlock, { TrendingSection, LatestSection, FeaturedSection } from '../components/SectionBlock'
import ViralSection from '../components/ViralSection'
import VideoBlock from '../components/VideoBlock'
import Footer from '../components/Footer'
import { getArticles } from '../lib/supabase'

// Sample data - replace with real data from CMS/API
const sampleArticles = [
  {
    id: '1',
    title: 'Tesla Model S Plaid Sets New Nürburgring Record',
    excerpt: 'The electric sedan dominates the legendary German track with unprecedented performance metrics that redefine what we thought possible.',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop',
    author: 'Alex Rodriguez',
    publishedAt: '2024-01-15',
    category: 'Breaking News',
    readTime: '5 min',
    views: 2500000,
    likes: 45000,
    slug: 'tesla-model-s-plaid-nurburgring-record',
    isTrending: true
  },
  {
    id: '2',
    title: 'Ferrari Unveils Revolutionary Hybrid Engine Technology',
    excerpt: 'The Italian automaker reveals groundbreaking powertrain technology that promises to redefine supercar performance for the next decade.',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
    author: 'Maria Santos',
    publishedAt: '2024-01-14',
    category: 'Technology',
    readTime: '8 min',
    views: 1800000,
    likes: 32000,
    slug: 'ferrari-hybrid-engine-technology'
  },
  {
    id: '3',
    title: 'Porsche 911 GT3 RS: Track-Focused Excellence Redefined',
    excerpt: 'Our comprehensive review of Porsche\'s most extreme street-legal sports car reveals why it\'s the ultimate driver\'s machine.',
    image: 'https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=800&h=600&fit=crop',
    author: 'James Wilson',
    publishedAt: '2024-01-13',
    category: 'Reviews',
    readTime: '12 min',
    views: 950000,
    likes: 28000,
    slug: 'porsche-911-gt3-rs-review'
  },
  {
    id: '4',
    title: 'Electric Vehicle Sales Surge 300% in Q4 2023',
    excerpt: 'Market analysis reveals unprecedented growth in electric vehicle adoption across all segments and price ranges.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    author: 'Sarah Chen',
    publishedAt: '2024-01-12',
    category: 'Market Analysis',
    readTime: '6 min',
    views: 1200000,
    likes: 18000,
    slug: 'ev-sales-surge-q4-2023'
  },
  {
    id: '5',
    title: 'McLaren 765LT Spider: Open-Top Savage',
    excerpt: 'We take McLaren\'s most hardcore convertible supercar to its limits on track and street to see if it lives up to the hype.',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
    author: 'Mike Thompson',
    publishedAt: '2024-01-11',
    category: 'Reviews',
    readTime: '10 min',
    views: 720000,
    likes: 22000,
    slug: 'mclaren-765lt-spider-review'
  },
  {
    id: '6',
    title: 'Bugatti Chiron Successor Spotted Testing',
    excerpt: 'Spy photographers capture the next-generation Bugatti hypercar during testing, revealing aggressive new aerodynamics.',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop',
    author: 'David Kim',
    publishedAt: '2024-01-10',
    category: 'Spy Shots',
    readTime: '4 min',
    views: 3100000,
    likes: 67000,
    slug: 'bugatti-chiron-successor-spy-shots',
    isTrending: true
  },
  {
    id: '7',
    title: 'BMW M4 CSL: The Ultimate Driving Machine Returns',
    excerpt: 'BMW\'s most track-focused M4 variant strips away luxury for pure performance, delivering an experience that purists will love.',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    author: 'Chris Anderson',
    publishedAt: '2024-01-09',
    category: 'Reviews',
    readTime: '9 min',
    views: 850000,
    likes: 31000,
    slug: 'bmw-m4-csl-review'
  },
  {
    id: '8',
    title: 'Autonomous Driving: Where We Stand in 2024',
    excerpt: 'A comprehensive look at the current state of self-driving technology and what to expect in the coming years.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    author: 'Lisa Park',
    publishedAt: '2024-01-08',
    category: 'Technology',
    readTime: '15 min',
    views: 1400000,
    likes: 24000,
    slug: 'autonomous-driving-2024-update'
  },
  {
    id: '9',
    title: 'Restored 1970 Plymouth Barracuda: Pure American Muscle',
    excerpt: 'This frame-off restoration of a classic Plymouth Barracuda showcases the golden age of American muscle cars.',
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop',
    author: 'Tony Rodriguez',
    publishedAt: '2024-01-07',
    category: 'Classics',
    readTime: '7 min',
    views: 680000,
    likes: 35000,
    slug: 'plymouth-barracuda-restoration'
  }
]

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    // Load real articles from database
    const loadArticles = async () => {
      try {
        const allArticles = await getArticles({
          limit: 20,
          status: 'published'
        })
        setArticles(allArticles)
      } catch (error) {
        console.log('Failed to load articles:', error)
      }
    }

    loadArticles()
  }, [])
  
  // Transform database articles to match component interface
  const transformedArticles = articles.map(article => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt || '',
    image: article.image_url || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop',
    author: article.profiles?.full_name || article.profiles?.username || 'Viral Motors',
    publishedAt: article.published_at || article.created_at,
    category: article.category,
    readTime: `${article.reading_time} min`,
    views: article.view_count,
    likes: article.like_count,
    slug: article.slug,
    isSponsored: false,
    isTrending: article.featured || article.viral_score > 90
  }))

  // Divide articles into sections
  const trendingArticles = transformedArticles.filter(article => article.isTrending).slice(0, 3)
  const latestArticles = transformedArticles.slice(0, 6)
  const reviewArticles = transformedArticles.filter(article => article.category === 'Reviews').slice(0, 3)
  
  // Fallback to sample data if no articles exist
  const hasArticles = transformedArticles.length > 0
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />
      
      {/* Trending Section */}
      <TrendingSection
        title="Trending Now"
        subtitle="The hottest automotive stories capturing everyone's attention"
        viewAllLink="/trending"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(hasArticles ? trendingArticles : sampleArticles.filter(article => article.isTrending).slice(0, 3)).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              layout="vertical"
              showStats={true}
            />
          ))}
        </div>
      </TrendingSection>

      {/* Viral Section */}
      <ViralSection />

      {/* Latest News Grid */}
      <LatestSection
        title="Latest News"
        subtitle="Stay updated with the freshest automotive news and developments"
        viewAllLink="/news"
        layout="default"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(hasArticles ? latestArticles : sampleArticles.slice(0, 6)).map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              layout={index === 0 ? "large" : "vertical"}
              showStats={true}
              className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}
            />
          ))}
        </div>
      </LatestSection>

      {/* Video Section */}
      <VideoBlock />

      {/* Reviews Section */}
      <FeaturedSection
        title="Featured Reviews"
        subtitle="In-depth reviews of the latest and greatest in automotive excellence"
        viewAllLink="/reviews"
        layout="minimal"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Featured Review */}
          <div className="lg:row-span-2">
            <ArticleCard
              article={(hasArticles ? reviewArticles : sampleArticles.filter(article => article.category === 'Reviews').slice(0, 3))[0]}
              layout="large"
              showStats={true}
            />
          </div>
          
          {/* Side Reviews */}
          <div className="space-y-6">
            {(hasArticles ? reviewArticles : sampleArticles.filter(article => article.category === 'Reviews').slice(0, 3)).slice(1).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                layout="horizontal"
                showStats={false}
              />
            ))}
          </div>
        </div>
      </FeaturedSection>

      {/* More Latest Articles */}
      <SectionBlock
        title="More Stories"
        subtitle="Don't miss these other great automotive stories"
        viewAllLink="/all"
        layout="minimal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleArticles.slice(6).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              layout="minimal"
              showStats={false}
            />
          ))}
        </div>
      </SectionBlock>

      {/* Footer */}
      <Footer />
    </div>
  )
}
