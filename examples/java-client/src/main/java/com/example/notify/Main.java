package com.example.notify;

/**
 * Java 客户端使用示例
 */
public class Main {
    public static void main(String[] args) {
        // 配置通知服务
        String baseUrl = "http://localhost:3000";
        String apiKey = "nb_dcabda0c4bb01e44f1ba0b15cd7bfef3a3d7d58b75078bb3";

        // 创建客户端
        NotifyClient client = new NotifyClient(baseUrl, apiKey);

        try {
            System.out.println("=== 测试飞书通知 ===");

            // 发送飞书通知
            SendResult result = client.sendFeishu(
                "Java 测试通知",
                "这是来自 Java 客户端的测试消息\n" +
                "时间: " + new java.util.Date() + "\n" +
                "应用: MyJavaApp"
            );

            System.out.println(result);

            // 发送钉钉通知
            System.out.println("\n=== 测试钉钉通知 ===");
            SendResult dingResult = client.sendDingTalk(
                "钉钉测试",
                "这是钉钉通知测试"
            );
            System.out.println(dingResult);

            // 发送企业微信通知
            System.out.println("\n=== 测试企业微信通知 ===");
            SendResult wecomResult = client.sendWeCom(
                "企业微信测试",
                "这是企业微信通知测试"
            );
            System.out.println(wecomResult);

            // 发送邮件
            System.out.println("\n=== 测试邮件通知 ===");
            SendResult emailResult = client.sendEmail(
                "test@example.com",
                "邮件测试",
                "这是一封测试邮件"
            );
            System.out.println(emailResult);

        } catch (Exception e) {
            System.err.println("发送通知时发生错误: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
