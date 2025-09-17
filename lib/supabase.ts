import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  website: string | null
  location: string | null
  interests: string[] | null
  role: 'user' | 'editor' | 'admin'
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image_url: string
  author_id: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  viral_score: number
  view_count: number
  like_count: number
  comment_count: number
  reading_time: number
  created_at: string
  updated_at: string
  published_at: string | null
  // Optional SEO fields
  seo_title?: string | null
  seo_description?: string | null
  // Relations
  profiles?: Profile
  bookmarks?: Bookmark[]
  comments?: Comment[]
  likes?: Like[]
}

export interface Comment {
  id: string
  article_id: string
  user_id: string
  parent_id: string | null
  content: string
  like_count: number
  created_at: string
  updated_at: string
  // Relations
  profiles?: Profile
  articles?: Article
  replies?: Comment[]
}

export interface Bookmark {
  id: string
  user_id: string
  article_id: string
  created_at: string
  // Relations
  profiles?: Profile
  articles?: Article
}

export interface Like {
  id: string
  user_id: string
  article_id: string | null
  comment_id: string | null
  created_at: string
  // Relations
  profiles?: Profile
  articles?: Article
  comments?: Comment
}

export interface Newsletter {
  id: string
  email: string
  subscribed: boolean
  interests: string[] | null
  created_at: string
  updated_at: string
}

// Helper functions for common operations
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data as Profile
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data as Profile
}

export const getArticles = async (options?: {
  limit?: number
  offset?: number
  category?: string
  featured?: boolean
  status?: 'draft' | 'published' | 'archived'
}) => {
  let query = supabase
    .from('articles')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        full_name,
        avatar_url
      ),
      bookmarks (id, user_id),
      _count: comments (count)
    `)
  
  if (options?.status !== undefined) {
    query = query.eq('status', options.status)
  }
  
  if (options?.category) {
    query = query.eq('category', options.category)
  }
  
  if (options?.featured !== undefined) {
    query = query.eq('featured', options.featured)
  }
  
  query = query.order('created_at', { ascending: false })
  
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as Article[]
}

export const getArticleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        full_name,
        avatar_url,
        bio
      ),
      comments (
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        ),
        replies:comments!parent_id (
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        )
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  
  if (error) throw error
  return data as Article
}

export const incrementArticleViews = async (articleId: string) => {
  const { error } = await supabase.rpc('increment_article_views', {
    article_id: articleId
  })
  
  if (error) throw error
}

export const getArticleById = async (id: string) => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Article
}

export const updateArticleById = async (id: string, updates: Partial<Article>) => {
  const { data, error } = await supabase
    .from('articles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Article
}

export const toggleBookmark = async (userId: string, articleId: string) => {
  // Check if bookmark exists
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('article_id', articleId)
    .single()
  
  if (existing) {
    // Remove bookmark
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existing.id)
    
    if (error) throw error
    return false // Bookmarked removed
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        article_id: articleId
      })
    
    if (error) throw error
    return true // Bookmark added
  }
}

export const toggleLike = async (userId: string, articleId?: string, commentId?: string) => {
  // Check if like exists
  let query = supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
  
  if (articleId) {
    query = query.eq('article_id', articleId)
  }
  
  if (commentId) {
    query = query.eq('comment_id', commentId)
  }
  
  const { data: existing } = await query.single()
  
  if (existing) {
    // Remove like
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existing.id)
    
    if (error) throw error
    return false // Like removed
  } else {
    // Add like
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        article_id: articleId || null,
        comment_id: commentId || null
      })
    
    if (error) throw error
    return true // Like added
  }
}

export const addComment = async (
  userId: string,
  articleId: string,
  content: string,
  parentId?: string
) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      article_id: articleId,
      content,
      parent_id: parentId || null
    })
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .single()
  
  if (error) throw error
  return data as Comment
}

export const subscribeToNewsletter = async (email: string, interests?: string[]) => {
  const { data, error } = await supabase
    .from('newsletter')
    .upsert({
      email,
      interests: interests || [],
      subscribed: true,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (error) throw error
  return data as Newsletter
}

// Admin functions
export const updateUserRole = async (userId: string, role: 'user' | 'editor' | 'admin') => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user role:', error)
    throw error
  }
}
