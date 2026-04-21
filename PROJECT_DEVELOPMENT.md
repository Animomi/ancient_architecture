# 中国传统建筑艺术展示平台 - 古建筑

> 为"中国计算机设计大赛"打造的古建筑展示平台

## 项目概述

本项目旨在通过现代 Web 技术展示中国传统建筑艺术的魅力，结合 3D 模型、AI 助手等创新功能，为用户提供沉浸式的建筑文化体验。

## 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端框架 | Next.js 14+ (App Router) + TypeScript |
| 样式 | Tailwind CSS (中式古典风格) |
| 后端 | Python Flask (Vercel Serverless Functions) |
| 数据库 | Supabase (PostgreSQL) |
| 认证 | Supabase Auth |
| AI | DeepSeek API (流式聊天) |
| 3D | @react-three/fiber + @react-three/drei |
| 部署 | Vercel (Monorepo) |

## 项目结构

```
demo5/
├── public/                    # 静态资源
│   ├── images/               # 图片资源
│   ├── videos/               # 视频资源
│   │   └── home-bg.mp4       # 主页背景视频
│   └── models/               # 3D模型 (.glb)
├── frontend/                  # Next.js 前端应用
│   ├── app/                  # App Router 页面
│   ├── components/           # React 组件
│   ├── lib/                  # 工具库
│   ├── styles/               # 全局样式
│   └── package.json
├── api/                       # Flask 后端 (Python Serverless)
│   ├── index.py              # Flask 应用入口
│   ├── auth.py               # 认证路由
│   ├── buildings.py          # 建筑相关 API
│   ├── knowledge.py          # 知识文章 API
│   ├── ai_chat.py            # AI 聊天 API
│   ├── supabase_client.py    # Supabase 后端客户端
│   └── requirements.txt      # Python 依赖
├── .env.example              # 环境变量示例
├── .gitignore
├── vercel.json               # Vercel 部署配置
├── README.md
└── PROJECT_DEVELOPMENT.md     # 本开发日志
```

## 设计风格

### 色彩方案
- 主色调：深棕木质色调 (`#4A3728`, `#6B4423`)
- 强调色：古典金色 (`#D4AF37`, `#FFD700`)
- 背景色：深色典雅 (`#1A1A1A`, `#2D2D2D`)
- 文字色：米白色 (`#F5F5DC`, `#EEE8AA`)

### 设计要点
- 大量使用毛笔字、传统纹样装饰
- 圆角卡片配合微妙阴影
- 过渡动画柔和优雅
- 金色点缀用于按钮、边框高亮

---

## 开发日志

### 步骤 1：项目初始化与文档创建 ✅
**完成日期**: 2026-04-21

**完成内容**:

1. **根目录配置文件**
   - `.gitignore` - 忽略 Node_modules、Python cache、Vercel 构建文件等
   - `.env.example` - 所有环境变量模板
   - `vercel.json` - Vercel 部署配置
   - `README.md` - 项目说明文档

2. **frontend/ Next.js 项目**
   - `package.json` - 依赖配置（Next.js 14、React Three Fiber、Supabase 等）
   - `tsconfig.json` - TypeScript 配置
   - `tailwind.config.ts` - Tailwind 配置（中式古典色彩系统）
   - `postcss.config.js` - PostCSS 配置
   - `next.config.js` - Next.js 配置
   - `styles/globals.css` - 全局样式（自定义组件类）
   - `middleware.ts` - 路由保护中间件
   - `app/layout.tsx` - 根布局
   - `app/page.tsx` - 根首页（登录/注册入口）
   - `lib/supabase.ts` - Supabase 客户端

3. **api/ Flask 后端**
   - `index.py` - Flask 应用入口（WSGI 导出，支持 Vercel）
   - `auth.py` - 认证路由（注册/登录/登出）
   - `buildings.py` - 建筑 API（列表/详情/分类/收藏）
   - `knowledge.py` - 知识文章 API
   - `ai_chat.py` - AI 聊天 API（支持流式响应）
   - `supabase_client.py` - Supabase 后端单例客户端
   - `requirements.txt` - Python 依赖

