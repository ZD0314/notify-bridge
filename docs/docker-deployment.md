# Docker 部署指南

## 1. 快速开始

### 1.1 构建镜像

```bash
# 进入项目目录
cd d:\zm\tip\notify-bridge

# 构建镜像
docker build -t notify-bridge:latest .
```

### 1.2 运行容器

```bash
# 创建数据目录
mkdir -p data

# 运行容器
docker run -d \
  --name notify-bridge \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=file:./data/notify-bridge.db \
  -e FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  notify-bridge:latest
```

### 1.3 验证运行

```bash
# 查看日志
docker logs -f notify-bridge

# 健康检查
curl http://localhost:3000/health
```

## 2. Docker Compose（推荐）

### 2.1 创建 docker-compose.yml

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
      # 飞书配置
      - FEISHU_WEBHOOK_URL=${FEISHU_WEBHOOK_URL}
      # 钉钉配置
      - DINGTALK_WEBHOOK_URL=${DINGTALK_WEBHOOK_URL}
      - DINGTALK_SECRET=${DINGTALK_SECRET}
      # 企业微信配置
      - WECOM_WEBHOOK_URL=${WECOM_WEBHOOK_URL}
      # 邮件配置
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_SECURE=${SMTP_SECURE}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - SMTP_FROM=${SMTP_FROM}
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 2.2 创建环境变量文件

创建 `.env` 文件：

```bash
# 飞书 Webhook
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook-url

# 钉钉 Webhook
DINGTALK_WEBHOOK_URL=https://oapi.dingtalk.com/robot/send?access_token=your-token
DINGTALK_SECRET=your-secret

# 企业微信 Webhook
WECOM_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=your-key

# 邮件配置
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=user@example.com
SMTP_PASS=your-password
SMTP_FROM="Notify Bridge <noreply@example.com>"
```

### 2.3 运行 Docker Compose

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

## 3. Windows PowerShell 部署

### 3.1 构建镜像

```powershell
# 进入项目目录
cd D:\zm\tip\notify-bridge

# 构建镜像
docker build -t notify-bridge:latest .
```

### 3.2 运行容器

```powershell
# 创建数据目录
New-Item -ItemType Directory -Force -Path ".\data"

# 运行容器
docker run -d `
  --name notify-bridge `
  -p 3000:3000 `
  -e NODE_ENV=production `
  -e DATABASE_URL=file:./data/notify-bridge.db `
  -e FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook `
  -v ${PWD}/data:/app/data `
  --restart unless-stopped `
  notify-bridge:latest
```

### 3.3 使用 Docker Compose（PowerShell）

创建 `docker-compose.yml` 同上，然后：

```powershell
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 4. 环境变量说明

### 4.1 必需变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NODE_ENV` | 环境 | `production` |
| `PORT` | 端口 | `3000` |
| `DATABASE_URL` | 数据库路径 | `file:./data/notify-bridge.db` |

### 4.2 通知渠道变量

| 渠道 | 变量名 | 说明 |
|------|--------|------|
| 飞书 | `FEISHU_WEBHOOK_URL` | 飞书机器人 Webhook URL |
| 钉钉 | `DINGTALK_WEBHOOK_URL` | 钉钉机器人 Webhook URL |
| 钉钉 | `DINGTALK_SECRET` | 钉钉签名密钥（可选） |
| 企业微信 | `WECOM_WEBHOOK_URL` | 企业微信机器人 Webhook URL |
| 邮件 | `SMTP_HOST` | SMTP 服务器地址 |
| 邮件 | `SMTP_PORT` | SMTP 端口（默认 587） |
| 邮件 | `SMTP_SECURE` | 是否使用 TLS（true/false） |
| 邮件 | `SMTP_USER` | SMTP 用户名 |
| 邮件 | `SMTP_PASS` | SMTP 密码 |
| 邮件 | `SMTP_FROM` | 发件人邮箱 |

## 5. 数据持久化

### 5.1 数据目录结构

```
data/
├── notify-bridge.db          # SQLite 数据库
└── backups/                  # 备份目录（可选）
```

