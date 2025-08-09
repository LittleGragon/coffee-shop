# Docker 镜像源配置指南

本指南帮助您配置 Docker 使用中科大 (USTC) 镜像源，以加速在中国大陆的镜像拉取速度。

## 🚀 一键配置脚本

### 自动配置 (推荐)
```bash
# 运行自动配置脚本
./scripts/configure-docker-mirror.sh
```

这个脚本会：
- 自动检测操作系统
- 配置 Docker daemon 使用 USTC 镜像源
- 备份现有配置
- 重启 Docker 服务 (Linux)

## 🔧 手动配置方法

### Linux 系统

1. 创建或编辑 Docker daemon 配置文件：
```bash
sudo mkdir -p /etc/docker
sudo nano /etc/docker/daemon.json
```

2. 添加以下内容：
```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn"
  ],
  "insecure-registries": [],
  "debug": false,
  "experimental": false,
  "features": {
    "buildkit": true
  }
}
```

3. 重启 Docker 服务：
```bash
sudo systemctl restart docker
```

### macOS 系统 (Docker Desktop)

1. 打开 Docker Desktop
2. 点击设置图标 (齿轮图标)
3. 选择 "Docker Engine" 标签页
4. 在配置中添加：
```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```
5. 点击 "Apply & Restart"

### Windows 系统 (Docker Desktop)

1. 打开 Docker Desktop
2. 点击设置图标
3. 选择 "Docker Engine"
4. 添加镜像源配置 (同 macOS)
5. 点击 "Apply & Restart"

## ✅ 验证配置

运行以下命令验证镜像源配置是否生效：

```bash
# 查看 Docker 信息
docker info

# 检查是否包含 USTC 镜像源
docker info | grep -i mirror
```

如果配置成功，您应该能看到：
```
Registry Mirrors:
 https://docker.mirrors.ustc.edu.cn/
```

## 🐳 使用镜像源构建项目

配置完成后，您可以正常使用 Docker 命令，镜像拉取会自动使用 USTC 镜像源：

### 开发环境启动
```bash
# 使用镜像源快速启动开发环境
./scripts/start-all.sh
```

### 生产环境启动
```bash
# 使用镜像源快速启动生产环境
./scripts/start-production.sh
```

### 手动构建镜像
```bash
# 构建单个服务镜像
docker build -t coffee-shop-web ./packages/web
docker build -t coffee-shop-api ./packages/api
docker build -t coffee-shop-ops ./packages/coffee-shop-ops

# 使用 Docker Compose 构建所有镜像
docker-compose build
```

## 📊 性能对比

使用 USTC 镜像源后，在中国大陆地区的镜像拉取速度通常会有显著提升：

- **官方源**: 通常 100KB/s - 1MB/s
- **USTC 镜像源**: 通常 5MB/s - 50MB/s (取决于网络环境)

## 🔄 其他可用镜像源

如果 USTC 镜像源不可用，您也可以尝试其他国内镜像源：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com",
    "https://ccr.ccs.tencentyun.com"
  ]
}
```

## 🛠️ 故障排除

### 问题 1: 配置后仍然很慢
**解决方案**: 
- 重启 Docker Desktop
- 检查网络连接
- 尝试其他镜像源

### 问题 2: Linux 系统权限问题
**解决方案**:
```bash
# 确保当前用户在 docker 组中
sudo usermod -aG docker $USER
# 重新登录或运行
newgrp docker
```

### 问题 3: 配置文件格式错误
**解决方案**:
- 检查 JSON 格式是否正确
- 使用 `docker info` 查看错误信息
- 恢复备份配置文件

## 📞 技术支持

如果遇到问题，可以：
1. 查看 Docker 日志：`docker logs <container_name>`
2. 检查 Docker daemon 状态：`systemctl status docker` (Linux)
3. 重置 Docker Desktop 设置 (macOS/Windows)

---

**镜像源地址**: https://docker.mirrors.ustc.edu.cn  
**维护方**: 中国科学技术大学  
**更新时间**: 每日同步