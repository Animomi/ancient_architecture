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
  getVisitorName,
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
  
  const currentVisitorId = typeof window !== 'undefined' 
    ? localStorage.getItem('visitor_id') || ''
    : ''

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
    // 标记消息已读
    await markMessagesAsRead(conversationId)
  }

  // 初始化
  useEffect(() => {
    loadConversations()
    
    // 检查 URL 参数是否有指定用户
    const userParam = searchParams.get('user')
    if (userParam) {
      initConversationWithUser(userParam)
    }
  }, [searchParams])

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
    const { data } = await getOrCreateConversation(userId)
    if (data) {
      setSelectedConversation(data)
      // 如果会话列表中没有这个对话，添加到列表
      if (!conversations.find(c => c.id === data.id)) {
        loadConversations()
      }
    }
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
      // 更新会话列表
      loadConversations()
    }
    setSending(false)
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
    
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  // 格式化消息时间
  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900">
      {/* ========== 左侧栏：会话列表 ========== */}
      <aside className={`w-72 flex-shrink-0 border-r border-wood-700/30 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-wood-700/30">
          <h2 className="text-lg font-serif font-bold text-gold">私信聊天</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-cream/50">加载中...</div>
          ) : conversations.length === 0 ? (
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
                className={`p-4 cursor-pointer border-b border-wood-700/20 transition-colors flex items-center gap-3 ${
                  selectedConversation?.id === conv.id
                    ? 'bg-gold/10 border-l-2 border-l-gold'
                    : 'hover:bg-wood-700/30'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-wood-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-cream font-medium text-sm truncate">
                      {conv.other_user?.username || conv.other_user?.visitor_id || '未知用户'}
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

      {/* ========== 中间栏：聊天窗口 ========== */}
      <main className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation ? (
          <>
            {/* 聊天头部 */}
            <div className="p-4 border-b border-wood-700/30 flex items-center gap-3">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden text-cream/70 hover:text-gold mr-2"
              >
                ←
              </button>
              <div className="w-10 h-10 rounded-full bg-wood-700 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div>
                <div className="text-cream font-medium">
                  {selectedConversation.other_user?.username || selectedConversation.other_user?.visitor_id || '未知用户'}
                </div>
                <div className="text-cream/40 text-xs">
                  ID: {(selectedConversation.other_user?.visitor_id || '').slice(-6)}
                </div>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-cream/50 py-8">
                  <div className="text-3xl mb-2">💬</div>
                  <p className="text-sm">开始聊天吧</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === currentVisitorId
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isMe
                              ? 'bg-gold/20 text-cream rounded-br-md'
                              : 'bg-wood-700/50 text-cream rounded-bl-md'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <p className={`text-cream/40 text-xs mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                          {formatMessageTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入框 */}
            <form onSubmit={handleSend} className="p-4 border-t border-wood-700/30">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="输入消息..."
                  className="input-field flex-1"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发送
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-serif text-gold mb-2">私信聊天</h3>
              <p className="text-cream/50 text-sm">选择一个对话开始聊天</p>
              <Link href="/square" className="btn-primary mt-4 inline-block">
                去游客广场
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-wood-900 via-wood-800 to-wood-900">
        <div className="text-cream/50">加载中...</div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}
