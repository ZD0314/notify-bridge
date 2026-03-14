# API 使用文档

## 鉴权

所有 `/api/v1/*` 接口均需在请求头中携带 API Key：

```
X-API-Key: nb_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

首次使用需先创建 API Key（见下方接口）。

---

## 接口列表

### 创建 API Key

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

---

### 发送通知

```
POST /api/v1/notify/send
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| channel | string | 是 | `EMAIL` / `FEISHU` / `DINGTALK` / `WECOM` |
| target | string | 否 | 收件人邮箱或 webhook URL，留空使用环境变量默认值 |
| title | string | 否 | 消息标题，最长 200 字符 |
| content | string | 是 | 消息正文，最长 4096 字符 |
| extra | object | 否 | 渠道扩展参数（如 email 的 `html` 字段） |

**飞书示例：**
```bash
curl -X POST http://localhost:3000/api/v1/notify/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nb_xxx" \
  -d '{
    "channel": "FEISHU",
    "title": "告警通知",
    "content": "服务器 CPU 超过 90%"
  }'
```

**Email 示例（含 HTML）：**
```bash
curl -X POST http://localhost:3000/api/v1/notify/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nb_xxx" \
  -d '{
    "channel": "EMAIL",
    "target": "user@example.com",
    "title": "每日报告",
    "content": "纯文本备用内容",
    "extra": { "html": "<h1>每日报告</h1><p>详情见附件</p>" }
  }'
```

响应（202）：
```json
{
  "logId": "clxxxxx",
  "status": "SUCCESS"
}
```

---

### 查询发送日志

```bash
# 列表（支持过滤和分页）
curl "http://localhost:3000/api/v1/logs?channel=FEISHU&status=FAILED&page=1&limit=20" \
  -H "X-API-Key: nb_xxx"

# 单条详情
curl http://localhost:3000/api/v1/logs/clxxxxx \
  -H "X-API-Key: nb_xxx"
```

---

### 其他接口

```bash
# 列出所有 API Key（不含 key 明文）
curl http://localhost:3000/api/v1/apikeys -H "X-API-Key: nb_xxx"

# 禁用 API Key
curl -X DELETE http://localhost:3000/api/v1/apikeys/clxxxxx -H "X-API-Key: nb_xxx"

# 健康检查（无需鉴权）
curl http://localhost:3000/health
```

---

## 错误码

| HTTP 状态码 | 说明 |
|-------------|------|
| 400 | 请求参数校验失败 |
| 401 | 缺少或无效的 API Key |
| 404 | 资源不存在 |
| 500 | 服务内部错误 |

---

## Swagger UI

启动服务后访问 [http://localhost:3000/docs](http://localhost:3000/docs) 查看完整交互式文档。
