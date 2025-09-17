'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit, Eye, Trash2, Calendar, TrendingUp, Users, FileText, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getArticles } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  status?: 'draft' | 'published' | 'archived'
  featured: boolean
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  published_at: string | null
  profiles?: {
    full_name: string | null
    username: string | null
  }
}

const AdminDashboard = () => {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    totalViews: 0,
    totalLikes: 0
  })

  // Check if user is admin or editor
  const canAccessAdmin = profile?.role === 'admin' || profile?.role === 'editor'

  useEffect(() => {
    if (!loading && (!user || !canAccessAdmin)) {
      router.push('/')
    }
  }, [user, profile, loading, canAccessAdmin, router])

  useEffect(() => {
    if (canAccessAdmin) {
      loadArticles()
    }
  }, [canAccessAdmin])

  const loadArticles = async () => {
    try {
      setArticlesLoading(true)
      const data = await getArticles({ limit: 50 })
      setArticles(data)
      
      // Calculate stats
      const totalArticles = data.length
      const publishedArticles = data.filter(a => a.published_at !== null).length
      const totalViews = data.reduce((sum, a) => sum + a.view_count, 0)
      const totalLikes = data.reduce((sum, a) => sum + a.like_count, 0)
      
      setStats({
        totalArticles,
        publishedArticles,
        totalViews,
        totalLikes
      })
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setArticlesLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500'
      case 'draft': return 'bg-yellow-500'
      case 'archived': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-red border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!user || !canAccessAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-dark-text mb-2">
                  Content Dashboard
                </h1>
                <p className="text-dark-text-secondary">
                  Manage articles and content for Viral Motors
                </p>
              </div>
              
              <Link
                href="/admin/articles/new"
                className="bg-primary-red hover:bg-primary-red-light text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-all duration-200 hover:shadow-glow"
              >
                <Plus size={20} className="mr-2" />
                New Article
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-dark-card rounded-xl p-6 shadow-card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-dark-text">{stats.totalArticles}</p>
                  <p className="text-gray-400 text-sm">Total Articles</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-6 shadow-card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Calendar size={24} className="text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-dark-text">{stats.publishedArticles}</p>
                  <p className="text-gray-400 text-sm">Published</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-6 shadow-card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Eye size={24} className="text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-dark-text">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Total Views</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-6 shadow-card">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-dark-text">{stats.totalLikes.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Total Likes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-dark-card rounded-xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-dark-text">Recent Articles</h2>
            </div>
            
            {articlesLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary-red border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="p-8 text-center">
                <FileText size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No articles yet</p>
                <Link
                  href="/admin/articles/new"
                  className="inline-flex items-center text-primary-red hover:text-primary-red-light font-medium"
                >
                  <Plus size={18} className="mr-2" />
                  Create your first article
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Article
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-sm font-medium text-dark-text line-clamp-1">
                                {article.title}
                              </h3>
                              {article.featured && (
                                <span className="ml-2 px-2 py-1 bg-primary-red text-white text-xs rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              {article.category} • by {article.profiles?.full_name || article.profiles?.username}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(article.published_at ? 'published' : 'draft')}`}>
                            {article.published_at ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Eye size={14} className="mr-1" />
                              {article.view_count}
                            </span>
                            <span className="flex items-center">
                              <TrendingUp size={14} className="mr-1" />
                              {article.like_count}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {article.published_at ? formatDate(article.published_at) : formatDate(article.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/articles/${article.slug}`}
                              className="text-gray-400 hover:text-primary-red transition-colors duration-200"
                              title="View Article"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              href={`/admin/articles/${article.id}/edit`}
                              className="text-gray-400 hover:text-primary-red transition-colors duration-200"
                              title="Edit Article"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                              title="Delete Article"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AdminDashboard
