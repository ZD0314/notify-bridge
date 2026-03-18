package com.example.notify;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDateTime;

/**
 * 异常监控通知器
 * 自动捕获异常并发送通知
 */
public class ExceptionNotifier {
    private final NotifyClient client;

    public ExceptionNotifier(String baseUrl, String apiKey) {
        this.client = new NotifyClient(baseUrl, apiKey);
    }

    /**
     * 发送异常通知
     *
     * @param e 异常对象
     * @param context 上下文信息
     */
    public void notifyException(Exception e, String context) {
        String title = "系统异常";
        String content = buildExceptionMessage(e, context);

        try {
            SendResult result = client.sendFeishu(title, content);
            if (!result.isSuccess()) {
                System.err.println("发送异常通知失败: " + result.getError());
            }
        } catch (Exception ex) {
            System.err.println("发送异常通知时发生错误: " + ex.getMessage());
        }
    }

    /**
     * 发送业务异常通知
     */
    public void notifyBusinessException(String businessName, String message, String context) {
        String title = "业务异常: " + businessName;
        String content = String.format(
            "业务名称: %s\n" +
            "错误信息: %s\n" +
            "上下文: %s\n" +
            "时间: %s",
            businessName,
            message,
            context,
            LocalDateTime.now()
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
            "指标: %s\n" +
            "当前值: %.2f\n" +
            "阈值: %s\n" +
            "时间: %s",
            metric,
            value,
            threshold,
            LocalDateTime.now()
        );

        try {
            client.sendFeishu(title, content);
        } catch (Exception e) {
            System.err.println("发送性能告警失败: " + e.getMessage());
        }
    }

    /**
     * 构建异常消息
     */
    private String buildExceptionMessage(Exception e, String context) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);

        return String.format(
            "异常类型: %s\n" +
            "错误信息: %s\n" +
            "上下文: %s\n" +
            "堆栈跟踪:\n%s\n" +
            "时间: %s",
            e.getClass().getSimpleName(),
            e.getMessage(),
            context,
            sw.toString(),
            LocalDateTime.now()
        );
    }
}

/**
 * 使用示例
 */
class ExceptionNotifierExample {
    public static void main(String[] args) {
        String baseUrl = "http://localhost:3000";
        String apiKey = "nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3";

        ExceptionNotifier notifier = new ExceptionNotifier(baseUrl, apiKey);

        // 模拟异常
        try {
            int[] arr = new int[5];
            System.out.println(arr[10]); // 会抛出 ArrayIndexOutOfBoundsException
        } catch (Exception e) {
            notifier.notifyException(e, "数组访问测试");
        }

        // 业务异常
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
    }
}
