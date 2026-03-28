# MultiClaw

A lightweight multi-agent collaboration layer built on top of OpenClaw, with visible discussion flows, Feishu/Lark integration, and deployment-friendly runtime tooling.

## 项目简介

MultiClaw 是一个基于 OpenClaw 的多代理协作框架，支持角色化的代理工作流编排、可见讨论追踪和飞书消息推送。适用于需要多角色协作、结构化任务流转和团队即时沟通的场景。

## 核心特性

- **多角色代理协作** - 内置 CTO、PO、Architect、Backend、Frontend、QA、DevOps 等角色代理
- **可见讨论追踪** - 实时追踪讨论过程，生成工作摘要
- **智能任务路由** - 根据任务描述自动分配给合适的代理角色
- **飞书/Lark 集成** - 支持将讨论进展推送至飞书群聊
- **工作流引擎** - 支持线性工作流编排和步骤依赖管理
- **轻量部署** - 基于 Node.js，支持 systemd 或 Docker 部署

## 架构概览

```text
User Task
    ↓
OpenClaw Gateway
    ↓
Session / Bridge Layer
    ↓
Visible Discussion Runtime
    ↓
Role-based Agents (CTO / PO / Architect / Backend / Frontend / QA / DevOps)
    ↓
Feishu / Lark Delivery
```

## 目录结构

```
.
├── src/
│   ├── agents/         # 角色代理定义
│   ├── bridge/         # Feishu 集成与消息处理
│   ├── gateway/        # OpenClaw 网关与路由
│   ├── runtime/        # 会话、工作流、可见讨论
│   ├── utils/          # 日志、验证等工具
│   ├── config.ts       # 配置加载
│   ├── types.ts        # 类型定义
│   └── index.ts        # 主入口
├── scripts/
│   ├── deploy/         # 部署脚本
│   ├── verify/         # 验证与健康检查脚本
│   └── setup/          # 初始化安装脚本
├── deploy/
│   ├── systemd/        # systemd 服务配置示例
│   └── docker/         # Docker 部署配置
├── docs/               # 文档
├── examples/           # 示例配置与工作流
├── .github/            # GitHub 模板与 CI
├── .env.example        # 环境变量示例
├── README.md           # 本文档
├── CONTRIBUTING.md     # 贡献指南
├── SECURITY.md         # 安全说明
└── LICENSE             # MIT 许可证
```

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/<YOUR_GITHUB_NAME>/multiClaw.git
cd multiClaw
```

### 2. 安装依赖

```bash
pnpm install
# 或
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入必要配置：

```env
OPENCLAW_API_KEY=<OPENCLAW_API_KEY>
FEISHU_APP_ID=<FEISHU_APP_ID>
FEISHU_APP_SECRET=<FEISHU_APP_SECRET>
FEISHU_CHAT_ID=<FEISHU_CHAT_ID>
```

### 4. 启动运行

```bash
pnpm start
# 或开发模式
pnpm dev
```

### 5. 健康检查

```bash
pnpm run verify
```

## 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `OPENCLAW_API_KEY` | OpenClaw 或上游模型 API 密钥 | ✅ |
| `OPENCLAW_BASE_URL` | OpenClaw API 地址（可选） | ❌ |
| `FEISHU_APP_ID` | 飞书应用 ID | 启用飞书时必填 |
| `FEISHU_APP_SECRET` | 飞书应用密钥 | 启用飞书时必填 |
| `FEISHU_CHAT_ID` | 目标飞书群 ID | 启用飞书时必填 |
| `NODE_ENV` | 运行环境（development/production） | ❌ |
| `LOG_LEVEL` | 日志级别（info/debug/error） | ❌ |

## OpenClaw 快速部署

### 本地部署

```bash
# 安装依赖
pnpm install

# 配置环境
cp .env.example .env
# 编辑 .env 填入真实配置

# 构建并启动
pnpm build
pnpm start
```

### systemd 服务部署

创建服务文件 `/etc/systemd/system/multiclaw.service`：

```ini
[Unit]
Description=MultiClaw Runtime
After=network.target

[Service]
Type=simple
WorkingDirectory=<PROJECT_ROOT>
EnvironmentFile=<PROJECT_ROOT>/.env
ExecStart=/usr/bin/env node dist/index.js
Restart=always
RestartSec=5
User=nobody
Group=nogroup

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable multiclaw
sudo systemctl start multiclaw
sudo systemctl status multiclaw
```

### Docker 部署

```bash
docker build -t multiclaw:latest .
docker run -d \
  --name multiclaw \
  --env-file .env \
  multiclaw:latest
```

### 健康检查命令

```bash
pnpm run verify
# 或直接调用
curl http://localhost:3000/health
```

## 飞书 / Lark 配置

### 创建飞书机器人应用

1. 登录飞书开放平台：https://open.feishu.cn
2. 创建企业自建应用
3. 配置应用权限：
   - `im:message` - 获取与发送消息
   - `im:message:send_as_bot` - 以应用身份发消息
4. 发布应用到企业

### 获取配置参数

- **APP_ID**: 应用基本信息页
- **APP_SECRET**: 应用基本信息页
- **CHAT_ID**: 目标群聊的 ID（可通过 API 或群设置获取）

### 验证飞书集成

```bash
pnpm run verify
```

脚本会尝试获取 tenant_access_token 并发送测试消息。

## 常见问题

### Q: 启动时报 OPENCLAW_API_KEY is required？

检查 `.env` 文件是否正确配置，确保：
1. `.env` 文件存在
2. `OPENCLAW_API_KEY` 已设置且不为空

### Q: 飞书消息发送失败？

1. 检查 APP_ID 和 APP_SECRET 是否正确
2. 确认应用已发布并获得必要权限
3. 验证 CHAT_ID 是否正确（群聊 ID）

### Q: 如何自定义代理角色？

扩展 `src/agents/roles.ts`，添加新的角色定义和对应的 Agent 类。

### Q: 如何添加新的工作流？

使用 `WorkflowEngine.createWorkflow()` 或参考 `examples/workflows/` 目录。

## 安全说明

- **不要提交 `.env` 文件** - 所有敏感配置仅保留在本地
- **不要提交日志文件** - `logs/` 目录已在 `.gitignore` 中排除
- **轮换历史密钥** - 如果仓库历史中曾包含敏感信息，发布前必须清洗历史并轮换所有密钥
- **使用占位符** - 所有示例配置使用 `<PLACEHOLDER>` 格式
- **生产环境隔离** - 生产部署时使用独立的密钥和配置

详见 `SECURITY.md`。

## Roadmap

- [ ] 更好的模型提供商抽象（支持多后端）
- [ ] 通用角色模板配置化
- [ ] 更安全的公开示例工作流
- [ ] Docker Compose 部署方案
- [ ] GitHub Actions CI/CD 流水线
- [ ] REST API 接口
- [ ] Web Dashboard

## Contributing

欢迎提交 Issue 和 Pull Request。详见 `CONTRIBUTING.md`。

## License

MIT License - 详见 `LICENSE` 文件。

---

**警告**：本项目在开源前已进行敏感信息脱敏处理。如果你从私有仓库迁移，请务必：
1. 清洗 git 历史（使用 git-filter-repo 或 BFG）
2. 轮换所有曾经使用过的密钥和凭证
3. 重新生成所有 token 和 secret