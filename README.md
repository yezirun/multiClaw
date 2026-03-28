# MultiClaw

> ## 拉一个多机器人的群，让他们自己讨论并输出成果。
>
> MultiClaw 是一个基于 OpenClaw 的 8 Bot 协作系统。
> 它让多个 AI 角色围绕同一个任务自动分工、接力讨论、形成过程可见的群聊协作流，并将讨论与结果同步到 Feishu / Lark。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![OpenClaw](https://img.shields.io/badge/OpenClaw-compatible-purple.svg)

---

## 项目简介

MultiClaw 不是"单个 AI 假装多个角色"的简单包装，而是一个面向真实协作流程设计的多 Bot 系统。

它的核心目标是：

- 把一个任务交给多个角色共同推进
- 让协作过程在群里可见，而不是只看最后答案
- 把需求、架构、开发、测试、运维串成一个连续工作流
- 用轻量方式接入 OpenClaw，并支持 Feishu / Lark 群聊交互

如果你想要的是：

- "不是一个机器人自说自话"
- "而是一群机器人自己讨论、自己推进、最后自己输出成果"

那么 MultiClaw 就是为这个场景设计的。

---

## 核心特性

### 1. 8 Bot 群聊协作

系统内置 8 个协作参与体，围绕同一个任务分工推进：

1. **CTO** — 认领任务、统筹推进、最终收口
2. **PO** — 需求澄清、边界定义、验收口径
3. **Architect** — 架构设计、模块划分、技术方案
4. **Backend** — 后端实现、接口、服务逻辑
5. **Frontend** — 前端实现、页面、交互流程
6. **Impl** — 集成实现、落地执行、拼装交付
7. **QA** — 测试验证、问题回归、质量检查
8. **DevOps** — 部署评估、发布控制、运行保障

### 2. 可见讨论（Visible Discussion）

任务不是黑盒执行，而是可见推进。
你可以看到多个角色是如何讨论、接力、收口并输出结果的。

### 3. 8 Bot 独立身份配置

支持为 8 个角色分别配置独立的 Feishu / Lark Bot 身份：

- `FEISHU_AGENT1_APP_ID / APP_SECRET`
- `FEISHU_AGENT2_APP_ID / APP_SECRET`
- ...
- `FEISHU_AGENT8_APP_ID / APP_SECRET`

### 4. 单 Bot 兼容模式

如果你暂时没有 8 套机器人身份，也可以启用兼容模式：

```env
FEISHU_SINGLE_BOT_MODE=true
```

这样可以先以单 Bot 模式运行，再逐步升级到完整 8 Bot 配置。

### 5. 防止"CTO 一个人说完"

系统内置最小 specialist 参与约束：

```
MIN_SPECIALIST_PARTICIPANTS=2
guaranteeSpecialistParticipation
```

这意味着讨论流程默认不会退化成"只有 CTO 一个人说完就结束"。

### 6. OpenClaw 友好

MultiClaw 设计为可通过 OpenClaw 快速接入与部署，适合本地调试、服务器常驻和后续二次开发。

---

## 适合什么场景

MultiClaw 适合：

- 想让 AI 团队化协作，而不是单点问答
- 想在群里看到 AI 讨论过程
- 想把 AI 角色分工接入飞书工作流
- 想做需求 → 架构 → 开发 → 测试 → 运维的连续协作
- 想基于 OpenClaw 快速部署一个多 Bot 系统

---

## 架构概览

```
Task Input
   ↓
OpenClaw Gateway
   ↓
Task Routing / Discussion Runtime
   ↓
8 Collaborative Bots
   ├── CTO
   ├── PO
   ├── Architect
   ├── Backend
   ├── Frontend
   ├── Impl
   ├── QA
   └── DevOps
   ↓
Visible Discussion
   ↓
Feishu / Lark Group Delivery
   ↓
Structured Output
```

---

## 典型工作流

一次任务通常按如下顺序推进：

1. CTO 认领任务并拆解
2. PO 澄清需求边界
3. Architect 输出技术方案
4. Backend / Frontend 分别推进实现
5. Impl 负责集成与落地
6. QA 验证质量和可交付性
7. DevOps 评估部署和发布风险
8. CTO 统一收口并输出结论

默认讨论顺序会尽量保证多个 specialist 真实参与，而不是流于单角色独白。

---

## 目录结构

```
multiClaw/
├── .github/                 # GitHub templates and project hygiene
├── deploy/
│   └── systemd/             # systemd service templates
├── docs/                    # supplementary docs
├── examples/
│   └── workflows/           # example workflows
├── scripts/
│   ├── setup/               # setup helpers
│   └── verify/              # verification helpers
├── src/
│   ├── agents/              # agent registry and role definitions
│   ├── bridge/              # Feishu / Lark bridge
│   ├── runtime/             # visible discussion runtime
│   ├── gateway/             # OpenClaw integration
│   ├── utils/               # utilities
│   ├── config.ts            # config loader
│   ├── index.ts             # entry
│   └── types.ts             # shared types
├── .env.example
├── package.json
├── README.md
└── LICENSE
```

---

## 快速开始

### 1. 环境要求

请先准备：

- Node.js 18+
- pnpm
- OpenClaw API Key
- Feishu / Lark 群聊环境
- 至少 1 个可发送消息的 Bot
- 推荐完整准备 8 套 Bot 身份

### 2. 克隆项目

```bash
git clone https://github.com/yezirun/multiClaw.git
cd multiClaw
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 创建本地环境变量

```bash
cp .env.example .env
```

然后填写你自己的本地配置。

> **重要：不要把真实 key / secret / token / chat_id 提交到 GitHub。**
> 也不要把真实密钥粘贴到 AI 对话、Issue、截图或日志中。

### 5. 构建项目

```bash
pnpm build
```

### 6. 启动项目

```bash
pnpm start
```

开发模式：

```bash
pnpm dev
```

### 7. 执行验证

```bash
pnpm verify
```

建议在以下场景执行一次：

- 首次安装后
- 修改 Bot 配置后
- 修改 Feishu / Lark 桥接逻辑后
- 修改 runtime / visible discussion 逻辑后
- 发布前

---

## 配置说明

### OpenClaw

```env
OPENCLAW_API_KEY=<OPENCLAW_API_KEY>
OPENCLAW_BASE_URL=https://api.openclaw.ai
```

| 变量 | 必填 | 说明 |
|------|------|------|
| OPENCLAW_API_KEY | 是 | OpenClaw API 密钥 |
| OPENCLAW_BASE_URL | 否 | OpenClaw 接口地址 |

### 群聊配置

```env
FEISHU_CHAT_ID=<FEISHU_CHAT_ID>
FEISHU_SINGLE_BOT_MODE=false
```

| 变量 | 必填 | 说明 |
|------|------|------|
| FEISHU_CHAT_ID | 是 | 目标群聊 ID |
| FEISHU_SINGLE_BOT_MODE | 否 | 是否启用单 Bot 兼容模式，默认 false |

### 8 Bot 身份配置

```env
FEISHU_AGENT1_APP_ID=<FEISHU_AGENT1_APP_ID>
FEISHU_AGENT1_APP_SECRET=<FEISHU_AGENT1_APP_SECRET>

FEISHU_AGENT2_APP_ID=<FEISHU_AGENT2_APP_ID>
FEISHU_AGENT2_APP_SECRET=<FEISHU_AGENT2_APP_SECRET>

FEISHU_AGENT3_APP_ID=<FEISHU_AGENT3_APP_ID>
FEISHU_AGENT3_APP_SECRET=<FEISHU_AGENT3_APP_SECRET>

FEISHU_AGENT4_APP_ID=<FEISHU_AGENT4_APP_ID>
FEISHU_AGENT4_APP_SECRET=<FEISHU_AGENT4_APP_SECRET>

FEISHU_AGENT5_APP_ID=<FEISHU_AGENT5_APP_ID>
FEISHU_AGENT5_APP_SECRET=<FEISHU_AGENT5_APP_SECRET>

FEISHU_AGENT6_APP_ID=<FEISHU_AGENT6_APP_ID>
FEISHU_AGENT6_APP_SECRET=<FEISHU_AGENT6_APP_SECRET>

FEISHU_AGENT7_APP_ID=<FEISHU_AGENT7_APP_ID>
FEISHU_AGENT7_APP_SECRET=<FEISHU_AGENT7_APP_SECRET>

FEISHU_AGENT8_APP_ID=<FEISHU_AGENT8_APP_ID>
FEISHU_AGENT8_APP_SECRET=<FEISHU_AGENT8_APP_SECRET>
```

建议角色映射如下：

| Agent | Role |
|-------|------|
| Agent 1 | CTO |
| Agent 2 | PO |
| Agent 3 | Architect |
| Agent 4 | Backend |
| Agent 5 | Frontend |
| Agent 6 | Impl |
| Agent 7 | QA |
| Agent 8 | DevOps |

---

## Feishu / Lark 配置步骤

### 完整 8 Bot 模式

如果你要使用完整的 8 Bot 群聊体验，请准备：

- 1 个目标群
- 8 组 Bot 身份配置
- 对应的 App ID / App Secret
- 群 chat_id

### 最低可运行模式

如果你暂时还没有 8 套身份，可以先使用：

- 1 个群
- 1 套 Bot 身份
- `FEISHU_SINGLE_BOT_MODE=true`

之后再切换到完整的 8 Bot 配置。

---

## OpenClaw 快速部署

如果你想通过 OpenClaw 辅助部署，推荐这样做：

1. 让它帮你克隆项目
2. 让它帮你安装依赖
3. 让它帮你复制 `.env.example` 到 `.env`
4. 你自己本地填写密钥
5. 让它帮你执行 `pnpm build`
6. 让它帮你执行 `pnpm start`
7. 让它帮你执行 `pnpm verify`

> 不要把真实密钥发到聊天里。
> 正确方式是：让 AI 执行步骤，但由你本地手工填写 secrets。

---

## systemd 部署

适合服务器常驻运行。

### 复制服务文件

```bash
sudo cp deploy/systemd/multiclaw.service /etc/systemd/system/
```

### 重载并启动

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now multiclaw
sudo systemctl status multiclaw
```

### 查看日志

```bash
journalctl -u multiclaw -f
```

> 启用前请确认 service 文件里没有个人路径、个人用户名或本地敏感环境引用。

---

## 验证与排查

### 快速验证

```bash
pnpm verify
```

### 常见问题

#### 1. 只有一个 Bot 在说话

检查：

- 是否启用了 `FEISHU_SINGLE_BOT_MODE=true`
- 是否完整配置了 8 组 `FEISHU_AGENT*_APP_ID / APP_SECRET`
- runtime 是否启用了 visible discussion

#### 2. 没有出现 Impl 角色

检查：

- 是否已经拉取到最新补丁
- `src/agents/roles.ts` 是否包含 impl
- registry 是否包含 agent6-impl

#### 3. 讨论很快被 CTO 收口

检查：

- `MIN_SPECIALIST_PARTICIPANTS=2` 相关逻辑是否启用
- `guaranteeSpecialistParticipation` 是否被包含在 runtime 中

#### 4. 飞书消息没有发出去

检查：

- `FEISHU_CHAT_ID` 是否正确
- App ID / Secret 是否正确
- Bot 是否已加入目标群
- 权限是否完整
- 配置是否仍是占位符

---

## 安全说明

MultiClaw 涉及消息平台和模型接入，安全卫生必须放在前面。

### 永远不要提交这些内容

- `.env`
- `secrets.env`
- 真实 App ID / App Secret
- 真实 `OPENCLAW_API_KEY`
- 真实 chat_id
- 真实 message_id
- 本地日志
- runtime 记录
- checkpoints
- shell 历史里的敏感命令
- 本地绝对路径
- 私有部署输出

### 发布前必须做的事

1. 扫描 secrets
2. 检查 git history，不只检查当前工作区
3. 检查 `.env.example` 是否只保留占位符
4. 检查 `.gitignore` 是否覆盖日志、runtime、密钥文件
5. 轮换所有曾在私有环境中使用过的旧密钥

推荐工具：

- gitleaks
- trufflehog
- git-filter-repo
- BFG Repo-Cleaner

---

## 项目定位

MultiClaw 的重点不是"给一个机器人贴上八个标签"，而是：

- 多 Bot 协作
- 多角色推进
- 过程可见
- 可部署可维护
- 可接入 OpenClaw
- 可同步到群聊

一句话概括：

> **拉一个多机器人的群，让他们自己讨论并输出成果。**

---

## Roadmap

- [ ] 更强的 8 Bot 身份校验
- [ ] 更完善的 Bot 映射验证工具
- [ ] 更多示例工作流
- [ ] 更细的可见讨论控制
- [ ] 更好的 secrets hygiene CI
- [ ] 更完整的部署模板
- [ ] 更灵活的模型路由扩展

---

## Contributing

欢迎提交改进。

请遵守以下原则：

- 不提交任何 secrets
- 不提交任何个人部署痕迹
- 公开仓库只保留占位符配置
- 保持轻量、模块化、可审查
- 保持 8 Bot 协作架构的一致性

---

## License

MIT