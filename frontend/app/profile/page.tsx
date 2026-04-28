'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  getCurrentUser,
  signOut,
} from '@/lib/supabase'
import {
  getVisitorId,
  getVisitorName,
  setVisitorName,
  getPosts,
  getPostLikes,
  getPostCollects,
  getFollowList,
  deletePost,
  type Post,
} from '@/lib/supabase-square'

type TabType = 'articles' | 'posts' | 'likes' | 'collects' | 'following' | 'settings'

interface VisitorProfile {
  visitor_id: string
  username: string
  avatar_url: string
  post_count: number
  total_likes: number
  total_collects: number
  follower_count: number
  following_count: number
  bio: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('articles')

  // 用户资料
  const [profile, setProfile] = useState<VisitorProfile | null>(null)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // 数据列表
  const [articles, setArticles] = useState<any[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [likedPosts, setLikedPosts] = useState<Post[]>([])
  const [collectedPosts, setCollectedPosts] = useState<Post[]>([])
  const [followingList, setFollowingList] = useState<any[]>([])

  // 加载状态
  const [loadingArticles, setLoadingArticles] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [loadingLikes, setLoadingLikes] = useState(false)
  const [loadingCollects, setLoadingCollects] = useState(false)
  const [loadingFollowing, setLoadingFollowing] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadProfile()
      loadArticles()
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    switch (activeTab) {
      case 'posts':
        loadPosts()
        break
      case 'likes':
        loadLikes()
        break
      case 'collects':
        loadCollects()
        break
      case 'following':
        loadFollowing()
        break
    }
  }, [activeTab, user])

  const checkUser = async () => {
    setLoading(true)
    const { user } = await getCurrentUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
    setLoading(false)
  }

  const loadProfile = async () => {
    const visitorId = getVisitorId()
    const storedName = getVisitorName()
    
    // 优先使用登录用户的邮箱作为用户名
    const displayName = user?.email?.split('@')[0] || user?.user_metadata?.username || storedName || visitorId
    
    setUsername(displayName)
    setProfile({
      visitor_id: visitorId,
      username: displayName,
      avatar_url: user?.user_metadata?.avatar_url || '',
      post_count: 0,
      total_likes: 0,
      total_collects: 0,
      follower_count: 0,
      following_count: 0,
      bio: user?.user_metadata?.bio || ''
    })
  }

  const loadArticles = async () => {
    setLoadingArticles(true)
    const { data } = await getPosts()
    if (data) {
      const visitorId = getVisitorId()
      const userArticles = data.filter(post => post.visitor_id === visitorId)
      setArticles(userArticles)
    }
    setLoadingArticles(false)
  }

  const loadPosts = async () => {
    setLoadingPosts(true)
    const { data } = await getPosts()
    if (data) {
      const visitorId = getVisitorId()
      const userPosts = data.filter(post => post.visitor_id === visitorId)
      setPosts(userPosts)
    }
    setLoadingPosts(false)
  }

  const loadLikes = async () => {
    setLoadingLikes(true)
    const { likedPostIds } = await getPostLikes()
    const { data } = await getPosts()
    if (data) {
      const liked = data.filter(post => likedPostIds.includes(post.id))
      setLikedPosts(liked)
    }
    setLoadingLikes(false)
  }

  const loadCollects = async () => {
    setLoadingCollects(true)
    const { collectedPostIds } = await getPostCollects()
    const { data } = await getPosts()
    if (data) {
      const collected = data.filter(post => collectedPostIds.includes(post.id))
      setCollectedPosts(collected)
    }
    setLoadingCollects(false)
  }

  const loadFollowing = async () => {
    setLoadingFollowing(true)
    const visitorId = getVisitorId()
    const { following } = await getFollowList(visitorId)
    setFollowingList(following || [])
    setLoadingFollowing(false)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    setVisitorName(username)
    localStorage.setItem('visitor_bio', bio)

    setMessage('个人资料更新成功！')
    setSaving(false)

    setProfile(prev => prev ? {
      ...prev,
      username,
      bio
    } : null)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('确定要删除这篇帖子吗？此操作不可撤销。')) return

    await deletePost(postId)
    loadPosts()
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) return

    setArticles(prev => prev.filter(a => a.id !== articleId))
  }

  const handleSignOut = async () => {
    if (!confirm('确定要退出登录吗？')) return
    await signOut()
    router.push('/')
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 30) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: `linear-gradient(to bottom, rgba(90, 75, 60, 0.65), rgba(100, 80, 65, 0.72)), 
                          url('/images/profile-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-cream/70">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: `linear-gradient(to bottom, rgba(90, 75, 60, 0.65), rgba(100, 80, 65, 0.72)), 
                          url('/images/profile-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        <div className="text-center">
          <p className="text-cream/80 mb-4">请先登录</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1410] font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-colors shadow-lg shadow-amber-900/30">
            去登录
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'articles' as TabType, label: '我的文章', icon: '📚' },
    { id: 'posts' as TabType, label: '我的帖子', icon: '📝' },
    { id: 'likes' as TabType, label: '我的点赞', icon: '❤️' },
    { id: 'collects' as TabType, label: '我的收藏', icon: '⭐' },
    { id: 'following' as TabType, label: '我的关注', icon: '👥' },
    { id: 'settings' as TabType, label: '账号设置', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen pb-16" style={{
      backgroundImage: `linear-gradient(to bottom, rgba(90, 75, 60, 0.65), rgba(100, 80, 65, 0.72)), 
                        url('/images/profile-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {/* 顶部装饰条 */}
      <div className="h-20 bg-gradient-to-r from-[#4A3828]/80 via-[#5A4838]/60 to-[#4A3828]/80 border-b border-amber-600/30 backdrop-blur-sm"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        {/* 返回首页按钮 */}
        <div className="mb-5">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-amber-100/80 hover:text-amber-300 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
        </div>

        {/* 个人信息卡片 */}
        <div className="bg-[#4A3828]/[0.88] backdrop-blur-md rounded-2xl shadow-xl border border-amber-600/30 p-6 mb-6 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* 头像 */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl text-white shadow-lg shadow-amber-900/30">
                {username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm shadow-md">
                ✓
              </div>
            </div>

            {/* 用户信息 */}
            <div className="flex-1 text-center lg:text-left w-full">
              <h1 className="text-2xl font-bold text-amber-100 mb-1">
                {username}
              </h1>
              <p className="text-cream/60 text-sm mb-5">
                ID: {profile?.visitor_id?.slice(-8) || '暂无'}
              </p>

              {/* 统计 */}
              <div className="grid grid-cols-5 gap-2">
                <div className="p-3 bg-[#5A4838]/80 backdrop-blur-sm rounded-xl text-center hover:shadow-lg hover:shadow-amber-900/20 transition-all cursor-default border border-amber-500/30">
                  <div className="text-xl font-bold text-amber-200">{articles.length}</div>
                  <div className="text-xs text-cream/70 font-medium">文章</div>
                </div>
                <div className="p-3 bg-[#5A4838]/80 backdrop-blur-sm rounded-xl text-center hover:shadow-lg hover:shadow-amber-900/20 transition-all cursor-default border border-amber-500/30">
                  <div className="text-xl font-bold text-amber-200">{posts.length}</div>
                  <div className="text-xs text-cream/70 font-medium">帖子</div>
                </div>
                <div className="p-3 bg-[#5A4838]/80 backdrop-blur-sm rounded-xl text-center hover:shadow-lg hover:shadow-amber-900/20 transition-all cursor-default border border-amber-500/30">
                  <div className="text-xl font-bold text-rose-300">{likedPosts.length}</div>
                  <div className="text-xs text-cream/70 font-medium">获赞</div>
                </div>
                <div className="p-3 bg-[#5A4838]/80 backdrop-blur-sm rounded-xl text-center hover:shadow-lg hover:shadow-amber-900/20 transition-all cursor-default border border-amber-500/30">
                  <div className="text-xl font-bold text-amber-300">{collectedPosts.length}</div>
                  <div className="text-xs text-cream/70 font-medium">收藏</div>
                </div>
                <div className="p-3 bg-[#5A4838]/80 backdrop-blur-sm rounded-xl text-center hover:shadow-lg hover:shadow-amber-900/20 transition-all cursor-default border border-amber-500/30">
                  <div className="text-xl font-bold text-amber-200">{followingList.length}</div>
                  <div className="text-xs text-cream/70 font-medium">关注</div>
                </div>
              </div>
            </div>

            {/* 退出登录 */}
            <button
              onClick={handleSignOut}
              className="flex-shrink-0 px-4 py-2.5 bg-[#5A4838]/80 backdrop-blur-sm text-amber-200/80 rounded-xl hover:bg-red-500/30 hover:text-red-300 transition-colors text-sm font-medium border border-amber-500/30"
            >
              退出登录
            </button>
          </div>
        </div>

        {/* 标签切换 */}
        <div className="bg-[#4A3828]/[0.85] backdrop-blur-md rounded-2xl shadow-lg border border-amber-600/30 p-1.5 mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1410] shadow-lg shadow-amber-500/30'
                    : 'text-amber-100/80 hover:bg-[#5A4838]/60 hover:text-amber-100'
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="bg-[#4A3828]/[0.88] backdrop-blur-md rounded-2xl shadow-xl border border-amber-600/30 p-6 min-h-[400px]">
          {/* 我的文章 */}
          {activeTab === 'articles' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-amber-100 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-400 rounded-full"></span>
                  我的文章
                </h2>
                <Link href="/knowledge" className="text-sm text-amber-300 hover:text-amber-200 font-medium transition-colors">
                  + 发布新文章
                </Link>
              </div>

              {loadingArticles ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-400 border-t-transparent"></div>
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-16 bg-[#5A4838]/60 backdrop-blur-sm rounded-xl border border-amber-500/30">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-cream/70 mb-5">还没有发布过文章</p>
                  <Link href="/knowledge" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1410] font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-colors shadow-lg">
                    去知识库看看
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="p-4 bg-[#5A4838]/80 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-amber-900/20 transition-all group border border-amber-500/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 cursor-pointer" onClick={() => router.push(`/knowledge?id=${article.id}`)}>
                          <h3 className="text-lg font-semibold text-amber-100 group-hover:text-amber-200 transition-colors mb-1">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-cream/60">
                            <span>{formatTime(article.created_at)}</span>
                            <span className="flex items-center gap-1">❤️ {article.like_count || 0}</span>
                            <span className="flex items-center gap-1">⭐ {article.collect_count || 0}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                          <button
                            onClick={() => router.push(`/knowledge?id=${article.id}`)}
                            className="p-2 text-cream/60 hover:text-amber-400 hover:bg-[#4A3828] rounded-lg transition-colors"
                            title="查看"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 text-cream/60 hover:text-red-400 hover:bg-[#4A3828] rounded-lg transition-colors"
                            title="删除"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 我的帖子 */}
          {activeTab === 'posts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-amber-100 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-400 rounded-full"></span>
                  我的帖子
                </h2>
                <Link href="/square" className="text-sm text-amber-300 hover:text-amber-200 font-medium transition-colors">
                  + 发布新帖子
                </Link>
              </div>

              {loadingPosts ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-400 border-t-transparent"></div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-16 bg-[#5A4838]/60 backdrop-blur-sm rounded-xl border border-amber-500/30">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-cream/70 mb-5">还没有发布过帖子</p>
                  <Link href="/square" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1410] font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-colors shadow-lg">
                    去广场看看
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 bg-[#5A4838]/80 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-amber-900/20 transition-all group border border-amber-500/30"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => router.push(`/square/post?id=${post.id}`)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {post.category && (
                              <span className="px-2.5 py-1 bg-amber-500/30 text-amber-200 text-xs font-medium rounded-lg border border-amber-400/40">
                                {post.category.name}
                              </span>
                            )}
                            <h3 className="text-lg font-semibold text-amber-100 group-hover:text-amber-200 transition-colors">
                              {post.title}
                            </h3>
                          </div>
                          <p className="text-sm text-cream/70 line-clamp-2 mb-2">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-cream/60">
                            <span>{formatTime(post.created_at)}</span>
                            <span className="flex items-center gap-1">❤️ {post.like_count || 0}</span>
                            <span className="flex items-center gap-1">⭐ {post.collect_count || 0}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                          <button
                            onClick={() => router.push(`/square/post?id=${post.id}`)}
                            className="p-2 text-cream/60 hover:text-amber-400 hover:bg-[#4A3828] rounded-lg transition-colors"
                            title="查看"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-cream/60 hover:text-red-400 hover:bg-[#4A3828] rounded-lg transition-colors"
                            title="删除"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 我的点赞 */}
          {activeTab === 'likes' && (
            <div>
              <h2 className="text-xl font-bold text-amber-100 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-rose-400 rounded-full"></span>
                我点赞的帖子
              </h2>

              {loadingLikes ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-400 border-t-transparent"></div>
                </div>
              ) : likedPosts.length === 0 ? (
                <div className="text-center py-16 bg-[#5A4838]/60 backdrop-blur-sm rounded-xl border border-amber-500/30">
                  <div className="text-6xl mb-4">❤️</div>
                  <p className="text-cream/70 mb-5">还没有点赞过任何帖子</p>
                  <Link href="/square" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1410] font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-colors shadow-lg">
                    去广场探索
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {likedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 bg-[#5A4838]/80 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-amber-900/20 transition-all border border-amber-500/30 cursor-pointer"
                      onClick={() => router.push(`/square/post?id=${post.id}`)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {post.category && (
                          <span className="px-2.5 py-1 bg-amber-500/30 text-amber-200 text-xs font-medium rounded-lg border border-amber-400/40">
                            {post.category.name}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-amber-100 hover:text-amber-200 transition-colors">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cream/70">作者: {post.username}</span>
                        <div className="flex items-center gap-4 text-cream/60">
                          <span className="flex items-center gap-1">❤️ {post.like_count || 0}</span>
                          <span className="flex items-center gap-1">⭐ {post.collect_count || 0}</span>
                          <span>{formatTime(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 我的收藏 */}
          {activeTab === 'collects' && (
            <div>
              <h2 className="text-xl font-bold text-amber-100 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-400 rounded-full"></span>
                我收藏的帖子
              </h2>

              {loadingCollects ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-400 border-t-transparent"></div>
                </div>
              ) : collectedPosts.length === 0 ? (
                <div className="text-center py-16 bg-[#5A4838]/60 backdrop-blur-sm rounded-xl border border-amber-500/30">
                  <div className="text-6xl mb-4">⭐</div>
                  <p className="text-cream/70 mb-5">还没有收藏过任何帖子</p>
                  <Link href="/square" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1410] font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-colors shadow-lg">
                    去广场探索
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {collectedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 bg-[#5A4838]/80 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-amber-900/20 transition-all border border-amber-500/30 cursor-pointer"
                      onClick={() => router.push(`/square/post?id=${post.id}`)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {post.category && (
                          <span className="px-2.5 py-1 bg-amber-500/30 text-amber-200 text-xs font-medium rounded-lg border border-amber-400/40">
                            {post.category.name}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-amber-100 hover:text-amber-200 transition-colors">
                          {post.title}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-cream/70">作者: {post.username}</span>
                        <div className="flex items-center gap-4 text-cream/60">
                          <span className="flex items-center gap-1">❤️ {post.like_count || 0}</span>
                          <span className="flex items-center gap-1">⭐ {post.collect_count || 0}</span>
                          <span>{formatTime(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 我的关注 */}
          {activeTab === 'following' && (
            <div>
              <h2 className="text-xl font-bold text-amber-100 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-400 rounded-full"></span>
                我关注的用户
              </h2>

              {loadingFollowing ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-400 border-t-transparent"></div>
                </div>
              ) : followingList.length === 0 ? (
                <div className="text-center py-16 bg-[#5A4838]/60 backdrop-blur-sm rounded-xl border border-amber-500/30">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-cream/70 mb-5">还没有关注过任何用户</p>
                  <Link href="/square" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1410] font-medium rounded-xl hover:from-amber-300 hover:to-amber-400 transition-colors shadow-lg">
                    去广场探索
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {followingList.map((user) => (
                    <div
                      key={user.visitor_id}
                      className="p-4 bg-[#5A4838]/80 backdrop-blur-sm rounded-xl hover:shadow-lg hover:shadow-amber-900/20 transition-all border border-amber-500/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl text-white shadow-md">
                          {user.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-amber-100 truncate">
                            {user.username}
                          </h3>
                          <p className="text-sm text-cream/60">
                            ID: {user.visitor_id?.slice(-6) || '未知'}
                          </p>
                        </div>
                        <button
                          onClick={() => {/* TODO: 取消关注 */}}
                          className="px-4 py-1.5 text-sm font-medium border-2 border-amber-500/40 text-amber-200/80 rounded-lg hover:border-red-400/60 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                        >
                          已关注
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 账号设置 */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-bold text-amber-100 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-400 rounded-full"></span>
                账号设置
              </h2>

              {message && (
                <div className={`mb-6 p-4 rounded-xl ${
                  message.includes('失败')
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-green-500/20 text-green-300 border border-green-500/40'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-semibold text-amber-100 mb-2">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="设置您的用户名"
                    className="w-full px-4 py-3 bg-[#5A4838]/80 backdrop-blur-sm border border-amber-500/40 rounded-xl text-amber-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-100 mb-2">
                    个人简介
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="介绍一下自己..."
                    rows={4}
                    className="w-full px-4 py-3 bg-[#5A4838]/80 backdrop-blur-sm border border-amber-500/40 rounded-xl text-amber-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/60 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-100 mb-2">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-[#4A3828]/60 backdrop-blur-sm border border-amber-500/30 rounded-xl text-cream/60 cursor-not-allowed"
                  />
                  <p className="text-xs text-cream/50 mt-1">
                    邮箱地址无法修改
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-amber-100 mb-2">
                    用户ID
                  </label>
                  <input
                    type="text"
                    value={profile?.visitor_id || ''}
                    disabled
                    className="w-full px-4 py-3 bg-[#4A3828]/60 backdrop-blur-sm border border-amber-500/30 rounded-xl text-cream/60 cursor-not-allowed"
                  />
                  <p className="text-xs text-cream/50 mt-1">
                    用户ID是您在平台的唯一标识
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a1410] font-semibold rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#1a1410] border-t-transparent"></div>
                      保存中...
                    </>
                  ) : (
                    '保存修改'
                  )}
                </button>
              </form>

              {/* 安全设置 */}
              <div className="mt-10 pt-8 border-t border-amber-500/30">
                <h3 className="text-lg font-bold text-amber-100 mb-4">安全设置</h3>
                <div className="space-y-4 max-w-lg">
                  <div className="flex items-center justify-between p-4 bg-[#5A4838]/60 backdrop-blur-sm rounded-xl border border-amber-500/30">
                    <div>
                      <h4 className="font-semibold text-amber-100">修改密码</h4>
                      <p className="text-sm text-cream/60">定期更换密码可以保护账户安全</p>
                    </div>
                    <button className="px-4 py-2 bg-[#4A3828]/80 text-amber-300 font-medium rounded-lg border border-amber-500/40 hover:bg-amber-500/30 hover:text-amber-200 transition-colors">
                      修改
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
