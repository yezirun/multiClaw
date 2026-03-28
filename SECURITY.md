# Security Policy

## 安全原则

MultiClaw 作为一个开源项目，遵循以下安全原则：

1. **零敏感信息泄露** - 代码、配置、文档中不包含真实密钥、ID、凭证
2. **配置外置** - 所有敏感配置通过环境变量注入，不硬编码
3. **历史清洗** - 发布前清洗 git 历史，确保无敏感遗留

## 报告安全漏洞

如果你发现安全漏洞，请**不要**在公开 Issue 中报告。

请通过以下方式私下报告：

- 发送邮件至项目维护者（请查看仓库联系方式）
- 或通过 GitHub Security Advisory 功能提交

我们会在 48 小时内回复，并在修复后公开感谢。

## 安全最佳实践

### 使用者

1. **不要提交 `.env` 文件**
   - `.env` 文件包含你的真实凭证
   - 使用 `.env.example` 作为模板
   - 生产环境使用独立的密钥管理

2. **定期轮换密钥**
   - 如果密钥曾被泄露或怀疑泄露，立即轮换
   - 定期更换 API Key、App Secret

3. **限制权限**
   - 飞书应用只申请必要的最小权限
   - OpenClaw API Key 只授予必要权限

4. **生产环境隔离**
   - 生产环境使用独立的飞书应用
   - 使用独立的 OpenClaw 项目/账户

### 贡献者

1. **使用占位符**
   ```env
   # 正确示例
   OPENCLAW_API_KEY=<OPENCLAW_API_KEY>
   FEISHU_APP_ID=<FEISHU_APP_ID>

   # 错误示例（禁止）
   OPENCLAW_API_KEY=sk-real-key-12345
   FEISHU_APP_ID=cli_a1b2c3d4e5
   ```

2. **不要硬编码路径**
   ```typescript
   // 正确示例
   const configPath = process.env.CONFIG_PATH || './config';

   // 错误示例（禁止）
   const configPath = '/home/user/project/config';
   ```

3. **不要提交测试输出**
   - 日志文件
   - 运行态文件
   - 调试输出

## 历史敏感信息处理

如果你从私有仓库迁移到公开仓库：

### 必须执行

1. **清洗 git 历史**
   ```bash
   # 使用 git-filter-repo
   pip install git-filter-repo
   git filter-repo --replace-text secrets.txt

   # 或使用 BFG Repo-Cleaner
   java -jar bfg.jar --replace-text secrets.txt
   ```

2. **轮换所有密钥**
   - 曾经使用过的所有 API Key
   - 所有 App Secret、Token
   - 所有 Chat ID、User ID

### 验证清洗结果

```bash
# 搜索历史中的敏感模式
git log -p | grep -E "sk-[a-zA-Z0-9]{20,}"
git log -p | grep -E "cli_[a-zA-Z0-9]{10,}"
```

## 更新日志

安全相关的更新会在此记录：

- **2026-03-28**: 项目开源前完成敏感信息脱敏处理

---

安全是持续的责任。如有疑问，请随时联系我们。