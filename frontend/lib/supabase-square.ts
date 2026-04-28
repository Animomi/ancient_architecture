import { supabase } from './supabase'
import { getCurrentUser } from './supabase'

// ==================== 游客标识 ====================

export const getVisitorId = () => {
  if (typeof window === 'undefined') return ''
  
  let visitorId = localStorage.getItem('visitor_id')
  if (!visitorId) {
    visitorId = '游客' + Math.random().toString(36).substring(2, 8).toUpperCase()
    localStorage.setItem('visitor_id', visitorId)
  }
  return visitorId
}

export const getVisitorName = () => {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('visitor_name') || getVisitorId()
}

export const setVisitorName = (name: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('visitor_name', name)
}

// ==================== 帖子分类 ====================

export interface PostCategory {
  id: string
  name: string
  description: string
  icon: string
  sort_order: number
}

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('post_categories')
    .select('*')
    .order('sort_order', { ascending: true })
  
  return { data: data as PostCategory[], error }
}

// ==================== 帖子相关 ====================

export interface Post {
  id: string
  title: string
  content: string
  category_id: string
  username: string
  visitor_id: string
  like_count: number
  collect_count: number
  comment_count: number
  created_at: string
  updated_at: string
  category?: PostCategory
}

// 获取所有帖子（按时间倒序）
export const getPosts = async (categoryId?: string) => {
  let query = supabase
    .from('posts')
    .select('*, category:post_categories(*)')
    .order('created_at', { ascending: false })
  
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }
  
  const { data, error } = await query
  return { data: data as Post[], error }
}

// 获取单个帖子
export const getPost = async (postId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, category:post_categories(*)')
    .eq('id', postId)
    .single()
  
  return { data: data as Post, error }
}

// 发布帖子
export const createPost = async (title: string, content: string, categoryId: string) => {
  const visitorId = getVisitorId()
  const username = getVisitorName()
  
  // #region agent debug log
  fetch('http://127.0.0.1:7464/ingest/d0370acf-0e49-4487-9b7c-abf162b0a30a', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'X-Debug-Session-Id': '791e96'},
    body: JSON.stringify({
      sessionId: '791e96',
      location: 'supabase-square.ts:createPost',
      message: 'createPost 开始执行',
      data: { title, categoryId, username, visitorId },
      timestamp: Date.now(),
      runId: 'initial-debug'
    })
  }).catch(() => {});
  // #endregion
  
  // 获取当前登录用户
  const { user } = await getCurrentUser()
  
  // #region agent debug log
  fetch('http://127.0.0.1:7464/ingest/d0370acf-0e49-4487-9b7c-abf162b0a30a', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'X-Debug-Session-Id': '791e96'},
    body: JSON.stringify({
      sessionId: '791e96',
      location: 'supabase-square.ts:createPost:getUser',
      message: '获取用户信息',
      data: { 
        userId: user?.id || null,
        userEmail: user?.email || null,
        userEmailPrefix: user?.email?.split('@')[0] || null,
        userMeta: user?.user_metadata || null
      },
      timestamp: Date.now(),
      runId: 'initial-debug'
    })
  }).catch(() => {});
  // #endregion
  
  // 使用登录用户的ID和名称，或回退到游客ID和名称
  const authorId = user?.id || null
  const authorName = user?.email?.split('@')[0] || user?.user_metadata?.username || username
  
  const insertData = {
    title,
    content,
    category_id: categoryId,
    author_id: authorId,
    author_name: authorName,
    visitor_id: visitorId
  }
  
  // #region agent debug log
  fetch('http://127.0.0.1:7464/ingest/d0370acf-0e49-4487-9b7c-abf162b0a30a', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'X-Debug-Session-Id': '791e96'},
    body: JSON.stringify({
      sessionId: '791e96',
      location: 'supabase-square.ts:createPost:insert',
      message: '准备插入数据',
      data: { 
        insertData,
        authorNameLength: authorName?.length || 0,
        authorId: authorId || 'null'
      },
      timestamp: Date.now(),
      runId: 'initial-debug'
    })
  }).catch(() => {});
  // #endregion
  
  const { data, error } = await supabase
    .from('posts')
    .insert(insertData)
    .select('*, category:post_categories(*)')
    .single()
  
  // #region agent debug log
  fetch('http://127.0.0.1:7464/ingest/d0370acf-0e49-4487-9b7c-abf162b0a30a', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'X-Debug-Session-Id': '791e96'},
    body: JSON.stringify({
      sessionId: '791e96',
      location: 'supabase-square.ts:createPost:result',
      message: '插入结果',
      data: { 
        success: !error,
        errorMessage: error?.message || null,
        errorDetails: error?.details || null,
        errorHint: error?.hint || null,
        errorCode: error?.code || null,
        returnedId: data?.id || null
      },
      timestamp: Date.now(),
      runId: 'initial-debug'
    })
  }).catch(() => {});
  // #endregion
  
  return { data: data as Post, error }
}

