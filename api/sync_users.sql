-- 同步已有用户到 public.users 表
-- 为 auth.users 中的每个用户，在 public.users 中创建记录

INSERT INTO public.users (id, email, username)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1))
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 查看同步结果
SELECT 
    u.id,
    u.email,
    u.username,
    u.created_at
FROM public.users u
ORDER BY u.created_at DESC;
