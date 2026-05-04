# MCP Integration Guide

## Overview

This guide documents the integration of two Model Context Protocol (MCP) servers into the Kiro development environment:

1. **Markdown MCP** - Parse and manipulate markdown files
2. **Filesystem MCP** - Access files with security boundaries

**Note**: Shell MCP was initially planned but removed due to a critical bug in the `mcp-server-shell` package (coroutine not awaited). Shell command execution is already available through Kiro's built-in `executeBash` tool, which is more secure and better integrated.

## Configuration Strategy

We use a **hybrid configuration approach**:

- **Global Configuration** (`~/.kiro/settings/mcp.json`): Servers available across all workspaces
- **Workspace Configuration** (`.kiro/settings/mcp.json`): Workspace-specific servers

### Why Hybrid?

- **Global**: Shell and Markdown MCP are useful everywhere
- **Workspace**: Filesystem MCP needs workspace-specific boundaries
- **Security**: Each Filesystem MCP instance is restricted to its allowed directory

## Global vs Workspace Configuration

### Global Configuration (`~/.kiro/settings/mcp.json`)

**Purpose**: Servers that are useful across all workspaces

**Servers Configured**:
- Markdown MCP (markdown processing)
- Filesystem MCP (restricted to `~/.kiro` only)

**Note**: Shell MCP was removed due to a bug in the community package.

**When to Use**:
- Servers that don't need workspace-specific configuration
- Servers that operate on global resources
- Servers that should be available everywhere

### Workspace Configuration (`.kiro/settings/mcp.json`)

**Purpose**: Workspace-specific server instances

**Servers Configured**:
- Filesystem MCP (restricted to workspace directory)

**When to Use**:
- Servers that need workspace-specific boundaries
- Servers that operate on workspace files
- Servers that should be isolated per workspace

## Configuration Precedence

When Kiro loads MCP configurations, it merges them with this precedence:

```
User Config < Workspace1 < Workspace2 < ... < WorkspaceN
```

Later configurations override earlier ones. This means:
- Workspace configurations can override global configurations
- In multi-root workspaces, later workspace folders override earlier ones

## Installation

### Prerequisites

- **uvx**: Required for Shell MCP
- **npx**: Required for Markdown and Filesystem MCP (comes with Node.js)

### Verify Prerequisites

```bash
# Check uvx is available
uvx --version

# Check npx is available
npx --version
```

### Installation Process

MCP servers are **automatically installed** by Kiro when it loads the configuration files. No manual installation is required.

When Kiro starts:
1. Reads `~/.kiro/settings/mcp.json` (global config)
2. Reads `.kiro/settings/mcp.json` (workspace config)
3. Automatically installs any missing MCP server packages
4. Starts the MCP servers

## Configuration Files

### Global Configuration Example

Location: `~/.kiro/settings/mcp.json`

```json
{
  "mcpServers": {
    "markdown": {
      "command": "npx",
      "args": ["-y", "mcp-server-markdown"],
      "autoApprove": [
        "read_markdown",
        "parse_markdown",
        "get_headers",
        "get_links"
      ]
    },
    "filesystem-global": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/.kiro"
      ],
      "autoApprove": [
        "read_file",
        "list_directory",
        "search_files"
      ]
    }
  }
}
```

### Workspace Configuration Example

Location: `.kiro/settings/mcp.json` (in your workspace root)

```json
{
  "mcpServers": {
    "filesystem-workspace": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/absolute/path/to/workspace"
      ],
      "autoApprove": [
        "read_file",
        "list_directory",
        "search_files"
      ]
    }
  }
}
```

### Configuration Fields Explained

- **`command`**: The command to run the MCP server (`uvx` or `npx`)
- **`args`**: Arguments passed to the command
  - For uvx: `["mcp-server-shell"]` or `["mcp-server-filesystem"]`
  - For npx: `["-y", "package-name"]` (the `-y` flag auto-confirms installation)
- **`autoApprove`**: List of tool names that don't require user confirmation
- **`env`**: (Optional) Environment variables for the server
- **`disabled`**: (Optional) Set to `true` to disable the server

## Security Boundaries

### Path Restrictions

All Filesystem MCP instances are restricted to their configured allowed directory:

- **Global Filesystem MCP**: Can only access `~/.kiro`
- **Workspace Filesystem MCP**: Can only access the workspace directory

### Blocked Paths

The following paths are **always blocked**:

1. **Root Filesystem**: `/` or `//`
2. **System Directories**:
   - `/etc` - System configuration
   - `/usr` - System binaries
   - `/bin` - Essential binaries
   - `/sbin` - System binaries
   - `/var` - Variable data
   - `/sys` - System information
   - `/proc` - Process information
   - `/boot` - Boot files
   - `/dev` - Device files
   - `/lib` - System libraries
   - `/lib64` - 64-bit libraries
   - `/root` - Root user home
   - `/tmp` - Temporary files (security risk)
   - `/System` - macOS system files
   - `/Library` - macOS system libraries

