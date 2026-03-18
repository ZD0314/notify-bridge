# Java 客户端使用指南

## 1. 添加依赖

在 `pom.xml` 中添加 HTTP 客户端依赖：

```xml
<dependencies>
    <!-- Apache HttpClient -->
    <dependency>
        <groupId>org.apache.httpcomponents</groupId>
        <artifactId>httpclient</artifactId>
        <version>4.5.14</version>
    </dependency>

    <!-- JSON 处理 -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.15.2</version>
    </dependency>
</dependencies>
```

或者使用 Spring Boot：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

## 2. 创建 Java 客户端

### 2.1 基础 HTTP 客户端

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class NotifyClient {
    private final String baseUrl;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public NotifyClient(String baseUrl, String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * 发送通知
     * @param channel 通知渠道：EMAIL, FEISHU, DINGTALK, WECOM
     * @param title 消息标题（可选）
     * @param content 消息内容
     * @return 发送结果
     */
    public SendResult sendNotification(String channel, String title, String content) throws IOException {
        return sendNotification(channel, null, title, content, null);
    }

    /**
     * 发送通知（完整版）
     * @param channel 通知渠道：EMAIL, FEISHU, DINGTALK, WECOM
     * @param target 目标地址（邮箱或 webhook URL，可选）
     * @param title 消息标题（可选）
     * @param content 消息内容
     * @param extra 额外参数（可选）
     * @return 发送结果
     */
    public SendResult sendNotification(String channel, String target, String title, String content, Map<String, Object> extra) throws IOException {
        Map<String, Object> body = new HashMap<>();
        body.put("channel", channel);
        if (target != null) {
            body.put("target", target);
        }
        if (title != null) {
            body.put("title", title);
        }
        body.put("content", content);
        if (extra != null) {
            body.put("extra", extra);
        }

        String jsonBody = objectMapper.writeValueAsString(body);

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost(baseUrl + "/api/v1/notify/send");
            request.setHeader("Content-Type", "application/json");
            request.setHeader("X-API-Key", apiKey);
            request.setEntity(new StringEntity(jsonBody, "UTF-8"));

            HttpResponse response = httpClient.execute(request);
            String responseBody = EntityUtils.toString(response.getEntity(), "UTF-8");

            if (response.getStatusLine().getStatusCode() == 202) {
                Map<String, Object> result = objectMapper.readValue(responseBody, Map.class);
                return new SendResult(true, (String) result.get("logId"), null);
            } else {
                Map<String, Object> error = objectMapper.readValue(responseBody, Map.class);
                return new SendResult(false, null, (String) error.get("error"));
            }
        }
    }

    /**
     * 查询发送日志
     * @param page 页码
     * @param limit 每页数量
     * @return 日志列表
     */
    public LogResult getLogs(int page, int limit) throws IOException {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            String url = String.format("%s/api/v1/logs?page=%d&limit=%d", baseUrl, page, limit);
            HttpPost request = new HttpPost(url);
            request.setHeader("X-API-Key", apiKey);

            HttpResponse response = httpClient.execute(request);
            String responseBody = EntityUtils.toString(response.getEntity(), "UTF-8");

            if (response.getStatusLine().getStatusCode() == 200) {
                Map<String, Object> result = objectMapper.readValue(responseBody, Map.class);
                return new LogResult(true, result, null);
            } else {
                return new LogResult(false, null, "Failed to get logs");
            }
        }
    }
}

// 结果类
class SendResult {
    private final boolean success;
    private final String logId;
    private final String error;

    public SendResult(boolean success, String logId, String error) {
        this.success = success;
        this.logId = logId;
        this.error = error;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getLogId() {
        return logId;
    }

    public String getError() {
        return error;
    }
}

class LogResult {
    private final boolean success;
    private final Map<String, Object> data;
    private final String error;

    public LogResult(boolean success, Map<String, Object> data, String error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }

