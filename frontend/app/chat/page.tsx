'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getCurrentUserId,
  type ChatConversation,
  type ChatMessage
} from '@/lib/supabase-square'

function ChatPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [initLoading, setInitLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // 加载会话列表
  const loadConversations = async () => {
    const { data } = await getConversations()
    if (data) {
      setConversations(data)
    }
    setLoading(false)
  }

  // 加载消息
  const loadMessages = async (conversationId: string) => {
    const { data } = await getMessages(conversationId)
    if (data) {
      setMessages(data)
    }
    await markMessagesAsRead(conversationId)
  }

  // 检查登录状态
  useEffect(() => {
    const checkLogin = async () => {
      const userId = await getCurrentUserId()
      setCurrentUserId(userId)
      setIsLoggedIn(!!userId)
    }
    checkLogin()
  }, [])

  // 初始化
  useEffect(() => {
    loadConversations()
  }, [])

  // 检查 URL 参数是否有指定用户，自动创建/打开对话
  useEffect(() => {
    const userParam = searchParams.get('user')
    if (userParam && isLoggedIn) {
      initConversationWithUser(userParam)
    }
  }, [searchParams, isLoggedIn])

  // 选中会话时加载消息
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 与指定用户初始化对话
  const initConversationWithUser = async (userId: string) => {
    setInitLoading(true)
    const { data, error } = await getOrCreateConversation(userId)
    if (data && !error) {
      setSelectedConversation(data)
      // 重新加载会话列表以包含新对话
      await loadConversations()
      // 清除 URL 参数
      router.replace('/chat', { scroll: false })
    }
    setInitLoading(false)
  }

  // 选择会话
  const handleSelectConversation = (conv: ChatConversation) => {
    setSelectedConversation(conv)
    router.replace('/chat', { scroll: false })
  }

  // 发送消息
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || sending) return

    setSending(true)
    const { data } = await sendMessage(selectedConversation.id, newMessage.trim())
    if (data) {
      setMessages(prev => [...prev, data])
      setNewMessage('')
      await loadConversations()
    }
    setSending(false)
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

    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  // 格式化消息时间
  const formatMessageTime = (dateStr: string | null) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  // 渲染消息列表
  const renderMessages = () => {
    if (!selectedConversation) return null

    return messages.map((msg) => {
      const isMe = msg.sender_id === currentUserId
      return (
        <div
          key={msg.id}
          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
            <div
              className={`px-4 py-2.5 rounded-2xl text-sm ${
                isMe
                  ? 'bg-gold/20 text-cream rounded-br-md'
                  : 'bg-wood-800/70 backdrop-blur-sm text-cream rounded-bl-md'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
            <p className={`text-cream/50 text-xs mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
              {formatMessageTime(msg.created_at)}
            </p>
          </div>
        </div>
      )
    })
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex relative">
      {/* 全屏背景图 */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/chat-bg.jpg)' }}
      />
      {/* 深色遮罩 */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-wood-900/85 via-wood-800/80 to-wood-900/85" />

      {/* 内容层 */}
      <div className="relative z-10 flex flex-1">

        {/* 未登录提示 */}
        {!isLoggedIn ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-wood-900/85 backdrop-blur-md border border-wood-700/30 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-serif text-gold mb-2">请先登录</h3>
              <p className="text-cream/60 text-sm mb-4">登录后才能使用私信功能</p>
              <Link href="/login" className="btn-primary inline-block">
                去登录
              </Link>
            </div>
          </div>
        ) : (
        <>
        {/* 左侧栏：会话列表 */}
        <aside className={`w-72 flex-shrink-0 border-r border-wood-700/20 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-wood-700/20">
            <h2 className="text-lg font-serif font-bold text-gold">私信聊天</h2>
          </div>

          {/* 初始化新对话提示 */}
          {initLoading && (
            <div className="p-3 mx-3 mt-3 bg-gold/15 border border-gold/30 rounded-lg">
              <div className="flex items-center gap-2 text-gold text-sm">
                <div className="animate-spin w-4 h-4 border-2 border-gold border-t-transparent rounded-full"></div>
                正在创建对话...
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-cream/50">加载中...</div>
            ) : conversations.length === 0 && !initLoading ? (
              <div className="p-4 text-center text-cream/50">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-sm">暂无私信对话</p>
                <p className="text-xs mt-1">去游客广场找人聊聊吧</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-4 cursor-pointer border-b border-wood-700/10 transition-colors flex items-center gap-3 ${
                    selectedConversation?.id === conv.id
                      ? 'bg-gold/15 border-l-2 border-l-gold'
                      : 'hover:bg-wood-800/40'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-wood-800/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-cream font-medium text-sm truncate">
                        {conv.other_user?.display_name || conv.other_user?.user_id?.slice(-8) || '未知用户'}
                      </span>
                      <span className="text-cream/40 text-xs flex-shrink-0">
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    <p className="text-cream/50 text-xs truncate mt-1">
                      {conv.last_message || '暂无消息'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* 中间栏：聊天窗口 */}
        <main className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {selectedConversation ? (
            <>
              {/* 聊天头部 */}
              <div className="p-4 border-b border-wood-700/20 flex items-center gap-3 bg-wood-900/50 backdrop-blur-sm">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden text-cream/70 hover:text-gold mr-2"
                >
                  ←
                </button>
                <div className="w-10 h-10 rounded-full bg-wood-800/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <div className="text-cream font-medium">
                    {selectedConversation.other_user?.display_name || selectedConversation.other_user?.user_id?.slice(-8) || '未知用户'}
                  </div>
                  <div className="text-cream/40 text-xs">
                    {initLoading ? '创建对话中...' : '在线'}
                  </div>
                </div>
              </div>

              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {initLoading ? (
                  <div className="text-center text-cream/50 py-8">
                    <div className="animate-pulse">
                      <div className="text-3xl mb-2">💬</div>
                      <p className="text-sm">正在创建对话...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-cream/50 py-8">
                    <div className="text-3xl mb-2">💬</div>
                    <p className="text-sm">开始聊天吧</p>
                  </div>
                ) : (
                  <>
                    {renderMessages()}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* 输入框 */}
              <form onSubmit={handleSend} className="p-4 border-t border-wood-700/20 bg-wood-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="输入消息..."
                    className="input-field flex-1"
                    disabled={sending || initLoading}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending || initLoading}
                    className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    发送
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-wood-900/85 backdrop-blur-md border border-wood-700/30 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-serif text-gold mb-2">私信聊天</h3>
                <p className="text-cream/60 text-sm">选择一个对话开始聊天</p>
                <Link href="/square" className="btn-primary mt-4 inline-block">
                  去游客广场
                </Link>
              </div>
            </div>
          )}
        </main>
        </>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center relative">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/chat-bg.jpg)' }}
        />
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-wood-900/85 via-wood-800/80 to-wood-900/85" />
        <div className="relative z-10 text-cream/50">加载中...</div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}
