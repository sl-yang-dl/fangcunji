# 中国邮票图鉴

> 新中国邮票 · 图鉴
> 方寸丹青 · 流金岁月 —— 邮票年鉴

基于 **React 18 + Vite** 的邮票图鉴展示网站。数据整理自公开集邮资料，仅供集邮爱好者学习交流。

## 技术栈

- **React 18**（函数组件 + Hooks）
- **Vite 5**（开发服务器 / 生产构建）
- **原生 CSS**（新中式"流金岁月"主题，自定义中国色变量）
- **GitHub Actions**（自动构建部署到 GitHub Pages）
- **GitHub Issues**（留言板存储）

## 功能特性

- **邮票图鉴**：以风格化 SVG 生成每套邮票的占位图，按真实比例与齿孔呈现
- **多维度筛选**：按年代、类别、专题（标签页）、关键词搜索
- **双视图**：
  - **卡片视图**：邮票平铺为网格
  - **月份横轴**：选中年份后，按 1-12 月为单位把邮票分隔成区块展示
- **留言板**：访问者留言直接提交到本仓库的 GitHub Issues
- **详情弹窗**：展示志号、发行日期、面值、规格、设计者、背景介绍等完整信息
- **响应式**：支持桌面与移动端

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173/）
npm run dev

# 生产构建（输出到 dist/）
npm run build

# 本地预览构建产物
npm run preview
```

## 项目结构

```
.
├── index.html              # Vite 入口
├── vite.config.js          # Vite 配置（GitHub Pages base 路径）
├── .env.example            # 本地环境变量示例
├── package.json
├── .github/workflows/
│   ├── deploy.yml          # GitHub Actions：自动构建部署
│   ├── guestbook-proxy.yml # 留言板代理（workflow_dispatch 触发建 Issue）
│   └── images.yml          # 邮票图片批量处理（手动触发：png/jpg → webp）
├── public/
│   └── stamps/             # 本地邮票图片（webp，文件名 = data.js 的 id）
├── assets-src/             # 原始图片（png/jpg，仅给 images.yml 用，不入库）
├── scripts/
│   └── process-stamp-images.mjs  # 图片转换脚本（sharp）
├── src/
│   ├── main.jsx            # React 入口
│   ├── App.jsx             # 根组件（状态管理）
│   ├── data.js             # 邮票数据（ES Module）
│   ├── utils.js            # 工具函数（SVG 生成 / 图片 URL / 筛选 / 月份分组）
│   ├── styles.css          # 全部样式
│   └── components/
│       ├── Header.jsx      # 顶部导航
│       ├── Toolbar.jsx     # 搜索 / 筛选 / 视图切换
│       ├── Tabs.jsx        # 专题标签页
│       ├── StampGrid.jsx   # 卡片网格 / 月份视图
│       ├── StampCard.jsx   # 单张邮票卡片
│       ├── StampModal.jsx  # 详情弹窗
│       └── Guestbook.jsx   # 留言板（写入 GitHub Issues）
├── 上线方案.md             # 内部规划文档（正式产品演进方案）
└── README.md
```

## 数据格式

数据以数组形式定义在 `src/data.js` 中（默认导出 `STAMP_DATA`），每套邮票字段如下：

| 字段 | 说明 |
|------|------|
| `id` | 唯一标识 |
| `zihao` | 邮票志号 |
| `name` | 邮票名称 |
| `year` | 发行年份（数字） |
| `date` | 发行日期（如 `1980年2月15日`） |
| `category` | 类别：普通邮票 / 纪念邮票 / 特种邮票 / 其他 |
| `theme` | 专题分类（生肖、四大名著等） |
| `total` | 全套枚数 |
| `faceValue` | 全套面值 |
| `spec` | 邮票规格（用于按真实比例生成占位图） |
| `designer` / `printer` | 设计者 / 印制厂 |
| `intro` | 背景介绍 |
| `stamps` | 各枚图案名称 |
| `themeColor` | 占位图主色调（有真实图片时不再使用） |
| `image` | 本地图片文件名（如 `t46-hou.webp`，空则回退到 SVG 占位图） |

## 图片规范

邮票图片统一**保存在本地**，与数据分离管理。

- **目录**：`public/stamps/`（属于 `public/`，Vite 构建时原样复制到 `dist/`，不参与打包）
- **格式**：统一 **WebP**（体积小、画质好，浏览器全兼容）
- **命名**：与 `src/data.js` 中邮票的 `id` 一一对应，例如 `t46-hou.webp`
- **字段**：`data.js` 中 `image` 只存文件名（`t46-hou.webp`），不带路径；前端用 `stampImageUrl()` 结合 `import.meta.env.BASE_URL` 自动拼出完整地址，因此**在 GitHub Pages 子路径下也能正确加载**
- **回退**：某张图缺失时 `image` 留空，前端自动显示 SVG 风格化占位图

### 生成 WebP 的两种方式

**方式一：手动触发 GitHub Actions（推荐批量）**
1. 把原始 `png/jpg` 图片放进仓库根目录 `assets-src/stamps/`，文件名与 `id` 一致（如 `t46-hou.png`）
2. 仓库 **Actions → Stamp images → Run workflow** 手动触发
3. 工作流自动把每张图转成 WebP、压缩（最长边 900px、质量 82），输出到 `public/stamps/`，并同步更新 `data.js` 的 `image` 字段，最后自动提交

> 图片是"数据资产"，转换一次、提交成果即可，无需放进每次部署的流程。原始图不入库（见 `.gitignore` 的 `assets-src/`）。

**方式二：本地转换（少量图片时）**
用 `cwebp` / `sharp` / 在线工具把 `png/jpg` 转成 webp 后放入 `public/stamps/`，并手动在 `data.js` 填写 `image` 字段。

> 调整压缩参数（最长边 / 质量）可编辑 `scripts/process-stamp-images.mjs` 顶部的 `MAX_EDGE` / `QUALITY`。

## 留言板

留言板采用 **GitHub Actions 代理方案（推荐，更安全）**：前端通过 `workflow_dispatch` 触发代理工作流，真正创建 Issue 使用的是**仓库的 `GITHUB_TOKEN`（repository secret）**，该令牌只存在于 GitHub Actions 运行环境，不会打包进前端产物。

### 整体流程

```
前端留言
  └─ POST /repos/{owner}/{repo}/actions/workflows/guestbook-proxy.yml/dispatches
       └─ GitHub Actions（guestbook-proxy.yml）服务器端执行
            └─ 使用仓库 GITHUB_TOKEN 创建 Issue
