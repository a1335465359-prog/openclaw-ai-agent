# OpenClaw Multi-Agent Orchestration System

> 🎯 基于 OpenClaw 框架的多 Agent 协作系统 | 电商数据自动化 · 内容创作发布 · 企业级飞书集成

[![OpenClaw](https://img.shields.io/badge/OpenClaw-2026.4.24-blue)](https://docs.openclaw.ai)
[![Node.js](https://img.shields.io/badge/Node.js-v24.14.0-green)](https://nodejs.org)
[![DeepSeek](https://img.shields.io/badge/LLM-DeepSeek%20V4%20Pro%2FFlash-purple)](https://api.deepseek.com)
[![Token](https://img.shields.io/badge/Token-1100%E4%B8%87%2F%E5%A4%A9-orange)]()

---

## 📖 项目概述

基于 **OpenClaw 框架** 搭建的企业级多 Agent 协作系统，通过 **OpenCode Go 网关** 统一调度多个 AI Agent，实现从数据采集、内容创作、企业协作到自动化办公的全链路智能化。

系统运行于 Windows 10 服务器，通过 **飞书群聊**作为主要交互入口，Agent 之间通过消息传递实现协同，支持**长链推理任务**、**多轮对话**、**浏览器自动化**等复杂场景。

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    飞书群聊 (用户入口)                         │
│              消息收发 · 文档 · 表格 · 审批                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  OpenClaw Gateway (调度层)                    │
│                OpenCode Go 统一调度网关                        │
│        模型路由 · Token 统计 · 任务分发 · 状态管理              │
└──────┬──────────────┬──────────────┬────────────────────────┘
       │              │              │
┌──────▼──────┐┌──────▼──────┐┌──────▼──────┐
│ 数据采集Agent││ 内容创作Agent││ 办公协作Agent│
│  SHEIN/电商  ││ 小红书/知乎/ ││ 飞书/CRON   │
│  浏览器自动化││  头条发布    ││  自动化任务  │
└──────┬──────┘└──────┬──────┘└──────┬──────┘
       │              │              │
┌──────▼──────────────▼──────────────▼────────────────────────┐
│                      LLM 模型池                               │
│  DeepSeek V4 Pro · DeepSeek V4 Flash · GLM-5 · Qwen3.6 Plus │
│                    MiniMax M2.5 · Kimi K2.6                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 核心功能

### 1. 🛒 SHEIN 电商数据智能采集

**解决的问题**：传统电商选品需要人工逐页浏览商品，效率极低。SHEIN 前端数据通过 `gbRawData` JavaScript 变量加载，搜索引擎无法抓取。

**实现方案**：
- 通过 **CDP (Chrome DevTools Protocol)** 连接 Edge 浏览器，导航至 SHEIN 目标品类页
- 自动滚动加载商品列表，解析 `gbRawData.results.bffProductsInfo.products[]`
- 提取完整商品信息：名称、价格、销量、上新时间、图片、商品链接
- 按 `sort=7`（Most Popular）排序，自动翻页采集 30-50 款商品
- 防重复机制：维护 `collected_products.json` 商品库，每次搜索前过滤已收集 ID
- 导出结构化 Excel 表格：序号、BS排名、类型、商品图、链接、价格、销量、上新时间

**技术亮点**：
- 商品链接自动拼接（`name-p-ID.html` 格式，避免跳转首页）
- 图片 URL 中 `/YYYY/MM/DD/` 路径解析上新时间
- 评论数 (`comment_num`) 近似销量排名

**每日消耗**：~500 万 Token

---

### 2. 📝 多平台内容自动发布

**解决的问题**：手动在多平台（小红书、知乎、头条）发布内容，重复操作耗时且容易出错。

**实现方案**：
- 通过 CDP 浏览器自动化连接 Edge 浏览器
- 自动导航至各平台创作者后台
- 自动填写标题、正文、上传图片
- 支持图文模式、长文模式等多种内容格式

**支持平台**：
| 平台 | 内容类型 | 发布方式 |
|------|----------|----------|
| 小红书 | 图文笔记 | CDP 浏览器自动化 |
| 知乎 | 长文 | 导入文档 + 自动填写 |
| 头条 | 文章 | CDP 浏览器自动化 |
| 微信公众号 | 图文 | 官方 API |

**技术亮点**：
- 小红书发布特殊处理：先点击"上传图片"按钮 → file upload 传图 → 填写标题正文 → 提交
- 图片预处理（压缩、加水印）后上传
- 记录发布历史，避免重复发布

**每日消耗**：~200 万 Token（每天发布 2-3 篇内容）

---

### 3. 🤖 飞书群聊 AI 助手

**解决的问题**：企业协作中信息分散、重复劳动多，需要 AI 助手统一处理消息、文档、表格等。

**实现方案**：
- 飞书群聊作为主交互入口，通过 WebSocket 实时接收消息
- 支持自然语言指令，Agent 自动识别意图并执行
- 集成飞书全套 API：消息收发、文档读写、表格操作、审批流程、日历管理、图片上传
- 支持卡片交互（按钮、表单、下拉选择）

**功能清单**：
- 📨 **消息处理**：群聊消息自动回复、私聊交互
- 📄 **文档操作**：创建/编辑飞书文档，Markdown 自动渲染
- 📊 **表格管理**：读取/写入飞书电子表格，数据统计
- ✅ **审批流程**：飞书审批实例管理
- 📅 **日历管理**：日程创建、查询、参会人管理
- 🖼️ **图片处理**：自动上传图片到飞书并发送

**每日消耗**：~300 万 Token（每日处理 100+ 条消息）

---

### 4. ⚙️ 自动化办公流程

**解决的问题**：日常运维、数据同步等重复性工作占用大量时间。

**实现方案**：
- 通过 Windows Task Scheduler + cron 定时任务自动执行
- 支持记忆蒸馏、数据同步、定期报告等后台任务
- 任务执行结果自动推送到飞书群聊

**每日消耗**：~100 万 Token

---

## 🧠 底层模型

| 模型 | 用途 | 每日消耗 |
|------|------|----------|
| DeepSeek V4 Pro | 复杂推理、长链任务、代码生成 | ~500 万 |
| DeepSeek V4 Flash | 快速响应、简单对话 | ~300 万 |
| GLM-5 | 结构化数据提取 | ~100 万 |
| Qwen3.6 Plus | 多模态、图片识别 | ~100 万 |
| MiniMax M2.5 | 内容创作 | ~50 万 |
| Kimi K2.6 | 备用推理 | ~50 万 |

---

## 📊 数据统计

| 指标 | 数值 |
|------|------|
| 运行时长 | 3+ 个月 |
| 每日 Token 消耗 | ~1100 万 |
| 每日处理消息 | 100+ 条 |
| 每日发布内容 | 2-3 篇 |
| 累计采集商品 | 1000+ 款 |
| Agent 数量 | 3 个主 Agent + 多个子 Agent |

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| OpenClaw 2026.4.24 | Agent 框架 |
| OpenCode Go | 统一网关调度 |
| Node.js v24.14.0 | 运行环境 |
| Edge Browser CDP | 浏览器自动化 |
| 飞书 OpenAPI | 企业协作集成 |
| Windows Task Scheduler | 定时任务调度 |
| NVIDIA RTX 3060 6GB | 本地推理 (Ollama) |

---

## 📁 项目结构

```
openclaw-ai-agent/
├── scripts/
│   ├── shein_scraper.js         # SHEIN 电商数据采集
│   ├── xiaohongshu_post.js      # 小红书内容发布
│   ├── feishu_bot.js            # 飞书机器人核心
│   ├── cdp_browser.js           # CDP 浏览器自动化工具
│   └── heartbeat_reminder.js    # 自动化办公任务
├── skills/
│   ├── shein-product-scraper.md # SHEIN 采集 SOP
│   ├── xiaohongshu-publish.md   # 小红书发布 SOP
│   ├── feishu-messaging.md      # 飞书消息 SOP
│   └── browser-automation.md    # 浏览器自动化 SOP
├── config/
│   └── openclaw.json            # OpenClaw 配置
└── README.md
```

---

## 🔧 快速开始

### 环境要求

- Windows 10+
- Node.js v24+
- Edge 浏览器
- OpenClaw CLI

### 安装

```bash
# 安装 OpenClaw
npm install -g openclaw

# 配置飞书应用
openclaw config init

# 启动浏览器
openclaw browser start --profile openclaw
```

### 飞书集成

1. 前往飞书开放平台创建应用
2. 获取 App ID 和 App Secret
3. 配置到 `openclaw.json`

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "your-app-id",
      "appSecret": "your-app-secret"
    }
  }
}
```

---

## 📈 实际案例

### 案例 1：SHEIN 中东刺绣服装选品

Agent 自动采集 SHEIN 中东市场 30 款刺绣服装：
- 自动导航到 https://us.shein.com/Embroidery-c-123.html
- 滚动 5 页采集商品数据
- 导出 Excel 表格用于选品分析
- 总耗时 3 分钟，人工需 30 分钟

### 案例 2：小红书每日内容发布

Agent 自动完成小红书内容发布全流程：
- 读取本地 Markdown 内容文件
- 打开小红书创作者平台
- 上传图片、填写标题和正文
- 自动发布并记录链接
- 总耗时 2 分钟，人工需 10 分钟

---

## 🔒 安全

- 所有 API Key 和 Token 本地存储，不上传到云端
- 飞书消息仅在授权群聊中处理
- 支持 allowlist 白名单管理
- 管理员身份验证，避免未授权操作

---

## 📄 License

MIT © 2026 OpenClaw AI Agent
