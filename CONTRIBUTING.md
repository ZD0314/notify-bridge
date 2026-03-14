# Contributing to notify-bridge

感谢你对本项目的兴趣！以下是参与贡献的指南。

## 开发环境

```bash
git clone https://github.com/your-org/notify-bridge.git
cd notify-bridge
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: 添加新渠道支持
fix: 修复飞书签名错误
docs: 更新 API 文档
test: 添加 provider 单元测试
refactor: 重构 registry 模块
```

## 添加新渠道

1. 在 `src/providers/` 新建 `xxx.provider.ts`，继承 `BaseProvider`
2. 实现 `send()` 方法
3. 在 `src/providers/registry.ts` 注册
4. 在 `prisma/schema.prisma` 的 `Channel` enum 添加新值
5. 执行 `npx prisma migrate dev --name add-xxx-channel`
6. 在 `src/config/index.ts` 添加对应环境变量
7. 在 `.env.example` 补充示例配置
8. 在 `docs/providers.md` 补充配置说明

## 运行测试

```bash
npm test
```

## Pull Request

- 确保测试通过
- 新功能需附带测试
- 更新相关文档
