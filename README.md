# notify-bridge

轻量通知聚合服务，统一接口发送 Email、飞书、钉钉、企业微信通知。

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入渠道配置

# 初始化数据库
npx prisma migrate dev --name init

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000/docs 查看 Swagger 文档。

## 使用

### 1. 创建 API Key

```bash
curl -X POST http://localhost:3000/api/v1/apikeys \
  -H "Content-Type: application/json" \
  -d '{"name": "my-app"}'
```

保存返回的 `key` 字段（仅显示一次）。

### 2. 发送通知

```bash
curl -X POST http://localhost:3000/api/v1/notify/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nb_xxx" \
  -d '{
    "channel": "FEISHU",
    "title": "告警",
    "content": "CPU 使用率超过 90%"
  }'
```

支持渠道：`EMAIL` / `FEISHU` / `DINGTALK` / `WECOM`

## 项目结构

```
src/
├── app.ts              # Fastify 实例构建
├── server.ts           # 启动入口
├── config/             # 环境变量配置
├── plugins/            # auth、prisma、swagger、error-handler
├── providers/          # 各渠道发送实现
├── modules/
│   ├── notify/         # 发送接口
│   ├── log/            # 日志查询
│   └── apikey/         # Key 管理
└── utils/
    └── response.ts     # 统一响应格式
```

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/v1/notify/send | 发送通知 |
| GET  | /api/v1/logs | 查询发送日志 |
| GET  | /api/v1/logs/:id | 日志详情 |
| POST | /api/v1/apikeys | 创建 API Key |
| GET  | /api/v1/apikeys | 列出 API Key |
| DELETE | /api/v1/apikeys/:id | 禁用 API Key |
| GET  | /health | 健康检查 |

详细文档见 [docs/api.md](docs/api.md)。

## Docker

```bash
cd docker
docker-compose up -d --build
```

## 技术栈

- Node.js 20 + TypeScript 5
- Fastify 5 + Prisma 6 + SQLite
- @fastify/swagger + @fastify/swagger-ui
