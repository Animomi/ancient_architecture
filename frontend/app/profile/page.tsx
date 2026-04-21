'use client'

import { useState, useEffect } from 'react'
import { supabase, signOut, getCurrentUser } from '@/lib/supabase'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  // 用户资料表单
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  
  // 统计数据
  const [stats, setStats] = useState({
    articles: 0,
    favorites: 0,
    comments: 0
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    setLoading(true)
    const { user: authUser } = await getCurrentUser()
    
    if (authUser) {
      setUser(authUser)
      setUsername(authUser.user_metadata?.username || '')
      setFullName(authUser.user_metadata?.full_name || '')
      
      // 获取用户统计数据
      const [articlesRes, favoritesRes, commentsRes] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact' }).eq('author_id', authUser.id),
        supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', authUser.id),
        supabase.from('comments').select('id', { count: 'exact' }).eq('user_id', authUser.id)
      ])
      
      setStats({
        articles: articlesRes.count || 0,
        favorites: favoritesRes.count || 0,
        comments: commentsRes.count || 0
      })
    }
    setLoading(false)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { error } = await supabase.auth.updateUser({
      data: {
        username,
        full_name: fullName
      }
    })

    if (error) {
      setMessage(`更新失败: ${error.message}`)
    } else {
      setMessage('个人资料更新成功！')
      // 刷新用户数据
      fetchUserProfile()
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900">
        <div className="text-center">
          <p className="text-cream/80 mb-4">请先登录</p>
          <a href="/login" className="btn-primary">去登录</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gradient-gold mb-2">个人中心</h1>
          <p className="text-cream/60">管理您的账户和偏好设置</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：用户信息卡片 */}
          <div className="lg:col-span-1">
            <div className="card p-6 text-center sticky top-24">
              {/* 头像 */}
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-5xl">
                  {username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gold rounded-full flex items-center justify-center text-wood-900 text-lg">
                  ✓
                </div>
              </div>
              
              <h2 className="text-xl font-serif font-bold text-gold mb-1">
                {username || user.email?.split('@')[0]}
              </h2>
              <p className="text-cream/60 text-sm mb-6">{user.email}</p>

              {/* 统计 */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="p-3 bg-wood-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-gold">{stats.articles}</div>
                  <div className="text-xs text-cream/60">文章</div>
                </div>
                <div className="p-3 bg-wood-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-gold">{stats.favorites}</div>
                  <div className="text-xs text-cream/60">收藏</div>
                </div>
                <div className="p-3 bg-wood-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-gold">{stats.comments}</div>
                  <div className="text-xs text-cream/60">评论</div>
                </div>
              </div>

              {/* 账户信息 */}
              <div className="text-left space-y-3 text-sm">
                <div className="flex justify-between py-2 border-t border-wood-700/50">
                  <span className="text-cream/60">用户ID</span>
                  <span className="text-cream/40 truncate max-w-[120px]">{user.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between py-2 border-t border-wood-700/50">
                  <span className="text-cream/60">邮箱</span>
                  <span className="text-cream/80">{user.email?.slice(0, 15)}...</span>
                </div>
                <div className="flex justify-between py-2 border-t border-wood-700/50">
                  <span className="text-cream/60">注册时间</span>
                  <span className="text-cream/80">
                    {new Date(user.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>

              {/* 退出登录 */}
              <button
                onClick={handleSignOut}
                className="w-full mt-6 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>

          {/* 右侧：设置表单 */}
          <div className="lg:col-span-2">
            {/* 基本信息 */}
            <div className="card p-6 mb-6">
              <h3 className="text-xl font-serif font-bold text-gold mb-6">基本信息</h3>
              
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.includes('失败') 
                    ? 'bg-red-500/10 text-red-400' 
                    : 'bg-green-500/10 text-green-400'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cream/80 mb-2">
                      用户名
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="设置您的用户名"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cream/80 mb-2">
                      昵称
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="设置您的昵称"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cream/80 mb-2">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="input-field opacity-60 cursor-not-allowed"
                  />
                  <p className="text-xs text-cream/40 mt-1">
                    邮箱地址无法修改
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '保存中...' : '保存修改'}
                </button>
              </form>
            </div>

            {/* 安全设置 */}
            <div className="card p-6 mb-6">
              <h3 className="text-xl font-serif font-bold text-gold mb-6">安全设置</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-wood-700/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-cream">修改密码</h4>
                    <p className="text-sm text-cream/50">定期更换密码可以保护账户安全</p>
                  </div>
                  <button className="btn-secondary text-sm py-2 px-4">
                    修改
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-wood-700/30 rounded-lg">
                  <div>
                    <h4 className="font-medium text-cream">两步验证</h4>
                    <p className="text-sm text-cream/50">启用额外的安全验证步骤</p>
                  </div>
                  <button className="btn-secondary text-sm py-2 px-4">
                    启用
                  </button>
                </div>
              </div>
            </div>

            {/* 通知设置 */}
            <div className="card p-6">
              <h3 className="text-xl font-serif font-bold text-gold mb-6">通知设置</h3>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-wood-700/30 rounded-lg cursor-pointer">
                  <div>
                    <h4 className="font-medium text-cream">邮件通知</h4>
                    <p className="text-sm text-cream/50">接收网站更新和活动通知</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded border-wood-600 bg-wood-700 text-gold focus:ring-gold focus:ring-offset-0"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-wood-700/30 rounded-lg cursor-pointer">
                  <div>
                    <h4 className="font-medium text-cream">评论回复</h4>
                    <p className="text-sm text-cream/50">有人回复您的评论时通知</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded border-wood-600 bg-wood-700 text-gold focus:ring-gold focus:ring-offset-0"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-wood-700/30 rounded-lg cursor-pointer">
                  <div>
                    <h4 className="font-medium text-cream">收藏更新</h4>
                    <p className="text-sm text-cream/50">收藏的内容有更新时通知</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-wood-600 bg-wood-700 text-gold focus:ring-gold focus:ring-offset-0"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
