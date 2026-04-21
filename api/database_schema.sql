-- =============================================
-- 古建筑平台 - Supabase 数据库建表语句
-- 运行位置：Supabase Dashboard > SQL Editor
-- 注意：已移除中文分词依赖，使用 simple 配置
-- =============================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. 用户表 (users)
-- 扩展 Supabase Auth 的 auth.users 表
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 策略：用户只能查看和修改自己的信息
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户只能查看自己的信息"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "用户只能更新自己的信息"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "用户只能插入自己的信息"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);


-- =============================================
-- 2. 建筑分类表 (categories)
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,                    -- 分类名称：宫殿、庙宇、民居、园林等
    slug TEXT UNIQUE NOT NULL,             -- URL 友好标识
    description TEXT,                      -- 分类描述
    icon TEXT,                             -- 图标或 emoji
    image_url TEXT,                        -- 分类封面图
    parent_id UUID REFERENCES categories(id), -- 父分类（可选层级）
    sort_order INTEGER DEFAULT 0,          -- 排序顺序
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 策略：公开可读
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "所有人可查看分类"
    ON public.categories FOR SELECT
    USING (true);

-- 插入默认分类
INSERT INTO public.categories (name, slug, description, icon) VALUES
    ('宫殿建筑', 'palace', '古代帝王居住和处理的宫殿建筑', '🏛️'),
    ('宗教建筑', 'religious', '寺庙、道观、教堂等宗教场所', '⛩️'),
    ('民居建筑', 'residential', '各地传统民居和四合院', '🏠'),
    ('园林建筑', 'garden', '古典园林和山水建筑', '🏯'),
    ('塔式建筑', 'tower', '佛塔、古塔等塔式结构', '🗼'),
    ('城防建筑', 'fortress', '城墙、城门、关隘等防御设施', '🏰')
ON CONFLICT (slug) DO NOTHING;


-- =============================================
-- 3. 建筑表 (buildings)
-- 核心数据表，存储古建筑信息
-- =============================================
CREATE TABLE IF NOT EXISTS public.buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,                    -- 建筑名称
    slug TEXT UNIQUE NOT NULL,             -- URL 友好标识
    dynasty TEXT,                           -- 建造朝代
    location TEXT,                         -- 地理位置
    description TEXT,                      -- 简介描述
    content TEXT,                          -- 详细内容（富文本）
    image_url TEXT,                        -- 主图 URL
    images TEXT[],                         -- 图片数组
    video_url TEXT,                        -- 视频 URL

    -- 3D 模型支持
    model_url TEXT,                        -- .glb 模型 URL
    model_thumbnail TEXT,                  -- 3D 模型缩略图

    -- AR 支持
    ar_model_url TEXT,                     -- AR 模型 URL
    ar_marker_image TEXT,                 -- AR 标记图片

    -- 元数据
    category_id UUID REFERENCES categories(id),
    area TEXT,                             -- 面积
    height TEXT,                           -- 高度
    construction_period TEXT,              -- 建造时间
    protection_level TEXT,                 -- 保护级别（国保/省保/市保）

    -- 统计
    view_count INTEGER DEFAULT 0,          -- 浏览次数
    favorite_count INTEGER DEFAULT 0,     -- 收藏次数

    -- SEO
    meta_title TEXT,
    meta_description TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 使用 simple 文本搜索配置（兼容所有 PostgreSQL）
ALTER TABLE public.buildings ADD COLUMN IF NOT EXISTS fts tsvector
GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(dynasty, '') || ' ' || coalesce(location, '') || ' ' || coalesce(description, ''))
) STORED;

CREATE INDEX IF NOT EXISTS idx_buildings_fts ON public.buildings USING GIN(fts);

-- RLS 策略：公开可读
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "所有人可查看建筑"
    ON public.buildings FOR SELECT
    USING (true);

CREATE POLICY "管理员可增删改建筑"
    ON public.buildings FOR ALL
    USING (auth.role() = 'authenticated');


-- =============================================
-- 4. 建筑属性表 (building_attributes)
-- 存储建筑的详细属性信息
-- =============================================
CREATE TABLE IF NOT EXISTS public.building_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    attribute_type TEXT NOT NULL,          -- 属性类型：structure/material/decoration/feature
    attribute_name TEXT NOT NULL,          -- 属性名称
    attribute_value TEXT,                  -- 属性值
    description TEXT,                      -- 详细说明
    image_url TEXT,                        -- 相关图片
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.building_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "所有人可查看属性"
    ON public.building_attributes FOR SELECT
    USING (true);


-- =============================================
-- 5. 收藏表 (favorites)
-- 用户收藏的建筑
-- =============================================
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, building_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可查看自己的收藏"
    ON public.favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "用户可添加收藏"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可删除收藏"
    ON public.favorites FOR DELETE
    USING (auth.uid() = user_id);


