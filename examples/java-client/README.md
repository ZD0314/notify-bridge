# Notify Bridge Java Client

Java 客户端用于调用 Notify Bridge 通知服务。

## 快速开始

### 1. 编译项目

```bash
mvn clean compile
```

### 2. 运行示例

```bash
# 运行主示例
mvn exec:java -Dexec.mainClass="com.example.notify.Main"

# 运行异常监控示例
mvn exec:java -Dexec.mainClass="com.example.notify.ExceptionNotifierExample"
```

### 3. 打包

```bash
mvn clean package
```

## 使用方法

### 基础使用

```java
import com.example.notify.NotifyClient;
import com.example.notify.SendResult;

public class Example {
    public static void main(String[] args) {
        // 创建客户端
        NotifyClient client = new NotifyClient(
            "http://localhost:3000",
            "nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3"
        );

        try {
            // 发送飞书通知
            SendResult result = client.sendFeishu(
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

### 支持的渠道

- **飞书 (FEISHU)**: `client.sendFeishu(title, content)`
- **钉钉 (DINGTALK)**: `client.sendDingTalk(title, content)`
- **企业微信 (WECOM)**: `client.sendWeCom(title, content)`
- **邮件 (EMAIL)**: `client.sendEmail(targetEmail, title, content)`

### 异常监控

```java
ExceptionNotifier notifier = new ExceptionNotifier(baseUrl, apiKey);

// 捕获异常并发送通知
try {
    // 业务逻辑
} catch (Exception e) {
    notifier.notifyException(e, "用户注册模块");
}
```

## 配置

修改 `Main.java` 中的配置：

```java
String baseUrl = "http://localhost:3000";
String apiKey = "nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3";
```

## 项目结构

```
java-client/
├── src/main/java/com/example/notify/
│   ├── NotifyClient.java      # 通知客户端
│   ├── Main.java              # 主示例
│   └── ExceptionNotifier.java # 异常监控
├── pom.xml                    # Maven 配置
└── README.md                  # 说明文档
```

## 依赖说明

- **Apache HttpClient**: HTTP 客户端
- **Jackson**: JSON 序列化/反序列化
- **SLF4J**: 日志框架（可选）

## 常见问题

### Q: 中文乱码
A: 确保使用 UTF-8 编码，客户端已自动处理。

### Q: 连接失败
A: 检查 Notify Bridge 服务是否运行，URL 和 API Key 是否正确。

### Q: 发送失败
A: 检查日志获取错误信息，或查看 Notify Bridge 服务日志。

## 更多示例

见 `Main.java` 和 `ExceptionNotifier.java` 中的完整示例。