### 5.2 备份数据

```bash
# 创建备份目录
mkdir -p data/backups

# 备份数据库
cp data/notify-bridge.db data/backups/notify-bridge.db.$(date +%Y%m%d)
```

### 5.3 恢复数据

```bash
# 停止容器
docker stop notify-bridge

# 恢复数据库
cp data/backups/notify-bridge.db.20260318 data/notify-bridge.db

# 启动容器
docker start notify-bridge
```

## 6. 监控与日志

### 6.1 查看日志

```bash
# 实时日志
docker logs -f notify-bridge

# 查看最近 100 行
docker logs --tail 100 notify-bridge

# 查看日志并跟随
docker logs -f --tail 100 notify-bridge
```

### 6.2 健康检查

```bash
# 健康检查
curl http://localhost:3000/health

# 预期响应
{"status":"ok","timestamp":"2026-03-18T11:24:37.362Z"}
```

### 6.3 容器状态

```bash
# 查看容器状态
docker ps

# 查看容器详情
docker inspect notify-bridge

# 查看资源使用
docker stats notify-bridge
```

## 7. 高级配置

### 7.1 使用自定义端口

```bash
docker run -d \
  --name notify-bridge \
  -p 8080:3000 \
  -e PORT=3000 \
  notify-bridge:latest
```

### 7.2 使用外部数据库

```bash
docker run -d \
  --name notify-bridge \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/dbname" \
  notify-bridge:latest
```

### 7.3 限制资源

```bash
docker run -d \
  --name notify-bridge \
  --memory=512m \
  --cpus=1 \
  notify-bridge:latest
```

### 7.4 使用自定义配置文件

```bash
docker run -d \
  --name notify-bridge \
  -v /path/to/custom/config:/app/config \
  notify-bridge:latest
```

## 8. 常见问题

### 8.1 端口冲突

```bash
# 查看端口占用
netstat -ano | findstr :3000

# 或使用 PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# 停止占用端口的进程
Stop-Process -Id <PID> -Force
```

### 8.2 数据库权限问题

```bash
# 检查数据目录权限
ls -la data/

# 修改权限（Linux/Mac）
chmod 755 data
chmod 644 data/notify-bridge.db
```

### 8.3 中文乱码

确保使用 UTF-8 编码：

```bash
# 在 Dockerfile 中添加
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
```

### 8.4 容器无法启动

```bash
# 查看容器日志
docker logs notify-bridge

# 查看容器详情
docker inspect notify-bridge

# 重新创建容器
docker stop notify-bridge
docker rm notify-bridge
docker run -d ...  # 重新运行
```

## 9. 生产环境最佳实践

### 9.1 使用 Docker Compose

推荐使用 Docker Compose 管理服务：

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
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 9.2 使用反向代理

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 9.3 使用 HTTPS

```bash
# 使用 Let's Encrypt
docker run -d \
  --name certbot \
  -v /etc/letsencrypt:/etc/letsencrypt \
  certbot/certbot certonly --webroot -w /var/www/html -d your-domain.com
```

### 9.4 自动更新

```bash
# 创建更新脚本 update.sh
#!/bin/bash
cd /path/to/notify-bridge
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 添加定时任务
crontab -e
# 添加：0 2 * * * /path/to/update.sh
```

## 10. 部署示例

### 10.1 本地开发环境

```bash
# 使用 Docker Compose
docker-compose up -d

# 查看日志
docker-compose logs -f

# 访问 Swagger 文档
open http://localhost:3000/docs
```

### 10.2 生产服务器

```bash
# 1. 克隆仓库
git clone https://github.com/your-username/notify-bridge.git
cd notify-bridge

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 3. 构建并启动
docker-compose up -d

# 4. 查看状态
docker-compose ps

# 5. 查看日志
docker-compose logs -f
```

### 10.3 云服务器（阿里云/腾讯云）

```bash
# 1. 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo systemctl start docker
sudo systemctl enable docker

# 2. 克隆仓库
git clone https://github.com/your-username/notify-bridge.git
cd notify-bridge

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加 Webhook URL

# 4. 启动服务
docker-compose up -d

# 5. 开放端口
# 阿里云/腾讯云控制台开放 3000 端口
```

