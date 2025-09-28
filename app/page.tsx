// Server component: fetch articles server-side for reliability
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ArticleCard from '../components/ArticleCard'
import SectionBlock, { TrendingSection, LatestSection, FeaturedSection } from '../components/SectionBlock'
import ViralSection from '../components/ViralSection'
import VideoBlock from '../components/VideoBlock'
import Footer from '../components/Footer'
import { getArticles } from '../lib/supabase'

// Removed sampleArticles – homepage now renders only real articles

export default async function HomePage() {
  // Fetch articles on the server for consistency
  let articles: any[] = []
  try {
    articles = await getArticles({ limit: 20, status: 'published' })
  } catch (error) {
    // Swallow to avoid breaking the page
  }
  
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
  
  // Show only real articles from database
  const hasArticles = transformedArticles.length > 0
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />
      
      {/* Debug/UI removed */}
      
      {/* Trending Section */}
      <TrendingSection
        title="Trending Now"
        subtitle="The hottest automotive stories capturing everyone's attention"
        viewAllLink="/news"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(trendingArticles.length > 0 ? trendingArticles : latestArticles.slice(0, 3)).map((article) => (
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
          {latestArticles.map((article, index) => (
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
            {reviewArticles[0] && (
              <ArticleCard
                article={reviewArticles[0]}
                layout="large"
                showStats={true}
              />
            )}
          </div>
          
          {/* Side Reviews */}
          <div className="space-y-6">
            {reviewArticles.slice(1).map((article) => (
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

      {/* More Latest Articles removed (was using sample data) */}

      {/* Footer */}
      <Footer />
    </div>
  )
}
