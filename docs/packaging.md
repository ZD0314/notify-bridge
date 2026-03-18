# 项目打包与部署指南

## 1. 项目结构

```
notify-bridge/
├── src/                          # 源代码
│   ├── app.ts                    # Fastify 应用
│   ├── server.ts                 # 服务器入口
│   ├── config/                   # 配置
│   ├── plugins/                  # Fastify 插件
│   ├── providers/                # 通知渠道提供者
│   └── modules/                  # 业务模块
│       ├── notify/               # 通知模块
│       ├── log/                  # 日志模块
│       └── apikey/               # API Key 模块
├── prisma/                       # Prisma 配置
│   ├── schema.prisma            # 数据库模型
│   └── migrations/              # 数据库迁移
├── docs/                         # 文档
├── examples/                     # 示例代码
│   ├── java-client/             # Java 客户端示例
│   └── spring-boot-demo/        # Spring Boot 示例
├── .env.example                 # 环境变量示例
├── package.json                 # 项目依赖
├── tsconfig.json               # TypeScript 配置
└── Dockerfile                   # Docker 配置
```

## 2. 本地打包

### 2.1 安装依赖

```bash
npm install
```

### 2.2 构建项目

```bash
npm run build
```

构建产物在 `dist/` 目录：

```
dist/
├── app.js
├── server.js
├── config/
├── plugins/
├── providers/
└── modules/
```

### 2.3 运行生产环境

```bash
# 设置生产环境
export NODE_ENV=production

# 运行
node dist/server.js
```

或者使用 PM2（推荐）：

```bash
npm install -g pm2
pm2 start dist/server.js --name notify-bridge
pm2 save
pm2 startup
```

## 3. Docker 部署

### 3.1 Dockerfile

项目已包含 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 运行阶段
FROM node:18-alpine

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# 创建数据目录
RUN mkdir -p data

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# 暴露端口
EXPOSE 3000

# 运行应用
CMD ["node", "dist/server.js"]
```

### 3.2 构建 Docker 镜像

```bash
# 构建镜像
docker build -t notify-bridge:latest .

# 查看镜像
docker images
```

### 3.3 运行容器

**方式 1：使用环境变量文件**

创建 `.env.docker`：
```bash
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
DATABASE_URL=file:./data/notify-bridge.db
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook-url
```

运行容器：
```bash
docker run -d \
  --name notify-bridge \
  -p 3000:3000 \
  --env-file .env.docker \
  -v $(pwd)/data:/app/data \
  notify-bridge:latest
```

**方式 2：直接传递环境变量**

```bash
docker run -d \
  --name notify-bridge \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=file:./data/notify-bridge.db \
  -e FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook-url \
  -v $(pwd)/data:/app/data \
  notify-bridge:latest
```

### 3.4 Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  notify-bridge:
    build: .
    container_name: notify-bridge
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOST=0.0.0.0
      - DATABASE_URL=file:./data/notify-bridge.db
      - FEISHU_WEBHOOK_URL=${FEISHU_WEBHOOK_URL}
      - DINGTALK_WEBHOOK_URL=${DINGTALK_WEBHOOK_URL}
      - DINGTALK_SECRET=${DINGTALK_SECRET}
      - WECOM_WEBHOOK_URL=${WECOM_WEBHOOK_URL}
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

运行：
```bash
docker-compose up -d
```

### 3.5 Docker 常用命令

```bash
# 查看日志
docker logs -f notify-bridge

# 进入容器
docker exec -it notify-bridge sh

# 重启容器
docker restart notify-bridge

# 停止容器
docker stop notify-bridge

# 删除容器
docker rm notify-bridge

# 查看容器状态
docker ps
```

## 4. GitHub 上传

### 4.1 初始化 Git 仓库

如果还没有初始化：

```bash
# 初始化
git init

# 添加 .gitignore
echo "node_modules/" >> .gitignore
echo "dist/" >> .gitignore
echo "data/" >> .gitignore
echo ".env" >> .gitignore
echo ".DS_Store" >> .gitignore
```

### 4.2 提交代码

```bash
# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Notify Bridge notification service"

# 添加远程仓库
git remote add origin https://github.com/your-username/notify-bridge.git

# 推送到 GitHub
git push -u origin main
```

### 4.3 创建 GitHub Release

**方式 1：使用 GitHub Web**

1. 访问 GitHub 仓库
2. 点击 "Releases"
3. 点击 "Draft a new release"
4. 填写版本号（如 v1.0.0）
5. 填写发布说明
6. 上传构建产物（可选）
7. 点击 "Publish release"

**方式 2：使用 GitHub CLI**

```bash
# 安装 GitHub CLI（如果还没有）
# https://cli.github.com/

# 登录
gh auth login

# 创建 Release
gh release create v1.0.0 \
  --title "Notify Bridge v1.0.0" \
  --notes "Initial release of Notify Bridge notification service" \
  --draft
```

### 4.4 创建 README

创建项目根目录的 `README.md`：

```markdown
# Notify Bridge

轻量级通知聚合服务，支持飞书、钉钉、企业微信、邮件等多渠道通知。

## 特性

- ✅ 多渠道支持：飞书、钉钉、企业微信、邮件
- ✅ API Key 认证
- ✅ 发送日志记录
- ✅ RESTful API
- ✅ Swagger 文档
- ✅ Docker 部署

