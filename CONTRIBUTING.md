# Contributing to MultiClaw

感谢你考虑为 MultiClaw 做贡献！

## 如何贡献

### 报告问题

如果你发现了 bug 或有功能建议：

1. 先在 [Issues](https://github.com/<YOUR_GITHUB_NAME>/multiClaw/issues) 中搜索，确认没有重复
2. 使用 Issue 模板创建新 Issue：
   - Bug Report：详细描述问题、复现步骤、预期行为
   - Feature Request：描述需求、使用场景、预期效果

### 提交代码

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 进行开发并确保：
   - 代码风格一致
   - 有必要的类型定义
   - 不引入敏感信息（密钥、ID、真实路径等）
4. 提交变更：`git commit -m "feat: your feature description"`
5. 推送到分支：`git push origin feature/your-feature`
6. 创建 Pull Request

### 开发规范

#### 代码风格

- 使用 TypeScript
- 遵循现有代码风格和命名约定
- 每个模块有清晰的职责划分
- 使用 `logger` 而不是 `console.log`

#### 安全规范

- **不要提交任何真实密钥、ID、凭证**
- 使用占位符 `<PLACEHOLDER>` 表示敏感配置
- 新增 `.env.example` 条目时使用占位符格式
- 代码中不要硬编码路径或组织信息

#### 文档规范

- README 使用中文，可适当加英文术语
- 更新功能时同步更新相关文档
- 保持文档简洁、可执行

### 提交信息格式

推荐使用 Conventional Commits：

```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
refactor: 重构代码
chore: 维护性变更
```

### 测试

- 确保现有测试通过
- 新功能添加相应测试
- 运行 `pnpm run verify` 进行健康检查

## 项目结构

```
src/
├── agents/     # 角色代理
├── bridge/     # 外部集成
├── gateway/    # API 网关
├── runtime/    # 运行时核心
└── utils/      # 工具函数
```

## 问题反馈

如有疑问，可在 Issue 中提问，或联系维护者。

---

再次感谢你的贡献！