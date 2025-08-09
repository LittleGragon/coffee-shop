#!/bin/bash

# Configure Docker to use USTC mirror
# This script configures Docker daemon to use USTC mirror for faster image pulls in China

set -e

echo "🐳 Configuring Docker to use USTC mirror..."

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo "📋 Detected OS: ${MACHINE}"

if [ "${MACHINE}" = "Linux" ]; then
    # Linux configuration
    DOCKER_CONFIG_DIR="/etc/docker"
    DOCKER_CONFIG_FILE="${DOCKER_CONFIG_DIR}/daemon.json"
    
    echo "🔧 Configuring Docker daemon for Linux..."
    
    # Create docker config directory if it doesn't exist
    if [ ! -d "${DOCKER_CONFIG_DIR}" ]; then
        echo "📁 Creating Docker config directory..."
        sudo mkdir -p "${DOCKER_CONFIG_DIR}"
    fi
    
    # Backup existing config if it exists
    if [ -f "${DOCKER_CONFIG_FILE}" ]; then
        echo "💾 Backing up existing Docker daemon config..."
        sudo cp "${DOCKER_CONFIG_FILE}" "${DOCKER_CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Create new daemon.json with USTC mirror
    echo "📝 Creating new Docker daemon configuration..."
    sudo tee "${DOCKER_CONFIG_FILE}" > /dev/null <<EOF
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
EOF
    
    echo "🔄 Restarting Docker daemon..."
    sudo systemctl restart docker
    
    echo "✅ Docker daemon configured successfully!"
    
elif [ "${MACHINE}" = "Mac" ]; then
    # macOS configuration
    echo "🍎 For macOS, please configure Docker Desktop manually:"
    echo ""
    echo "1. Open Docker Desktop"
    echo "2. Go to Settings (gear icon)"
    echo "3. Go to 'Docker Engine' tab"
    echo "4. Add the following configuration:"
    echo ""
    cat docker-daemon.json
    echo ""
    echo "5. Click 'Apply & Restart'"
    echo ""
    echo "📋 The configuration has been saved to 'docker-daemon.json' for your reference."
    
else
    echo "❌ Unsupported operating system: ${MACHINE}"
    echo "Please configure Docker manually with the following registry mirror:"
    echo "https://docker.mirrors.ustc.edu.cn"
    exit 1
fi

# Test the configuration
echo "🧪 Testing Docker configuration..."
if docker info | grep -q "docker.mirrors.ustc.edu.cn"; then
    echo "✅ USTC mirror is configured correctly!"
else
    echo "⚠️  Mirror configuration may not be active yet. Please restart Docker if needed."
fi

echo ""
echo "🎉 Docker mirror configuration completed!"
echo ""
echo "📝 Registry mirror: https://docker.mirrors.ustc.edu.cn"
echo "🔄 You may need to restart Docker Desktop (on macOS/Windows) for changes to take effect."
echo ""