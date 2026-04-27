-- ============================================
-- 古建筑展示平台 - 帖子与聊天功能数据库表
-- 在 Supabase SQL Editor 中执行以下 SQL
-- ============================================

-- 1. 帖子分类表
CREATE TABLE IF NOT EXISTS post_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(20),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入默认分类
INSERT INTO post_categories (name, description, icon, sort_order) VALUES
  ('建筑讨论', '关于古建筑结构、历史文化的讨论', '🏛️', 1),
  ('游记分享', '游览古建筑的亲身经历分享', '📸', 2),
  ('摄影作品', '古建筑摄影作品展示', '📷', 3),
  ('文化科普', '古建筑相关的历史文化知识', '📚', 4),
  ('求助交流', '寻求帮助或交流经验', '❓', 5),
  ('闲聊灌水', '轻松话题，随意交流', '☕', 6)
ON CONFLICT (name) DO NOTHING;

-- 2. 用户资料表（扩展 users 表）
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(50),
  avatar_url TEXT,
  bio TEXT,
  post_count INT DEFAULT 0,
  total_likes INT DEFAULT 0,
  total_collects INT DEFAULT 0,
  follower_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 帖子表
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES post_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name VARCHAR(50) NOT NULL,
  like_count INT DEFAULT 0,
  collect_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

-- 4. 点赞表
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON post_likes(user_id);

-- 5. 收藏表
CREATE TABLE IF NOT EXISTS post_collects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_collects_post ON post_collects(post_id);
CREATE INDEX IF NOT EXISTS idx_collects_user ON post_collects(user_id);

-- 6. 评论表（新增）
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  like_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON post_comments(parent_id);

-- 7. 评论点赞表（新增）
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- 8. 关注表
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- 9. 私信会话表
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON chat_conversations(user1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON chat_conversations(user2_id);

-- 10. 私信消息表
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON chat_messages(created_at);

-- ============================================
-- RLS 行级安全策略
-- ============================================

-- 帖子分类表（公开读取）
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read categories" ON post_categories FOR SELECT USING (true);
CREATE POLICY "Allow insert categories" ON post_categories FOR INSERT WITH CHECK (true);

-- 用户资料表
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- 帖子表
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow insert posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Allow update own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Allow delete own posts" ON posts FOR DELETE USING (auth.uid() = author_id);

-- 点赞表
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Allow insert likes" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow delete own likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- 收藏表
ALTER TABLE post_collects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read collects" ON post_collects FOR SELECT USING (true);
CREATE POLICY "Allow insert collects" ON post_collects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow delete own collects" ON post_collects FOR DELETE USING (auth.uid() = user_id);

-- 评论表（新增）
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read comments" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Allow insert comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Allow update own comments" ON post_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Allow delete own comments" ON post_comments FOR DELETE USING (auth.uid() = author_id);

-- 评论点赞表（新增）
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read comment likes" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Allow insert comment likes" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow delete own comment likes" ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- 关注表
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read follows" ON follows FOR SELECT USING (true);
CREATE POLICY "Allow insert follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Allow delete own follows" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- 私信会话表
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read own conversations" ON chat_conversations FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Allow insert conversations" ON chat_conversations FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- 私信消息表
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read own messages" ON chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_conversations 
    WHERE id = conversation_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);
CREATE POLICY "Allow insert messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Allow update own messages" ON chat_messages FOR UPDATE USING (auth.uid() = sender_id);

-- ============================================
-- 自动更新触发器
-- ============================================

-- 更新帖子点赞数
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    UPDATE user_profiles SET total_likes = total_likes + 1 
    WHERE user_id = (SELECT author_id FROM posts WHERE id = NEW.post_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.post_id;
    UPDATE user_profiles SET total_likes = GREATEST(0, total_likes - 1) 
    WHERE user_id = (SELECT author_id FROM posts WHERE id = OLD.post_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 更新帖子收藏数
CREATE OR REPLACE FUNCTION update_post_collect_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET collect_count = collect_count + 1 WHERE id = NEW.post_id;
    UPDATE user_profiles SET total_collects = total_collects + 1 
    WHERE user_id = (SELECT author_id FROM posts WHERE id = NEW.post_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET collect_count = GREATEST(0, collect_count - 1) WHERE id = OLD.post_id;
    UPDATE user_profiles SET total_collects = GREATEST(0, total_collects - 1) 
    WHERE user_id = (SELECT author_id FROM posts WHERE id = OLD.post_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 更新用户帖子数
CREATE OR REPLACE FUNCTION update_user_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_profiles SET post_count = post_count + 1 WHERE user_id = NEW.author_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_profiles SET post_count = GREATEST(0, post_count - 1) WHERE user_id = OLD.author_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 更新用户粉丝数
CREATE OR REPLACE FUNCTION update_user_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_profiles SET follower_count = follower_count + 1 WHERE user_id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_profiles SET follower_count = GREATEST(0, follower_count - 1) WHERE user_id = OLD.following_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 更新帖子评论数
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_update_post_like_count ON post_likes;
CREATE TRIGGER trigger_update_post_like_count
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

DROP TRIGGER IF EXISTS trigger_update_post_collect_count ON post_collects;
CREATE TRIGGER trigger_update_post_collect_count
AFTER INSERT OR DELETE ON post_collects
FOR EACH ROW EXECUTE FUNCTION update_post_collect_count();

DROP TRIGGER IF EXISTS trigger_update_user_post_count ON posts;
CREATE TRIGGER trigger_update_user_post_count
AFTER INSERT OR DELETE ON posts
FOR EACH ROW EXECUTE FUNCTION update_user_post_count();

DROP TRIGGER IF EXISTS trigger_update_user_follower_count ON follows;
CREATE TRIGGER trigger_update_user_follower_count
AFTER INSERT OR DELETE ON follows
FOR EACH ROW EXECUTE FUNCTION update_user_follower_count();

DROP TRIGGER IF EXISTS trigger_update_post_comment_count ON post_comments;
CREATE TRIGGER trigger_update_post_comment_count
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- ============================================
-- 自动创建用户资料（当新用户注册时）
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 完成！可以将此脚本粘贴到 Supabase SQL Editor 执行
-- ============================================
