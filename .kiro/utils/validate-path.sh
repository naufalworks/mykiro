#!/bin/bash

# Secure Path Validation Module for MCP Configuration
# Provides functions to validate paths against security rules
# Usage: source this file and call validation functions

# Expanded list of blocked system directories
BLOCKED_SYSTEM_DIRS=(
    "/"
    "/etc"
    "/usr"
    "/bin"
    "/var"
    "/sys"
    "/proc"
    "/boot"
    "/dev"
    "/lib"
    "/lib64"
    "/sbin"
    "/root"
    "/tmp"
    "/opt"
)

# Check if path is root filesystem
# Returns: 0 (true) if root, 1 (false) otherwise
is_root_filesystem() {
    local path="$1"
    
    if [ -z "$path" ]; then
        return 1
    fi
    
    # Check for root filesystem patterns
    if [ "$path" = "/" ] || [ "$path" = "//" ]; then
        return 0
    fi
    
    return 1
}

# Check if path is a system directory
# Returns: 0 (true) if system directory, 1 (false) otherwise
is_system_directory() {
    local path="$1"
    
    if [ -z "$path" ]; then
        return 1
    fi
    
    # Normalize path (remove trailing slashes)
    path="${path%/}"
    
    # Check against blocked system directories
    for blocked in "${BLOCKED_SYSTEM_DIRS[@]}"; do
        # Exact match or starts with blocked path followed by /
        if [ "$path" = "$blocked" ] || [[ "$path" == "$blocked/"* ]]; then
            return 0
        fi
    done
    
    return 1
}

# Normalize path by resolving to canonical absolute path
# Handles symlinks, relative paths, and canonicalization
# Returns: normalized path on stdout, or empty string on error
normalize_path() {
    local path="$1"
    
    if [ -z "$path" ]; then
        echo ""
        return 1
    fi
    
    # Use realpath to resolve symlinks and canonicalize
    # macOS realpath doesn't support -m flag, so we handle non-existent paths differently
    local normalized
    
    if [ -e "$path" ]; then
        # Path exists - use realpath directly
        normalized=$(realpath "$path" 2>/dev/null)
    else
        # Path doesn't exist - resolve parent directory and append basename
        local parent_dir=$(dirname "$path")
        local basename=$(basename "$path")
        
        if [ -e "$parent_dir" ]; then
            local resolved_parent=$(realpath "$parent_dir" 2>/dev/null)
            if [ -n "$resolved_parent" ]; then
                normalized="$resolved_parent/$basename"
            fi
        else
            # Parent doesn't exist either - use cd to resolve as much as possible
            normalized=$(cd "$(dirname "$path")" 2>/dev/null && pwd)/$(basename "$path") || echo ""
        fi
    fi
    
    if [ -z "$normalized" ]; then
        echo ""
        return 1
    fi
    
    echo "$normalized"
    return 0
}

# Check if target path is within allowed directory
# Uses proper boundary checking to prevent bypasses
# Returns: 0 (true) if within allowed, 1 (false) otherwise
is_within_allowed_directory() {
    local target_path="$1"
    local allowed_dir="$2"
    
    if [ -z "$target_path" ] || [ -z "$allowed_dir" ]; then
        return 1
    fi
    
    # Normalize both paths
    local normalized_target
    local normalized_allowed
    
    normalized_target=$(normalize_path "$target_path")
    normalized_allowed=$(normalize_path "$allowed_dir")
    
    if [ -z "$normalized_target" ] || [ -z "$normalized_allowed" ]; then
        return 1
    fi
    
    # Remove trailing slashes for comparison
    normalized_target="${normalized_target%/}"
    normalized_allowed="${normalized_allowed%/}"
    
    # Check if paths are equal (target IS the allowed directory)
    if [ "$normalized_target" = "$normalized_allowed" ]; then
        return 0
    fi
    
    # Check if target starts with allowed directory followed by /
    # This prevents /etc-backup from passing /etc check
    if [[ "$normalized_target" == "$normalized_allowed/"* ]]; then
        return 0
    fi
    
    return 1
}

# Main validation function for allowed directories
# Combines all security checks
# Returns: 0 (valid) or 1 (invalid)
# Prints error message to stderr on failure
validate_allowed_directory() {
    local path="$1"
    local allowed_dirs=("${@:2}")  # Remaining arguments are allowed directories
    
    # Input validation
    if [ -z "$path" ]; then
        echo "ERROR: Path cannot be empty" >&2
        return 1
    fi
    
    # Reject paths containing '..' segments (path traversal protection)
    if [[ "$path" == *".."* ]]; then
        echo "ERROR: Path contains invalid '..' segment" >&2
        return 1
    fi
    
    # Normalize path
    local normalized
    normalized=$(normalize_path "$path")
    
    if [ -z "$normalized" ]; then
        echo "ERROR: Failed to normalize path" >&2
        return 1
    fi
    
    # Check if root filesystem
    if is_root_filesystem "$normalized"; then
        echo "ERROR: Root filesystem access not allowed" >&2
        return 1
    fi
    
    # Check if system directory
    if is_system_directory "$normalized"; then
        echo "ERROR: System directory access not allowed" >&2
        return 1
    fi
    
    # Check if within any allowed directory (allowlist validation)
    local within_allowed=false
    
    for allowed_dir in "${allowed_dirs[@]}"; do
        if is_within_allowed_directory "$normalized" "$allowed_dir"; then
            within_allowed=true
            break
        fi
    done
    
    if [ "$within_allowed" = false ]; then
        echo "ERROR: Path not within allowed directories" >&2
        return 1
    fi
    
    # All checks passed
    return 0
}

# Export functions for use in other scripts
export -f is_root_filesystem
export -f is_system_directory
export -f normalize_path
export -f is_within_allowed_directory
export -f validate_allowed_directory