## 11. 维护命令

### 11.1 日常维护

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs -f notify-bridge

# 重启服务
docker restart notify-bridge

# 停止服务
docker stop notify-bridge

# 启动服务
docker start notify-bridge
```

### 11.2 清理维护

```bash
# 清理停止的容器
docker container prune

# 清理未使用的镜像
docker image prune

# 清理未使用的卷
docker volume prune

# 清理所有未使用的资源
docker system prune -a
```

### 11.3 备份与恢复

```bash
# 备份数据
tar -czf notify-bridge-backup-$(date +%Y%m%d).tar.gz data/

# 恢复数据
tar -xzf notify-bridge-backup-20260318.tar.gz
```

## 12. 故障排除

### 12.1 容器无法启动

```bash
# 查看详细错误
docker logs notify-bridge

# 检查端口占用
netstat -ano | findstr :3000

# 重新创建容器
docker stop notify-bridge
docker rm notify-bridge
docker run -d ...  # 重新运行
```

### 12.2 数据库错误

```bash
# 检查数据库文件
ls -la data/notify-bridge.db

# 重新初始化数据库
docker exec -it notify-bridge npx prisma migrate dev --name init
```

### 12.3 网络问题

```bash
# 检查容器网络
docker network inspect bridge

# 测试容器内网络
docker exec -it notify-bridge ping google.com
```

### 12.4 性能问题

```bash
# 查看资源使用
docker stats notify-bridge

# 查看容器详情
docker inspect notify-bridge
```

## 13. 监控告警

### 13.1 健康检查脚本

创建 `health-check.sh`：

```bash
#!/bin/bash
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$RESPONSE" != "200" ]; then
    echo "Health check failed: HTTP $RESPONSE"
    docker restart notify-bridge
fi
```

### 13.2 定时任务

```bash
# 每 5 分钟检查一次
crontab -e
# 添加：
*/5 * * * * /path/to/health-check.sh
```

## 14. 扩展配置

### 14.1 多实例部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  notify-bridge-1:
    build: .
    ports:
      - "3001:3000"
    environment:
      - INSTANCE_ID=1
    volumes:
      - ./data1:/app/data

  notify-bridge-2:
    build: .
    ports:
      - "3002:3000"
    environment:
      - INSTANCE_ID=2
    volumes:
      - ./data2:/app/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - notify-bridge-1
      - notify-bridge-2
```

### 14.2 负载均衡

```nginx
# nginx.conf
upstream notify_bridge {
    server notify-bridge-1:3000;
    server notify-bridge-2:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://notify_bridge;
    }
}
```

## 15. 安全加固

### 15.1 使用非 root 用户

修改 Dockerfile：

```dockerfile
# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# 切换用户
USER nodeuser
```

### 15.2 使用 secrets（Docker Swarm）

```bash
# 创建 secret
echo "your-api-key" | docker secret create notify_api_key -

# 使用 secret
docker service create \
  --name notify-bridge \
  --secret notify_api_key \
  notify-bridge:latest
```

### 15.3 网络隔离

```yaml
# docker-compose.yml
networks:
  notify-network:
    driver: bridge
    internal: true  # 内部网络，不暴露给外部
```

## 16. 总结

### 16.1 快速命令

```bash
# 构建
docker build -t notify-bridge:latest .

# 运行
docker run -d --name notify-bridge -p 3000:3000 notify-bridge:latest

# 使用 Docker Compose
docker-compose up -d

# 查看日志
docker logs -f notify-bridge

# 停止
docker stop notify-bridge
```

### 16.2 文件清单

- `Dockerfile` - Docker 配置
- `docker-compose.yml` - Docker Compose 配置
- `.env` - 环境变量
- `docs/docker-deployment.md` - 本文档

### 16.3 下一步

1. 配置环境变量
2. 启动服务
3. 访问 Swagger 文档：`http://localhost:3000/docs`
4. 创建 API Key
5. 发送测试通知