// 删除帖子（仅作者可删除）
export const deletePost = async (postId: string) => {
  const visitorId = getVisitorId()
  
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('visitor_id', visitorId)
  
  return { error }
}

// ==================== 用户资料 ====================

export interface VisitorProfile {
  visitor_id: string
  username: string
  avatar_url: string
  post_count: number
  total_likes: number
  total_collects: number
  follower_count: number
  following_count: number
}

export const getVisitorProfile = async (visitorId: string) => {
  const { data, error } = await supabase
    .from('visitor_profiles')
    .select('*')
    .eq('visitor_id', visitorId)
    .single()
  
  return { data: data as VisitorProfile, error }
}

export const updateVisitorProfile = async (updates: Partial<VisitorProfile>) => {
  const visitorId = getVisitorId()
  
  const { data, error } = await supabase
    .from('visitor_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('visitor_id', visitorId)
    .select()
    .single()
  
  return { data, error }
}

// ==================== 点赞相关 ====================

// 获取用户对帖子的点赞状态
export const getLikeStatus = async (postId: string) => {
  const visitorId = getVisitorId()
  
  const { data, error } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('visitor_id', visitorId)
    .single()
  
  return { isLiked: !!data, error }
}

// 切换点赞状态
export const toggleLike = async (postId: string) => {
  const visitorId = getVisitorId()
  
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('visitor_id', visitorId)
    .single()
  
  if (existing) {
    await supabase
      .from('post_likes')
      .delete()
      .eq('id', existing.id)
    return { isLiked: false }
  } else {
    await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        visitor_id: visitorId
      })
    return { isLiked: true }
  }
}

// 批量获取点赞状态
export const getBatchLikeStatus = async (postIds: string[]) => {
  const visitorId = getVisitorId()
  
  const { data, error } = await supabase
    .from('post_likes')
    .select('post_id')
    .in('post_id', postIds)
    .eq('visitor_id', visitorId)
  
  const likedPostIds = new Set(data?.map(d => d.post_id) || [])
  return { likedPostIds }
}

// ==================== 收藏相关 ====================

// 获取用户对帖子的收藏状态
export const getCollectStatus = async (postId: string) => {
  const visitorId = getVisitorId()
  
  const { data, error } = await supabase
    .from('post_collects')
    .select('id')
    .eq('post_id', postId)
    .eq('visitor_id', visitorId)
    .single()
  
  return { isCollected: !!data, error }
}

// 切换收藏状态
export const toggleCollect = async (postId: string) => {
  const visitorId = getVisitorId()
  
  const { data: existing } = await supabase
    .from('post_collects')
    .select('id')
    .eq('post_id', postId)
    .eq('visitor_id', visitorId)
    .single()
  
  if (existing) {
    await supabase
      .from('post_collects')
      .delete()
      .eq('id', existing.id)
    return { isCollected: false }
  } else {
    await supabase
      .from('post_collects')
      .insert({
        post_id: postId,
        visitor_id: visitorId
      })
    return { isCollected: true }
  }
}

// 批量获取收藏状态
export const getBatchCollectStatus = async (postIds: string[]) => {
  const visitorId = getVisitorId()
  
  const { data, error } = await supabase
    .from('post_collects')
    .select('post_id')
    .in('post_id', postIds)
    .eq('visitor_id', visitorId)
  
  const collectedPostIds = new Set(data?.map(d => d.post_id) || [])
  return { collectedPostIds }
}

// ==================== 帖子收藏/点赞列表 ====================

// 获取用户点赞过的所有帖子
export const getPostLikes = async () => {
  const visitorId = getVisitorId()

  const { data, error } = await supabase
    .from('post_likes')
    .select('post_id')
    .eq('visitor_id', visitorId)

  const likedPostIds = data?.map(d => d.post_id) || []
  return { likedPostIds }
}