## 快速开始

### 1. 环境要求

- Node.js 18+
- SQLite（默认）或其他支持的数据库

### 2. 安装运行

```bash
# 克隆仓库
git clone https://github.com/your-username/notify-bridge.git
cd notify-bridge

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 初始化数据库
npx prisma migrate dev --name init

# 运行
npm run dev
```

### 3. Docker 部署

```bash
# 构建镜像
docker build -t notify-bridge:latest .

# 运行容器
docker run -d \
  --name notify-bridge \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -v $(pwd)/data:/app/data \
  notify-bridge:latest
```

## API 文档

访问 `http://localhost:3000/docs` 查看 Swagger 文档。

### 发送通知

```bash
curl -X POST http://localhost:3000/api/v1/notify/send \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "FEISHU",
    "title": "测试标题",
    "content": "测试内容"
  }'
```

## 客户端 SDK

- **Java**: 见 `examples/java-client/`
- **Python**: 见 `examples/python-client/`
- **Node.js**: 见 `examples/node-client/`

## 文档

- [API 文档](docs/api.md)
- [部署指南](docs/deployment.md)
- [Java 集成](docs/java-integration.md)
- [提供者配置](docs/providers.md)

## 许可证

MIT License
```

## 5. 在其他项目中使用

### 5.1 作为子模块

```bash
# 添加为子模块
git submodule add https://github.com/your-username/notify-bridge.git libs/notify-bridge

# 更新子模块
git submodule update --init --recursive
```

### 5.2 作为依赖包（npm）

如果要发布为 npm 包：

1. 修改 `package.json`：
```json
{
  "name": "notify-bridge-client",
  "version": "1.0.0",
  "main": "dist/client.js",
  "types": "dist/client.d.ts"
}
```

2. 构建客户端：
```bash
npm run build:client
```

3. 发布到 npm：
```bash
npm login
npm publish
```

### 5.3 直接复制使用

将 `src/providers/` 目录复制到你的项目中，然后：

```typescript
import { FeishuProvider } from './providers/feishu.provider'

const provider = new FeishuProvider()
await provider.send({
  channel: 'FEISHU',
  target: 'webhook-url',
  title: '标题',
  content: '内容'
})
```

## 6. 生产环境配置

### 6.1 环境变量

```bash
# 服务器配置
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# 数据库
DATABASE_URL=file:./data/notify-bridge.db

# 飞书
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxx

# 钉钉
DINGTALK_WEBHOOK_URL=https://oapi.dingtalk.com/robot/send?access_token=xxx
DINGTALK_SECRET=your-secret

# 企业微信
WECOM_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx

# 邮件（SMTP）
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASS=password
SMTP_FROM="Notify Bridge <noreply@example.com>"
```

### 6.2 使用 PM2（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 创建 ecosystem.config.js
module.exports = {
  apps: [{
    name: 'notify-bridge',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}

# 启动
pm2 start ecosystem.config.js

# 保存
pm2 save
pm2 startup
```

### 6.3 使用 systemd（Linux）

创建 `/etc/systemd/system/notify-bridge.service`：

```ini
[Unit]
Description=Notify Bridge Notification Service
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/opt/notify-bridge
ExecStart=/usr/bin/node dist/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

启用服务：
```bash
sudo systemctl enable notify-bridge
sudo systemctl start notify-bridge
sudo systemctl status notify-bridge
```

## 7. 监控与日志

### 7.1 查看日志

```bash
# 开发环境
npm run dev

# 生产环境（PM2）
pm2 logs notify-bridge

# Docker
docker logs -f notify-bridge
```

### 7.2 健康检查

```bash
curl http://localhost:3000/health
```

响应：
```json
{
  "status": "ok",
  "timestamp": "2026-03-18T11:24:37.362Z"
}
```

### 7.3 监控指标

- 发送成功率
- 响应时间
- 错误率
- API 调用次数

## 8. 备份与恢复

### 8.1 备份数据库

```bash
# SQLite 备份
cp data/notify-bridge.db data/notify-bridge.db.backup.$(date +%Y%m%d)
```

### 8.2 恢复数据库

```bash
# 停止服务
pm2 stop notify-bridge

# 恢复数据库
cp data/notify-bridge.db.backup.20260318 data/notify-bridge.db

# 启动服务
pm2 start notify-bridge
```

## 9. 故障排除

### 9.1 常见问题

**问题：端口被占用**
```bash
# 查看端口占用
netstat -ano | findstr :3000

# 或使用 PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
```

**问题：数据库连接失败**
```bash
# 检查数据库文件权限
ls -la data/

# 重新初始化数据库
npx prisma migrate dev --name init
```

**问题：中文乱码**
```bash
# 确保使用 UTF-8 编码
chcp 65001
```

### 9.2 获取帮助

- 查看文档：`docs/` 目录
- 查看日志：`pm2 logs` 或 `docker logs`
- 提交 Issue：GitHub Issues

## 10. 更新指南

### 10.1 更新代码

```bash
# 拉取最新代码
git pull origin main

# 安装依赖
npm install

# 重新构建
npm run build

# 重启服务
pm2 restart notify-bridge
```

### 10.2 数据库迁移

```bash
# 生成迁移
npx prisma migrate dev --name feature_name

# 应用迁移
npx prisma migrate deploy
```
