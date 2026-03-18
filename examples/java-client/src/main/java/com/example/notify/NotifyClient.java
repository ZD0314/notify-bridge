package com.example.notify;

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

/**
 * 通知服务客户端
 * 支持飞书、钉钉、企业微信、邮件等通知渠道
 */
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
     * 发送飞书通知
     */
    public SendResult sendFeishu(String title, String content) throws IOException {
        return sendNotification("FEISHU", null, title, content, null);
    }

    /**
     * 发送钉钉通知
     */
    public SendResult sendDingTalk(String title, String content) throws IOException {
        return sendNotification("DINGTALK", null, title, content, null);
    }

    /**
     * 发送企业微信通知
     */
    public SendResult sendWeCom(String title, String content) throws IOException {
        return sendNotification("WECOM", null, title, content, null);
    }

    /**
     * 发送邮件
     */
    public SendResult sendEmail(String targetEmail, String title, String content) throws IOException {
        return sendNotification("EMAIL", targetEmail, title, content, null);
    }

    /**
     * 发送通知（通用方法）
     *
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
            request.setHeader("Content-Type", "application/json; charset=utf-8");
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
}

/**
 * 发送结果
 */
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

    @Override
    public String toString() {
        if (success) {
            return "SendResult{success=true, logId='" + logId + "'}";
        } else {
            return "SendResult{success=false, error='" + error + "'}";
        }
    }
}
