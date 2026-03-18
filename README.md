# Notify Bridge

轻量级通知聚合服务，支持飞书、钉钉、企业微信、邮件等多渠道通知。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-blue.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-%3E%3D20-blue.svg)](https://www.docker.com/)

## ✨ 特性

- ✅ **多渠道支持**：飞书、钉钉、企业微信、邮件
- ✅ **API Key 认证**：安全的 API 访问控制
- ✅ **发送日志记录**：完整的发送历史记录
- ✅ **RESTful API**：标准的 HTTP API 接口
- ✅ **Swagger 文档**：自动生成 API 文档
- ✅ **Docker 部署**：支持容器化部署
- ✅ **轻量级**：基于 Node.js + SQLite，资源占用低

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- SQLite（默认）或其他支持的数据库

### 安装运行

```bash
# 克隆仓库
git clone https://github.com/your-username/notify-bridge.git
cd notify-bridge

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加 Webhook URL

# 初始化数据库
npx prisma migrate dev --name init

# 运行开发服务器
npm run dev
```

访问 `http://localhost:3000/docs` 查看 Swagger 文档。

## 📖 API 使用

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
curl -X POST http://localhost:3000/api/v1/notify/send \
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
{ "logId": "clxxxxx", "status": "SUCCESS" }
```

支持渠道：`EMAIL` / `FEISHU` / `DINGTALK` / `WECOM`

**钉钉示例：**
```bash
curl -X POST http://localhost:3000/api/v1/notify/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nb_xxx" \
  -d '{"channel": "DINGTALK", "title": "部署完成", "content": "v1.2.0 已上线"}'
```

**Email 示例：**
```bash
curl -X POST http://localhost:3000/api/v1/notify/send \
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
curl "http://localhost:3000/api/v1/logs?channel=FEISHU&status=FAILED&page=1&limit=20" \
  -H "X-API-Key: nb_xxx"
```

响应：
```json
{
  "total": 5,
  "page": 1,
  "limit": 20,
  "items": [...]
}
```

## 📦 Java 集成

### 添加依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.httpcomponents</groupId>
        <artifactId>httpclient</artifactId>
        <version>4.5.14</version>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.15.2</version>
    </dependency>
</dependencies>
```

### 使用示例

```java
// 创建客户端
NotifyClient client = new NotifyClient(
    "http://localhost:3000",
    "nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3"
);

// 发送飞书通知
SendResult result = client.sendFeishu(
    "系统通知",
    "服务器 CPU 使用率超过 80%"
);

if (result.isSuccess()) {
    System.out.println("发送成功: " + result.getLogId());
} else {
    System.err.println("发送失败: " + result.getError());
}
```

详细文档见 [Java 集成指南](docs/java-integration.md) | [Spring Boot 集成指南](docs/spring-boot-integration.md)

## 🐳 Docker 部署

### 构建和运行

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

### Docker Compose

```bash
cd docker
docker-compose up -d
```

详细文档见 [Docker 部署指南](docs/docker-deployment.md)

## 🔧 配置

### 环境变量

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

# 邮件
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
```

详细配置见 [提供者配置](docs/providers.md)

## 📁 项目结构

```
notify-bridge/
├── src/
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
├── docker/                       # Docker 配置
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env.example                 # 环境变量示例
├── package.json                 # 项目依赖
├── tsconfig.json               # TypeScript 配置
└── README.md                    # 本文档
```

## 🤝 贡献

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

详细指南见 [贡献指南](CONTRIBUTING.md)

## 📄 许可证

MIT License - 见 [LICENSE](LICENSE) 文件

## 📚 文档

- [API 文档](docs/api.md)
- [部署指南](docs/deployment.md)
- [Docker 部署](docs/docker-deployment.md)
- [Java 集成](docs/java-integration.md)
- [Spring Boot 集成](docs/spring-boot-integration.md)
- [提供者配置](docs/providers.md)
- [打包指南](docs/packaging.md)
- [GitHub 指南](docs/github-guide.md)

## 🔧 技术栈

- Node.js 20 + TypeScript 5
- Fastify 5 + Prisma 6 + SQLite
- Zod — 请求参数校验
- @fastify/swagger + @fastify/swagger-ui
- nodemailer — 邮件发送
- axios — HTTP 请求

## 📞 支持

- 提交 Issue: https://github.com/your-username/notify-bridge/issues
- 邮件联系: your.email@example.com
