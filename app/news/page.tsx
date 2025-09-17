import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ArticleCard from '../../components/ArticleCard'
import SectionBlock from '../../components/SectionBlock'
import { getArticles } from '../../lib/supabase'

export default async function NewsPage() {
  const articles = await getArticles({ status: 'published', limit: 24 }).catch(() => [])

  const [featured, ...rest] = articles

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-dark-text">Latest News</h1>
            <p className="text-dark-text-secondary mt-2">Stay on top of the automotive world with real-time coverage and analysis.</p>
          </header>

          {articles.length === 0 ? (
            <div className="bg-dark-card rounded-xl p-8 text-center text-gray-400">
              No articles yet. Check back soon.
            </div>
          ) : (
            <SectionBlock title="" layout="minimal">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featured && (
                  <ArticleCard
                    key={featured.id}
                    article={{
                      id: featured.id,
                      title: featured.title,
                      excerpt: featured.excerpt || '',
                      image: featured.image_url || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop',
                      author: featured.profiles?.full_name || featured.profiles?.username || 'Viral Motors',
                      publishedAt: featured.published_at || featured.created_at,
                      category: featured.category,
                      readTime: `${featured.reading_time} min`,
                      views: featured.view_count,
                      likes: featured.like_count,
                      slug: featured.slug,
                      isTrending: featured.featured || (featured.viral_score ?? 0) > 90,
                    }}
                    layout="large"
                    showStats={true}
                    className="md:col-span-2 lg:col-span-3"
                  />
                )}
                {rest.map((a) => (
                  <ArticleCard
                    key={a.id}
                    article={{
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
                    }}
                    layout="vertical"
                    showStats={true}
                  />
                ))}
              </div>
            </SectionBlock>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}


