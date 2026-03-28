# Release Notes - v1.0.0

## MultiClaw - First Public Release

这是 MultiClaw 项目的首个公开发布版本。

### 新功能

- **多角色代理协作** - 内置 7 种角色代理：CTO、PO、Architect、Backend、Frontend、QA、DevOps
- **可见讨论追踪** - 实时追踪讨论过程，自动生成工作摘要
- **智能任务路由** - 根据任务关键词自动分配给合适的代理
- **飞书/Lark 集成** - 支持将讨论进展推送至飞书群聊
- **工作流引擎** - 支持线性工作流编排和步骤依赖管理
- **轻量部署** - 支持 Node.js 直接运行、systemd 服务、Docker 容器

### 项目结构

```
src/
├── agents/     # 角色代理模块
├── bridge/     # 外部集成模块（飞书）
├── gateway/    # API 网关与路由
├── runtime/    # 运行时核心（会话、工作流、可见讨论）
└── utils/      # 工具函数
```

### 部署支持

- 本地开发部署：`pnpm install && pnpm start`
- systemd 服务：参见 `deploy/systemd/multiclaw.service`
- Docker 部署：参见 `deploy/docker/Dockerfile`

### 文档

- README.md - 项目概述与快速开始
- CONTRIBUTING.md - 贡献指南
- SECURITY.md - 安全说明
- docs/configuration.md - 配置详解
- docs/troubleshooting.md - 故障排查

### 安全处理

本项目在发布前已完成：
- 敏感信息脱敏处理
- 所有密钥使用占位符 `<PLACEHOLDER>` 格式
- `.gitignore` 配置完善
- 安全指南编写

### 已知限制

- 暂不支持 REST API 接口
- 暂不支持 Web Dashboard
- 工作流暂不支持并行步骤

### 后续计划

参见 README.md 的 Roadmap 章节。

---

**注意**：如果你从私有仓库迁移，请务必：
1. 清洗 git 历史
2. 轮换所有曾经使用的密钥和凭证