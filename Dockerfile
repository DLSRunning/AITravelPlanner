# 使用官方 Node 镜像作为基础镜像
FROM node:23 AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（或 yarn.lock）
COPY package*.json ./

# 安装依赖（生产环境 + 开发依赖，因为构建需要）
RUN npm ci

# 复制源代码
COPY . .

# 构建生产版本的 React 应用
RUN npm run build

# ------------------- 生产阶段 -------------------
FROM nginx:alpine

# 从构建阶段复制构建好的静态文件到 Nginx 的 html 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]