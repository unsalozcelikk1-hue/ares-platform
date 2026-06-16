#!/bin/bash
# ==============================================================================
# ARES - AWS EC2 Automated Docker Deployment Script
# ==============================================================================

set -e

# Stylized headers
echo -e "\033[1;33m"
echo "======================================================================"
echo "    ARES AI Lead-Gen Platform - AWS EC2 Deployment Tool v1.0         "
echo "======================================================================"
echo -e "\033[0m"

# 1. Update system packages
echo -e "\033[1;32m[*] Updating apt package manager...\033[0m"
sudo apt-get update -y

# 2. Check if Docker is installed, otherwise install it
if ! command -v docker &> /dev/null; then
    echo -e "\033[1;32m[*] Docker not found. Installing Docker...\033[0m"
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    # Add current user to docker group
    sudo usermod -aG docker $USER
    echo -e "\033[1;32m[+] Docker installed successfully!\033[0m"
else
    echo -e "\033[1;32m[+] Docker is already installed.\033[0m"
fi

# 3. Create directory for persistent SQLite data
echo -e "\033[1;32m[*] Setting up database persistence directories...\033[0m"
mkdir -p ~/ares-platform/backend

# 4. Prompt for Cloud LLM environment variables
echo -e "\033[1;33m"
echo "----------------------------------------------------------------------"
echo "   Configuration - Cloud LLM Provider (Optimized Alternative)         "
echo "----------------------------------------------------------------------"
echo -e "\033[0m"

read -p "Enter ARES_LLM_API_KEY (Leave empty to use local Ollama / scripted templates): " API_KEY

if [ -n "$API_KEY" ]; then
    read -p "Enter ARES_LLM_PROVIDER (Options: deepseek, groq, openrouter, openai - default: deepseek): " PROVIDER
    PROVIDER=${PROVIDER:-deepseek}
    
    read -p "Enter ARES_LLM_MODEL (Leave empty to use provider's default model): " MODEL
else
    PROVIDER="ollama"
    MODEL=""
fi

# 5. Stop and clean up existing containers if running
echo -e "\033[1;32m[*] Cleaning up older instances...\033[0m"
sudo docker stop ares-app 2>/dev/null || true
sudo docker rm ares-app 2>/dev/null || true

# 6. Build the Docker Image
echo -e "\033[1;32m[*] Building ARES Docker Image...\033[0m"
sudo docker build -t ares-platform .

# 7. Launch the Container with Volume and Env Vars
echo -e "\033[1;32m[*] Starting ARES platform container...\033[0m"
sudo docker run -d \
  --name ares-app \
  -p 5050:5050 \
  -v ~/ares-platform/backend:/app/backend \
  -e ARES_LLM_API_KEY="$API_KEY" \
  -e ARES_LLM_PROVIDER="$PROVIDER" \
  -e ARES_LLM_MODEL="$MODEL" \
  --restart unless-stopped \
  ares-platform

echo -e "\033[1;32m"
echo "======================================================================"
echo "    [SUCCESS] ARES Platform is now running on port 5050!             "
echo "======================================================================"
echo -e "\033[0m"
echo -e "You can access the platform at: \033[1;36mhttp://YOUR_EC2_PUBLIC_IP:5050\033[0m"
echo -e "To view execution logs, run:    \033[1;36msudo docker logs -f ares-app\033[0m"
echo -e "Persistent database stored at:  \033[1;36m~/ares-platform/backend/database.sqlite\033[0m"
echo ""
