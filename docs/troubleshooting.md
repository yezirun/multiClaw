# MultiClaw 故障排查指南

## 常见问题

### 启动失败

**症状**: 启动时报错 `OPENCLAW_API_KEY is required`

**排查步骤**:
1. 检查 `.env` 文件是否存在
2. 确认 `OPENCLAW_API_KEY` 已设置
3. 确认值不为空或占位符

**解决方案**:
```bash
cp .env.example .env
# 编辑 .env，填入真实值
```

### 飞书消息发送失败

**症状**: 报错 `Feishu auth failed` 或 `Feishu message failed`

**排查步骤**:
1. 检查 `FEISHU_APP_ID` 和 `FEISHU_APP_SECRET` 是否正确
2. 确认应用已发布到企业
3. 确认应用权限配置正确
4. 验证 `FEISHU_CHAT_ID` 是否正确

**验证脚本**:
```bash
# 测试飞书 API 连接
curl -X POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal \
  -H 'Content-Type: application/json' \
  -d '{"app_id":"<FEISHU_APP_ID>","app_secret":"<FEISHU_APP_SECRET>"}'
```

### 构建失败

**症状**: `pnpm build` 报错

**排查步骤**:
1. 确认 Node.js 版本 >= 18
2. 确认依赖已安装
3. 检查 TypeScript 配置

**解决方案**:
```bash
# 重新安装依赖
rm -rf node_modules
pnpm install

# 清理并重新构建
rm -rf dist
pnpm build
```

### 服务无响应

**症状**: systemd 服务状态为 `failed` 或无响应

**排查步骤**:
1. 查看服务日志: `journalctl -u multiclaw -n 100`
2. 检查 `.env` 文件路径是否正确
3. 确认 WorkingDirectory 配置正确

**解决方案**:
```bash
# 检查服务配置
sudo systemctl cat multiclaw

# 手动测试启动
cd <PROJECT_ROOT>
node dist/index.js
```

## 健康检查

### 命令行检查

```bash
./scripts/verify/health-check.sh
```

### API 检查

如果项目有 HTTP 接口：

```bash
curl http://localhost:3000/health
```

### 预期输出

```json
{
  "status": "healthy",
  "components": {
    "openclaw": true,
    "feishu": true,
    "runtime": true
  },
  "timestamp": "2026-03-28T..."
}
```

## 日志分析

### 日志位置

- 本地运行: 控制台输出
- systemd: `journalctl -u multiclaw`
- Docker: `docker logs multiclaw`

### 关键日志

| 日志内容 | 含义 |
|---------|------|
| `MultiClaw Runtime initialized` | 启动成功 |
| `OpenClaw request failed` | API 连接问题 |
| `Feishu auth failed` | 飞书认证问题 |
| `Session created` | 任务开始处理 |
| `Workflow completed` | 工作流完成 |

### 日志级别调整

```env
LOG_LEVEL=debug  # 详细日志
LOG_LEVEL=info   # 正常日志
LOG_LEVEL=error  # 仅错误日志
```

## 诊断脚本

创建诊断脚本检查各组件：

```typescript
// scripts/verify/diagnose.ts
import { loadConfig } from '../src/config';
import { OpenClawGateway } from '../src/gateway';
import { FeishuBridge } from '../src/bridge';

async function diagnose() {
  const config = loadConfig();

  // Check OpenClaw
  const gateway = new OpenClawGateway(config.openclaw);
  const openclawHealthy = await gateway.healthCheck();
  console.log('OpenClaw:', openclawHealthy ? 'OK' : 'FAIL');

  // Check Feishu (if configured)
  if (config.feishu) {
    const feishu = new FeishuBridge(config.feishu);
    const feishuHealthy = await feishu.healthCheck();
    console.log('Feishu:', feishuHealthy ? 'OK' : 'FAIL');
  }
}

diagnose();
```

## 获取帮助

如果以上步骤无法解决问题：

1. 提交 Issue: https://github.com/<YOUR_GITHUB_NAME>/multiClaw/issues
2. 使用 Bug Report 模板
3. 附上日志和配置（使用占位符）