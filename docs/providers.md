# 渠道配置文档

## 飞书（Feishu）

### 创建机器人

1. 打开飞书群聊 → 设置 → 群机器人 → 添加机器人
2. 选择「自定义机器人」
3. 复制 Webhook 地址

### 配置

```env
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 发送示例

```bash
curl -X POST http://localhost:3000/api/v1/notify/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nb_xxx" \
  -d '{
    "channel": "FEISHU",
    "title": "部署通知",
    "content": "v1.2.0 已成功部署到生产环境"
  }'
```

> `target` 留空使用 `FEISHU_WEBHOOK_URL`，也可每次请求指定不同 webhook。

---

## 钉钉（DingTalk）

### 创建机器人

1. 打开钉钉群 → 群设置 → 智能群助手 → 添加机器人
2. 选择「自定义」
3. 安全设置选择「加签」，复制密钥
4. 复制 Webhook 地址

### 配置

```env
DINGTALK_WEBHOOK_URL=https://oapi.dingtalk.com/robot/send?access_token=xxxxxxxx
DINGTALK_SECRET=SECxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> `DINGTALK_SECRET` 为可选项，不填则不启用加签模式。

### 发送示例

```bash
curl -X POST http://localhost:3000/api/v1/notify/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nb_xxx" \
  -d '{
    "channel": "DINGTALK",
    "title": "告警",
    "content": "数据库连接池耗尽，请立即处理"
  }'
```

---

## 企业微信（WeCom）

### 创建机器人

1. 打开企业微信群 → 右键群名 → 添加群机器人
2. 新建机器人，复制 Webhook 地址

### 配置

```env
WECOM_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 发送示例

```bash
curl -X POST http://localhost:3000/api/v1/notify/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nb_xxx" \
  -d '{
    "channel": "WECOM",
    "title": "每日报告",
    "content": "今日订单量：1,234\n成功率：99.8%"
  }'
```

---

## Email（SMTP）

### 常用 SMTP 配置

**Gmail：**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password  # 需开启两步验证并生成应用密码
```

**企业邮箱（腾讯）：**
```env
SMTP_HOST=smtp.exmail.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@company.com
SMTP_PASS=your-password
```

### 发送示例

```bash
curl -X POST http://localhost:3000/api/v1/notify/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: nb_xxx" \
  -d '{
    "channel": "EMAIL",
    "target": "recipient@example.com",
    "title": "系统通知",
    "content": "您的账户已成功激活"
  }'
```

> `target` 为收件人邮箱地址，email 渠道必填。
