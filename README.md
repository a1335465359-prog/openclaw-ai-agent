# OpenClaw Multi-Agent Orchestration System

> 🎯 基于 OpenClaw 框架的企业级多 Agent 协作系统 | 电商数据自动化 · 内容创作发布 · 飞书全链路集成

[![OpenClaw](https://img.shields.io/badge/OpenClaw-2026.4.24-blue)](https://docs.openclaw.ai)
[![Node.js](https://img.shields.io/badge/Node.js-v24.14.0-green)](https://nodejs.org)
[![DeepSeek](https://img.shields.io/badge/LLM-DeepSeek%20V4%20Pro%2FFlash-purple)](https://api.deepseek.com)
[![Token](https://img.shields.io/badge/月消耗-2%E4%BA%BF%2B%20Token-orange)]()

---

## 📖 项目概述

基于 **OpenClaw 框架**搭建的企业级多 Agent 协作系统，通过 **OpenCode Go 网关**统一调度多个 AI Agent，实现从电商数据采集、多平台内容发布、飞书企业协作到自动化办公的全链路智能化。

系统 7×24 小时运行于 Windows 10 服务器，以飞书群聊为主要交互入口，Agent 之间通过消息传递实现协同，支持**长链推理**、**多轮对话**、**浏览器自动化**等复杂场景。

---

## 🏗️ 系统架构

```
┌──────────────────────────────────────────────────────┐
│              飞书群聊 (用户交互层)                      │
│       消息收发 · 文档 · 表格 · 审批 · 日历              │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────┐
│             OpenClaw Gateway (调度层)                  │
│           OpenCode Go 统一网关 · 模型路由               │
│       Token 统计 · 任务分发 · 状态管理 · 流式输出       │
└──────┬──────────────┬──────────────┬─────────────────┘
       │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌────▼──────────────┐
│ 数据采集Agent│ │内容创作Agent│ │ 办公协作Agent      │
│ SHEIN电商   │ │小红书/知乎/ │ │ 飞书/CRON/审批    │
│ CDP浏览器   │ │头条/公众号  │ │ 日历/表格/文档     │
└──────┬──────┘ └─────┬──────┘ └────┬──────────────┘
       │              │              │
┌──────▼──────────────▼──────────────▼────────────────┐
│                    LLM 模型池                        │
│ DeepSeek V4 Pro/Flash · GLM-5 · Qwen3.6 Plus        │
│ MiniMax M2.5 · Kimi K2.6 · Doubao-Seed              │
└─────────────────────────────────────────────────────┘
```

---

## 📊 实际消耗数据 (2026年4月)

### 多平台 Token 消耗汇总

| 平台 | 模型 | 4月消耗 |
|------|------|---------|
| 扣子编程 | doubao-seed-2-0-pro | 13.6 万积分 |
| 扣子编程 | doubao-seed-2-0-lite | 7.1 万积分 |
| 扣子编程 | minimax-m2-5 | 4.0 万积分 |
| 扣子编程 | kimi-k2.5 | 2.7 万积分 |
| 扣子编程 | glm-4-7 | 1.0 万积分 |
| 扣子编程 | deepseek-v3-2 | 0.1 万积分 |
| 扣子编程 | doubao-seed-1.8 | 41 积分 |
| 扣子编程 | 编程任务 | 1.3 万积分 |
| 扣子编程 | doubao-seedream-4.5 (生图) | 2,250 积分 |
| **扣子编程合计** | | **2,210 积分/月** |
| **OpenCode Go** | deepseek-v4-pro/flash 等 | **Weekly 33%, Monthly 20%** |
| **ChatGPT Plus** | GPT-4o 等 | **Plus 订阅制** |

> **月均 Token 消耗估算：2 亿+ Token**（含扣子编程、OpenCode Go、DeepSeek API 等）

---

## 🚀 核心功能

### 1. 🛒 SHEIN 电商数据智能采集

**每天自动采集 30-50 款商品，人工需 30 分钟 → AI 3 分钟**

- 通过 CDP 连接 Edge 浏览器，导航至 SHEIN 品类页
- 解析 `gbRawData.results.bffProductsInfo.products[]` 提取商品信息
- 自动翻页采集，导出 Excel（序号、BS排名、类型、商品图、价格、销量、上新时间）
- 防重复机制：`collected_products.json` 商品库过滤
- 商品链接自动拼接（`name-p-ID.html`），图片 URL 路径解析上新时间

### 2. 📝 多平台内容自动发布

**日均发布 2-3 篇，覆盖小红书、知乎、头条**

| 平台 | 内容类型 | 发布方式 |
|------|----------|----------|
| 小红书 | 图文笔记 | CDP 浏览器自动化 |
| 知乎 | 长文 | 导入文档 + 自动填写 |
| 头条 | 文章 | CDP 浏览器自动化 |
| 微信公众号 | 图文 | 官方 API |

### 3. 🤖 飞书群聊 AI 助手

**日均处理 100+ 条消息**，覆盖消息收发、文档读写、表格操作、审批流程、日历管理、图片上传等全套飞书 API。

### 4. ⚙️ 自动化办公流程

通过 Windows Task Scheduler + cron 定时任务自动执行数据同步、记忆蒸馏等后台任务。

---

## 🧠 使用的模型与平台

### 文本模型
| 模型 | 平台 | 用途 |
|------|------|------|
| DeepSeek V4 Pro | DeepSeek API / OpenCode Go | 复杂推理、长链任务 |
| DeepSeek V4 Flash | DeepSeek API / OpenCode Go | 快速响应 |
| Doubao-Seed-2.0-Pro | 扣子编程 | 高强度推理 |
| Doubao-Seed-2.0-Lite | 扣子编程 | 常规任务 |
| MiniMax M2.5 | 扣子编程 / OpenCode Go | 内容创作 |
| Kimi K2.5/K2.6 | 扣子编程 / OpenCode Go | 长文本处理 |
| GLM-5/GLM-4-7 | 扣子编程 / OpenCode Go | 结构化提取 |
| Qwen3.6 Plus | OpenCode Go | 多模态识别 |

### 订阅服务
| 服务 | 套餐 | 用途 |
|------|------|------|
| ChatGPT | Plus | 内容生成、图片创作 |
| OpenCode Go | 订阅制 | 低成本编码模型调度 |
| 扣子编程 | 个人免费版 (1,500积分) | AI 编程、模型调用 |

---

## 📈 运行数据

| 指标 | 数值 |
|------|------|
| 运行时长 | 3+ 个月 |
| 月均 Token 消耗 | 2亿+ |
| 日均处理消息 | 100+ 条 |
| 日均发布内容 | 2-3 篇 |
| 累计采集商品 | 1000+ 款 |
| Agent 数量 | 3 个主 Agent + 多个子 Agent |
| 接入模型数 | 10+ |
| 接入平台数 | 5 个（扣子编程/OpenCode Go/DeepSeek API/ChatGPT/本地Ollama） |

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| OpenClaw 2026.4.24 | Agent 框架 |
| OpenCode Go | 统一网关调度 |
| Node.js v24.14.0 | 运行环境 |
| Edge Browser CDP | 浏览器自动化 |
| 飞书 OpenAPI | 企业协作集成 |
| Windows Task Scheduler | 定时任务 |
| NVIDIA RTX 3060 6GB | 本地推理 (Ollama qwen3:0.6b) |

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
│   ├── feishu-image-send.md     # 飞书发图 SOP
│   └── browser-automation.md    # 浏览器自动化 SOP
├── config/
│   └── openclaw.json            # OpenClaw 配置
└── README.md
```

---

## 📄 License

MIT © 2026 OpenClaw AI Agent
