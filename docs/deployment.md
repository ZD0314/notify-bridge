# 部署文档

## 本地开发

### 前置要求

- Node.js >= 20
- npm >= 9

### 启动步骤

```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量文件并填写配置
cp .env.example .env

# 3. 初始化数据库（首次运行）
npx prisma migrate dev --name init

# 4. 启动开发服务器
npm run dev
```

服务启动后访问：
- API：http://localhost:3000
- Swagger UI：http://localhost:3000/docs
- 健康检查：http://localhost:3000/health

---

## 环境变量说明

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | `3000` | 监听端口 |
| `HOST` | `0.0.0.0` | 监听地址 |
| `NODE_ENV` | `development` | 运行环境 |
| `DATABASE_URL` | `file:./data/notify-bridge.db` | SQLite 数据库路径 |
| `SMTP_HOST` | - | SMTP 服务器地址 |
| `SMTP_PORT` | `587` | SMTP 端口 |
| `SMTP_SECURE` | `false` | 是否使用 TLS（465 端口设为 true） |
| `SMTP_USER` | - | SMTP 用户名 |
| `SMTP_PASS` | - | SMTP 密码 |
| `SMTP_FROM` | `Notify Bridge <noreply@example.com>` | 发件人 |
| `FEISHU_WEBHOOK_URL` | - | 飞书机器人默认 webhook |
| `DINGTALK_WEBHOOK_URL` | - | 钉钉机器人默认 webhook |
| `DINGTALK_SECRET` | - | 钉钉加签密钥（可选） |
| `WECOM_WEBHOOK_URL` | - | 企业微信机器人默认 webhook |

---

## Docker 部署

### 单容器启动

```bash
# 构建镜像
docker build -f docker/Dockerfile -t notify-bridge .

# 运行容器
docker run -d \
  -p 3000:3000 \
  -v notify-data:/app/data \
  --env-file .env \
  --name notify-bridge \
  notify-bridge
```

### docker-compose 启动

```bash
cd docker
docker-compose up -d --build
```

查看日志：
```bash
docker-compose logs -f notify-bridge
```

停止服务：
```bash
docker-compose down
```

---

## 数据库管理

```bash
# 查看数据库（开发环境）
npx prisma studio

# 生产环境执行迁移
npx prisma migrate deploy

# 重新生成 Prisma Client（修改 schema 后）
npx prisma generate
```

---

## 生产构建

```bash
npm run build
npm start
```
