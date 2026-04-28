'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  getPosts,
  getCategories,
  getBatchLikeStatus,
  getBatchCollectStatus,
  getVisitorName,
  setVisitorName,
  getVisitorId,
  getVisitorProfile,
  toggleFollow,
  getFollowStatus,
  type Post,
  type PostCategory,
  type VisitorProfile
} from '@/lib/supabase-square'

export default function SquarePage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<PostCategory[]>([])
  const [loading, setLoading] = useState(true)
  
  // 用户状态
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [collectedPosts, setCollectedPosts] = useState<Set<string>>(new Set())
  const [isFollowing, setIsFollowing] = useState(false)
  const [targetProfile, setTargetProfile] = useState<VisitorProfile | null>(null)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
  
  // 编辑用户名
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

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

  // 加载目标用户资料
  const loadTargetProfile = async (post: Post) => {
    const { data: profile } = await getVisitorProfile(post.visitor_id)
    if (profile) {
      setTargetProfile(profile)
      // 检查关注状态
      const { isFollowing } = await getFollowStatus(post.visitor_id)
      setIsFollowing(isFollowing)
    } else {
      setTargetProfile({
        visitor_id: post.visitor_id,
        username: post.username,
        avatar_url: '',
        post_count: 0,
        total_likes: 0,
        total_collects: 0,
        follower_count: 0,
        following_count: 0
      })
    }
  }

  // 选择帖子
  const handleSelectPost = async (post: Post) => {
    setSelectedPost(post)
    await loadTargetProfile(post)
  }

  // 格式化时间
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
    
    const { isLiked } = await toggleLikeInList(postId)
    
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
        ? { ...p, like_count: p.like_count + (isLiked ? 1 : -1) }
        : p
    ))
    
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, like_count: prev.like_count + (isLiked ? 1 : -1) } : null)
    }
    
    setActionLoading(prev => ({ ...prev, [postId]: false }))
  }

  // 临时替代函数（需要从 supabase-square 导入）
  const toggleLikeInList = async (postId: string) => {
    const visitorId = getVisitorId()
    const { supabase } = await import('@/lib/supabase')
    
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('visitor_id', visitorId)
      .single()
    
    if (existing) {
      await supabase.from('post_likes').delete().eq('id', existing.id)
      return { isLiked: false }
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, visitor_id: visitorId })
      return { isLiked: true }
    }
  }

  // 收藏
  const handleCollect = async (postId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (actionLoading[postId]) return
    
    setActionLoading(prev => ({ ...prev, [postId]: true }))
    
    const { isCollected } = await toggleCollectInList(postId)
    
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
        ? { ...p, collect_count: p.collect_count + (isCollected ? 1 : -1) }
        : p
    ))
    
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, collect_count: prev.collect_count + (isCollected ? 1 : -1) } : null)
    }
    
    setActionLoading(prev => ({ ...prev, [postId]: false }))
  }

  const toggleCollectInList = async (postId: string) => {
    const visitorId = getVisitorId()
    const { supabase } = await import('@/lib/supabase')
    
    const { data: existing } = await supabase
      .from('post_collects')
      .select('id')
      .eq('post_id', postId)
      .eq('visitor_id', visitorId)
      .single()
    
    if (existing) {
      await supabase.from('post_collects').delete().eq('id', existing.id)
      return { isCollected: false }
    } else {
      await supabase.from('post_collects').insert({ post_id: postId, visitor_id: visitorId })
      return { isCollected: true }
    }
  }

  // 关注
  const handleFollow = async () => {
    if (!selectedPost || selectedPost.visitor_id === getVisitorId()) return
    
    const { isFollowing: newStatus } = await toggleFollow(selectedPost.visitor_id)
    setIsFollowing(newStatus)
    setTargetProfile(prev => prev ? {
      ...prev,
      follower_count: prev.follower_count + (newStatus ? 1 : -1)
    } : null)
  }

  // 私信
  const handleMessage = () => {
    if (!selectedPost) return
    router.push(`/chat?user=${selectedPost.visitor_id}`)
  }

  // 保存用户名
  const handleSaveName = () => {
    if (tempName.trim()) {
      setVisitorName(tempName.trim())
    }
    setIsEditingName(false)
  }

  const handleEditName = () => {
    setTempName(getVisitorName())
    setIsEditingName(true)
    setTimeout(() => nameInputRef.current?.focus(), 100)
  }

  // 内容预览（截取前100字）
  const getPreview = (content: string) => {
    if (content.length <= 100) return content
    return content.substring(0, 100) + '...'
  }

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `linear-gradient(to bottom, rgba(60, 50, 40, 0.78), rgba(70, 55, 45, 0.82)), 
                        url('/images/square-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <div className="flex max-w-7xl mx-auto">
        {/* ========== 左侧栏：分类导航 ========== */}
        <aside className="w-56 flex-shrink-0 p-4 hidden lg:block">
          <div className="sticky top-20">
            {/* 发帖按钮 */}
            <Link
              href="/square/post"
              className="block w-full text-center mb-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-900/30"
            >
              + 发帖
            </Link>
            
            {/* 当前用户 */}
            <div className="bg-[#3D2E20]/[0.88] backdrop-blur-md rounded-xl p-4 mb-4 border border-amber-700/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <span className="text-amber-400">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  {isEditingName ? (
                    <div className="flex items-center gap-1">
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                        className="input-field py-1 px-2 text-sm w-20"
                      />
                      <button onClick={handleSaveName} className="text-amber-400 text-xs">✓</button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEditName}
                      className="text-cream text-sm truncate hover:text-amber-400 transition-colors w-full text-left"
                    >
                      {getVisitorName()}
                    </button>
                  )}
                  <div className="text-cream/40 text-xs">游客 ID: {getVisitorId().slice(-6)}</div>
                </div>
              </div>
            </div>

            {/* 分类列表 */}
            <div className="bg-[#3D2E20]/[0.88] backdrop-blur-md rounded-xl p-2 border border-amber-700/30">
              <h3 className="text-amber-400 text-sm font-medium px-3 py-2">帖子分类</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedPost(null) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    !selectedCategory 
                      ? 'bg-amber-500/30 text-amber-100' 
                      : 'text-cream/80 hover:bg-[#4A3828]/60 hover:text-cream'
                  }`}
                >
                  全部帖子
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setSelectedPost(null) }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                      selectedCategory === cat.id 
                        ? 'bg-amber-500/30 text-amber-100' 
                        : 'text-cream/80 hover:bg-[#4A3828]/60 hover:text-cream'
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
        <main className="flex-1 min-w-0 border-x border-amber-700/20">
          {/* 移动端顶部 */}
          <div className="lg:hidden p-4 flex items-center justify-between">
            <Link href="/square/post" className="text-sm py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg">
              + 发帖
            </Link>
            <button
              onClick={() => setSelectedPost(null)}
              className="text-cream/70 hover:text-amber-400"
            >
              ← 返回列表
            </button>
          </div>

          {selectedPost ? (
            // ========== 帖子详情 ==========
            <div className="p-6">
              <button
                onClick={() => setSelectedPost(null)}
                className="text-cream/60 hover:text-amber-400 text-sm mb-4 flex items-center gap-1"
              >
                ← 返回列表
              </button>
              
              <div className="bg-[#3D2E20]/[0.88] backdrop-blur-md rounded-2xl p-6 border border-amber-700/30 shadow-xl">
                {/* 分类标签 */}
                {selectedPost.category && (
                  <span className="inline-block bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full mb-3">
                    {selectedPost.category.icon} {selectedPost.category.name}
                  </span>
                )}
                
                {/* 标题 */}
                <h1 className="text-2xl font-serif font-bold text-amber-100 mb-4">
                  {selectedPost.title}
                </h1>
                
                {/* 作者信息 */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-700/30">
                  <div className="w-10 h-10 rounded-full bg-[#4A3828] flex items-center justify-center">
                    <span className="text-cream/70">👤</span>
                  </div>
                  <div>
                    <div className="text-amber-200 font-medium">{selectedPost.username}</div>
                    <div className="text-cream/50 text-xs">{formatTime(selectedPost.created_at)}</div>
                  </div>
                </div>
                
                {/* 内容 */}
                <div className="text-cream leading-relaxed whitespace-pre-wrap mb-6">
                  {selectedPost.content}
                </div>
                
                {/* 互动按钮 */}
                <div className="flex items-center gap-6 pt-4 border-t border-amber-700/30">
                  <button
                    onClick={() => handleLike(selectedPost.id)}
                    disabled={actionLoading[selectedPost.id]}
                    className={`flex items-center gap-2 transition-all ${
                      likedPosts.has(selectedPost.id)
                        ? 'text-red-400'
                        : 'text-cream/60 hover:text-red-400'
                    }`}
                  >
                    <span>{likedPosts.has(selectedPost.id) ? '❤️' : '🤍'}</span>
                    <span>{selectedPost.like_count}</span>
                  </button>
                  
                  <button
                    onClick={() => handleCollect(selectedPost.id)}
                    disabled={actionLoading[selectedPost.id]}
                    className={`flex items-center gap-2 transition-all ${
                      collectedPosts.has(selectedPost.id)
                        ? 'text-amber-400'
                        : 'text-cream/60 hover:text-amber-400'
                    }`}
                  >
                    <span>{collectedPosts.has(selectedPost.id) ? '⭐' : '☆'}</span>
                    <span>{selectedPost.collect_count}</span>
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
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-all ${
                      !selectedCategory 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-[#3D2E20]/80 text-cream/70 border border-amber-700/30'
                    }`}
                  >
                    全部
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-1 ${
                        selectedCategory === cat.id 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-[#3D2E20]/80 text-cream/70 border border-amber-700/30'
                      }`}
                    >
                      <span>{cat.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="bg-[#3D2E20]/[0.88] backdrop-blur-md rounded-xl p-8 text-center text-cream/60 border border-amber-700/30">加载中...</div>
              ) : posts.length === 0 ? (
                <div className="bg-[#3D2E20]/[0.88] backdrop-blur-md rounded-xl p-8 text-center border border-amber-700/30">
                  <div className="text-4xl mb-3">📝</div>
                  <div className="text-cream/80">暂无帖子，来发表第一篇吧</div>
                  <Link href="/square/post" className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all">
                    去发帖
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handleSelectPost(post)}
                      className="bg-[#3D2E20]/[0.88] backdrop-blur-md rounded-xl p-4 cursor-pointer hover:bg-[#4A3828]/90 transition-all border border-amber-700/30 hover:border-amber-500/40"
                    >
                      {/* 顶部：分类 + 时间 */}
                      <div className="flex items-center justify-between mb-2">
                        {post.category && (
                          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                            {post.category.icon} {post.category.name}
                          </span>
                        )}
                        <span className="text-cream/50 text-xs">{formatTime(post.created_at)}</span>
                      </div>
                      
                      {/* 标题 */}
                      <h3 className="text-lg font-serif font-medium text-amber-100 mb-1 line-clamp-1">
                        {post.title}
                      </h3>
                      
                      {/* 预览 */}
                      <p className="text-cream/70 text-sm line-clamp-2 mb-3">
                        {getPreview(post.content)}
                      </p>
                      
                      {/* 底部：作者 + 互动 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-cream/60">
                          <span>👤</span>
                          <span>{post.username}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className={likedPosts.has(post.id) ? 'text-red-400' : 'text-cream/60'}>
                            ❤️ {post.like_count}
                          </span>
                          <span className={collectedPosts.has(post.id) ? 'text-amber-400' : 'text-cream/60'}>
                            ⭐ {post.collect_count}
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
              <div className="bg-[#3D2E20]/[0.88] backdrop-blur-md rounded-xl p-4 border border-amber-700/30">
                <h3 className="text-amber-400 text-sm font-medium mb-4">帖子作者</h3>
                
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#4A3828] flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="text-cream font-medium">{selectedPost.username}</div>
                  <div className="text-cream/50 text-xs mt-1">ID: {selectedPost.visitor_id ? selectedPost.visitor_id.slice(-6) : '未知'}</div>
                </div>
                
                {/* 统计数据 */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-[#4A3828]/50 rounded-lg">
                    <div className="text-amber-400 font-bold">{targetProfile?.post_count || 0}</div>
                    <div className="text-cream/60 text-xs">发帖</div>
                  </div>
                  <div className="text-center p-2 bg-[#4A3828]/50 rounded-lg">
                    <div className="text-amber-400 font-bold">{targetProfile?.follower_count || 0}</div>
                    <div className="text-cream/60 text-xs">粉丝</div>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="space-y-2">
                  <button
                    onClick={handleFollow}
                    disabled={selectedPost.visitor_id === getVisitorId()}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedPost.visitor_id === getVisitorId()
                        ? 'bg-[#4A3828]/50 text-cream/40 cursor-not-allowed'
                        : isFollowing
                          ? 'bg-[#4A3828] text-cream/80 hover:bg-[#5A4838]'
                          : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    }`}
                  >
                    {selectedPost.visitor_id === getVisitorId() 
                      ? '我自己' 
                      : isFollowing 
                        ? '已关注' 
                        : '+ 关注'}
                  </button>
                  
                  <button
                    onClick={handleMessage}
                    disabled={selectedPost.visitor_id === getVisitorId()}
                    className="w-full py-2 rounded-lg text-sm font-medium bg-[#4A3828]/50 text-cream/80 hover:bg-[#4A3828] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💬 私信
                  </button>
                </div>
              </div>
            ) : (
              // 未选择帖子，显示广场信息
              <div className="bg-[#3D2E20]/[0.88] backdrop-blur-md rounded-xl p-4 border border-amber-700/30">
                <h3 className="text-amber-400 text-sm font-medium mb-4">游客广场</h3>
                <p className="text-cream/70 text-sm mb-4">
                  分享你对古建筑的见解与感悟，与志同道合的朋友交流讨论。
                </p>
                <div className="text-cream/50 text-xs">
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
