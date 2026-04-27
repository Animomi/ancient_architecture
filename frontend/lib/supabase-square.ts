import { supabase } from './supabase'

// ==================== 当前登录用户 ====================

export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id || null
}

export const getCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  return data
}

// ==================== 帖子分类 ====================

export interface PostCategory {
  id: string
  name: string
  description: string | null
  icon: string | null
  sort_order: number | null
  created_at: string | null
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
  category_id: string | null
  author_id: string | null
  author_name: string
  like_count: number | null
  collect_count: number | null
  comment_count: number | null
  created_at: string | null
  updated_at: string | null
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
  // 获取当前登录用户
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { data: null, error: new Error('请先登录后再发帖') }
  }
  
  // 获取用户名称（优先使用 metadata 中的 username）
  const authorName = user.user_metadata?.username || user.email?.split('@')[0] || '匿名用户'
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title,
      content,
      category_id: categoryId || null,
      author_id: user.id,
      author_name: authorName,
      like_count: 0,
      collect_count: 0,
      comment_count: 0
    })
    .select('*, category:post_categories(*)')
    .single()
  
  // 创建用户资料（如果不存在）- 数据库触发器会自动更新 post_count
  if (!error && data) {
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .single()
    
    if (!existingProfile) {
      await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          display_name: authorName,
          post_count: 1,
          total_likes: 0,
          total_collects: 0,
          follower_count: 0,
          following_count: 0
        })
    }
  }
  
  return { data: data as Post, error }
}

// 删除帖子（仅作者可删除）
export const deletePost = async (postId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: new Error('请先登录') }
  }
  
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id)
  
  return { error }
}

// 获取用户的所有帖子
export const getUserPosts = async (authorId?: string) => {
  let query = supabase
    .from('posts')
    .select('*, category:post_categories(*)')
    .order('created_at', { ascending: false })
  
  if (authorId) {
    query = query.eq('author_id', authorId)
  }
  
  const { data, error } = await query
  return { data: data as Post[], error }
}

// ==================== 点赞相关 ====================

// 获取用户对帖子的点赞状态
export const getLikeStatus = async (postId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isLiked: false, error: null }
  
  const { data, error } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()
  
  return { isLiked: !!data, error }
}

// 切换点赞状态
export const toggleLike = async (postId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isLiked: false, error: new Error('请先登录') }
  
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
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
        user_id: user.id
      })
    return { isLiked: true }
  }
}

// 批量获取点赞状态
export const getBatchLikeStatus = async (postIds: string[]) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { likedPostIds: new Set<string>() }
  
  const { data, error } = await supabase
    .from('post_likes')
    .select('post_id')
    .in('post_id', postIds)
    .eq('user_id', user.id)
  
  const likedPostIds = new Set(data?.map(d => d.post_id) || [])
  return { likedPostIds }
}

// ==================== 收藏相关 ====================

// 获取用户对帖子的收藏状态
export const getCollectStatus = async (postId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isCollected: false, error: null }
  
  const { data, error } = await supabase
    .from('post_collects')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()
  
  return { isCollected: !!data, error }
}

// 切换收藏状态
export const toggleCollect = async (postId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isCollected: false, error: new Error('请先登录') }
  
  const { data: existing } = await supabase
    .from('post_collects')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
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
        user_id: user.id
      })
    return { isCollected: true }
  }
}

// 批量获取收藏状态
export const getBatchCollectStatus = async (postIds: string[]) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { collectedPostIds: new Set<string>() }
  
  const { data, error } = await supabase
    .from('post_collects')
    .select('post_id')
    .in('post_id', postIds)
    .eq('user_id', user.id)
  
  const collectedPostIds = new Set(data?.map(d => d.post_id) || [])
  return { collectedPostIds }
}

// ==================== 评论相关 ====================

export interface PostComment {
  id: string
  post_id: string
  parent_id: string | null
  author_id: string | null
  author_name: string
  content: string
  like_count: number | null
  created_at: string | null
  updated_at: string | null
}

// 获取帖子的所有评论
export const getPostComments = async (postId: string) => {
  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  
  return { data: data as PostComment[], error }
}

// 添加评论
export const addComment = async (postId: string, content: string, parentId?: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('请先登录') }
  
  const authorName = user.user_metadata?.username || user.email?.split('@')[0] || '匿名用户'
  
  const { data, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: postId,
      parent_id: parentId || null,
      author_id: user.id,
      author_name: authorName,
      content,
      like_count: 0
    })
    .select()
    .single()
  
  return { data: data as PostComment, error }
}

// 删除评论
export const deleteComment = async (commentId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: new Error('请先登录') }
  
  const { error } = await supabase
    .from('post_comments')
    .delete()
    .eq('id', commentId)
    .eq('author_id', user.id)
  
  return { error }
}

// 评论点赞
export const toggleCommentLike = async (commentId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isLiked: false, error: new Error('请先登录') }
  
  const { data: existing } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .single()
  
  if (existing) {
    await supabase
      .from('comment_likes')
      .delete()
      .eq('id', existing.id)
    return { isLiked: false }
  } else {
    await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId,
        user_id: user.id
      })
    return { isLiked: true }
  }
}

// ==================== 关注相关 ====================

// 获取用户对目标用户的关注状态
export const getFollowStatus = async (targetUserId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isFollowing: false, error: null }
  
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .single()
  
  return { isFollowing: !!data, error }
}

// 切换关注状态
export const toggleFollow = async (targetUserId: string) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { isFollowing: false, error: new Error('请先登录') }
  
  if (user.id === targetUserId) {
    return { isFollowing: false, error: new Error('不能关注自己') }
  }
  
  const { data: existing } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
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
        follower_id: user.id,
        following_id: targetUserId
      })
    return { isFollowing: true }
  }
}

// ==================== 私信/聊天相关 ====================

export interface ChatConversation {
  id: string
  user1_id: string
  user2_id: string
  last_message: string | null
  last_message_at: string | null
  created_at: string | null
  other_user?: {
    user_id: string
    display_name: string
    avatar_url: string | null
  }
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean | null
  created_at: string | null
}

// 获取当前用户的所有会话列表
export const getConversations = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [] as ChatConversation[], error: null }
  
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false })
  
  // 获取对方用户信息
  if (data && data.length > 0) {
    const conversationsWithUsers = await Promise.all(
      data.map(async (conv) => {
        const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('user_id, display_name, avatar_url')
          .eq('user_id', otherUserId)
          .single()
        
        return {
          ...conv,
          other_user: profile || {
            user_id: otherUserId,
            display_name: otherUserId,
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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('请先登录') }
  
  // 先查找是否已存在会话
  const { data: existing } = await supabase
    .from('chat_conversations')
    .select('*')
    .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${user.id})`)
    .single()
  
  if (existing) {
    return { data: existing as ChatConversation, error: null }
  }
  
  // 创建新会话
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      user1_id: user.id,
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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: new Error('请先登录') }
  
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      is_read: false
    })
    .select()
    .single()
  
  // 更新会话的最后消息
  if (!error && data) {
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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  
  await supabase
    .from('chat_messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', user.id)
    .eq('is_read', false)
}