-- =============================================
-- 6. 知识分类表 (knowledge_categories)
-- =============================================
CREATE TABLE IF NOT EXISTS public.knowledge_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,                            -- 分类颜色
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.knowledge_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "所有人可查看知识分类"
    ON public.knowledge_categories FOR SELECT
    USING (true);

-- 插入默认知识分类
INSERT INTO public.knowledge_categories (name, slug, description, icon, color) VALUES
    ('建筑构造', 'structure', '斗拱、榫卯等结构知识', '🔧', '#D4AF37'),
    ('建筑文化', 'culture', '建筑背后的文化内涵', '📜', '#8B6914'),
    ('历史故事', 'history', '建筑相关的历史典故', '📚', '#6B4423'),
    ('工艺技法', 'technique', '传统建筑工艺技法', '🎨', '#4A3728')
ON CONFLICT (slug) DO NOTHING;


-- =============================================
-- 7. 知识文章表 (knowledge_articles)
-- =============================================
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,                          -- 文章摘要
    content TEXT,                         -- 文章内容（Markdown）
    cover_image TEXT,                     -- 封面图
    category_id UUID REFERENCES knowledge_categories(id),
    author_id UUID REFERENCES users(id),

    -- 标签和关键词
    tags TEXT[],
    keywords TEXT[],

    -- 统计数据
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,

    -- SEO
    meta_title TEXT,
    meta_description TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 使用 simple 文本搜索配置
ALTER TABLE public.knowledge_articles ADD COLUMN IF NOT EXISTS fts tsvector
GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(content, ''))
) STORED;

CREATE INDEX IF NOT EXISTS idx_articles_fts ON public.knowledge_articles USING GIN(fts);

ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "所有人可查看已发布的文章"
    ON public.knowledge_articles FOR SELECT
    USING (is_published = true);


-- =============================================
-- 8. AI 对话历史表 (chat_history)
-- 存储用户与 AI 的对话记录
-- =============================================
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,              -- 对话会话 ID
    role TEXT NOT NULL,                     -- user / assistant
    content TEXT NOT NULL,                  -- 对话内容
    tokens_used INTEGER,                    -- 消耗的 tokens
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可查看自己的对话历史"
    ON public.chat_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "用户可添加对话历史"
    ON public.chat_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可删除对话历史"
    ON public.chat_history FOR DELETE
    USING (auth.uid() = user_id);


-- =============================================
-- 9. 触发器：自动更新 updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildings_updated_at
    BEFORE UPDATE ON buildings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON knowledge_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- =============================================
-- 10. 存储函数：搜索建筑（使用 LIKE 替代全文搜索）
-- =============================================
CREATE OR REPLACE FUNCTION search_buildings(search_query TEXT)
RETURNS TABLE(
    id UUID,
    name TEXT,
    slug TEXT,
    dynasty TEXT,
    location TEXT,
    description TEXT,
    image_url TEXT,
    category_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id,
        b.name,
        b.slug,
        b.dynasty,
        b.location,
        b.description,
        b.image_url,
        c.name as category_name
    FROM buildings b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE
        b.name ILIKE '%' || search_query || '%'
        OR b.dynasty ILIKE '%' || search_query || '%'
        OR b.location ILIKE '%' || search_query || '%'
        OR b.description ILIKE '%' || search_query || '%';
END;
$$ LANGUAGE plpgsql;


-- =============================================
-- 11. 存储函数：更新建筑浏览量
-- =============================================
CREATE OR REPLACE FUNCTION increment_view_count(building_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE buildings
    SET view_count = view_count + 1
    WHERE id = building_id;
END;
$$ LANGUAGE plpgsql;


-- =============================================
-- 12. 创建常用视图
-- =============================================
-- 建筑列表视图（包含分类信息）
CREATE OR REPLACE VIEW building_list AS
SELECT
    b.id,
    b.name,
    b.slug,
    b.dynasty,
    b.location,
    b.description,
    b.image_url,
    b.view_count,
    b.favorite_count,
    b.model_url,
    c.name as category_name,
    c.slug as category_slug
FROM buildings b
LEFT JOIN categories c ON b.category_id = c.id;

-- 热门建筑视图
CREATE OR REPLACE VIEW popular_buildings AS
SELECT
    b.id,
    b.name,
    b.slug,
    b.dynasty,
    b.location,
    b.image_url,
    b.view_count + b.favorite_count * 2 as popularity_score
FROM buildings b
ORDER BY popularity_score DESC
LIMIT 10;


-- =============================================
-- 完成提示
-- =============================================
-- 所有表创建完成！
-- 接下来请在 Supabase Dashboard 设置以下环境变量：
-- 1. NEXT_PUBLIC_SUPABASE_URL
-- 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
-- 3. SUPABASE_SERVICE_ROLE_KEY（仅后端使用）