    public boolean isSuccess() {
        return success;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public String getError() {
        return error;
    }
}
```

### 2.2 Spring Boot 版本

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

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

    /**
     * 发送飞书通知
     */
    public SendResult sendFeishu(String title, String content) {
        return sendNotification("FEISHU", null, title, content, null);
    }

    /**
     * 发送钉钉通知
     */
    public SendResult sendDingTalk(String title, String content) {
        return sendNotification("DINGTALK", null, title, content, null);
    }

    /**
     * 发送企业微信通知
     */
    public SendResult sendWeCom(String title, String content) {
        return sendNotification("WECOM", null, title, content, null);
    }

    /**
     * 发送邮件
     */
    public SendResult sendEmail(String targetEmail, String title, String content) {
        return sendNotification("EMAIL", targetEmail, title, content, null);
    }

    /**
     * 发送通知（通用方法）
     */
    public SendResult sendNotification(String channel, String target, String title, String content, Map<String, Object> extra) {
        String url = baseUrl + "/api/v1/notify/send";

        Map<String, Object> body = new HashMap<>();
        body.put("channel", channel);
        if (target != null) {
            body.put("target", target);
        }
        if (title != null) {
            body.put("title", title);
        }
        body.put("content", content);
        if (extra != null) {
            body.put("extra", extra);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-API-Key", apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode() == HttpStatus.ACCEPTED) {
                Map<String, Object> result = response.getBody();
                return new SendResult(true, (String) result.get("logId"), null);
            } else {
                return new SendResult(false, null, "HTTP " + response.getStatusCode());
            }
        } catch (Exception e) {
            return new SendResult(false, null, e.getMessage());
        }
    }
}
```

## 3. 使用示例

### 3.1 基础使用

```java
public class Main {
    public static void main(String[] args) {
        // 创建客户端
        NotifyClient client = new NotifyClient(
            "http://localhost:3000",
            "nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3"
        );

        try {
            // 发送飞书通知
            SendResult result = client.sendNotification(
                "FEISHU",
                "系统通知",
                "服务器 CPU 使用率超过 80%"
            );

            if (result.isSuccess()) {
                System.out.println("发送成功，日志ID: " + result.getLogId());
            } else {
                System.out.println("发送失败: " + result.getError());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### 3.2 Spring Boot 使用

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

            if (result.isSuccess()) {
                return ResponseEntity.ok("告警已发送");
            } else {
                return ResponseEntity.status(500).body("发送失败: " + result.getError());
            }
        }
        return ResponseEntity.ok("正常");
    }
}
```

### 3.3 异常监控示例

```java
public class ExceptionNotifier {
    private final NotifyClient client;

    public ExceptionNotifier(String baseUrl, String apiKey) {
        this.client = new NotifyClient(baseUrl, apiKey);
    }

    /**
     * 发送异常通知
     */
    public void notifyException(Exception e, String context) {
        String title = "系统异常";
        String content = String.format(
            "异常类型: %s\n" +
            "错误信息: %s\n" +
            "上下文: %s\n" +
            "时间: %s",
            e.getClass().getSimpleName(),
            e.getMessage(),
            context,
            java.time.LocalDateTime.now()
        );

        try {
            SendResult result = client.sendNotification("FEISHU", title, content);
            if (!result.isSuccess()) {
                // 记录日志或降级处理
                System.err.println("发送异常通知失败: " + result.getError());
            }
        } catch (Exception ex) {
            System.err.println("发送异常通知时发生错误: " + ex.getMessage());
        }
    }
}
```

## 4. 配置文件

### 4.1 application.properties

```properties
# 通知服务配置
notify.base-url=http://localhost:3000
notify.api-key=nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3
```

### 4.2 application.yml

```yaml
notify:
  base-url: http://localhost:3000
  api-key: nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3
```

## 5. 通知渠道说明

| 渠道 | 说明 | 目标参数 |
|------|------|----------|
| `FEISHU` | 飞书机器人 | 可选，不填使用环境变量配置的 webhook |
| `DINGTALK` | 钉钉机器人 | 可选，不填使用环境变量配置的 webhook |
| `WECOM` | 企业微信机器人 | 可选，不填使用环境变量配置的 webhook |
| `EMAIL` | 邮件 | 必填，接收邮箱地址 |

## 6. 完整示例项目

创建一个完整的 Spring Boot 项目：

```bash
# 1. 创建项目
spring init --dependencies=web notify-client-demo

# 2. 添加依赖到 pom.xml
# 见上面的依赖配置

# 3. 创建配置类
@Configuration
public class NotifyConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

# 4. 创建服务类
# 见上面的 NotifyService

# 5. 创建控制器
# 见上面的 NotificationController
```

## 7. 测试

```bash
# 启动 Java 应用
mvn spring-boot:run

# 测试发送通知
curl -X POST http://localhost:8080/alert/cpu?usage=85
```

## 8. 错误处理

```java
try {
    SendResult result = client.sendNotification("FEISHU", "标题", "内容");
    if (result.isSuccess()) {
        // 发送成功
    } else {
        // 发送失败，记录错误
        logger.error("发送失败: {}", result.getError());
    }
} catch (IOException e) {
    // 网络异常
    logger.error("网络异常", e);
}
```

## 9. 最佳实践

1. **异步发送**：对于非关键通知，使用异步方式发送
2. **重试机制**：网络失败时自动重试
3. **降级处理**：通知服务不可用时，记录到本地日志
4. **限流**：避免频繁发送通知
5. **监控**：监控通知发送成功率

## 10. 完整示例代码

见项目中的 `examples/java-client` 目录。
