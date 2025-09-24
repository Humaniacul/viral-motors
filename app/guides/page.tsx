import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ArticleCard from '../../components/ArticleCard'
import SectionBlock from '../../components/SectionBlock'
import { getArticles } from '../../lib/supabase'

export default async function GuidesPage() {
  let articles: any[] = []
  try {
    articles = await getArticles({ status: 'published', category: 'Guides', limit: 24 })
  } catch (error) {
    console.log('Failed to load articles:', error)
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-dark-text">Guides</h1>
            <p className="text-dark-text-secondary mt-2">Actionable buying guides, maintenance tips, and how-tos.</p>
          </header>

          {articles.length === 0 ? (
            <div className="bg-dark-card rounded-xl p-8 text-center text-gray-400">No guides yet.</div>
          ) : (
            <SectionBlock title="" layout="minimal">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((a) => (
                  <ArticleCard
                    key={a.id}
                    article={{
                      id: a.id,
                      title: a.title,
                      excerpt: a.excerpt || '',
                      image: a.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
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