### Path Traversal Protection

The MCP servers have built-in protection against path traversal attacks:

- `../` segments are resolved and validated
- Symlinks are followed and validated
- Paths outside the allowed directory are rejected

**Example**: If workspace is `/home/user/project`, these are blocked:
- `/home/user/project/../../../etc/passwd` (resolves to `/etc/passwd`)
- `/home/user/project/../other-project/file.txt` (outside workspace)

### Security Best Practices

1. **Use Absolute Paths**: Always specify absolute paths for allowed directories
2. **Minimal Auto-Approve**: Only auto-approve safe, read-only operations
3. **Workspace Isolation**: Each workspace should have its own Filesystem MCP instance
4. **Regular Audits**: Review auto-approve settings periodically
5. **Backup Configs**: Always backup before modifying configurations

## Auto-Approve Settings

### Shell MCP

**Status**: Removed due to bug in community package

**Reason**: The `mcp-server-shell` package has a critical bug (Python coroutine not awaited) that prevents it from starting. Since Kiro already has a built-in `executeBash` tool for shell command execution, the Shell MCP server is not necessary.

**Alternative**: Use Kiro's built-in `executeBash` tool for shell commands.

### Markdown MCP

**Auto-Approved Operations**:
- `read_markdown` - Read markdown files
- `parse_markdown` - Parse markdown structure
- `get_headers` - Extract headers
- `get_links` - Extract links

**Why Safe**: All operations are read-only and operate on markdown content only.

### Filesystem MCP (Global)

**Auto-Approved Operations**:
- `read_file` - Read file contents
- `list_directory` - List directory contents
- `search_files` - Search for files

**Why Safe**: All operations are read-only and restricted to `~/.kiro`.

**Not Auto-Approved**:
- `write_file` - Requires user confirmation (prevents accidental overwrites)
- `create_directory` - Requires user confirmation
- `move_file` - Requires user confirmation
- `delete_file` - Requires user confirmation

### Filesystem MCP (Workspace)

**Auto-Approved Operations**:
- `read_file` - Read file contents
- `list_directory` - List directory contents
- `search_files` - Search for files

**Security Decision**: We intentionally removed `write_file` from auto-approve due to:
- **HIGH Severity**: Unrestricted write access without user confirmation
- **Risk**: Accidental file overwrites, data loss, or malicious modifications
- **Best Practice**: Write operations should always require explicit user approval

**Recommendation**: User confirmation is required for all write operations.

## Workspace Setup Process

### Adding Filesystem MCP to a New Workspace

1. **Create Configuration Directory**:
   ```bash
   mkdir -p .kiro/settings
   ```

2. **Create Configuration File**:
   ```bash
   touch .kiro/settings/mcp.json
   ```

3. **Add Configuration** (replace `/absolute/path/to/workspace` with your workspace path):
   ```json
   {
     "mcpServers": {
       "filesystem-workspace": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-filesystem",
           "/absolute/path/to/workspace"
         ],
         "autoApprove": [
           "read_file",
           "list_directory",
           "search_files"
         ]
       }
     }
   }
   ```

4. **Restart Kiro**: Kiro will automatically load the new configuration

### Configuration Template

```json
{
  "mcpServers": {
    "filesystem-workspace": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "REPLACE_WITH_ABSOLUTE_WORKSPACE_PATH"
      ],
      "autoApprove": [
        "read_file",
        "list_directory",
        "search_files"
      ]
    }
  }
}
```

**Important**: Replace `REPLACE_WITH_ABSOLUTE_WORKSPACE_PATH` with the absolute path to your workspace.

### Workspace-Specific Considerations

- **Absolute Paths**: Always use absolute paths, not relative paths
- **Path Validation**: Ensure the path is not root (`/`) or a system directory
- **Security**: Only auto-approve read operations for safety
- **Isolation**: Each workspace should have its own Filesystem MCP instance
- **Testing**: After adding configuration, test with `list_directory` to verify access

## Troubleshooting

### Common Issues

#### 1. MCP Server Not Starting

**Symptoms**:
- Server doesn't appear in Kiro's MCP server list
- Tools from the server are not available

**Solutions**:
1. Check configuration file syntax (must be valid JSON)
2. Verify command is available (`uvx --version` or `npx --version`)
3. Check Kiro logs for error messages
4. Restart Kiro to reload configurations

#### 2. "Command Not Found" Error

**Symptoms**:
- Error: `uvx: command not found` or `npx: command not found`

**Solutions**:
1. Install uvx: Follow instructions at https://docs.astral.sh/uv/getting-started/installation/
2. Install Node.js (includes npx): https://nodejs.org/
3. Verify installation: `uvx --version` and `npx --version`

