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

响应（201）：
```json
{
  "id": "clxxxxx",
  "name": "my-app",
  "key": "nb_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "enabled": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

> key 明文仅此处返回一次，请妥善保存。

### 2. 发送通知

```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nb_xxx" \
  -d '{
    "channel": "FEISHU",
    "title": "告警",
    "content": "CPU 使用率超过 90%"
  }'
```

响应（202）：
```json
{ "success": true, "data": { "logId": "clxxxxx", "status": "SUCCESS" } }
```

支持渠道：`EMAIL` / `FEISHU` / `DINGTALK` / `WECOM`

**钉钉示例：**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nb_xxx" \
  -d '{"channel": "DINGTALK", "title": "部署完成", "content": "v1.2.0 已上线"}'
```

**Email 示例：**
```bash
curl -X POST http://localhost:3000/api/v1/messages/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nb_xxx" \
  -d '{
    "channel": "EMAIL",
    "target": "user@example.com",
    "title": "系统通知",
    "content": "纯文本内容",
    "extra": { "html": "<h1>系统通知</h1>" }
  }'
```

### 3. 查询发送日志

```bash
# 分页查询，支持 channel / status 过滤
curl "http://localhost:3000/api/v1/messages/logs?channel=FEISHU&status=FAILED&page=1&pageSize=20" \
  -H "X-API-Key: nb_xxx"
```

响应：
```json
{
  "success": true,
  "data": {
    "total": 5,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1,
    "items": [...]
  }
}
```

## API

| 方法   | 路径                      | 说明           |
|--------|---------------------------|----------------|
| POST   | /api/v1/messages/send     | 发送通知       |
| GET    | /api/v1/messages/logs     | 查询发送日志   |
| POST   | /api/v1/apikeys           | 创建 API Key   |
| GET    | /api/v1/apikeys           | 列出 API Key   |
| DELETE | /api/v1/apikeys/:id       | 禁用 API Key   |
| GET    | /health                   | 健康检查       |

详细文档见 [docs/api.md](docs/api.md)。

## 测试

```bash
# 单次运行
npm test

# 监听模式
npm run test:watch
```

测试覆盖：
- `tests/utils/interpolate.test.ts` — 模板变量替换
- `tests/modules/messages.schema.test.ts` — Zod 请求参数校验
- `tests/providers/registry.test.ts` — provider 工厂选择逻辑

## 项目结构

```
src/
├── app.ts              # Fastify 实例构建
├── server.ts           # 启动入口
├── config/             # 环境变量配置
├── plugins/            # auth、prisma、swagger、error-handler
├── providers/          # 各渠道发送实现
├── modules/
│   ├── messages/       # 发送接口 + 日志查询
│   ├── log/            # 通用日志查询
│   └── apikey/         # Key 管理
└── utils/
    ├── response.ts     # 统一响应格式
    └── interpolate.ts  # 模板变量替换
tests/
├── utils/
├── modules/
└── providers/
```

## Prisma 数据模型

```prisma
model ApiKey {
  id        String      @id @default(cuid())
  name      String
  key       String      @unique
  enabled   Boolean     @default(true)
  createdAt DateTime    @default(now())
  logs      NotifyLog[]
}

model NotifyLog {
  id        String    @id @default(cuid())
  apiKeyId  String
  channel   Channel                    # EMAIL | FEISHU | DINGTALK | WECOM
  target    String
  title     String?
  content   String
  status    LogStatus @default(PENDING) # PENDING | SUCCESS | FAILED
  error     String?
  requestId String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

迁移命令：
```bash
# 开发环境（自动生成迁移文件）
npx prisma migrate dev --name init

# 生产环境（执行已有迁移）
npx prisma migrate deploy
```

## Docker

```bash
cd docker
docker-compose up -d --build
```

## 技术栈

- Node.js 20 + TypeScript 5
- Fastify 5 + Prisma 6 + SQLite
- Zod — 请求参数校验
- @fastify/swagger + @fastify/swagger-ui
- Vitest — 单元测试
