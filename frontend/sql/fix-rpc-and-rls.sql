-- ============================================
-- 中国传统建筑平台 - 数据库修复脚本 v2
-- 在 Supabase SQL Editor 中执行以下 SQL
-- ============================================

-- 1. 创建帖子数自动更新触发器函数
CREATE OR REPLACE FUNCTION trigger_increment_post_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET post_count = COALESCE(post_count, 0) + 1,
      updated_at = NOW()
  WHERE user_id = NEW.author_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION trigger_decrement_post_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET post_count = GREATEST(0, COALESCE(post_count, 0) - 1),
      updated_at = NOW()
  WHERE user_id = OLD.author_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 创建帖子点赞数自动更新触发器函数
CREATE OR REPLACE FUNCTION trigger_increment_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts 
  SET like_count = COALESCE(like_count, 0) + 1
  WHERE id = NEW.post_id;
  
  UPDATE user_profiles 
  SET total_likes = COALESCE(total_likes, 0) + 1,
      updated_at = NOW()
  WHERE user_id = (SELECT author_id FROM posts WHERE id = NEW.post_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION trigger_decrement_post_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts 
  SET like_count = GREATEST(0, COALESCE(like_count, 0) - 1)
  WHERE id = OLD.post_id;
  
  UPDATE user_profiles 
  SET total_likes = GREATEST(0, COALESCE(total_likes, 0) - 1),
      updated_at = NOW()
  WHERE user_id = (SELECT author_id FROM posts WHERE id = OLD.post_id);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 创建帖子收藏数自动更新触发器函数
CREATE OR REPLACE FUNCTION trigger_increment_post_collects()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts 
  SET collect_count = COALESCE(collect_count, 0) + 1
  WHERE id = NEW.post_id;
  
  UPDATE user_profiles 
  SET total_collects = COALESCE(total_collects, 0) + 1,
      updated_at = NOW()
  WHERE user_id = (SELECT author_id FROM posts WHERE id = NEW.post_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION trigger_decrement_post_collects()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts 
  SET collect_count = GREATEST(0, COALESCE(collect_count, 0) - 1)
  WHERE id = OLD.post_id;
  
  UPDATE user_profiles 
  SET total_collects = GREATEST(0, COALESCE(total_collects, 0) - 1),
      updated_at = NOW()
  WHERE user_id = (SELECT author_id FROM posts WHERE id = OLD.post_id);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 创建粉丝数自动更新触发器函数
CREATE OR REPLACE FUNCTION trigger_increment_follower()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET follower_count = COALESCE(follower_count, 0) + 1,
      updated_at = NOW()
  WHERE user_id = NEW.following_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION trigger_decrement_follower()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET follower_count = GREATEST(0, COALESCE(follower_count, 0) - 1),
      updated_at = NOW()
  WHERE user_id = OLD.following_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 创建关注数自动更新触发器函数
CREATE OR REPLACE FUNCTION trigger_increment_following()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET following_count = COALESCE(following_count, 0) + 1,
      updated_at = NOW()
  WHERE user_id = NEW.follower_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION trigger_decrement_following()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles 
  SET following_count = GREATEST(0, COALESCE(following_count, 0) - 1),
      updated_at = NOW()
  WHERE user_id = OLD.follower_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 删除旧触发器
DROP TRIGGER IF EXISTS trigger_increment_post_count ON posts;
DROP TRIGGER IF EXISTS trigger_decrement_post_count ON posts;
DROP TRIGGER IF EXISTS trigger_increment_likes ON post_likes;
DROP TRIGGER IF EXISTS trigger_decrement_likes ON post_likes;
DROP TRIGGER IF EXISTS trigger_increment_collects ON post_collects;
DROP TRIGGER IF EXISTS trigger_decrement_collects ON post_collects;
DROP TRIGGER IF EXISTS trigger_increment_follower ON follows;
DROP TRIGGER IF EXISTS trigger_decrement_follower ON follows;
DROP TRIGGER IF EXISTS trigger_increment_following ON follows;
DROP TRIGGER IF EXISTS trigger_decrement_following ON follows;

-- 7. 创建帖子触发器
CREATE TRIGGER trigger_increment_post_count
AFTER INSERT ON posts
FOR EACH ROW EXECUTE FUNCTION trigger_increment_post_count();

CREATE TRIGGER trigger_decrement_post_count
AFTER DELETE ON posts
FOR EACH ROW EXECUTE FUNCTION trigger_decrement_post_count();

-- 8. 创建帖子点赞触发器
CREATE TRIGGER trigger_increment_likes
AFTER INSERT ON post_likes
FOR EACH ROW EXECUTE FUNCTION trigger_increment_post_likes();

CREATE TRIGGER trigger_decrement_likes
AFTER DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION trigger_decrement_post_likes();

-- 9. 创建帖子收藏触发器
CREATE TRIGGER trigger_increment_collects
AFTER INSERT ON post_collects
FOR EACH ROW EXECUTE FUNCTION trigger_increment_post_collects();

CREATE TRIGGER trigger_decrement_collects
AFTER DELETE ON post_collects
FOR EACH ROW EXECUTE FUNCTION trigger_decrement_post_collects();

-- 10. 创建粉丝数触发器
CREATE TRIGGER trigger_increment_follower
AFTER INSERT ON follows
FOR EACH ROW EXECUTE FUNCTION trigger_increment_follower();

CREATE TRIGGER trigger_decrement_follower
AFTER DELETE ON follows
FOR EACH ROW EXECUTE FUNCTION trigger_decrement_follower();

-- 11. 创建关注数触发器
CREATE TRIGGER trigger_increment_following
AFTER INSERT ON follows
FOR EACH ROW EXECUTE FUNCTION trigger_increment_following();

CREATE TRIGGER trigger_decrement_following
AFTER DELETE ON follows
FOR EACH ROW EXECUTE FUNCTION trigger_decrement_following();

-- ============================================
-- RLS 策略部分
-- ============================================

-- 12. 确保 user_profiles 表有正确的 RLS 策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read user_profiles" ON user_profiles;
CREATE POLICY "Allow read user_profiles" ON user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert user_profiles" ON user_profiles;
CREATE POLICY "Allow insert user_profiles" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow update own user_profiles" ON user_profiles;
CREATE POLICY "Allow update own user_profiles" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- 13. 确保 posts 表有正确的 RLS 策略
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read posts" ON posts;
CREATE POLICY "Allow read posts" ON posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert posts" ON posts;
CREATE POLICY "Allow insert posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Allow update own posts" ON posts;
CREATE POLICY "Allow update own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Allow delete own posts" ON posts;
CREATE POLICY "Allow delete own posts" ON posts FOR DELETE USING (auth.uid() = author_id);

-- 14. 确保 post_likes 表有正确的 RLS 策略
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read post_likes" ON post_likes;
CREATE POLICY "Allow read post_likes" ON post_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert post_likes" ON post_likes;
CREATE POLICY "Allow insert post_likes" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow delete own post_likes" ON post_likes;
CREATE POLICY "Allow delete own post_likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- 15. 确保 post_collects 表有正确的 RLS 策略
ALTER TABLE post_collects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read post_collects" ON post_collects;
CREATE POLICY "Allow read post_collects" ON post_collects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert post_collects" ON post_collects;
CREATE POLICY "Allow insert post_collects" ON post_collects FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow delete own post_collects" ON post_collects;
CREATE POLICY "Allow delete own post_collects" ON post_collects FOR DELETE USING (auth.uid() = user_id);

-- 16. 确保 post_comments 表有正确的 RLS 策略
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read post_comments" ON post_comments;
CREATE POLICY "Allow read post_comments" ON post_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert post_comments" ON post_comments;
CREATE POLICY "Allow insert post_comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Allow update own post_comments" ON post_comments;
CREATE POLICY "Allow update own post_comments" ON post_comments FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Allow delete own post_comments" ON post_comments;
CREATE POLICY "Allow delete own post_comments" ON post_comments FOR DELETE USING (auth.uid() = author_id);

-- 17. 确保 comment_likes 表有正确的 RLS 策略
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read comment_likes" ON comment_likes;
CREATE POLICY "Allow read comment_likes" ON comment_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert comment_likes" ON comment_likes;
CREATE POLICY "Allow insert comment_likes" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow delete own comment_likes" ON comment_likes;
CREATE POLICY "Allow delete own comment_likes" ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- 18. 确保 follows 表有正确的 RLS 策略
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read follows" ON follows;
CREATE POLICY "Allow read follows" ON follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert follows" ON follows;
CREATE POLICY "Allow insert follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Allow delete own follows" ON follows;
CREATE POLICY "Allow delete own follows" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- 19. 确保 chat_conversations 表有正确的 RLS 策略
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read own conversations" ON chat_conversations;
CREATE POLICY "Allow read own conversations" ON chat_conversations FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "Allow insert conversations" ON chat_conversations;
CREATE POLICY "Allow insert conversations" ON chat_conversations FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- 20. 确保 chat_messages 表有正确的 RLS 策略
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read own messages" ON chat_messages;
CREATE POLICY "Allow read own messages" ON chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chat_conversations 
    WHERE id = conversation_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Allow insert messages" ON chat_messages;
CREATE POLICY "Allow insert messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Allow update own messages" ON chat_messages;
CREATE POLICY "Allow update own messages" ON chat_messages FOR UPDATE USING (auth.uid() = sender_id);

-- ============================================
-- 完成！将此脚本粘贴到 Supabase SQL Editor 执行
-- ============================================
