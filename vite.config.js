import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 部署路径配置。
// - 部署到用户站点根路径（username.github.io）时保持 base: "/"
// - 部署到项目站点（https://user.github.io/<仓库名>/）时设置 base: "/<仓库名>/"
// CI 环境下可通过环境变量 VITE_BASE 覆盖（见 .github/workflows/deploy.yml）
const base = process.env.VITE_BASE || "/";

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: "dist",
    assetsDir: "assets"
  }
});
