-- Viral Motors Database Schema
-- This file contains all the SQL needed to set up the Supabase database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'editor', 'admin');
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    location TEXT,
    interests TEXT[] DEFAULT '{}',
    role user_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT username_length CHECK (char_length(username) >= 3),
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Articles table
CREATE TABLE articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    status article_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    viral_score INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 5, -- in minutes
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    
    CONSTRAINT title_length CHECK (char_length(title) >= 10),
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT viral_score_range CHECK (viral_score >= 0 AND viral_score <= 100),
    CONSTRAINT reading_time_positive CHECK (reading_time > 0)
);

-- Comments table
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);

-- Bookmarks table
CREATE TABLE bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, article_id)
);

-- Likes table (for both articles and comments)
CREATE TABLE likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT like_target CHECK (
        (article_id IS NOT NULL AND comment_id IS NULL) OR 
        (article_id IS NULL AND comment_id IS NOT NULL)
    ),
    UNIQUE(user_id, article_id),
    UNIQUE(user_id, comment_id)
);

-- Newsletter subscriptions
CREATE TABLE newsletter (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed BOOLEAN DEFAULT TRUE,
    interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Reading history
CREATE TABLE reading_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
    progress INTEGER DEFAULT 0, -- percentage read (0-100)
    completed BOOLEAN DEFAULT FALSE,
    time_spent INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, article_id),
    CONSTRAINT progress_range CHECK (progress >= 0 AND progress <= 100)
);

-- Analytics events
CREATE TABLE analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB,
    session_id TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_viral_score ON articles(viral_score DESC);
CREATE INDEX idx_articles_view_count ON articles(view_count DESC);
CREATE INDEX idx_articles_featured ON articles(featured) WHERE featured = TRUE;
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);

CREATE INDEX idx_comments_article ON comments(article_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_article ON bookmarks(article_id);

CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_article ON likes(article_id);
CREATE INDEX idx_likes_comment ON likes(comment_id);

CREATE INDEX idx_reading_history_user ON reading_history(user_id);
CREATE INDEX idx_reading_history_updated ON reading_history(updated_at DESC);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);

-- Create full-text search index
CREATE INDEX idx_articles_search ON articles USING GIN(
    to_tsvector('english', title || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, ''))
);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at 
    BEFORE UPDATE ON articles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_updated_at 
    BEFORE UPDATE ON newsletter 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_history_updated_at 
    BEFORE UPDATE ON reading_history 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RPC functions for common operations
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE articles 
    SET view_count = view_count + 1 
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_viral_score(article_id UUID, points INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
    UPDATE articles 
    SET viral_score = LEAST(viral_score + points, 100)
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_article_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update like_count for articles
    IF TG_TABLE_NAME = 'likes' THEN
        IF NEW.article_id IS NOT NULL THEN
            UPDATE articles 
            SET like_count = (
                SELECT COUNT(*) FROM likes WHERE article_id = NEW.article_id
            )
            WHERE id = NEW.article_id;
        END IF;
        
        IF NEW.comment_id IS NOT NULL THEN
            UPDATE comments 
            SET like_count = (
                SELECT COUNT(*) FROM likes WHERE comment_id = NEW.comment_id
            )
            WHERE id = NEW.comment_id;
        END IF;
    END IF;
    
    -- Update comment_count for articles
    IF TG_TABLE_NAME = 'comments' THEN
        UPDATE articles 
        SET comment_count = (
            SELECT COUNT(*) FROM comments WHERE article_id = NEW.article_id
        )
        WHERE id = NEW.article_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic count updates
CREATE TRIGGER update_counts_on_like_insert
    AFTER INSERT ON likes
    FOR EACH ROW EXECUTE FUNCTION update_article_counts();

CREATE TRIGGER update_counts_on_like_delete
    AFTER DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_article_counts();

CREATE TRIGGER update_counts_on_comment_insert
    AFTER INSERT ON comments
    FOR EACH ROW EXECUTE FUNCTION update_article_counts();

CREATE TRIGGER update_counts_on_comment_delete
    AFTER DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_article_counts();

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Articles policies
CREATE POLICY "Published articles are viewable by everyone" ON articles
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view own articles" ON articles
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can update own articles" ON articles
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Editors and admins can manage articles" ON articles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role IN ('editor', 'admin')
        )
    );

-- Comments policies
CREATE POLICY "Comments are viewable by everyone" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Users can view own bookmarks" ON bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks" ON bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone" ON likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON likes
    FOR ALL USING (auth.uid() = user_id);

-- Reading history policies
CREATE POLICY "Users can view own reading history" ON reading_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reading history" ON reading_history
    FOR ALL USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Analytics events are insertable by everyone" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- Newsletter policy (public table)
ALTER TABLE newsletter DISABLE ROW LEVEL SECURITY;

-- Insert sample data for development
INSERT INTO profiles (id, username, full_name, avatar_url, bio, role) VALUES 
(
    uuid_generate_v4(),
    'viralmotors',
    'Viral Motors Team',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    'The official Viral Motors editorial team bringing you the latest in automotive news and culture.',
    'admin'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample articles
INSERT INTO articles (title, slug, excerpt, content, image_url, category, tags, status, featured, viral_score) VALUES 
(
    'Tesla Model S Plaid Sets New Nürburgring Record',
    'tesla-model-s-plaid-nurburgring-record',
    'The electric sedan dominates the legendary German track with unprecedented performance metrics.',
    'In a stunning display of electric vehicle capability, the Tesla Model S Plaid has set a new lap record at the Nürburgring...',
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop',
    'Breaking News',
    '{"Tesla", "Electric Vehicles", "Performance", "Nürburgring"}',
    'published',
    TRUE,
    98
),
(
    'Ferrari Unveils Revolutionary Hybrid Engine Technology',
    'ferrari-hybrid-engine-technology',
    'The Italian automaker reveals groundbreaking powertrain technology that promises to redefine supercar performance.',
    'Ferrari has pulled back the curtain on their most advanced hybrid powertrain system yet...',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop',
    'Technology',
    '{"Ferrari", "Hybrid", "Supercars", "Innovation"}',
    'published',
    TRUE,
    95
),
(
    'Porsche 911 GT3 RS: Track-Focused Excellence Redefined',
    'porsche-911-gt3-rs-review',
    'Our comprehensive review of Porsche''s most extreme street-legal sports car reveals why it''s the ultimate driver''s machine.',
    'The Porsche 911 GT3 RS represents the pinnacle of track-focused engineering from Stuttgart...',
    'https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=800&h=600&fit=crop',
    'Reviews',
    '{"Porsche", "911", "Track", "Performance"}',
    'published',
    FALSE,
    89
);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
