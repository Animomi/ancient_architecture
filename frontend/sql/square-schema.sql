-- ============================================
-- 游客广场数据库表结构
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
  ('闲聊灌水', '轻松话题，随意交流', '☕', 6);

-- 2. 用户信息表（游客扩展信息）
CREATE TABLE IF NOT EXISTS visitor_profiles (
  visitor_id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  post_count INT DEFAULT 0,
  total_likes INT DEFAULT 0,
  total_collects INT DEFAULT 0,
  follower_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 帖子表（完善版）
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES post_categories(id),
  username VARCHAR(50) NOT NULL,
  visitor_id VARCHAR(50) NOT NULL,
  like_count INT DEFAULT 0,
  collect_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_visitor ON posts(visitor_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);

-- 4. 点赞表
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  visitor_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, visitor_id)
);

CREATE INDEX idx_likes_post ON post_likes(post_id);
CREATE INDEX idx_likes_visitor ON post_likes(visitor_id);

-- 5. 收藏表
CREATE TABLE IF NOT EXISTS post_collects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  visitor_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, visitor_id)
);

CREATE INDEX idx_collects_post ON post_collects(post_id);
CREATE INDEX idx_collects_visitor ON post_collects(visitor_id);

-- 6. 关注表
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id VARCHAR(50) NOT NULL,
  following_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- 7. 私信会话表
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id VARCHAR(50) NOT NULL,
  user2_id VARCHAR(50) NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX idx_conversations_user1 ON chat_conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON chat_conversations(user2_id);

-- 8. 私信消息表
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_messages_created ON chat_messages(created_at);

-- ============================================
-- RLS 策略（允许匿名访问）
-- ============================================

-- 帖子分类表
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read categories" ON post_categories FOR SELECT USING (true);

-- 用户信息表
ALTER TABLE visitor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read profiles" ON visitor_profiles FOR SELECT USING (true);
CREATE POLICY "Allow insert profiles" ON visitor_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update profiles" ON visitor_profiles FOR UPDATE USING (true);

-- 帖子表
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Allow delete posts" ON posts FOR DELETE USING (true);

-- 点赞表
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Allow insert likes" ON post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete likes" ON post_likes FOR DELETE USING (true);

-- 收藏表
ALTER TABLE post_collects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read collects" ON post_collects FOR SELECT USING (true);
CREATE POLICY "Allow insert collects" ON post_collects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete collects" ON post_collects FOR DELETE USING (true);

-- 关注表
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read follows" ON follows FOR SELECT USING (true);
CREATE POLICY "Allow insert follows" ON follows FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete follows" ON follows FOR DELETE USING (true);

-- 私信会话表
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read conversations" ON chat_conversations FOR SELECT USING (true);
CREATE POLICY "Allow insert conversations" ON chat_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update conversations" ON chat_conversations FOR UPDATE USING (true);

-- 私信消息表
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow insert messages" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update messages" ON chat_messages FOR UPDATE USING (true);

-- ============================================
-- 自动更新计数器函数
-- ============================================

-- 更新帖子点赞数
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.post_id;
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
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET collect_count = GREATEST(0, collect_count - 1) WHERE id = OLD.post_id;
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
    UPDATE visitor_profiles SET post_count = post_count + 1 WHERE visitor_id = NEW.visitor_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE visitor_profiles SET post_count = GREATEST(0, post_count - 1) WHERE visitor_id = OLD.visitor_id;
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
    UPDATE visitor_profiles SET follower_count = follower_count + 1 WHERE visitor_id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE visitor_profiles SET follower_count = GREATEST(0, follower_count - 1) WHERE visitor_id = OLD.following_id;
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
