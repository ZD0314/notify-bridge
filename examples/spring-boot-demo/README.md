# Spring Boot 集成示例

## 快速开始

### 1. 创建 Spring Boot 项目

```bash
spring init --dependencies=web,actuator notify-spring-demo
```

### 2. 添加依赖

在 `pom.xml` 中添加：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 3. 配置文件

`application.yml`:

```yaml
notify:
  base-url: http://localhost:3000
  api-key: nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3
```

### 4. 创建服务类

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
        return sendNotification("FEISHU", null, title, content, null);
    }

    private SendResult sendNotification(String channel, String target, String title, String content, Map<String, Object> extra) {
        // 实现略...
        return new SendResult(true, "log-id", null);
    }
}
```

### 5. 创建控制器

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

### 6. 运行

```bash
mvn spring-boot:run
```

### 7. 测试

```bash
curl -X POST http://localhost:8080/alert/cpu?usage=85
```

## 完整示例代码

见 `src/main/java/com/example/notify/` 目录。
