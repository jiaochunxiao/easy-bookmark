# 📚 便捷书签管理器 | Smart Bookmark Manager

<div align="center">

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?style=for-the-badge&logo=google-chrome)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss)

一个现代化的Chrome扩展，为您提供优雅的书签管理体验

*A modern Chrome extension that provides an elegant bookmark management experience*

[功能特性](#-功能特性) • [技术栈](#-技术栈) • [安装使用](#-安装使用) • [开发指南](#-开发指南)

</div>

---

## 🌟 功能特性 | Features

### 📁 智能文件夹管理 | Smart Folder Management
- **📋 文件夹预览**: 每个文件夹显示前5个书签的预览 | *Folder preview with first 5 bookmarks*
- **🔍 详情查看**: 点击"查看全部"可查看文件夹内所有书签 | *View all bookmarks in folder details*
- **✏️ 编辑操作**: 支持对文件夹内书签的编辑和删除 | *Edit and delete bookmarks within folders*

### ⭐ 未归纳书签管理 | Uncategorized Bookmark Management
- **🤖 智能识别**: 自动识别未分类到任何文件夹的书签 | *Automatically detect uncategorized bookmarks*
- **📂 虚拟文件夹**: 将未归纳书签作为特殊虚拟文件夹显示 | *Display uncategorized bookmarks as virtual folder*
- **🏷️ 特殊标识**: 独特的图标和描述，便于识别 | *Unique icons and descriptions for easy identification*
- **🔧 完整功能**: 支持查看、编辑、删除未归纳书签 | *Full functionality for viewing, editing, and deleting*

### 🔍 智能搜索功能 | Smart Search
- **📁 文件夹搜索**: 支持按文件夹名称搜索 | *Search by folder names*
- **🔖 书签搜索**: 支持搜索文件夹内书签标题 | *Search bookmark titles within folders*
- **⚡ 实时过滤**: 输入关键词即时显示匹配结果 | *Real-time filtering with instant results*

### 🎨 主题和背景定制 | Theme & Background Customization
- **🌈 多主题选择**: 提供多种颜色主题 | *Multiple color themes available*
- **🖼️ 随机背景**: 支持随机背景图片功能 | *Random background image support*
- **🔄 背景切换**: 可在纯色主题和随机背景间切换 | *Switch between solid themes and random backgrounds*

### 📝 书签操作 | Bookmark Operations
- **✏️ 编辑书签**: 修改书签标题和URL | *Edit bookmark titles and URLs*
- **🗑️ 删除书签**: 删除不需要的书签，带确认机制 | *Delete bookmarks with confirmation*
- **💬 操作反馈**: 所有操作都有成功/失败的消息提示 | *Success/error feedback for all operations*

---

## 🛠️ 技术栈 | Tech Stack

### 前端框架 | Frontend Framework
- **⚛️ React 18**: 现代化的用户界面库 | *Modern UI library*
- **📘 TypeScript**: 类型安全的JavaScript超集 | *Type-safe JavaScript superset*
- **🎣 React Hooks**: 现代React开发模式 | *Modern React development patterns*

### 样式和UI | Styling & UI
- **🎨 TailwindCSS**: 实用优先的CSS框架 | *Utility-first CSS framework*
- **📱 响应式设计**: 适配不同屏幕尺寸 | *Responsive design for all screen sizes*
- **✨ 动画效果**: 流畅的交互动画 | *Smooth interaction animations*

### 扩展开发 | Extension Development
- **🔌 Plasmo Framework**: 现代化的浏览器扩展开发框架 | *Modern browser extension framework*
- **🌐 Chrome Extension API**: 原生Chrome扩展API集成 | *Native Chrome extension API integration*
- **📦 Manifest V3**: 最新的扩展清单版本 | *Latest extension manifest version*

### 开发工具 | Development Tools
- **📦 Yarn**: 包管理器 | *Package manager*
- **🔧 PostCSS**: CSS后处理器 | *CSS post-processor*
- **🎯 ESLint**: 代码质量检查 | *Code quality linting*

---

## 🚀 安装使用 | Installation & Usage

### 开发环境安装 | Development Setup

1. **克隆项目 | Clone Repository**
   ```bash
   git clone https://github.com/your-username/smart-bookmark-manager.git
   cd smart-bookmark-manager
   ```

2. **安装依赖 | Install Dependencies**
   ```bash
   yarn install
   ```

3. **启动开发服务器 | Start Development Server**
   ```bash
   yarn dev
   ```

4. **加载扩展 | Load Extension**
   - 打开Chrome浏览器，访问 `chrome://extensions/` | *Open Chrome and go to `chrome://extensions/`*
   - 启用"开发者模式" | *Enable "Developer mode"*
   - 点击"加载已解压的扩展程序" | *Click "Load unpacked"*
   - 选择项目中的 `build/chrome-mv3-dev` 文件夹 | *Select the `build/chrome-mv3-dev` folder*

### 生产构建 | Production Build

```bash
yarn build
```

构建完成后，在 `build/chrome-mv3-prod` 文件夹中找到生产版本 | *Find the production build in `build/chrome-mv3-prod` folder*

---

## 📖 开发指南 | Development Guide

### 项目结构 | Project Structure

```
├── components/                 # React组件 | React Components
│   ├── FolderCard.tsx         # 文件夹卡片组件 | Folder card component
│   ├── FolderDetailModal.tsx  # 文件夹详情模态框 | Folder detail modal
│   ├── EditBookmarkModal.tsx  # 编辑书签模态框 | Edit bookmark modal
│   ├── DeleteConfirmModal.tsx # 删除确认模态框 | Delete confirmation modal
│   ├── ActionMessage.tsx      # 操作消息组件 | Action message component
│   ├── BookmarkItem.tsx       # 书签项组件 | Bookmark item component
│   └── ThemeSelector.tsx      # 主题选择器 | Theme selector
├── hooks/                     # 自定义Hooks | Custom Hooks
│   ├── useBookmarks.ts        # 书签数据管理 | Bookmark data management
│   └── useBackground.ts       # 背景管理 | Background management
├── utils/                     # 工具函数 | Utility Functions
│   └── index.ts              # 通用工具函数 | Common utilities
├── config/                    # 配置文件 | Configuration
│   └── themes.ts             # 主题配置 | Theme configuration
├── types/                     # 类型定义 | Type Definitions
│   └── index.ts              # TypeScript类型 | TypeScript types
├── newtab.tsx                # 主页面组件 | Main page component
├── style.css                 # 全局样式 | Global styles
└── manifest.json             # 扩展清单 | Extension manifest
```

### 核心功能实现 | Core Implementation

#### 未归纳书签提取 | Uncategorized Bookmark Extraction
```typescript
export const extractUncategorizedBookmarks = (node: BookmarkTreeNode): BookmarkTreeNode[] => {
  const uncategorized: BookmarkTreeNode[] = []
  
  const traverse = (currentNode: BookmarkTreeNode) => {
    if (currentNode.children) {
      currentNode.children.forEach(child => {
        if (child.url) {
          // 这是一个书签，添加到未归纳列表
          uncategorized.push({
            ...child,
            parentId: currentNode.id
          })
        } else if (child.children) {
          // 这是一个文件夹，递归遍历
          traverse(child)
        }
      })
    }
  }
  
  traverse(node)
  return uncategorized
}
```

#### 虚拟文件夹创建 | Virtual Folder Creation
```typescript
export const UNCATEGORIZED_FOLDER_ID = 'uncategorized-bookmarks'

const createUncategorizedFolder = (uncategorizedBookmarks: BookmarkTreeNode[]): BookmarkTreeNode => ({
  id: UNCATEGORIZED_FOLDER_ID,
  title: '未归类书签',
  children: uncategorizedBookmarks,
  parentId: 'virtual',
  dateAdded: Date.now(),
  dateGroupModified: Date.now()
})
```

### 开发命令 | Development Commands

```bash
# 开发模式 | Development mode
yarn dev

# 生产构建 | Production build
yarn build

# 类型检查 | Type checking
yarn type-check

# 代码格式化 | Code formatting
yarn format
```

---

## 🎯 使用说明 | Usage Instructions

### 查看书签 | Viewing Bookmarks
1. 安装扩展后，打开新标签页 | *After installation, open a new tab*
2. 所有书签文件夹将以卡片形式显示 | *All bookmark folders will be displayed as cards*
3. 未归纳的书签会显示为特殊的虚拟文件夹 | *Uncategorized bookmarks appear as a special virtual folder*

### 管理书签 | Managing Bookmarks
1. **查看详情**: 点击文件夹的"查看全部"按钮 | *View details: Click "View All" button*
2. **编辑书签**: 在详情页面点击编辑按钮 | *Edit bookmark: Click edit button in details*
3. **删除书签**: 点击删除按钮并确认 | *Delete bookmark: Click delete button and confirm*

### 搜索功能 | Search Functionality
1. 在搜索框中输入关键词 | *Enter keywords in the search box*
2. 系统会同时搜索文件夹名称和书签标题 | *System searches both folder names and bookmark titles*
3. 实时显示匹配结果 | *Real-time display of matching results*

### 主题定制 | Theme Customization
1. 点击右上角的设置按钮 | *Click the settings button in the top right*
2. 选择喜欢的颜色主题 | *Choose your preferred color theme*
3. 可选择启用随机背景功能 | *Optionally enable random background feature*

---

## 🤝 贡献指南 | Contributing

我们欢迎所有形式的贡献！| *We welcome all forms of contributions!*

1. Fork 项目 | *Fork the project*
2. 创建功能分支 | *Create a feature branch*
3. 提交更改 | *Commit your changes*
4. 推送到分支 | *Push to the branch*
5. 创建 Pull Request | *Create a Pull Request*

---

## 📄 许可证 | License

本项目采用 MIT 许可证 | *This project is licensed under the MIT License*

---

## 📞 联系我们 | Contact

如有问题或建议，请通过以下方式联系我们：| *For questions or suggestions, please contact us:*

- 📧 Email: jiaochunxiao2008@163.com
- 🐛 Issues: [GitHub Issues](https://github.com/jiaochunxiao/easy-bookmark/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/jiaochunxiao/easy-bookmark/discussions)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个星标！| If this project helps you, please give us a star! ⭐**

Made with ❤️ by jiaochunxiao

</div>
