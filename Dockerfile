# 使用 Node.js 官方镜像作为基础镜像
FROM node:16 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目源代码
COPY . .

# 生成 React 应用的生产环境构建
RUN npm run build

# 使用 Nginx 作为生产环境的 Web 服务器
FROM nginx:alpine

# 删除默认的 Nginx 配置文件
RUN rm -rf /usr/share/nginx/html/*

# 复制生成的 build 文件到 Nginx 的静态文件目录
COPY --from=build /app/build /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]