```

### 部署配置（一次性）

1. **推送代码**到 `main` 分支，`.github/workflows/guestbook-proxy.yml` 即被启用。
2. **创建低权限令牌**（Fine-grained PAT）：
   - 权限仅勾选该仓库的 **Actions: Read and write**（用于触发 `workflow_dispatch`）
   - 无需 `Issues` 权限——创建 Issue 由 Actions 的 `GITHUB_TOKEN` 完成
3. 设置本地（或 CI）环境变量，在 `.env` 中：

```env
VITE_GITHUB_REPO="your-name/your-repo"
VITE_GUESTBOOK_TOKEN="github_pat_xxxxxxxx"   # 仅用于触发工作流的低权限令牌
```

> **为什么前端仍需要一个令牌？** 这是纯静态前端的固有约束：前端总要经过一次 GitHub API 触发代理。通过将令牌权限缩到"仅触发工作流"，把"创建 Issue"的高权限令牌完全收敛到服务端 secret，安全性已大幅提升。

### 更进一步（彻底零令牌，可选）

若希望前端**完全不携带任何令牌**，需在 GitHub Actions 之外再加一层服务端转发（如 Cloudflare Workers / Vercel Functions / 自建服务器），前端仅向该服务端提交，由服务端持有令牌触发工作流。本仓库默认采用上面的"低权限令牌"代理方案，平衡了安全性与零服务器成本。

### 本地开发

复制 `.env.example` 为 `.env` 并设置上述两个变量即可；未配置令牌时前端会**优雅提示**而非报错。

### 工作流文件

- `.github/workflows/guestbook-proxy.yml`：留言代理，`workflow_dispatch` 触发，服务器端用 `GITHUB_TOKEN` 创建 Issue。
- `deploy.yml` 在构建时自动注入 `VITE_GITHUB_REPO`，留言板部署后自动指向当前仓库。

## 部署到 GitHub Pages（自动）

项目已配置 GitHub Actions 工作流 `.github/workflows/deploy.yml`，**推送到 `main` 分支即自动构建并部署**。

### 一次性配置

1. 在 GitHub 创建仓库，推送代码
2. 仓库 **Settings → Pages** → Source 选 **GitHub Actions**
3. 仓库 **Settings → Actions → General**：勾选 **Allow GitHub Actions to create and approve pull requests**（如需）并确认 Workflow permissions 为可写（`Read and write permissions`）以触发 Pages 部署

### 工作流做了什么

- 检出代码 → 安装依赖 → `npm run build`
- 自动推导 GitHub Pages 的 `base` 路径（项目站点为 `/<仓库名>/`）
- 注入留言板所需的 `VITE_GITHUB_REPO`
- 上传产物并部署到 Pages

部署完成后，访问 `https://<你的用户名>.github.io/<仓库名>/` 即可。

### 手动部署（备用）

```bash
npm run build
# 将 dist/ 目录内容作为 Pages 源
```

> **注意**：若部署在项目站点（`https://user.github.io/<仓库名>/`），`vite.config.js` 中的 `base` 需为 `"/<仓库名>/"`（CI 已自动处理，本地手动构建时可通过 `VITE_BASE=/<仓库名>/ npm run build` 设置）。

## 说明与合规

- 邮票图片目前为风格化占位图，后续可替换为 `image` 字段接入真实图片
- 数据整理自公开资料，仅供学习交流，请勿用于商业用途
- 详细的产品演进规划见 `上线方案.md`

## License

仅供学习交流使用。
