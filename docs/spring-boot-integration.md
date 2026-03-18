# Spring Boot 集成指南

最简单、最方便的 Spring Boot 集成方式。

## 1. 添加依赖

在 `pom.xml` 中添加：

```xml
<dependencies>
    <!-- Notify Bridge 客户端 -->
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

## 2. 复制客户端代码

将以下两个文件复制到你的项目中：

- `examples/java-client/src/main/java/com/example/notify/NotifyClient.java`
- `examples/java-client/src/main/java/com/example/notify/SendResult.java`

## 3. 配置文件

在 `application.yml` 或 `application.properties` 中添加配置：

```yaml
# application.yml
notify:
  bridge:
    base-url: http://localhost:3000
    api-key: nb_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

或

```properties
# application.properties
notify.bridge.base-url=http://localhost:3000
notify.bridge.api-key=nb_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 4. 创建配置类

```java
package com.example.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.example.notify.NotifyClient;

@Configuration
public class NotifyConfig {

    @Value("${notify.bridge.base-url}")
    private String baseUrl;

    @Value("${notify.bridge.api-key}")
    private String apiKey;

    @Bean
    public NotifyClient notifyClient() {
        return new NotifyClient(baseUrl, apiKey);
    }
}
```

## 5. 在 Service 中使用

```java
package com.example.service;

import com.example.notify.NotifyClient;
import com.example.notify.SendResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private NotifyClient notifyClient;

    public void processOrder(String orderId) {
        try {
            // 业务逻辑
            // ...

            // 发送成功通知
            SendResult result = notifyClient.sendFeishu(
                "订单处理成功",
                "订单号: " + orderId + "\n状态: 已处理"
            );

            if (!result.isSuccess()) {
                System.err.println("通知发送失败: " + result.getError());
            }
        } catch (Exception e) {
            // 发送异常通知
            notifyClient.sendFeishu(
                "订单处理异常",
                "订单号: " + orderId + "\n错误: " + e.getMessage()
            );
        }
    }
}
```

## 6. 全局异常处理（推荐）

创建全局异常处理器，自动发送异常通知：

```java
package com.example.exception;

import com.example.notify.NotifyClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private NotifyClient notifyClient;

    @ExceptionHandler(Exception.class)
    public ErrorResponse handleException(Exception e, WebRequest request) {
        // 发送异常通知到飞书
        String content = String.format(
            "异常类型: %s\n" +
            "错误信息: %s\n" +
            "请求路径: %s\n" +
            "时间: %s",
            e.getClass().getSimpleName(),
            e.getMessage(),
            request.getDescription(false).replace("uri=", ""),
            java.time.LocalDateTime.now()
        );

        try {
            notifyClient.sendFeishu("系统异常", content);
        } catch (Exception ex) {
            System.err.println("发送异常通知失败: " + ex.getMessage());
        }

        return new ErrorResponse("系统异常，请稍后重试");
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
```

## 7. 完整使用示例

```java
package com.example.controller;

import com.example.notify.NotifyClient;
import com.example.notify.SendResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private NotifyClient notifyClient;

    @PostMapping
    public String createOrder(@RequestBody OrderRequest request) {
        // 创建订单逻辑...

        // 发送通知
        SendResult result = notifyClient.sendFeishu(
            "新订单创建",
            String.format("订单号: %s\n金额: %.2f\n客户: %s",
                request.getOrderNo(),
                request.getAmount(),
                request.getCustomerName())
        );

        return result.isSuccess() ? "订单创建成功" : "订单创建成功，但通知发送失败";
    }
}
```

## 8. 多环境配置

不同环境使用不同的配置：

```yaml
# application-dev.yml
notify:
  bridge:
    base-url: http://localhost:3000
    api-key: nb_dev_xxxx

# application-prod.yml
notify:
  bridge:
    base-url: http://notify-bridge.example.com
    api-key: nb_prod_xxxx
```

## 9. 通知渠道示例

### 飞书通知
```java
notifyClient.sendFeishu("标题", "内容");
```

### 钉钉通知
```java
notifyClient.sendDingTalk("标题", "内容");
```

### 企业微信通知
```java
notifyClient.sendWeCom("标题", "内容");
```

### 邮件通知
```java
notifyClient.sendEmail("user@example.com", "标题", "内容");
```

## 10. 最佳实践

1. **配置管理**：将 API Key 放在配置文件中，不要硬编码
2. **异常处理**：使用 `@RestControllerAdvice` 全局处理异常
3. **异步发送**：对于非关键通知，可以使用 `@Async` 异步发送
4. **重试机制**：重要通知可以添加重试逻辑
5. **日志记录**：记录通知发送结果，便于排查问题

## 11. 完整示例项目

参考 `examples/spring-boot-demo/` 目录中的完整示例。

## 12. 常见问题

**Q: 如何异步发送通知？**

A: 使用 `@Async` 注解：

```java
@Async
public void sendNotificationAsync(String title, String content) {
    notifyClient.sendFeishu(title, content);
}
```

**Q: 如何批量发送通知？**

A: 使用循环或并行流：

```java
List<String> recipients = Arrays.asList("user1@example.com", "user2@example.com");
recipients.forEach(email ->
    notifyClient.sendEmail(email, "批量通知", "内容")
);
```

**Q: 如何测试通知功能？**

A: 使用测试环境配置，或创建 Mock 客户端进行单元测试。