**vercel.json 完整内容**:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "api/**/*.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "FLASK_ENV": "production"
  }
}
```

**关键设计决策**:

1. **Flask WSGI 导出模式**：Vercel Python Runtime 需要标准的 WSGI 应用，不能使用 `app.run()`
2. **路由分发**：使用 `/(.*)` 通配符让 Next.js 处理所有非 API 请求
3. **Tailwind 色彩系统**：自定义 `wood-*` 和 `gold-*` 色板支持中式古典风格
4. **蓝图模式**：Flask 使用 Blueprint 组织路由，便于维护
5. **Supabase 单例**：后端使用懒加载单例模式管理数据库连接

**注意事项**:

- 所有静态资源放在 `public/` 目录，使用相对路径引用
- Python 环境变量需要正确设置 `SUPABASE_URL` 和 `SUPABASE_KEY`
- Vercel 部署时确保 `.env` 环境变量已配置

---

### 步骤 2：Supabase 配置与数据库表设计 ✅
**完成日期**: 2026-04-21

**完成内容**:

1. **更新 `.env.example`**
   - 添加完整的环境变量说明和分组注释
   - 包括 Supabase、前端/后端、AI 等配置

2. **创建数据库建表脚本** `api/database_schema.sql`
   - 完整的 Supabase SQL Editor 执行脚本

**数据库表设计**:

| 表名 | 说明 |
|------|------|
| `users` | 用户表（扩展 Auth） |
| `categories` | 建筑分类表（宫殿/庙宇/民居等） |
| `buildings` | 建筑表（核心数据，含 3D/AR 字段） |
| `building_attributes` | 建筑属性表 |
| `favorites` | 收藏表 |
| `knowledge_categories` | 知识分类表 |
| `knowledge_articles` | 知识文章表 |
| `chat_history` | AI 对话历史表 |

**关键特性**:

1. **RLS 行级安全策略**：所有表启用 RLS，用户只能操作自己的数据
2. **全文搜索**：buildings 和 knowledge_articles 表配置了中文全文搜索
3. **3D/AR 扩展支持**：
   - `model_url` - .glb 模型 URL
   - `ar_model_url` - AR 模型 URL
   - `ar_marker_image` - AR 标记图片
4. **自动时间戳**：使用触发器自动更新 `updated_at` 字段
5. **视图和存储函数**：预定义搜索和统计视图

**建表 SQL 执行步骤**:

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 进入项目 > SQL Editor
3. 粘贴 `api/database_schema.sql` 内容并执行
4. 在 Settings > Environment Variables 配置环境变量

---

### 步骤 3：认证系统 ✅
**完成日期**: 2026-04-21

**完成内容**:

1. **登录页面** `frontend/app/login/page.tsx`
   - 邮箱密码登录表单
   - 错误提示处理
   - 登录成功后跳转到首页
   - 与 Supabase Auth 集成

2. **注册页面** `frontend/app/register/page.tsx`
   - 用户注册表单（待验证实现）

3. **认证 Provider** `frontend/components/AuthProvider.tsx`
   - 用户状态全局管理
   - 登录状态监听

4. **中间件** `frontend/middleware.ts`
   - 路由保护
   - 未登录用户重定向

---

### 步骤 4：主页 ✅
**完成日期**: 2026-04-21

**完成内容** `frontend/app/home/page.tsx`:

1. **Hero Section**
   - 欢迎语动态显示用户名
   - 背景装饰动画

2. **建筑分类浏览**
   - 6 大建筑类型卡片（宫殿/宗教/园林/民居/长城/桥梁）
   - 点击跳转分类筛选

3. **精选内容展示**
   - 3 个推荐建筑图文卡片
   - 封面图片、分类标签

4. **AI 助手介绍**
   - 功能说明卡片
   - 跳转链接

5. **3D 展示入口**
   - 功能特性列表
   - 3D 展厅跳转

---

### 步骤 5：核心模块开发 ✅
**完成日期**: 2026-04-21

#### 5.1 建筑分类页面 ✅
**路径**: `frontend/app/categories/page.tsx`

- 6 大建筑类型分类卡片
- 点击筛选功能
- 分类文章列表展示
- 加载骨架屏

#### 5.2 建筑知识页面 ✅
**路径**: `frontend/app/knowledge/page.tsx`

- 文章列表与详情左右布局
- 文章创建表单（仅登录用户）
- 文章删除功能（仅作者）
- 封面图片支持

#### 5.3 AI助手页面 ✅
**路径**: `frontend/app/ai/page.tsx`

- 聊天消息界面
- 快捷问题按钮
- 流式模拟响应
- 知识问答（故宫/斗拱/园林/材料）

#### 5.4 3D模型展示页面 ✅
**路径**: `frontend/app/3d/page.tsx`

- 6 个古建筑卡片列表
- 3D 场景模拟展示区
- 加载动画
- 交互提示（旋转/缩放/平移）
- 功能说明

#### 5.5 个人中心页面 ✅
**路径**: `frontend/app/profile/page.tsx`

- 用户信息展示（头像、用户名、邮箱）
- 用户统计数据（文章数、收藏数、评论数）
- 个人资料编辑表单
- 安全设置（修改密码、两步验证）
- 通知设置（邮件、评论回复、收藏更新）
- 退出登录功能

#### 5.6 建筑详情页
**状态**: 待完善（可通过知识文章链接访问）

---

### 步骤 6：后端 API 开发 ✅
**完成日期**: 2026-04-21

**完成内容** `api/` 目录:

1. **Flask 应用入口** `api/index.py`
   - WSGI 应用导出（兼容 Vercel）
   - CORS 中间件配置
   - 蓝图路由注册

2. **认证 API** `api/auth.py`
   - 用户注册、登录、登出
   - 与 Supabase Auth 集成

3. **建筑 API** `api/buildings.py`
   - 建筑列表、详情、分类查询
   - 收藏功能

4. **知识 API** `api/knowledge.py`
   - 文章 CRUD 操作
   - 分类管理

5. **AI 聊天 API** `api/ai_chat.py`
   - DeepSeek API 集成
   - 流式响应支持

6. **数据库客户端** `api/supabase_client.py`
   - Supabase 服务端客户端
   - 管理员权限操作

---

### 步骤 7：部署准备
**状态**: 待完成
- Vercel 部署配置已就绪（vercel.json）
- 环境变量配置
- 生产环境测试
