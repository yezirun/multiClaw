<div align="center">

# MultiClaw

**多代理协作 · 可见讨论 · 一键部署**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-orange.svg)](https://openclaw.ai)

**[中文文档](#中文文档) | [English Docs](#english-docs)**

</div>

---

<!--
  LANGUAGE SWITCH NOTE:
  本 README 包含中文版和英文版，内容完全一致。
  This README contains both Chinese and English versions with identical content.
  点击上方链接快速跳转 / Click the links above to navigate.
-->

<a name="中文文档"></a>

# 🇨🇳 中文文档

---

## ⚡ OpenClaw 一键安装

> **最快上手方式：将以下提示词发送给 OpenClaw，即可自动完成项目安装与配置！**

```
请帮我安装 MultiClaw 项目：

项目地址：https://github.com/yezirun/multiClaw.git

我已准备好的信息：
1. 飞书机器人名称：【填写你想给机器人取的名字，如"DevTeam助手"】
2. 目标飞书群：【填写群名称或群ID】
3. 我已有飞书开放平台账号：【是/否】

请帮我：
1. 克隆项目到本地
2. 安装依赖（pnpm install）
3. 检查并提示我完成飞书机器人创建（如果还没创建）
4. 配置 .env 文件
5. 构建并启动服务
6. 发送一条测试消息到飞书群验证配置成功
```

### 📋 一键安装前需要准备

| 准备项 | 说明 | 如何获取 |
|--------|------|----------|
| **飞书开放平台账号** | 用于创建机器人应用 | 访问 [open.feishu.cn](https://open.feishu.cn) 注册 |
| **飞书机器人名称** | 建议命名如 `DevTeam助手`、`MultiClawBot` | 自定义，建议体现团队用途 |
| **目标飞书群** | 接收协作消息的群聊 | 可用已有群或新建群，需要获取群ID |
| **Coding Plan 订阅** | 推荐！节省 token 成本 | 见下方「省钱推荐」 |

<details>
<summary>🔧 飞书机器人创建步骤（首次使用必看）</summary>

1. **登录飞书开放平台** → [open.feishu.cn](https://open.feishu.cn)
2. **创建企业自建应用**
   - 应用名称：填写你准备的机器人名称（如 `DevTeam助手`）
   - 应用描述：`MultiClaw 多代理协作消息推送机器人`
3. **配置权限**（权限管理 → 申请权限）
   - ✅ `im:message` - 获取与发送消息
   - ✅ `im:message:send_as_bot` - 以应用身份发消息
4. **发布应用** → 提交审核 → 等待通过
5. **获取凭证**（应用基本信息页）
   - 复制 `App ID` 和 `App Secret`
6. **获取群聊 ID**
   - 打开目标飞书群 → 设置 → 群二维码 → URL 中的 `chat_id` 参数

</details>

---

## 💰 省钱推荐：订阅 Coding Plan

> **强烈建议：在使用本项目前，先订阅包月 Coding Plan，可大幅降低 token 成本并发挥各模型优势！**

| 平台 | Coding Plan | 推荐理由 | 价格参考 |
|------|-------------|----------|----------|
| **百炼** | Coding Plan | 国内首选，支持多模型切换，适合后端/架构代理 | ¥99/月起 |
| **Kimi** | Kimi Pro | 长文本能力强，适合 PO/需求分析代理 | ¥19/月起 |
| **DeepSeek** | DeepSeek Pro | 性价比高，适合通用代理任务 | ¥10/月起 |
| **Claude** | Claude Pro | 代码能力强，适合 Backend/Frontend 代理 | $20/月 |

### 🎯 为什么推荐订阅？

1. **节省 Token 成本** - 包月套餐比按量付费便宜 5-10 倍
2. **各司所长** - 不同模型适合不同代理角色：
   - **架构设计** → 用 DeepSeek/百炼（推理能力强）
   - **需求分析** → 用 Kimi（长文档处理）
   - **代码实现** → 用 Claude（代码质量高）
3. **稳定可用** - 包月用户优先响应，高峰期不排队
4. **无限制使用** - 多代理协作消耗大量 token，包月更安心

---

## 🎯 MultiClaw 解决了什么痛点？

### 你是否遇到过这些问题？

| 痛点 | 现状 | MultiClaw 解决方案 |
|------|------|-------------------|
| 🔴 **AI 单打独斗** | 单个 AI 需同时扮演产品、开发、测试等多个角色，容易角色混乱 | ✅ **多代理分工** - 每个角色专注本职，专业人做专业事 |
| 🔴 **讨论过程不可见** | AI 协作过程是黑盒，出了问题不知道哪个环节出错 | ✅ **可见讨论追踪** - 完整记录每个代理的输入输出，过程透明可追溯 |
| 🔴 **任务分配靠人工** | 需手动判断"这个需求该找谁"，效率低且容易出错 | ✅ **智能任务路由** - 自动识别任务类型，分派给最合适的代理 |
| 🔴 **团队沟通断层** | AI 输出的结果难以同步给真实团队成员 | ✅ **飞书实时推送** - 协作进展自动推送到飞书群，团队即时可见 |
| 🔴 **工作流混乱** | 缺乏标准流程，开发任务东一榔头西一棒槌 | ✅ **工作流引擎** - 按标准流程执行：需求→架构→开发→测试→部署 |
| 🔴 **Token 成本高** | 多轮对话消耗大量 token，按量付费成本不可控 | ✅ **支持 Coding Plan** - 推荐包月订阅，成本可控 |

### 一句话总结

> **MultiClaw = 多代理分工协作 + 可见讨论追踪 + 飞书团队同步 + 一键部署**

---

## 📸 效果预览

```text
┌─────────────────────────────────────────────────────────┐
│  📋 任务: 设计用户认证系统                               │
├─────────────────────────────────────────────────────────┤
│  [PO] 分析需求... → 输出: 用户故事 + 验收标准            │
│  [Architect] 设计架构... → 输出: 系统架构图              │
│  [Backend] 实现API... → 输出: 认证API代码                │
│  [Frontend] 实现界面... → 输出: 登录页面代码             │
│  [QA] 编写测试... → 输出: 单元测试 + E2E测试             │
│  [DevOps] 配置部署... → 输出: CI/CD配置                  │
├─────────────────────────────────────────────────────────┤
│  📤 已推送至飞书群「DevTeam」                             │
│  📊 工作摘要: 6个代理参与，共12条讨论                     │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ 核心特性

| 特性 | 说明 |
|------|------|
| 🤖 **7 种内置角色** | CTO、PO、Architect、Backend、Frontend、QA、DevOps |
| 👁️ **可见讨论追踪** | 完整记录协作过程，自动生成工作摘要 |
| 🧭 **智能任务路由** | 根据任务关键词自动分配给最合适的代理 |
| 📱 **飞书/Lark 集成** | 讨论进展实时推送至飞书群聊 |
| 🔀 **工作流引擎** | 支持线性流程编排，步骤依赖管理 |
| 🚀 **一键部署** | OpenClaw 一键安装、systemd、Docker 多种部署方式 |

---

## 🏗️ 架构概览

```text
                    ┌─────────────┐
                    │  用户任务   │
                    └─────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  OpenClaw 网关  │
                 │  (智能路由)     │
                 └─────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │   CTO    │   │    PO    │   │ Architect│
    │  决策者  │   │ 产品经理 │   │  架构师  │
    └──────────┘   └──────────┘   └──────────┘
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                 ┌─────────────────┐
                 │  可见讨论运行时  │
                 │  (过程追踪)     │
                 └─────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  飞书/Lark 推送  │
                 │  (团队同步)     │
                 └─────────────────┘
```

---

## 📦 目录结构

```
multiClaw/
├── src/
│   ├── agents/          # 🤖 角色代理 (CTO/PO/Architect/...)
│   ├── bridge/          # 📱 外部集成 (飞书/Lark)
│   ├── gateway/         # 🧭 网关与路由 (OpenClaw)
│   ├── runtime/         # ⚙️ 运行时 (会话/工作流/讨论追踪)
│   └── utils/           # 🔧 工具 (日志/验证)
├── scripts/
│   ├── setup/           # 📥 安装脚本
│   └── verify/          # ✅ 健康检查
├── deploy/
│   ├── systemd/         # 🖥️ systemd 服务
│   └── docker/          # 🐳 Docker 部署
├── docs/                # 📚 文档
├── examples/            # 📝 示例工作流
└── .github/             # 🐙 GitHub 模板
```

---

## 🚀 快速开始

### 方式一：OpenClaw 一键安装（推荐）

> 将本页顶部的「OpenClaw 一键安装」提示词发送给 OpenClaw 即可！

### 方式二：手动安装

```bash
# 1. 克隆项目
git clone https://github.com/yezirun/multiClaw.git
cd multiClaw

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，填入飞书凭证

# 4. 构建并启动
pnpm build
pnpm start

# 5. 健康检查
pnpm verify
```

---

## ⚙️ 环境变量配置

| 变量 | 说明 | 必填 | 示例 |
|------|------|:----:|------|
| `OPENCLAW_API_KEY` | OpenClaw API 密钥 | ✅ | `<YOUR_API_KEY>` |
| `FEISHU_APP_ID` | 飞书应用 ID | ✅ | `cli_xxxxxxxxxx` |
| `FEISHU_APP_SECRET` | 飞书应用密钥 | ✅ | `<YOUR_SECRET>` |
| `FEISHU_CHAT_ID` | 目标飞书群 ID | ✅ | `oc_xxxxxxxxxx` |
| `LOG_LEVEL` | 日志级别 | ❌ | `info` |

---

## 🖥️ 部署方式

### systemd 服务部署

```bash
sudo cp deploy/systemd/multiclaw.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now multiclaw
```

### Docker 部署

```bash
docker build -t multiclaw:latest .
docker run -d --env-file .env multiclaw:latest
```

---

## 🐛 常见问题

<details>
<summary><b>启动报错：OPENCLAW_API_KEY is required</b></summary>

检查 `.env` 文件：
1. 文件是否存在于项目根目录
2. `OPENCLAW_API_KEY` 是否已设置
3. 值是否为空或仍为占位符

</details>

<details>
<summary><b>飞书消息发送失败</b></summary>

排查步骤：
1. 检查 APP_ID 和 APP_SECRET 是否正确
2. 认飞书应用已通过审核并发布
3. 验证应用权限包含 `im:message` 和 `im:message:send_as_bot`
4. 确认 CHAT_ID 是群聊 ID（不是用户 ID）

</details>

<details>
<summary><b>如何自定义代理角色？</b></summary>

编辑 `src/agents/roles.ts`，添加新角色：

```typescript
export const ROLE_DEFINITIONS = {
  // ...现有角色
  security: {
    role: 'security',
    name: 'Security Agent',
    description: '安全审计与漏洞检测',
    capabilities: ['security-review', 'vulnerability-scan'],
    promptTemplate: `你是安全代理，负责代码安全审计...`
  }
};
```

</details>

---

## 🛡️ 安全须知

- ❌ **不要提交 `.env` 文件**
- ❌ **不要提交日志和运行态文件**
- ✅ **发布前清洗 git 历史**（如有敏感信息）
- ✅ **轮换所有曾使用的密钥和凭证**

详见 [SECURITY.md](./SECURITY.md)

---

## 🗺️ Roadmap

| 版本 | 计划功能 | 状态 |
|------|----------|:----:|
| v1.0 | 核心多代理协作 | ✅ |
| v1.1 | REST API 接口 | 🔄 |
| v1.2 | Web Dashboard | 📋 |
| v1.3 | 多模型提供商支持 | 📋 |
| v1.4 | Docker Compose 方案 | 📋 |
| v2.0 | 插件系统 + 自定义角色模板 | 📋 |

---

## 🤝 Contributing

欢迎提交 Issue 和 Pull Request！

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 License

[MIT License](./LICENSE) © 2026 MultiClaw Contributors

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

[![Star History Chart](https://api.star-history.com/svg?repos=yezirun/multiClaw&type=Date)](https://star-history.com/#yezirun/multiClaw)

</div>

---

<a name="english-docs"></a>

# 🇺🇸 English Docs

---

## ⚡ One-Click Install with OpenClaw

> **Fastest way to get started: Send the prompt below to OpenClaw for automatic installation!**

```
Please help me install the MultiClaw project:

Project URL: https://github.com/yezirun/multiClaw.git

Information I have prepared:
1. Feishu bot name: 【Enter your bot name, e.g. "DevTeam Assistant"】
2. Target Feishu group: 【Enter group name or group ID】
3. I already have a Feishu Open Platform account: 【Yes/No】

Please help me:
1. Clone the project locally
2. Install dependencies (pnpm install)
3. Check and guide me through Feishu bot creation (if not created yet)
4. Configure the .env file
5. Build and start the service
6. Send a test message to the Feishu group to verify configuration
```

### 📋 Prerequisites for One-Click Install

| Requirement | Description | How to Obtain |
|-------------|-------------|---------------|
| **Feishu Open Platform Account** | Used to create bot application | Register at [open.feishu.cn](https://open.feishu.cn) |
| **Feishu Bot Name** | Recommended names like `DevTeam Assistant`, `MultiClawBot` | Customize, suggest reflecting team purpose |
| **Target Feishu Group** | Group chat to receive collaboration messages | Use existing group or create new, need Group ID |
| **Coding Plan Subscription** | Recommended! Save token costs | See "Cost-Saving Recommendation" below |

<details>
<summary>🔧 Feishu Bot Creation Steps (First-Time Users Must Read)</summary>

1. **Login to Feishu Open Platform** → [open.feishu.cn](https://open.feishu.cn)
2. **Create Enterprise Self-Built App**
   - App Name: Enter your prepared bot name (e.g. `DevTeam Assistant`)
   - App Description: `MultiClaw multi-agent collaboration message push bot`
3. **Configure Permissions** (Permission Management → Apply for Permission)
   - ✅ `im:message` - Get and send messages
   - ✅ `im:message:send_as_bot` - Send messages as bot
4. **Publish App** → Submit for review → Wait for approval
5. **Get Credentials** (App Basic Information page)
   - Copy `App ID` and `App Secret`
6. **Get Group Chat ID**
   - Open target Feishu group → Settings → Group QR Code → `chat_id` parameter in URL

</details>

---

## 💰 Cost-Saving Recommendation: Subscribe to Coding Plan

> **Strongly Recommended: Before using this project, subscribe to a monthly Coding Plan to significantly reduce token costs and leverage each model's strengths!**

| Platform | Coding Plan | Recommendation | Price Reference |
|----------|-------------|----------------|-----------------|
| **Bailian** | Coding Plan | Top choice in China, supports multi-model switching, ideal for backend/architect agents | ¥99/month+ |
| **Kimi** | Kimi Pro | Strong long-text capability, ideal for PO/requirements analysis agents | ¥19/month+ |
| **DeepSeek** | DeepSeek Pro | High cost-effectiveness, ideal for general agent tasks | ¥10/month+ |
| **Claude** | Claude Pro | Strong coding ability, ideal for Backend/Frontend agents | $20/month |

### 🎯 Why Subscribe?

1. **Save Token Costs** - Monthly plans are 5-10x cheaper than pay-per-use
2. **Leverage Each Model's Strength** - Different models suit different agent roles:
   - **Architecture Design** → DeepSeek/Bailian (strong reasoning)
   - **Requirements Analysis** → Kimi (long document processing)
   - **Code Implementation** → Claude (high code quality)
3. **Stable Availability** - Monthly subscribers get priority response, no queuing during peak times
4. **Unlimited Usage** - Multi-agent collaboration consumes lots of tokens, monthly plans are worry-free

---

## 🎯 What Pain Points Does MultiClaw Solve?

### Have You Encountered These Problems?

| Pain Point | Current Situation | MultiClaw Solution |
|------------|-------------------|-------------------|
| 🔴 **AI Working Alone** | Single AI needs to play multiple roles (product, dev, test), causing role confusion | ✅ **Multi-Agent Division** - Each role focuses on their specialty, professionals do professional work |
| 🔴 **Invisible Discussion Process** | AI collaboration is a black box, hard to know which step failed | ✅ **Visible Discussion Tracking** - Complete record of each agent's input/output, transparent and traceable |
| 🔴 **Manual Task Assignment** | Need to manually decide "who should handle this request", inefficient and error-prone | ✅ **Smart Task Routing** - Auto-identify task type and assign to most suitable agent |
| 🔴 **Team Communication Gap** | AI output hard to sync with real team members | ✅ **Feishu Real-Time Push** - Collaboration progress auto-pushed to Feishu group, team sees instantly |
| 🔴 **Chaotic Workflow** | No standard process, development tasks scattered | ✅ **Workflow Engine** - Execute by standard process: Requirements→Architecture→Dev→Test→Deploy |
| 🔴 **High Token Costs** | Multi-turn dialogue consumes many tokens, pay-per-use costs uncontrollable | ✅ **Support Coding Plan** - Recommend monthly subscription, controllable costs |

### One Sentence Summary

> **MultiClaw = Multi-Agent Division + Visible Discussion Tracking + Feishu Team Sync + One-Click Deployment**

---

## 📸 Preview

```text
┌─────────────────────────────────────────────────────────┐
│  📋 Task: Design User Authentication System             │
├─────────────────────────────────────────────────────────┤
│  [PO] Analyzing requirements... → Output: User stories  │
│  [Architect] Designing architecture... → Output: Arch   │
│  [Backend] Implementing API... → Output: Auth API code  │
│  [Frontend] Building UI... → Output: Login page code    │
│  [QA] Writing tests... → Output: Unit + E2E tests       │
│  [DevOps] Configuring deployment... → Output: CI/CD     │
├─────────────────────────────────────────────────────────┤
│  📤 Pushed to Feishu group "DevTeam"                    │
│  📊 Summary: 6 agents participated, 12 discussions      │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🤖 **7 Built-in Roles** | CTO, PO, Architect, Backend, Frontend, QA, DevOps |
| 👁️ **Visible Discussion Tracking** | Complete collaboration record, auto-generated work summary |
| 🧭 **Smart Task Routing** | Auto-assign to most suitable agent based on task keywords |
| 📱 **Feishu/Lark Integration** | Real-time push of discussion progress to Feishu group |
| 🔀 **Workflow Engine** | Linear process orchestration, step dependency management |
| 🚀 **One-Click Deployment** | OpenClaw one-click install, systemd, Docker options |

---

## 🏗️ Architecture Overview

```text
                    ┌─────────────┐
                    │  User Task  │
                    └─────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  OpenClaw Gateway │
                 │  (Smart Routing) │
                 └─────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │   CTO    │   │    PO    │   │ Architect│
    │ Decision │   │ Product  │   │  Design  │
    └──────────┘   └──────────┘   └──────────┘
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                 ┌─────────────────┐
                 │ Visible Discussion │
                 │    Runtime       │
                 └─────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Feishu/Lark Push │
                 │  (Team Sync)    │
                 └─────────────────┘
```

---

## 📦 Directory Structure

```
multiClaw/
├── src/
│   ├── agents/          # 🤖 Role Agents (CTO/PO/Architect/...)
│   ├── bridge/          # 📱 External Integration (Feishu/Lark)
│   ├── gateway/         # 🧭 Gateway & Routing (OpenClaw)
│   ├── runtime/         # ⚙️ Runtime (Session/Workflow/Tracking)
│   └── utils/           # 🔧 Utils (Logger/Validation)
├── scripts/
│   ├── setup/           # 📥 Install Scripts
│   └── verify/          # ✅ Health Check
├── deploy/
│   ├── systemd/         # 🖥️ systemd Service
│   └── docker/          # 🐳 Docker Deployment
├── docs/                # 📚 Documentation
├── examples/            # 📝 Example Workflows
└── .github/             # 🐙 GitHub Templates
```

---

## 🚀 Quick Start

### Method 1: OpenClaw One-Click Install (Recommended)

> Send the "One-Click Install" prompt at the top of this page to OpenClaw!

### Method 2: Manual Install

```bash
# 1. Clone project
git clone https://github.com/yezirun/multiClaw.git
cd multiClaw

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your Feishu credentials

# 4. Build and start
pnpm build
pnpm start

# 5. Health check
pnpm verify
```

---

## ⚙️ Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|:--------:|---------|
| `OPENCLAW_API_KEY` | OpenClaw API Key | ✅ | `<YOUR_API_KEY>` |
| `FEISHU_APP_ID` | Feishu App ID | ✅ | `cli_xxxxxxxxxx` |
| `FEISHU_APP_SECRET` | Feishu App Secret | ✅ | `<YOUR_SECRET>` |
| `FEISHU_CHAT_ID` | Target Feishu Group ID | ✅ | `oc_xxxxxxxxxx` |
| `LOG_LEVEL` | Log Level | ❌ | `info` |

---

## 🖥️ Deployment Methods

### systemd Service

```bash
sudo cp deploy/systemd/multiclaw.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now multiclaw
```

### Docker

```bash
docker build -t multiclaw:latest .
docker run -d --env-file .env multiclaw:latest
```

---

## 🐛 Common Issues

<details>
<summary><b>Error: OPENCLAW_API_KEY is required</b></summary>

Check `.env` file:
1. Does the file exist in project root
2. Is `OPENCLAW_API_KEY` set
3. Is the value empty or still a placeholder

</details>

<details>
<summary><b>Feishu message send failed</b></summary>

Troubleshooting steps:
1. Check APP_ID and APP_SECRET are correct
2. Confirm Feishu app is approved and published
3. Verify app permissions include `im:message` and `im:message:send_as_bot`
4. Confirm CHAT_ID is a group chat ID (not user ID)

</details>

<details>
<summary><b>How to customize agent roles?</b></summary>

Edit `src/agents/roles.ts`, add new role:

```typescript
export const ROLE_DEFINITIONS = {
  // ...existing roles
  security: {
    role: 'security',
    name: 'Security Agent',
    description: 'Security audit and vulnerability detection',
    capabilities: ['security-review', 'vulnerability-scan'],
    promptTemplate: `You are a security agent, responsible for code security audit...`
  }
};
```

</details>

---

## 🛡️ Security Notes

- ❌ **Do NOT commit `.env` file**
- ❌ **Do NOT commit logs and runtime files**
- ✅ **Clean git history before publishing** (if sensitive info exists)
- ✅ **Rotate all previously used keys and credentials**

See [SECURITY.md](./SECURITY.md)

---

## 🗺️ Roadmap

| Version | Planned Features | Status |
|---------|------------------|:------:|
| v1.0 | Core multi-agent collaboration | ✅ |
| v1.1 | REST API interface | 🔄 |
| v1.2 | Web Dashboard | 📋 |
| v1.3 | Multi-model provider support | 📋 |
| v1.4 | Docker Compose solution | 📋 |
| v2.0 | Plugin system + custom role templates | 📋 |

---

## 🤝 Contributing

Issues and Pull Requests welcome!

See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 License

[MIT License](./LICENSE) © 2026 MultiClaw Contributors

---

<div align="center">

**⭐ If this project helps you, please give it a Star!**

[![Star History Chart](https://api.star-history.com/svg?repos=yezirun/multiClaw&type=Date)](https://star-history.com/#yezirun/multiClaw)

</div>