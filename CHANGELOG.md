# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- 统一通知发送接口 `POST /api/v1/messages/send`
- 发送日志查询 `GET /api/v1/messages/logs`
- API Key 鉴权（`X-API-Key` header）
- 支持渠道：Email、飞书、钉钉、企业微信
- Swagger UI 文档（`/docs`）
- Docker 部署支持
- Vitest 单元测试
- 模板变量替换工具 `interpolate()`
