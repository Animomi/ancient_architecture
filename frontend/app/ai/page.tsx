'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const quickQuestions = [
  '故宫的建筑风格有什么特点？',
  '什么是斗拱结构？',
  '苏州园林的设计理念是什么？',
  '中国传统建筑用什么材料？'
]

const architectureKnowledge = `
作为古建筑 AI 助手，我可以帮助你了解中国传统建筑的各个方面：

🏛️ **建筑类型**
- 宫殿建筑：故宫、天坛、颐和园
- 宗教建筑：寺庙、道观、石窟
- 园林建筑：苏州园林、承德避暑山庄
- 民居建筑：四合院、徽派建筑、吊脚楼

🏗️ **建筑结构**
- 斗拱：中国传统建筑特有的结构构件
- 大木作：承重结构体系
- 小木作：装饰与分隔构件

🎨 **建筑风格**
- 屋顶形式：庑殿、歇山、悬山、硬山
- 色彩运用：红墙黄瓦是皇家专属
- 装饰艺术：雕刻、彩画、砖雕

请告诉我你想了解的具体内容！
`

export default function AiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: architectureKnowledge,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // 模拟 AI 响应
    setTimeout(() => {
      const response = generateResponse(input)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1000)
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase()
    
    if (q.includes('故宫')) {
      return `🏛️ **故宫建筑详解**

故宫，又称紫禁城，是明清两代的皇家宫殿，主要特点包括：

**📐 总体布局**
- 中轴对称：建筑群沿南北中轴线展开
- 前朝后寝：前面是办公区，后面是居住区
- 三朝五门：午门、神武门等重要门殿

**🎨 色彩风格**
- 红色宫墙：象征皇家威严
- 黄色琉璃瓦：只有皇家建筑可用
- 金色装饰：彰显帝王尊贵

**🏗️ 结构特点**
- 木结构为主：采用抬梁式和穿斗式结构
- 斗拱系统：层层叠加，分散重量
- 屋顶形式：重檐庑殿顶最为尊贵

故宫是世界上现存规模最大、保存最完整的木质结构古建筑群！`
    }
    
    if (q.includes('斗拱')) {
      return `🏗️ **斗拱结构解析**

斗拱是中国传统建筑特有的结构构件组合，具有重要地位：

**📦 组成部件**
- 斗：方形木块，承托拱木
- 拱：弓形木件，横置于斗口
- 翘：倾斜的拱，角度约30度

**✨ 主要功能**
1. **力学功能**：分散屋顶重量，层层叠加传导
2. **结构伸缩**：适应木材热胀冷缩
3. **等级象征**：斗拱大小反映建筑等级
4. **装饰美化**：精美的雕刻艺术

**🏛️ 演变历史**
- 唐代：斗拱巨大，结构为主
- 宋代：斗拱变小，装饰性增强
- 明清：斗拱更加精巧繁复

斗拱被誉为"中国古建筑的灵魂"！`
    }
    
    if (q.includes('园林') || q.includes('苏州')) {
      return `🌳 **苏州园林艺术**

苏州园林是中国古典园林的杰出代表，联合国教科文组织世界遗产。

**🎯 设计理念**
- **天人合一**：人工与自然和谐统一
- **借景**：将园外景色纳入园内
- **一步一景**：移步换景，景随人动
- **虚实相生**：以小见大，咫尺山林

**🌿 构成元素**
- 水系：园林的灵魂，曲水环绕
- 假山：太湖石堆叠，千姿百态
- 植物：四季花卉，搭配有致
- 建筑：亭台楼阁，点缀其间

**📚 代表作品**
- 拙政园：最大最具代表性
- 留园：以建筑艺术见长
- 狮子林：假山王国
- 网师园：小巧精致典范

苏州园林体现了中国文人的审美情趣和生活理想！`
    }
    
    if (q.includes('材料') || q.includes('木材')) {
      return `🪵 **中国传统建筑材料**

中国古建筑以木材为主要结构材料，辅以多种材料：

**🪵 主要木材**
- 楠木：最珍贵，防腐防虫
- 杉木：耐腐耐久，南方常用
- 松木：取材方便，应用广泛
- 柏木：香气持久，陵墓建筑常用

**🧱 砖石材料**
- 青砖：宫殿、庙宇墙体
- 城砖：城墙、基础工程
- 石材：台基、柱础、石桥

**🎨 装饰材料**
- 琉璃：彩色釉面瓦，专属皇家
- 石灰：粉刷墙面，洁白如雪
- 桐油：保护木构件
- 朱漆：红色涂装，庄严华贵

**🏛️ 台基材料**
- 汉白玉：最高等级台阶
- 青石：普通建筑台基
- 砾石：基础填充材料

木材为主的特点决定了中国古建筑"土木结构"的独特风格！`
    }

    return `📚 关于"${question}"

这是一个关于中国传统建筑的好问题！

我目前是一个基础版本的 AI 助手，可以回答常见问题：

- 🏛️ 宫殿建筑（如故宫）
- ⛩️ 宗教建筑（寺庙、道观）
- 🏡 园林建筑（苏州园林）
- 🏠 民居建筑（四合院、徽派）
- 🏗️ 建筑结构（斗拱、大木作）
- 🎨 建筑风格与装饰

请尝试以下问题：
- "故宫的建筑风格有什么特点？"
- "什么是斗拱结构？"
- "苏州园林的设计理念是什么？"
- "中国传统建筑用什么材料？"

或者直接问我你想了解的具体内容！`
  }

  return (
    <div className="min-h-screen pb-12 px-4" style={{
      backgroundImage: `linear-gradient(to bottom, rgba(60, 50, 40, 0.75), rgba(70, 55, 45, 0.80)), 
                        url('/images/ai-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8 pt-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gradient-gold mb-4">
            AI 古建筑助手
          </h1>
          <p className="text-cream/80 max-w-xl mx-auto">
            询问任何关于中国传统建筑的问题，AI 将为你提供详细的解答
          </p>
        </div>

        {/* 聊天容器 */}
        <div className="bg-[#3D2E20]/[0.88] backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-amber-700/30">
          {/* 消息列表 */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-amber-600/40 to-amber-700/30 text-cream shadow-lg'
                      : 'bg-[#4A3828]/80 text-cream backdrop-blur-sm'
                  }`}
                >
                  <div className={`text-xs mb-2 ${
                    message.role === 'assistant' ? 'text-amber-300/80' : 'text-cream/60'
                  }`}>
                    {message.role === 'assistant' ? '🤖 AI 助手' : '👤 你'} •{' '}
                    {message.timestamp.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#4A3828]/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-amber-400/80 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-amber-400/80 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-amber-400/80 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 快捷问题 */}
          <div className="px-6 py-4 border-t border-amber-700/30 bg-[#2D1F15]/60">
            <p className="text-xs text-amber-200/60 mb-3">快捷问题：</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs bg-[#4A3828]/70 text-cream/90 px-3 py-1.5 rounded-full hover:bg-amber-600/50 hover:text-amber-50 transition-all border border-amber-600/20 hover:border-amber-500/40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* 输入框 */}
          <div className="p-6 border-t border-amber-700/30 bg-[#2D1F15]/70">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入你的问题..."
                className="flex-1 px-5 py-3 bg-[#4A3828]/70 backdrop-blur-sm border border-amber-600/40 rounded-xl text-cream placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500/60 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发送
              </button>
            </div>
          </div>
        </div>

        {/* 返回链接 */}
        <div className="mt-8 text-center">
          <Link href="/home" className="text-amber-200/70 hover:text-amber-400 transition-colors inline-flex items-center gap-2">
            <span>←</span> 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
