-- =============================================
-- 古建筑平台 - 自动用户创建触发器
-- 运行位置：Supabase Dashboard > SQL Editor
-- =============================================

-- 1. 创建函数：当 auth.users 中有新用户时，自动在 public.users 创建记录
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, username)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 创建触发器：在 auth.users 插入新用户时自动执行
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. 为 service_role 授予权限（确保触发器可以正常工作）
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON public.users TO postgres;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

-- 4. 给 anon 和 authenticated 用户必要的权限
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;

-- 5. 验证：查看当前 users 表中的用户
-- SELECT * FROM public.users;

-- 执行完成！新用户注册时会自动在 users 表中创建记录
