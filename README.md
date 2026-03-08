# OpenCode Dashboard

一个用于与 [OpenCode](https://opencode.ai) 服务器交互的 Web 控制面板。

## 功能特性

- **实时事件流** - 监控服务器的所有事件
- **会话管理** - 创建和管理多个 AI 编程会话
- **工具日志** - 追踪工具调用和执行状态
- **终端输出** - 查看 Bash 命令的实时输出
- **文件变更** - 监控文件的创建、修改和删除
- **灵活配置** - 支持自定义服务器地址和端口

## 截图

![Dashboard Screenshot 1](images/Screenshot%202026-03-08%20at%2011.06.56.png)

![Dashboard Screenshot 2](images/Screenshot%202026-03-08%20at%2011.07.04.png)

## 技术栈

- React 19
- TypeScript
- Tailwind CSS
- Server-Sent Events (SSE)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

## 配置

在 Settings 页面可以配置：

- 服务器地址（默认：127.0.0.1）
- 服务器端口（默认：4096）
- 自动连接开关

## 项目结构

```
src/
├── components/       # React 组件
│   ├── Header.tsx          # 顶部导航栏
│   ├── Sidebar.tsx         # 侧边栏导航
│   ├── EventStream.tsx    # 事件流显示
│   ├── SessionView.tsx    # 会话视图
│   ├── ToolLog.tsx        # 工具日志
│   ├── TerminalOutput.tsx # 终端输出
│   ├── FileChanges.tsx    # 文件变更
│   └── Settings.tsx       # 设置页面
├── hooks/
│   └── useOpenCodeServer.ts  # OpenCode 服务器交互逻辑
└── lib/
    ├── api.ts          # API 客户端
    └── types.ts        # TypeScript 类型定义
```

## 注意事项

- 本项目需要运行 OpenCode 服务器才能正常使用
- 确保服务器地址和端口配置正确
