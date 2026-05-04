#!/bin/bash

# Secure Backup Utility for MCP Configuration Files
# Creates timestamped backups with validation and verification
# Usage: ./backup-config.sh <config-file-path>

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print error messages
error() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    exit 1
}

# Function to print success messages
success() {
    echo -e "${GREEN}SUCCESS: $1${NC}"
}

# Function to print warning messages
warning() {
    echo -e "${YELLOW}WARNING: $1${NC}"
}

# Validate input arguments
if [ $# -ne 1 ]; then
    error "Usage: $0 <config-file-path>"
fi

CONFIG_PATH="$1"

# Validate input is non-empty
if [ -z "$CONFIG_PATH" ]; then
    error "Config file path cannot be empty"
fi

# Check if source file exists
if [ ! -f "$CONFIG_PATH" ]; then
    error "Config file does not exist: $(basename "$CONFIG_PATH")"
fi

# Check if source file is readable
if [ ! -r "$CONFIG_PATH" ]; then
    error "Config file is not readable: $(basename "$CONFIG_PATH")"
fi

# Resolve to absolute path
CONFIG_PATH=$(cd "$(dirname "$CONFIG_PATH")" && pwd)/$(basename "$CONFIG_PATH")

# Define allowed base directories
HOME_KIRO_SETTINGS="$HOME/.kiro/settings"
WORKSPACE_KIRO_SETTINGS="$(pwd)/.kiro/settings"

# Validate path is in allowed directories
ALLOWED=false

if [[ "$CONFIG_PATH" == "$HOME_KIRO_SETTINGS"* ]]; then
    ALLOWED=true
elif [[ "$CONFIG_PATH" == "$WORKSPACE_KIRO_SETTINGS"* ]]; then
    ALLOWED=true
fi

if [ "$ALLOWED" = false ]; then
    error "Config file must be in ~/.kiro/settings/ or workspace/.kiro/settings/ (got: $(basename "$CONFIG_PATH"))"
fi

# Reject paths containing '..' segments (path traversal protection)
if [[ "$CONFIG_PATH" == *".."* ]]; then
    error "Path contains invalid '..' segment"
fi

# Generate ISO 8601 timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")

# Generate backup filename
BACKUP_PATH="${CONFIG_PATH}.backup.${TIMESTAMP}"

# Check if backup already exists (prevent overwrites)
if [ -f "$BACKUP_PATH" ]; then
    error "Backup file already exists: $(basename "$BACKUP_PATH")"
fi

# Get source file size for verification
SOURCE_SIZE=$(stat -f%z "$CONFIG_PATH" 2>/dev/null || stat -c%s "$CONFIG_PATH" 2>/dev/null)

if [ -z "$SOURCE_SIZE" ]; then
    error "Failed to get source file size"
fi

# Create backup with error handling
if ! cp "$CONFIG_PATH" "$BACKUP_PATH" 2>/dev/null; then
    error "Failed to create backup (check permissions and disk space)"
fi

# Verify backup was created
if [ ! -f "$BACKUP_PATH" ]; then
    error "Backup verification failed: file does not exist"
fi

# Verify backup file size matches source
BACKUP_SIZE=$(stat -f%z "$BACKUP_PATH" 2>/dev/null || stat -c%s "$BACKUP_PATH" 2>/dev/null)

if [ -z "$BACKUP_SIZE" ]; then
    error "Failed to get backup file size"
fi

if [ "$SOURCE_SIZE" -ne "$BACKUP_SIZE" ]; then
    # Clean up failed backup
    rm -f "$BACKUP_PATH"
    error "Backup verification failed: size mismatch (source: $SOURCE_SIZE, backup: $BACKUP_SIZE)"
fi

# Success - return backup path
success "Backup created: $(basename "$BACKUP_PATH")"
echo "$BACKUP_PATH"
