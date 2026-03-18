# GitHub 上传与分享指南

## 1. 准备工作

### 1.1 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: `notify-bridge`
   - Description: 轻量级通知聚合服务
   - 选择 Public 或 Private
   - 勾选 "Add a README file"
4. 点击 "Create repository"

### 1.2 配置 Git

```bash
# 设置用户名
git config --global user.name "Your Name"

# 设置邮箱
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
```

## 2. 初始化本地仓库

### 2.1 如果已有项目

```bash
# 进入项目目录
cd d:\zm\tip\notify-bridge

# 初始化 Git
git init

# 添加远程仓库
git remote add origin https://github.com/your-username/notify-bridge.git
```

### 2.2 创建 .gitignore

创建 `.gitignore` 文件：

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# Database
data/
*.db
*.db-journal

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Logs
logs/
*.log

# Temporary files
tmp/
temp/

# Coverage
coverage/

# Production
production/
```

### 2.3 提交代码

```bash
# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Notify Bridge notification service"

# 推送到 GitHub
git push -u origin main
```

## 3. 项目结构优化

### 3.1 创建完整的项目结构

```
notify-bridge/
├── .github/                    # GitHub 配置
│   └── workflows/
│       └── ci.yml             # CI/CD 配置
├── .vscode/                   # VS Code 配置
│   └── settings.json
├── docs/                      # 文档
│   ├── api.md
│   ├── deployment.md
│   ├── docker-deployment.md
│   ├── github-guide.md
│   ├── java-integration.md
│   ├── packaging.md
│   └── providers.md
├── examples/                  # 示例代码
│   ├── java-client/
│   └── spring-boot-demo/
├── src/                       # 源代码
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── plugins/
│   ├── providers/
│   └── modules/
├── prisma/                    # 数据库
│   ├── schema.prisma
│   └── migrations/
├── scripts/                   # 脚本
│   ├── setup.sh
│   └── deploy.sh
├── .env.example              # 环境变量示例
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

### 3.2 创建 README.md

```markdown
# Notify Bridge

轻量级通知聚合服务，支持飞书、钉钉、企业微信、邮件等多渠道通知。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-blue.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-%3E%3D20-blue.svg)](https://www.docker.com/)

## ✨ 特性

- ✅ **多渠道支持**：飞书、钉钉、企业微信、邮件
- ✅ **API Key 认证**：安全的 API 访问控制
- ✅ **发送日志记录**：完整的发送历史记录
- ✅ **RESTful API**：标准的 HTTP API 接口
- ✅ **Swagger 文档**：自动生成 API 文档
- ✅ **Docker 部署**：支持容器化部署
- ✅ **轻量级**：基于 Node.js + SQLite，资源占用低

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- SQLite（默认）或其他支持的数据库

### 安装运行

```bash
# 克隆仓库
git clone https://github.com/your-username/notify-bridge.git
cd notify-bridge

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加 Webhook URL

# 初始化数据库
npx prisma migrate dev --name init

# 运行开发服务器
npm run dev
```

### Docker 部署

```bash
# 构建镜像
docker build -t notify-bridge:latest .

# 运行容器
docker run -d \
  --name notify-bridge \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -v $(pwd)/data:/app/data \
  notify-bridge:latest
```

## 📖 API 文档

访问 `http://localhost:3000/docs` 查看 Swagger 文档。

### 发送通知

```bash
curl -X POST http://localhost:3000/api/v1/notify/send \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "FEISHU",
    "title": "测试标题",
    "content": "测试内容"
  }'
```

### 创建 API Key

```bash
curl -X POST http://localhost:3000/api/v1/apikeys \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"name":"my-app"}'
```

## 📦 客户端 SDK

### Java

```java
NotifyClient client = new NotifyClient(
    "http://localhost:3000",
    "your-api-key"
);

SendResult result = client.sendFeishu("标题", "内容");
```

见 `examples/java-client/`

### Python

```python
from notify_client import NotifyClient

client = NotifyClient("http://localhost:3000", "your-api-key")
result = client.send_feishu("标题", "内容")
```

### Node.js

```javascript
const { NotifyClient } = require('notify-bridge-client');

const client = new NotifyClient('http://localhost:3000', 'your-api-key');
await client.sendFeishu('标题', '内容');
```

## 📚 文档

- [API 文档](docs/api.md)
- [部署指南](docs/deployment.md)
- [Docker 部署](docs/docker-deployment.md)
- [Java 集成](docs/java-integration.md)
- [提供者配置](docs/providers.md)
- [打包指南](docs/packaging.md)
- [GitHub 指南](docs/github-guide.md)