#### 3. "Access Denied" or "Path Outside Allowed Directory"

**Symptoms**:
- Filesystem MCP rejects file access
- Error: "Path is outside allowed directory"

**Solutions**:
1. Verify the path is within the allowed directory
2. Check for path traversal attempts (`../`)
3. Ensure allowed directory is specified correctly in configuration
4. Use absolute paths, not relative paths

#### 4. "Invalid Configuration" Error

**Symptoms**:
- Kiro reports configuration validation error
- MCP server doesn't load

**Solutions**:
1. Validate JSON syntax (use a JSON validator)
2. Check all required fields are present (`command`, `args`)
3. Verify paths are absolute, not relative
4. Ensure allowed directory is not root or system directory

#### 5. Timeout Errors

**Symptoms**:
- Operations timeout before completing
- Long-running commands fail

**Solutions**:
1. Check network connectivity (for npx package downloads)
2. Verify MCP server is running (check Kiro's MCP server view)
3. For long operations, ensure they complete within default timeout (30-60 seconds)
4. Restart MCP server from Kiro's MCP server view

### Error Messages and Fixes

| Error Message | Cause | Fix |
|---------------|-------|-----|
| `uvx: command not found` | uvx not installed | Install uvx |
| `npx: command not found` | Node.js not installed | Install Node.js |
| `Path is outside allowed directory` | Path traversal or wrong directory | Use correct path within allowed directory |
| `Invalid JSON` | Syntax error in config | Validate JSON syntax |
| `Server failed to start` | Configuration error | Check Kiro logs for details |
| `Tool not found` | Server not loaded | Restart Kiro to reload configs |

### Debugging Steps

1. **Check Configuration Files**:
   ```bash
   # Validate global config
   cat ~/.kiro/settings/mcp.json | python -m json.tool
   
   # Validate workspace config
   cat .kiro/settings/mcp.json | python -m json.tool
   ```

2. **Verify Prerequisites**:
   ```bash
   uvx --version
   npx --version
   ```

3. **Check Kiro Logs**:
   - Open Kiro's output panel
   - Look for MCP-related error messages
   - Check for configuration validation errors

4. **Test MCP Server Manually**:
   ```bash
   # Test Shell MCP
   uvx mcp-server-shell
   
   # Test Markdown MCP
   npx -y mcp-server-markdown
   
   # Test Filesystem MCP
   npx -y @modelcontextprotocol/server-filesystem /path/to/test
   ```

5. **Restart Kiro**:
   - Close and reopen Kiro
   - Configurations are loaded on startup

### Getting Help

If you encounter issues not covered here:

1. Check Kiro documentation
2. Review MCP server documentation:
   - Shell MCP: https://github.com/modelcontextprotocol/servers
   - Markdown MCP: https://github.com/modelcontextprotocol/servers
   - Filesystem MCP: https://github.com/modelcontextprotocol/servers
3. Check Kiro's GitHub issues
4. Ask in Kiro community forums

## Utilities

### Backup Utility

Location: `.kiro/utils/backup-config.sh`

**Purpose**: Create timestamped backups of configuration files before modification.

**Usage**:
```bash
bash .kiro/utils/backup-config.sh /path/to/config.json
```

**Features**:
- ISO timestamp format (YYYY-MM-DDTHH:MM:SS.3NZ)
- Path validation (only allows ~/.kiro/settings/ and workspace/.kiro/settings/)
- File size verification
- Comprehensive error handling
- macOS compatible

### Path Validation Utility

Location: `.kiro/utils/validate-path.sh`

**Purpose**: Validate paths are not root or system directories.

**Usage**:
```bash
source .kiro/utils/validate-path.sh
validate_allowed_directory "/path/to/validate"
```

**Features**:
- Checks if path is root filesystem (`/`)
- Checks if path is system directory
- Normalizes paths (resolves symlinks)
- Validates directory boundaries
- Prevents path traversal attacks

## Summary

This integration provides:

✅ **Markdown MCP**: Full markdown processing capabilities
✅ **Filesystem MCP**: Secure file access with workspace isolation
✅ **Security**: Multi-layer protection against unauthorized access
✅ **Flexibility**: Hybrid configuration for global and workspace-specific needs
✅ **Safety**: Read-only auto-approve, write operations require confirmation

**Shell MCP Note**: Originally planned but removed due to a bug in the community package. Kiro's built-in `executeBash` tool provides equivalent functionality with better integration.

**Next Steps**:
1. Restart Kiro to load the configurations
2. Verify MCP servers appear in Kiro's MCP server view
3. Test basic operations (list files, read files, execute commands)
4. Review auto-approve settings and adjust if needed

---

**Last Updated**: 2026-05-04
**Version**: 1.0.0