// 获取用户收藏过的所有帖子
export const getPostCollects = async () => {
  const visitorId = getVisitorId()

  const { data, error } = await supabase
    .from('post_collects')
    .select('post_id')
    .eq('visitor_id', visitorId)

  const collectedPostIds = data?.map(d => d.post_id) || []
  return { collectedPostIds }
}

// 获取用户关注的所有用户
export const getFollowList = async (visitorId?: string) => {
  const currentVisitorId = visitorId || getVisitorId()

  const { data, error } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', currentVisitorId)

  // 获取被关注用户的详细信息
  if (data && data.length > 0) {
    const followingIds = data.map(d => d.following_id)
    const { data: profiles } = await supabase
      .from('visitor_profiles')
      .select('*')
      .in('visitor_id', followingIds)

    return { following: profiles || [] }
  }

  return { following: [] }
}

// ==================== 关注相关 ====================

// 获取用户对目标用户的关注状态
export const getFollowStatus = async (targetVisitorId: string) => {
  const visitorId = getVisitorId()
  
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', visitorId)
    .eq('following_id', targetVisitorId)
    .single()
  
  return { isFollowing: !!data, error }
}

// 切换关注状态
export const toggleFollow = async (targetVisitorId: string) => {
  const visitorId = getVisitorId()
  
  if (visitorId === targetVisitorId) {
    return { isFollowing: false, error: new Error('不能关注自己') }
  }
  
  const { data: existing } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', visitorId)
    .eq('following_id', targetVisitorId)
    .single()
  
  if (existing) {
    await supabase
      .from('follows')
      .delete()
      .eq('id', existing.id)
    return { isFollowing: false }
  } else {
    await supabase
      .from('follows')
      .insert({
        follower_id: visitorId,
        following_id: targetVisitorId
      })
    return { isFollowing: true }
  }
}

// ==================== 私信/聊天相关 ====================

export interface ChatConversation {
  id: string
  user1_id: string
  user2_id: string
  last_message: string
  last_message_at: string
  created_at: string
  other_user?: {
    visitor_id: string
    username: string
    avatar_url: string
  }
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

// 获取当前用户的所有会话列表
export const getConversations = async () => {
  const visitorId = getVisitorId()
  
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .or(`user1_id.eq.${visitorId},user2_id.eq.${visitorId}`)
    .order('last_message_at', { ascending: false })
  
  // 获取对方用户信息
  if (data && data.length > 0) {
    const conversationsWithUsers = await Promise.all(
      data.map(async (conv) => {
        const otherUserId = conv.user1_id === visitorId ? conv.user2_id : conv.user1_id
        const { data: profile } = await supabase
          .from('visitor_profiles')
          .select('visitor_id, username, avatar_url')
          .eq('visitor_id', otherUserId)
          .single()
        
        return {
          ...conv,
          other_user: profile || {
            visitor_id: otherUserId,
            username: otherUserId,
            avatar_url: null
          }
        }
      })
    )
    return { data: conversationsWithUsers as ChatConversation[], error }
  }
  
  return { data: [] as ChatConversation[], error }
}

// 获取或创建与某用户的会话
export const getOrCreateConversation = async (otherUserId: string) => {
  const visitorId = getVisitorId()
  
  // 先查找是否已存在会话
  const { data: existing } = await supabase
    .from('chat_conversations')
    .select('*')
    .or(`and(user1_id.eq.${visitorId},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${visitorId})`)
    .single()
  
  if (existing) {
    return { data: existing as ChatConversation, error: null }
  }
  
  // 创建新会话
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      user1_id: visitorId,
      user2_id: otherUserId
    })
    .select()
    .single()
  
  return { data: data as ChatConversation, error }
}

// 获取会话中的消息
export const getMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  
  return { data: data as ChatMessage[], error }
}

// 发送消息
export const sendMessage = async (conversationId: string, content: string) => {
  const visitorId = getVisitorId()
  
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      sender_id: visitorId,
      content
    })
    .select()
    .single()
  
  // 更新会话的最后消息
  if (!error) {
    await supabase
      .from('chat_conversations')
      .update({
        last_message: content,
        last_message_at: new Date().toISOString()
      })
      .eq('id', conversationId)
  }
  
  return { data: data as ChatMessage, error }
}

// 标记消息已读
export const markMessagesAsRead = async (conversationId: string) => {
  const visitorId = getVisitorId()
  
  await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', visitorId)
    .eq('is_read', false)
}
