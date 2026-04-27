'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  getPosts,
  getCategories,
  getBatchLikeStatus,
  getBatchCollectStatus,
  toggleLike,
  toggleCollect,
  toggleFollow,
  getFollowStatus,
  getCurrentUserId,
  type Post,
  type PostCategory
} from '@/lib/supabase-square'

export default function SquarePage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<PostCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  // 用户状态
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [collectedPosts, setCollectedPosts] = useState<Set<string>>(new Set())
  const [isFollowing, setIsFollowing] = useState(false)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  // 检查登录状态
  useEffect(() => {
    const checkLogin = async () => {
      const userId = await getCurrentUserId()
      setCurrentUserId(userId)
    }
    checkLogin()
  }, [])

  // 加载分类
  const loadCategories = async () => {
    const { data } = await getCategories()
    if (data) {
      setCategories(data)
    }
  }

  // 加载帖子
  const loadPosts = async () => {
    setLoading(true)
    const { data } = await getPosts(selectedCategory || undefined)
    if (data) {
      setPosts(data)
      
      // 批量获取点赞/收藏状态
      const postIds = data.map((p: Post) => p.id)
      const { likedPostIds } = await getBatchLikeStatus(postIds)
      const { collectedPostIds } = await getBatchCollectStatus(postIds)
      
      setLikedPosts(likedPostIds)
      setCollectedPosts(collectedPostIds)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadCategories()
    loadPosts()
  }, [selectedCategory])

  // 加载目标用户资料并检查关注状态
  const loadFollowStatus = async (post: Post) => {
    if (!currentUserId || !post.author_id) {
      setIsFollowing(false)
      return
    }
    const { isFollowing } = await getFollowStatus(post.author_id)
    setIsFollowing(isFollowing)
  }

  // 选择帖子
  const handleSelectPost = async (post: Post) => {
    setSelectedPost(post)
    await loadFollowStatus(post)
  }

  // 格式化时间
  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
  }

  // 点赞
  const handleLike = async (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (actionLoading[postId]) return
    
    setActionLoading(prev => ({ ...prev, [postId]: true }))
    
    const { isLiked, error } = await toggleLike(postId)
    
    if (!error) {
      setLikedPosts(prev => {
        const newSet = new Set(prev)
        if (isLiked) {
          newSet.add(postId)
        } else {
          newSet.delete(postId)
        }
        return newSet
      })
      
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, like_count: (p.like_count || 0) + (isLiked ? 1 : -1) }
          : p
      ))
      
      if (selectedPost?.id === postId) {
        setSelectedPost(prev => prev ? { ...prev, like_count: (prev.like_count || 0) + (isLiked ? 1 : -1) } : null)
      }
    }
    
    setActionLoading(prev => ({ ...prev, [postId]: false }))
  }

  // 收藏
  const handleCollect = async (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (actionLoading[postId]) return
    
    setActionLoading(prev => ({ ...prev, [postId]: true }))
    
    const { isCollected, error } = await toggleCollect(postId)
    
    if (!error) {
      setCollectedPosts(prev => {
        const newSet = new Set(prev)
        if (isCollected) {
          newSet.add(postId)
        } else {
          newSet.delete(postId)
        }
        return newSet
      })
      
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, collect_count: (p.collect_count || 0) + (isCollected ? 1 : -1) }
          : p
      ))
      
      if (selectedPost?.id === postId) {
        setSelectedPost(prev => prev ? { ...prev, collect_count: (prev.collect_count || 0) + (isCollected ? 1 : -1) } : null)
      }
    }
    
    setActionLoading(prev => ({ ...prev, [postId]: false }))
  }

  // 关注
  const handleFollow = async () => {
    if (!selectedPost?.author_id) return
    if (currentUserId === selectedPost.author_id) return
    
    const { isFollowing: newStatus } = await toggleFollow(selectedPost.author_id)
    setIsFollowing(newStatus)
  }

  // 私信
  const handleMessage = () => {
    if (!selectedPost?.author_id) return
    router.push(`/chat?user=${selectedPost.author_id}`)
  }

  // 内容预览（截取前100字）
  const getPreview = (content: string) => {
    if (content.length <= 100) return content
    return content.substring(0, 100) + '...'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900">
      <div className="flex max-w-7xl mx-auto">
        {/* ========== 左侧栏：分类导航 ========== */}
        <aside className="w-56 flex-shrink-0 p-4 hidden lg:block">
          <div className="sticky top-20">
            {/* 发帖按钮 */}
            <Link
              href={currentUserId ? "/square/post" : "/login"}
              className="block w-full btn-primary text-center mb-6"
            >
              + 发帖
            </Link>
            
            {/* 当前用户 */}
            <div className="card p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-gold">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  {currentUserId ? (
                    <div className="text-cream text-sm truncate">已登录用户</div>
                  ) : (
                    <Link href="/login" className="text-gold text-sm hover:text-gold-light">
                      点击登录
                    </Link>
                  )}
                  <div className="text-cream/40 text-xs">游客广场</div>
                </div>
              </div>
            </div>

            {/* 分类列表 */}
            <div className="card p-2">
              <h3 className="text-gold text-sm font-medium px-3 py-2">帖子分类</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedPost(null) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !selectedCategory 
                      ? 'bg-gold/20 text-gold' 
                      : 'text-cream/70 hover:bg-wood-700/50 hover:text-cream'
                  }`}
                >
                  全部帖子
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setSelectedPost(null) }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      selectedCategory === cat.id 
                        ? 'bg-gold/20 text-gold' 
                        : 'text-cream/70 hover:bg-wood-700/50 hover:text-cream'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* ========== 中间栏：帖子列表 / 详情 ========== */}
        <main className="flex-1 min-w-0 border-x border-wood-700/30">
          {/* 移动端顶部 */}
          <div className="lg:hidden p-4 flex items-center justify-between">
            <Link href={currentUserId ? "/square/post" : "/login"} className="btn-primary text-sm py-2 px-4">
              + 发帖
            </Link>
            <button
              onClick={() => setSelectedPost(null)}
              className="text-cream/70 hover:text-gold"
            >
              ← 返回列表
            </button>
          </div>

          {selectedPost ? (
            // ========== 帖子详情 ==========
            <div className="p-6">
              <button
                onClick={() => setSelectedPost(null)}
                className="text-cream/50 hover:text-gold text-sm mb-4 flex items-center gap-1"
              >
                ← 返回列表
              </button>
              
              <div className="card p-6">
                {/* 分类标签 */}
                {selectedPost.category && (
                  <span className="inline-block bg-gold/10 text-gold text-xs px-3 py-1 rounded-full mb-3">
                    {selectedPost.category.icon} {selectedPost.category.name}
                  </span>
                )}
                
                {/* 标题 */}
                <h1 className="text-2xl font-serif font-bold text-gold mb-4">
                  {selectedPost.title}
                </h1>
                
                {/* 作者信息 */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-wood-700/30">
                  <div className="w-10 h-10 rounded-full bg-wood-700 flex items-center justify-center">
                    <span className="text-cream/70">👤</span>
                  </div>
                  <div>
                    <div className="text-gold font-medium">{selectedPost.author_name}</div>
                    <div className="text-cream/40 text-xs">{formatTime(selectedPost.created_at)}</div>
                  </div>
                </div>
                
                {/* 内容 */}
                <div className="text-cream/90 leading-relaxed whitespace-pre-wrap mb-6">
                  {selectedPost.content}
                </div>
                
                {/* 互动按钮 */}
                <div className="flex items-center gap-6 pt-4 border-t border-wood-700/30">
                  <button
                    onClick={() => handleLike(selectedPost.id)}
                    disabled={actionLoading[selectedPost.id]}
                    className={`flex items-center gap-2 transition-colors ${
                      likedPosts.has(selectedPost.id)
                        ? 'text-red-400'
                        : 'text-cream/50 hover:text-red-400'
                    }`}
                  >
                    <span>{likedPosts.has(selectedPost.id) ? '❤️' : '🤍'}</span>
                    <span>{selectedPost.like_count || 0}</span>
                  </button>
                  
                  <button
                    onClick={() => handleCollect(selectedPost.id)}
                    disabled={actionLoading[selectedPost.id]}
                    className={`flex items-center gap-2 transition-colors ${
                      collectedPosts.has(selectedPost.id)
                        ? 'text-gold'
                        : 'text-cream/50 hover:text-gold'
                    }`}
                  >
                    <span>{collectedPosts.has(selectedPost.id) ? '⭐' : '☆'}</span>
                    <span>{selectedPost.collect_count || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // ========== 帖子列表 ==========
            <div className="p-4">
              {/* 移动端分类筛选 */}
              <div className="lg:hidden mb-4 overflow-x-auto">
                <div className="flex gap-2 pb-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-colors ${
                      !selectedCategory 
                        ? 'bg-gold text-wood-900' 
                        : 'bg-wood-700 text-cream/70'
                    }`}
                  >
                    全部
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1 ${
                        selectedCategory === cat.id 
                          ? 'bg-gold text-wood-900' 
                          : 'bg-wood-700 text-cream/70'
                      }`}
                    >
                      <span>{cat.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="card p-8 text-center text-cream/50">加载中...</div>
              ) : posts.length === 0 ? (
                <div className="card p-8 text-center">
                  <div className="text-4xl mb-3">📝</div>
                  <div className="text-cream/70">暂无帖子，来发表第一篇吧</div>
                  <Link href={currentUserId ? "/square/post" : "/login"} className="btn-primary mt-4 inline-block">
                    去发帖
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handleSelectPost(post)}
                      className="card p-4 cursor-pointer hover:border-gold/30 transition-all"
                    >
                      {/* 顶部：分类 + 时间 */}
                      <div className="flex items-center justify-between mb-2">
                        {post.category && (
                          <span className="text-xs bg-gold/10 text-gold/80 px-2 py-0.5 rounded">
                            {post.category.icon} {post.category.name}
                          </span>
                        )}
                        <span className="text-cream/40 text-xs">{formatTime(post.created_at)}</span>
                      </div>
                      
                      {/* 标题 */}
                      <h3 className="text-lg font-serif font-medium text-gold mb-1 line-clamp-1">
                        {post.title}
                      </h3>
                      
                      {/* 预览 */}
                      <p className="text-cream/60 text-sm line-clamp-2 mb-3">
                        {getPreview(post.content)}
                      </p>
                      
                      {/* 底部：作者 + 互动 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-cream/50">
                          <span>👤</span>
                          <span>{post.author_name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={likedPosts.has(post.id) ? 'text-red-400' : 'text-cream/50'}>
                            ❤️ {post.like_count || 0}
                          </span>
                          <span className={collectedPosts.has(post.id) ? 'text-gold' : 'text-cream/50'}>
                            ⭐ {post.collect_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* ========== 右侧栏：用户信息 ========== */}
        <aside className="w-64 flex-shrink-0 p-4 hidden xl:block">
          <div className="sticky top-20">
            {selectedPost ? (
              // 已选择帖子，显示作者信息
              <div className="card p-4">
                <h3 className="text-gold text-sm font-medium mb-4">帖子作者</h3>
                
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-wood-700 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="text-cream font-medium">{selectedPost.author_name}</div>
                  {selectedPost.author_id && (
                    <div className="text-cream/40 text-xs mt-1">ID: {selectedPost.author_id.slice(-6)}</div>
                  )}
                </div>
                
                {/* 操作按钮 */}
                <div className="space-y-2">
                  <button
                    onClick={handleFollow}
                    disabled={!currentUserId || !selectedPost.author_id || currentUserId === selectedPost.author_id}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      !currentUserId || !selectedPost.author_id
                        ? 'bg-wood-700/50 text-cream/30 cursor-not-allowed'
                        : currentUserId === selectedPost.author_id
                          ? 'bg-wood-700/50 text-cream/30 cursor-not-allowed'
                          : isFollowing
                            ? 'bg-wood-700 text-cream/70 hover:bg-wood-600'
                            : 'bg-gold/20 text-gold hover:bg-gold/30'
                    }`}
                  >
                    {!currentUserId 
                      ? '登录后关注' 
                      : currentUserId === selectedPost.author_id 
                        ? '我自己' 
                        : isFollowing 
                          ? '已关注' 
                          : '+ 关注'}
                  </button>
                  
                  <button
                    onClick={handleMessage}
                    disabled={!currentUserId || !selectedPost.author_id || currentUserId === selectedPost.author_id}
                    className="w-full py-2 rounded-lg text-sm font-medium bg-wood-700/50 text-cream/70 hover:bg-wood-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!currentUserId ? '登录后私信' : '💬 私信'}
                  </button>
                </div>
              </div>
            ) : (
              // 未选择帖子，显示广场信息
              <div className="card p-4">
                <h3 className="text-gold text-sm font-medium mb-4">游客广场</h3>
                <p className="text-cream/60 text-sm mb-4">
                  分享你对古建筑的见解与感悟，与志同道合的朋友交流讨论。
                </p>
                <div className="text-cream/40 text-xs">
                  共 {posts.length} 篇帖子
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
