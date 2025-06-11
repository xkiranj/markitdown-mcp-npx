# MarkItDown-MCP-NPX

[![npm version](https://img.shields.io/npm/v/markitdown-mcp-npx.svg)](https://www.npmjs.com/package/markitdown-mcp-npx)
[![npm downloads](https://img.shields.io/npm/dm/markitdown-mcp-npx.svg)](https://www.npmjs.com/package/markitdown-mcp-npx)
[![Built for AutoGen](https://img.shields.io/badge/Built%20for-AutoGen-blue)](https://github.com/microsoft/autogen)

**NPX wrapper for Microsoft's MarkItDown MCP server - No Docker Required!**

This package provides an NPX-compatible wrapper for Microsoft's [markitdown-mcp](https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp), allowing you to run the MarkItDown MCP server without Docker dependencies.

## ✨ Features

- 🚀 **No Docker Required**: Run directly with NPX - no installation needed
- 🔧 **Automatic Setup**: Handles Python environment and dependencies automatically
- 🔄 **Full Compatibility**: Works exactly like the original Docker version
- 💻 **Cross-Platform**: Works on Windows, macOS, and Linux
- ⚡ **Fast**: Reuses virtual environment after first setup
- 📦 **Zero Config**: Just run `npx -y markitdown-mcp-npx` and you're ready!

## 📋 Prerequisites

### Required
- **Node.js 16+**: Required for NPX execution
- **Python 3.10+**: Required for MarkItDown functionality
- **Internet Connection**: For initial package installation

### Optional (for enhanced functionality)
- **FFmpeg**: For audio file processing and transcription (.mp3, .wav files)
- **ExifTool**: For advanced image metadata extraction

> 💡 **Note**: MarkItDown works perfectly for most file types (PDF, Word, Excel, basic images) without the optional dependencies. They're only needed for audio files and advanced image metadata.

**Windows users**: See [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) for easy installation of optional dependencies.

## 🚀 Quick Start

### Using NPX (Recommended - No Installation Required!)

```bash
# Basic STDIO mode (for Claude Desktop)
npx -y markitdown-mcp-npx

# HTTP mode for testing
npx -y markitdown-mcp-npx --http --host 127.0.0.1 --port 3001

# Show help
npx -y markitdown-mcp-npx --help
```

### Alternative Installation Methods

#### Local Installation
```bash
# Install globally
npm install -g markitdown-mcp-npx

# Then run directly
markitdown-mcp-npx
```

#### Local Development
```bash
# Clone this repository
git clone https://github.com/xkiranj/markitdown-mcp-npx.git
cd markitdown-mcp-npx

# Run locally
npm start
```

## 🔧 Configuration for Claude Desktop

### Claude Desktop Configuration (Recommended)

**NPX Version (Recommended):**
```json
{
  "mcpServers": {
    "markitdown": {
      "command": "npx",
      "args": [
        "-y",
        "markitdown-mcp-npx"
      ]
    }
  }
}
```

**With HTTP transport:**
```json
{
  "mcpServers": {
    "markitdown": {
      "command": "npx",
      "args": [
        "-y",
        "markitdown-mcp-npx",
        "--http",
        "--host",
        "127.0.0.1",
        "--port",
        "3001"
      ]
    }
  }
}
```

**Global Installation:**
```json
{
  "mcpServers": {
    "markitdown": {
      "command": "markitdown-mcp-npx",
      "args": []
    }
  }
}
```

> 🔑 **Critical**: The `-y` flag is **required** for NPX in Claude Desktop to prevent installation prompts that would cause the server to hang.

### Comparison with Docker Version

| Feature | Docker Version | NPX Version |
|---------|----------------|-------------|
| **Setup** | Requires Docker | Just NPX (comes with Node.js) |
| **Command** | `docker run ...` | `npx -y markitdown-mcp-npx` |
| **Dependencies** | Isolated in container | Managed in virtual environment |
| **Performance** | Container overhead | Direct execution |
| **File Access** | Requires volume mounts | Direct file system access |
| **Installation** | Docker pull required | Zero installation with NPX |

## 📖 Usage Examples

### Basic STDIO Mode (Default)
```bash
npx -y markitdown-mcp-npx
```

### HTTP/SSE Mode
```bash
npx -y markitdown-mcp-npx --http --host 127.0.0.1 --port 3001
```

### With Custom Host/Port
```bash
npx -y markitdown-mcp-npx --http --host 0.0.0.0 --port 8080
```

### One-time Setup Verification
```bash
# Test installation and show help
npx -y markitdown-mcp-npx --help
```

## 🛠️ Available Options

```
Usage: markitdown-mcp-npx [options]

Options:
  --http           Run with Streamable HTTP and SSE transport (default: STDIO)
  --sse            Alias for --http (deprecated)
  --host HOST      Host to bind to (default: 127.0.0.1)
  --port PORT      Port to listen on (default: 3001)
  --help           Show help message
```

## 🔍 How It Works

1. **NPX Magic**: NPX automatically downloads and runs the latest version
2. **Auto-confirmation**: The `-y` flag skips installation prompts for seamless startup
3. **Environment Detection**: Automatically detects Python 3.10+ installation
4. **Virtual Environment**: Creates isolated Python environment in temp directory
5. **Package Installation**: Installs `markitdown-mcp` and dependencies
6. **Process Management**: Spawns and manages the Python MCP server process
7. **Signal Handling**: Properly handles termination signals
8. **Caching**: Reuses the virtual environment for faster subsequent runs

## 🧪 Testing with MCP Inspector

You can test the server using the MCP Inspector:

```bash
# Start the inspector
npx @modelcontextprotocol/inspector

# For STDIO mode:
# - Transport: STDIO
# - Command: npx
# - Args: -y, markitdown-mcp-npx

# For HTTP mode:
# - Start server: npx -y markitdown-mcp-npx --http
# - Transport: Streamable HTTP
# - URL: http://127.0.0.1:3001/mcp
```

## 🔧 Expected Tool Behavior

**✓ Single Tool**: MarkItDown MCP provides exactly **1 tool** called `convert_to_markdown`  
**✓ Universal Converter**: This one tool handles **all file types**:  
- 📄 Documents: PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx)  
- 🖼️ Images: JPG, PNG, GIF, etc. (with OCR support)  
- 🎧 Audio: MP3, WAV (with transcription if FFmpeg installed)  
- 🌐 Web: HTTP/HTTPS URLs  
- 🗃️ Archives: ZIP files  
- 📊 Data: CSV, JSON, XML  

**✓ URI Parameter**: Accepts `http:`, `https:`, `file:`, or `data:` URIs

> 💡 **Note**: Seeing "1 tools available" in Claude Desktop is **correct behavior**!

## 🐛 Troubleshooting

### Server Hangs on Startup
```
Server appears to hang or timeout on startup
```
**Solution**: Ensure you're using the `-y` flag: `npx -y markitdown-mcp-npx`  
**Cause**: Without `-y`, NPX prompts for installation confirmation, which hangs in non-interactive environments like Claude Desktop.

### Python Not Found
```
Error: Python 3.10+ is required but not found
```
**Solution**: Install Python 3.10+ and ensure it's in your PATH

### Permission Errors
```
Error: Failed to create virtual environment
```
**Solution**: Check write permissions to your temp directory

### Installation Failures
```
Error: Failed to install markitdown-mcp
```
**Solution**: Check internet connectivity and proxy settings

### Port Already in Use
```
Error: Port 3001 already in use
```
**Solution**: Use a different port with `--port <number>`

### NPX Cache Issues
```
Error: Package not found or outdated
```
**Solution**: Clear NPX cache with `npx clear-npx-cache` or use `npx -y markitdown-mcp-npx`

### FFmpeg Warning
```
RuntimeWarning: Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work
```
**This warning is harmless!** It means:
- ✅ MarkItDown is working correctly
- ✅ All file types work (PDF, Word, Excel, images)
- ⚠️ Audio files (.mp3, .wav) processing will be limited

**To resolve**: Install FFmpeg (see [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) for Windows)

## 📂 File Structure

```
markitdown-mcp-npx/
├── package.json              # NPM package configuration
├── index.js                  # Main entry point
├── bin/
│   └── markitdown-mcp-npx.js # Node.js executable script
├── README.md                 # This file
├── WINDOWS_SETUP.md          # Windows setup guide
├── test.js                   # Test suite
└── LICENSE                   # MIT License
```

## 🔐 Security Considerations

- The server runs with the same privileges as the user executing it
- No authentication is provided for HTTP/SSE modes
- For HTTP mode, bind to `localhost` unless specifically needed otherwise
- Virtual environments provide isolation for Python dependencies
- NPX ensures you always get the latest published version

## 🆚 vs. Docker Version

### Advantages of NPX Version:
- ✅ No Docker installation required
- ✅ Zero configuration with NPX
- ✅ Direct file system access (no volume mounts)
- ✅ Faster startup (no container overhead)
- ✅ Easier to debug and troubleshoot
- ✅ Always up-to-date with NPX

### Advantages of Docker Version:
- ✅ Complete isolation
- ✅ Consistent environment across systems
- ✅ No Python installation required on host

## 📈 Version Updates

The NPX version automatically uses the latest published version. To check for updates or force a fresh download:

```bash
# Clear cache and run latest version
npx -y markitdown-mcp-npx

# Check current version
npx -y markitdown-mcp-npx --help
```

## 📦 Package Information

- **Package**: [markitdown-mcp-npx](https://www.npmjs.com/package/markitdown-mcp-npx)
- **Repository**: [GitHub](https://github.com/xkiranj/markitdown-mcp-npx)
- **License**: MIT
- **Node.js**: >=16.0.0
- **Python**: >=3.10

## 🤝 Contributing

This is an unofficial wrapper for Microsoft's MarkItDown MCP server. For issues with the core MarkItDown functionality, please refer to the [original repository](https://github.com/microsoft/markitdown).

For issues specific to this wrapper:
1. Check the troubleshooting section
2. Verify your Python and Node.js installations
3. Test with the MCP Inspector
4. [Open an issue](https://github.com/xkiranj/markitdown-mcp-npx/issues) on GitHub

## 🙏 Acknowledgments

- **Microsoft AutoGen Team**: For creating the original MarkItDown and MCP server
- **Model Context Protocol**: For the MCP specification
- **Claude Desktop**: For MCP integration
- **NPM Community**: For the fantastic NPX tool

---

**✨ Ready to use? Just run: `npx -y markitdown-mcp-npx`**

This is an unofficial wrapper for MarkItDown MCP. For the official Docker version, visit the [original repository](https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp).