## 🔧 配置

### 环境变量

```bash
# 服务器配置
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# 数据库
DATABASE_URL=file:./data/notify-bridge.db

# 飞书
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxx

# 钉钉
DINGTALK_WEBHOOK_URL=https://oapi.dingtalk.com/robot/send?access_token=xxx
DINGTALK_SECRET=your-secret

# 企业微信
WECOM_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx

# 邮件
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
```

## 🐳 Docker

### 构建和运行

```bash
# 构建镜像
docker build -t notify-bridge:latest .

# 运行容器
docker run -d \
  --name notify-bridge \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -v $(pwd)/data:/app/data \
  notify-bridge:latest
```

### Docker Compose

```bash
docker-compose up -d
```

## 🤝 贡献

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Fastify](https://www.fastify.io/) - Web 框架
- [Prisma](https://www.prisma.io/) - ORM
- [SQLite](https://www.sqlite.org/) - 数据库

## 📞 支持

- 提交 Issue: https://github.com/your-username/notify-bridge/issues
- 邮件联系: your.email@example.com
```

## 4. GitHub Actions CI/CD

### 4.1 创建 CI 配置

创建 `.github/workflows/ci.yml`：

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test

    - name: Build
      run: npm run build

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      if: matrix.node-version == '18.x'
```

### 4.2 创建 Release 配置

创建 `.github/workflows/release.yml`：

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        registry-url: 'https://registry.npmjs.org'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Create Release
      uses: softprops/action-gh-release@v1
      with:
        files: |
          dist/
          package.json
        generate_release_notes: true
```

## 5. 发布版本

### 5.1 创建版本标签

```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签
git push origin v1.0.0
```

### 5.2 创建 GitHub Release

**方式 1：使用 GitHub Web**

1. 访问 GitHub 仓库
2. 点击 "Releases"
3. 点击 "Draft a new release"
4. 选择标签 `v1.0.0`
5. 填写标题和描述
6. 上传构建产物（可选）
7. 点击 "Publish release"

**方式 2：使用 GitHub CLI**

```bash
# 安装 GitHub CLI
# https://cli.github.com/

# 登录
gh auth login

# 创建 Release
gh release create v1.0.0 \
  --title "Notify Bridge v1.0.0" \
  --notes-file RELEASE_NOTES.md \
  --draft
```

### 5.3 Release 说明模板

创建 `RELEASE_NOTES.md`：

```markdown
# Notify Bridge v1.0.0

## ✨ 新特性

- 支持飞书通知
- 支持钉钉通知
- 支持企业微信通知
- 支持邮件通知
- API Key 认证
- 发送日志记录

## 🐛 修复

- 修复中文编码问题
- 修复数据库连接问题

## 📝 文档

- 添加 API 文档
- 添加部署指南
- 添加 Docker 部署文档

## 🔧 其他

- 升级依赖包
- 优化性能
```

## 6. 分支管理

### 6.1 分支策略

```
main        # 生产环境分支
develop     # 开发环境分支
feature/*   # 功能分支
hotfix/*    # 紧急修复分支
```

### 6.2 创建功能分支

```bash
# 创建功能分支
git checkout -b feature/add-email-support

# 开发完成，提交代码
git add .
git commit -m "Add email support"

# 推送到远程
git push origin feature/add-email-support

# 创建 Pull Request
# 在 GitHub 上创建 PR，合并到 develop 分支
```

### 6.3 合并到主分支

```bash
# 切换到 develop 分支
git checkout develop

# 拉取最新代码
git pull origin develop

# 合并功能分支
git merge feature/add-email-support

# 推送到远程
git push origin develop

# 创建 Release
git checkout main
git merge develop
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main --tags
```

## 7. 贡献指南

### 7.1 创建 CONTRIBUTING.md

```markdown
# 贡献指南

感谢您对 Notify Bridge 的贡献！

## 如何贡献

### 1. 报告 Bug

1. 检查是否已有相同的 Issue
2. 创建新的 Issue
3. 描述问题：
   - 问题描述
   - 复现步骤
   - 预期行为
   - 实际行为
   - 环境信息

### 2. 请求新功能

1. 检查是否已有相同的 Feature Request
2. 创建新的 Issue
3. 描述功能：
   - 功能描述
   - 使用场景
   - 预期行为

### 3. 提交代码

1. Fork 仓库
2. 创建特性分支
3. 提交代码
4. 创建 Pull Request

### Pull Request 规范

- 标题格式：`[类型] 简短描述`
- 类型：`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- 描述更改内容
- 关联 Issue（如果有）

### 代码规范

- 遵循 TypeScript 最佳实践
- 添加必要的注释
- 编写测试用例
- 更新文档

### 提交信息规范

```
类型(范围): 简短描述

详细描述（可选）

BREAKING CHANGE: 重大变更描述（可选）
```

示例：
```
feat(notify): 添加邮件通知支持

支持通过 SMTP 发送邮件通知
- 添加邮件提供者
- 添加 SMTP 配置
- 更新文档
```

## 开发环境

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

### 运行测试

```bash
npm test
```

### 构建项目

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 许可证

本项目采用 MIT 许可证。
```

### 7.2 创建 Issue 模板

创建 `.github/ISSUE_TEMPLATE/` 目录：

**bug_report.md**
```markdown
---
name: Bug 报告
about: 创建一个报告来帮助我们改进
title: '[BUG] '
labels: bug
assignees: ''
---

**描述**
清晰地描述问题

**复现步骤**
1. ...
2. ...
3. ...

**预期行为**
描述预期的行为

**实际行为**
描述实际的行为

**环境信息**
- OS: [例如 Windows 10]
- Node.js 版本: [例如 18.0.0]
- 项目版本: [例如 v1.0.0]

**附加信息**
任何其他相关的上下文
```

**feature_request.md**
```markdown
---
name: 功能请求
about: 为项目提出新功能建议
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**描述**
清晰地描述功能

**使用场景**
描述使用场景

**替代方案**
描述你考虑过的替代方案

**附加信息**
任何其他相关的上下文
```

## 8. 社交媒体分享

### 8.1 创建分享内容

```
🚀 Notify Bridge - 轻量级通知聚合服务

支持飞书、钉钉、企业微信、邮件等多渠道通知

✨ 特性：
- 多渠道支持
- API Key 认证
- 发送日志记录
- RESTful API
- Docker 部署

🔗 GitHub: https://github.com/your-username/notify-bridge

#NodeJS #Docker #通知服务 #开源项目
```

### 8.2 分享平台

- Twitter
- LinkedIn
- Reddit (r/programming, r/node)
- Hacker News
- 掘金
- 知乎
- V2EX

## 9. 监控和维护

### 9.1 GitHub Insights

- Star 数量
- Fork 数量
- Issue 数量
- PR 数量
- 下载量

### 9.2 定期维护

1. 更新依赖包
2. 修复安全漏洞
3. 回复 Issue 和 PR
4. 更新文档
5. 发布新版本

## 10. 总结

### 10.1 完成清单

- [x] 创建 GitHub 仓库
- [x] 初始化本地仓库
- [x] 创建 .gitignore
- [x] 创建 README.md
- [x] 创建文档目录
- [x] 创建 CI/CD 配置
- [x] 创建 Release 配置
- [x] 发布第一个版本
- [x] 创建贡献指南
- [x] 创建 Issue 模板

### 10.2 下一步

1. 邀请贡献者
2. 收集反馈
3. 持续改进
4. 社区建设

### 10.3 资源

- GitHub 文档: https://docs.github.com/
- GitHub Actions: https://docs.github.com/actions
- GitHub Releases: https://docs.github.com/repositories/releasing-projects-on-github
```

## 11. 快速命令参考

### 11.1 Git 命令

```bash
# 初始化
git init
git remote add origin https://github.com/your-username/notify-bridge.git

# 提交代码
git add .
git commit -m "Initial commit"
git push -u origin main

# 创建分支
git checkout -b feature/new-feature

# 合并分支
git checkout main
git merge feature/new-feature

# 创建标签
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 11.2 GitHub CLI 命令

```bash
# 登录
gh auth login

# 创建 Issue
gh issue create --title "Bug" --body "Description"

# 创建 PR
gh pr create --title "Feature" --body "Description"

# 创建 Release
gh release create v1.0.0 --title "v1.0.0" --notes "Release notes"
```

## 12. 常见问题

### Q: 如何删除敏感信息？

A: 使用 `git filter-branch` 或 BFG Repo-Cleaner：

```bash
# 使用 BFG
java -jar bfg.jar --delete-files .env
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Q: 如何更改仓库名称？

A: 在 GitHub 设置中更改，然后更新本地 remote：

```bash
git remote set-url origin https://github.com/your-username/new-name.git
```

### Q: 如何转移仓库？

A: 在 GitHub 设置中使用 "Transfer repository" 功能。

### Q: 如何归档仓库？

A: 在 GitHub 设置中勾选 "Archive this repository"。
