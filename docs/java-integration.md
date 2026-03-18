# Java 项目集成指南

## 快速开始（3 步）

### 1. 添加 Maven 依赖

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

### 2. 复制客户端代码

从 `examples/java-client/src/main/java/com/example/notify/` 复制以下文件到你的项目：

- `NotifyClient.java` - 通知客户端
- `SendResult.java` - 发送结果类
- `ExceptionNotifier.java` - 异常监控通知器（可选）

### 3. 使用示例

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

## 完整示例

### 主示例（Main.java）

```java
public class Main {
    public static void main(String[] args) {
        NotifyClient client = new NotifyClient(
            "http://localhost:3000",
            "nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3"
        );

        try {
            // 发送飞书通知
            SendResult result = client.sendFeishu(
                "Java 测试通知",
                "这是来自 Java 客户端的测试消息"
            );
            System.out.println(result);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 异常监控（ExceptionNotifier.java）

ExceptionNotifier 是一个高级工具类，可以自动捕获异常并发送通知，特别适合用于异常监控和性能告警。

```java
public class ExceptionNotifier {
    private final NotifyClient client;

    public ExceptionNotifier(String baseUrl, String apiKey) {
        this.client = new NotifyClient(baseUrl, apiKey);
    }

    /**
     * 发送异常通知（包含堆栈跟踪）
     */
    public void notifyException(Exception e, String context) {
        String title = "系统异常";
        String content = String.format(
            "异常类型: %s\n错误信息: %s\n上下文: %s\n时间: %s",
            e.getClass().getSimpleName(),
            e.getMessage(),
            context,
            java.time.LocalDateTime.now()
        );

        try {
            client.sendFeishu(title, content);
        } catch (Exception ex) {
            System.err.println("发送通知失败: " + ex.getMessage());
        }
    }

    /**
     * 发送业务异常通知
     */
    public void notifyBusinessException(String businessName, String message, String context) {
        String title = "业务异常: " + businessName;
        String content = String.format(
            "业务名称: %s\n错误信息: %s\n上下文: %s\n时间: %s",
            businessName,
            message,
            context,
            java.time.LocalDateTime.now()
        );

        try {
            client.sendFeishu(title, content);
        } catch (Exception e) {
            System.err.println("发送业务异常通知失败: " + e.getMessage());
        }
    }

    /**
     * 发送性能告警
     */
    public void notifyPerformanceAlert(String metric, double value, String threshold) {
        String title = "性能告警: " + metric;
        String content = String.format(
            "指标: %s\n当前值: %.2f\n阈值: %s\n时间: %s",
            metric,
            value,
            threshold,
            java.time.LocalDateTime.now()
        );

        try {
            client.sendFeishu(title, content);
        } catch (Exception e) {
            System.err.println("发送性能告警失败: " + e.getMessage());
        }
    }
}
```

**使用示例：**

```java
ExceptionNotifier notifier = new ExceptionNotifier("http://localhost:3000", "nb_xxx");

try {
    // 业务逻辑
    processOrder(orderId);
} catch (Exception e) {
    // 自动发送异常通知（包含堆栈跟踪）
    notifier.notifyException(e, "处理订单: " + orderId);
}

// 业务异常通知
notifier.notifyBusinessException(
    "用户注册",
    "用户名已存在",
    "用户名: testuser"
);

// 性能告警
notifier.notifyPerformanceAlert(
    "CPU使用率",
    85.5,
    "80%"
);
```

## Spring Boot 集成

### 配置文件

```yaml
# application.yml
notify:
  base-url: http://localhost:3000
  api-key: nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3
```

### 服务类

```java
@Service
public class NotifyService {
    @Value("${notify.base-url:http://localhost:3000}")
    private String baseUrl;

    @Value("${notify.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public NotifyService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public SendResult sendFeishu(String title, String content) {
        Map<String, Object> body = new HashMap<>();
        body.put("channel", "FEISHU");
        body.put("title", title);
        body.put("content", content);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-API-Key", apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
            baseUrl + "/api/v1/notify/send",
            request,
            Map.class
        );

        if (response.getStatusCode() == HttpStatus.ACCEPTED) {
            return new SendResult(true, (String) response.getBody().get("logId"), null);
        }
        return new SendResult(false, null, "HTTP " + response.getStatusCode());
    }
}
```

### 控制器

```java
@RestController
public class NotificationController {
    @Autowired
    private NotifyService notifyService;

    @PostMapping("/alert/cpu")
    public ResponseEntity<String> alertCpu(@RequestParam double usage) {
        if (usage > 80) {
            SendResult result = notifyService.sendFeishu(
                "CPU 告警",
                String.format("服务器 CPU 使用率: %.2f%%", usage)
            );
            return ResponseEntity.ok(result.isSuccess() ? "告警已发送" : "发送失败");
        }
        return ResponseEntity.ok("正常");
    }
}
```

## 通知渠道

| 渠道 | 方法 | 说明 |
|------|------|------|
| 飞书 | `sendFeishu(title, content)` | 发送到飞书机器人 |
| 钉钉 | `sendDingTalk(title, content)` | 发送到钉钉机器人 |
| 企业微信 | `sendWeCom(title, content)` | 发送到企业微信机器人 |
| 邮件 | `sendEmail(email, title, content)` | 发送邮件 |

## 完整示例项目

见 `examples/java-client/` 目录：

```
examples/java-client/
├── src/main/java/com/example/notify/
│   ├── NotifyClient.java      # 通知客户端
│   ├── Main.java              # 主示例
│   └── ExceptionNotifier.java # 异常监控
├── pom.xml                    # Maven 配置
└── README.md                  # 说明文档
```

## 运行示例

```bash
# 进入示例目录
cd examples/java-client

# 编译
mvn clean compile

# 运行主示例
mvn exec:java -Dexec.mainClass="com.example.notify.Main"

# 运行异常监控示例
mvn exec:java -Dexec.mainClass="com.example.notify.ExceptionNotifierExample"
```

## 常见问题

### Q: 中文乱码
A: 客户端已自动处理 UTF-8 编码，确保服务器也使用 UTF-8。

### Q: 连接失败
A: 检查：
1. Notify Bridge 服务是否运行：`curl http://localhost:3000/health`
2. API Key 是否正确
3. 网络连接是否正常

### Q: 发送失败
A: 查看返回的错误信息，或检查 Notify Bridge 服务日志。

## 最佳实践

1. **异步发送**：对于非关键通知，使用异步方式
2. **重试机制**：网络失败时自动重试
3. **降级处理**：服务不可用时记录到本地日志
4. **限流**：避免频繁发送通知
5. **监控**：监控通知发送成功率

## 下一步

1. 查看完整文档：[java-client.md](java-client.md)
2. 查看 API 文档：[api.md](api.md)
3. 查看部署指南：[deployment.md](deployment.md)
