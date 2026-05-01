#!/bin/bash
# Verify Kiro Intelligent MCP Suite installation

echo "================================================"
echo "  Kiro Intelligent MCP Suite - Verification"
echo "================================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    VERSION=$(node --version)
    echo -e "${GREEN}✓ $VERSION${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
    ((ERRORS++))
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    VERSION=$(npm --version)
    echo -e "${GREEN}✓ $VERSION${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
    ((ERRORS++))
fi

# Check Docker
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Installed${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
    ((ERRORS++))
fi

# Check Qdrant
echo -n "Checking Qdrant... "
if docker ps | grep -q qdrant; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${YELLOW}⚠ Not running${NC}"
fi

# Check Redis
echo -n "Checking Redis... "
if docker ps | grep -q redis; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${YELLOW}⚠ Not running${NC}"
fi

# Check server builds
echo ""
echo "Checking MCP servers..."

for server in intelligent-context-mcp adaptive-memory-mcp predictive-analysis-mcp collaborative-planning-mcp; do
    echo -n "  $server... "
    if [ -d "servers/$server/dist" ]; then
        echo -e "${GREEN}✓ Built${NC}"
    else
        echo -e "${RED}✗ Not built${NC}"
        ((ERRORS++))
    fi
done

# Check Kiro config
echo ""
echo -n "Checking Kiro configuration... "
if [ -f "$HOME/.kiro/settings/mcp.json" ]; then
    if grep -q "intelligent-context" "$HOME/.kiro/settings/mcp.json"; then
        echo -e "${GREEN}✓ Configured${NC}"
    else
        echo -e "${YELLOW}⚠ Not configured${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Config file not found${NC}"
fi

# Check environment variables
echo ""
echo "Checking environment variables..."
echo -n "  ANTHROPIC_API_KEY... "
if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo -e "${GREEN}✓ Set${NC}"
else
    echo -e "${YELLOW}⚠ Not set (will use config)${NC}"
fi

echo -n "  VOYAGE_API_KEY... "
if [ -n "$VOYAGE_API_KEY" ]; then
    echo -e "${GREEN}✓ Set${NC}"
else
    echo -e "${YELLOW}⚠ Not set (will use config)${NC}"
fi

# Summary
echo ""
echo "================================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Your Kiro Intelligent MCP Suite is ready to use."
    echo "Restart Kiro IDE to load the MCP servers."
else
    echo -e "${RED}✗ $ERRORS error(s) found${NC}"
    echo ""
    echo "Please fix the errors above and run ./install.sh"
fi
echo "================================================"
