# 古建筑 - 中国传统建筑艺术展示平台

> 为中国计算机设计大赛打造的现代 Web 应用，展示中国传统建筑艺术的魅力

## 项目简介

本项目是一个融合传统美学与现代技术的 Web 平台，通过 3D 模型、AI 助手和丰富的交互功能，让用户沉浸式体验中国古建筑的之美。

## 功能特点

- **建筑分类浏览**: 按朝代、类型、地区浏览传统建筑
- **3D 模型展示**: 使用 Three.js 加载 .glb 模型，360° 观赏建筑细节
- **AI 建筑助手**: 基于 DeepSeek 的智能问答，了解建筑历史与文化
- **建筑知识库**: 系统性介绍各类建筑的构造特点与文化内涵
- **用户系统**: 支持邮箱注册登录，收藏喜爱的建筑

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 14+ (App Router) |
| 编程语言 | TypeScript |
| 样式方案 | Tailwind CSS |
| 后端框架 | Python Flask (Serverless) |
| 数据库 | Supabase PostgreSQL |
| 认证服务 | Supabase Auth |
| AI 服务 | DeepSeek API |
| 3D 渲染 | React Three Fiber |
| 部署平台 | Vercel |

## 开始使用

### 环境要求

- Node.js 18+
- Python 3.9+
- npm / yarn / pnpm

### 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 返回根目录
cd ..
```

### 配置环境变量

复制 `.env.example` 为 `.env.local`，并填写必要配置：

```bash
cp .env.example .env.local
```

### 启动开发服务器

```bash
# 启动前端 (在 frontend 目录)
cd frontend
npm run dev

# 或使用 Vercel CLI
vercel dev
```

### 构建部署

```bash
vercel deploy
```

## 项目结构

```
├── public/           # 静态资源
│   ├── images/       # 图片资源
│   ├── videos/       # 视频资源
│   └── models/       # 3D 模型
├── frontend/         # Next.js 前端
├── api/              # Flask 后端 API
└── vercel.json       # Vercel 配置
```

## 静态资源说明

| 路径 | 用途 |
|------|------|
| `/images/` | 建筑图片、UI 图片、背景图 |
| `/videos/home-bg.mp4` | 主页循环视频背景 |
| `/models/` | 3D .glb 模型文件 |

## License

MIT License
