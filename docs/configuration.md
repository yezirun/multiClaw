# MultiClaw 示例配置

## 环境变量配置

参考 `.env.example` 文件进行配置。

### 最小配置（仅 OpenClaw）

```env
OPENCLAW_API_KEY=<OPENCLAW_API_KEY>
NODE_ENV=production
LOG_LEVEL=info
```

### 完整配置（含飞书集成）

```env
OPENCLAW_API_KEY=<OPENCLAW_API_KEY>
OPENCLAW_BASE_URL=https://api.openclaw.ai
FEISHU_APP_ID=<FEISHU_APP_ID>
FEISHU_APP_SECRET=<FEISHU_APP_SECRET>
FEISHU_CHAT_ID=<FEISHU_CHAT_ID>
NODE_ENV=production
LOG_LEVEL=info
MAX_MESSAGES=50
SUMMARIZE_THRESHOLD=10
ENABLE_WORK_SUMMARY=true
```

## 飞书配置详解

### 1. 创建飞书应用

登录飞书开放平台，创建企业自建应用。

### 2. 配置权限

应用需要以下权限：

| 权限名称 | 权限码 | 说明 |
|---------|--------|------|
| 获取与发送消息 | `im:message` | 基础消息权限 |
| 以应用身份发消息 | `im:message:send_as_bot` | 发送机器人消息 |

### 3. 获取参数

- **APP_ID**: 应用详情页 > 基本信息 > App ID
- **APP_SECRET**: 应用详情页 > 基本信息 > App Secret
- **CHAT_ID**: 群设置 > 二维码 > URL 中的 `chat_id` 参数

### 4. 发布应用

应用配置完成后需要发布到企业才能使用。

## systemd 配置详解

### 安装服务

```bash
# 复制服务文件
sudo cp deploy/systemd/multiclaw.service /etc/systemd/system/

# 编辑服务文件，替换 <PROJECT_ROOT>
sudo sed -i 's/<PROJECT_ROOT>/\/path\/to\/multiclaw/g' /etc/systemd/system/multiclaw.service

# 加载服务
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start multiclaw

# 查看状态
sudo systemctl status multiclaw
```

### 日志查看

```bash
# 使用 journalctl 查看日志
journalctl -u multiclaw -f
```

### 服务管理

```bash
# 停止服务
sudo systemctl stop multiclaw

# 重启服务
sudo systemctl restart multiclaw

# 设置开机自启
sudo systemctl enable multiclaw

# 取消开机自启
sudo systemctl disable multiclaw
```

## Docker 配置详解

### 构建镜像

```bash
docker build -t multiclaw:latest -f deploy/docker/Dockerfile .
```

### 运行容器

```bash
# 使用环境文件
docker run -d \
  --name multiclaw \
  --env-file .env \
  -p 3000:3000 \
  multiclaw:latest

# 或使用 docker-compose
docker-compose -f deploy/docker/docker-compose.yml up -d
```

### 管理容器

```bash
# 查看日志
docker logs -f multiclaw

# 停止容器
docker stop multiclaw

# 删除容器
docker rm multiclaw
```