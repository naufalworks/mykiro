#!/bin/bash
set -e

echo "================================================"
echo "  Kiro Intelligent MCP Suite - Uninstallation"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

KIRO_CONFIG_DIR="$HOME/.kiro/settings"
KIRO_MCP_CONFIG="$KIRO_CONFIG_DIR/mcp.json"

echo -e "${YELLOW}This will remove all Kiro Intelligent MCP Suite servers from your Kiro IDE configuration.${NC}"
echo ""
read -p "Are you sure you want to continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Uninstallation cancelled."
    exit 0
fi

echo ""
echo -e "${BLUE}Step 1: Backing up current configuration...${NC}"

if [ -f "$KIRO_MCP_CONFIG" ]; then
    BACKUP_FILE="$KIRO_MCP_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$KIRO_MCP_CONFIG" "$BACKUP_FILE"
    echo -e "${GREEN}✓ Config backed up to: $BACKUP_FILE${NC}"
else
    echo -e "${YELLOW}⚠ No existing config found${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Removing MCP servers from configuration...${NC}"

if [ -f "$KIRO_MCP_CONFIG" ]; then
    # Remove our servers from config using jq if available, otherwise manual
    if command -v jq &> /dev/null; then
        jq 'del(.mcpServers["intelligent-context"]) | del(.mcpServers["adaptive-memory"]) | del(.mcpServers["predictive-analysis"]) | del(.mcpServers["collaborative-planning"])' "$KIRO_MCP_CONFIG" > "$KIRO_MCP_CONFIG.tmp"
        mv "$KIRO_MCP_CONFIG.tmp" "$KIRO_MCP_CONFIG"
        echo -e "${GREEN}✓ MCP servers removed from configuration${NC}"
    else
        echo -e "${YELLOW}⚠ jq not installed, please manually remove servers from $KIRO_MCP_CONFIG${NC}"
    fi
fi

echo ""
echo -e "${BLUE}Step 3: Stopping Docker services (optional)...${NC}"
read -p "Stop Qdrant and Redis containers? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if docker ps | grep -q qdrant; then
        docker stop qdrant
        docker rm qdrant
        echo -e "${GREEN}✓ Qdrant stopped and removed${NC}"
    fi

    if docker ps | grep -q redis; then
        docker stop redis
        docker rm redis
        echo -e "${GREEN}✓ Redis stopped and removed${NC}"
    fi
else
    echo "Docker services left running."
fi

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Uninstallation Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "The MCP servers have been removed from Kiro IDE."
echo ""
echo "To restore your previous configuration:"
echo "  cp $BACKUP_FILE $KIRO_MCP_CONFIG"
echo ""
echo "Restart Kiro IDE to apply changes."
