# MarkItDown-MCP-NPX

[![npm version](https://img.shields.io/npm/v/markitdown-mcp-npx.svg)](https://www.npmjs.com/package/markitdown-mcp-npx)
[![Built for AutoGen](https://img.shields.io/badge/Built%20for-AutoGen-blue)](https://github.com/microsoft/autogen)

**NPX wrapper for Microsoft's MarkItDown MCP server - No Docker Required!**

This package provides an NPX-compatible wrapper for Microsoft's [markitdown-mcp](https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp), allowing you to run the MarkItDown MCP server without Docker dependencies.

## ✨ Features

- 🚀 **No Docker Required**: Run directly with "node"
- 🔧 **Automatic Setup**: Handles Python environment and dependencies automatically
- 🔄 **Full Compatibility**: Works exactly like the original Docker version
- 💻 **Cross-Platform**: Works on Windows, macOS, and Linux
- ⚡ **Fast**: Reuses virtual environment after first setup

## 📋 Prerequisites

### Required
- **Node.js 16+**: Required for running the local script
- **Python 3.10+**: Required for MarkItDown functionality
- **Internet Connection**: For initial package installation

### Optional (for enhanced functionality)
- **FFmpeg**: For audio file processing and transcription (.mp3, .wav files)
- **ExifTool**: For advanced image metadata extraction

> 💡 **Note**: MarkItDown works perfectly for most file types (PDF, Word, Excel, basic images) without the optional dependencies. They're only needed for audio files and advanced image metadata.

**Windows users**: See [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) for easy installation of optional dependencies.

## 🚀 Quick Start

### Using Local Installation (Recommended)

```bash
# Run directly with node (no installation required after setup)
node C:\Users\YOUR_USERNAME\MCP\markitdown-mcp-npx\bin\markitdown-mcp-npx.js

# Run with HTTP transport
node C:\Users\YOUR_USERNAME\MCP\markitdown-mcp-npx\bin\markitdown-mcp-npx.js --http --host 127.0.0.1 --port 3001

# Run with specific arguments
node C:\Users\YOUR_USERNAME\MCP\markitdown-mcp-npx\bin\markitdown-mcp-npx.js --help
```

### Future NPX Usage (if published to NPM)

```bash
# Once published to NPM, you could use:
npx markitdown-mcp-npx
npx markitdown-mcp-npx --http --host 127.0.0.1 --port 3001
```

### Local Installation

```bash
# Clone or download this package
git clone <this-repo-url>
cd markitdown-mcp-npx

# Install dependencies
npm install

# Run locally
npm start
```

## 🔧 Configuration for Claude Desktop

The local version can be used as a drop-in replacement for the Docker version in Claude Desktop.

### Claude Desktop Configuration

**For Local Installation:**
```json
{
  "mcpServers": {
    "markitdown": {
      "command": "node",
      "args": [
        "C:\\Users\\YOUR_USERNAME\\MCP\\markitdown-mcp-npx\\bin\\markitdown-mcp-npx.js"
      ]
    }
  }
}
```

**For NPX version (if published to NPM):**
```json
{
  "mcpServers": {
    "markitdown": {
      "command": "npx",
      "args": [
        "markitdown-mcp-npx"
      ]
    }
  }
}
```

**For HTTP transport:**
```json
{
  "mcpServers": {
    "markitdown": {
      "command": "node",
      "args": [
        "C:\\Users\\YOUR_USERNAME\\MCP\\markitdown-mcp-npx\\bin\\markitdown-mcp-npx.js",
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

### Comparison with Docker Version

| Feature | Docker Version | Local Node Version |
|---------|----------------|--------------------|
| **Setup** | Requires Docker | Requires Node.js + Python |
| **Command** | `docker run ...` | `node path/to/markitdown-mcp-npx.js` |
| **Dependencies** | Isolated in container | Managed in virtual environment |
| **Performance** | Container overhead | Direct execution |
| **File Access** | Requires volume mounts | Direct file system access |

## 📖 Usage Examples

### Basic STDIO Mode (Default)
```bash
node C:\Users\YOUR_USERNAME\MCP\markitdown-mcp-npx\bin\markitdown-mcp-npx.js
```

### HTTP/SSE Mode
```bash
node C:\Users\YOUR_USERNAME\MCP\markitdown-mcp-npx\bin\markitdown-mcp-npx.js --http --host 127.0.0.1 --port 3001
```

### With Custom Host/Port
```bash
node C:\Users\YOUR_USERNAME\MCP\markitdown-mcp-npx\bin\markitdown-mcp-npx.js --http --host 0.0.0.0 --port 8080
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

1. **Environment Detection**: Automatically detects Python 3.10+ installation
2. **Virtual Environment**: Creates isolated Python environment in temp directory
3. **Package Installation**: Installs `markitdown-mcp` and dependencies
4. **Process Management**: Spawns and manages the Python MCP server process
5. **Signal Handling**: Properly handles termination signals

## 🐛 Troubleshooting

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

## 🧪 Testing with MCP Inspector

You can test the server using the MCP Inspector:

```bash
# Start the inspector
npx @modelcontextprotocol/inspector

# For STDIO mode:
# - Transport: STDIO
# - Command: node
# - Args: C:\Users\YOUR_USERNAME\MCP\markitdown-mcp-npx\bin\markitdown-mcp-npx.js

# For HTTP mode:
# - Transport: Streamable HTTP
# - URL: http://127.0.0.1:3001/mcp
```

## 📂 File Structure

```
markitdown-mcp-npx/
├── package.json              # NPM package configuration
├── index.js                  # Main entry point
├── bin/
│   └── markitdown-mcp-npx.js # Node.js executable script
└── README.md                 # This file
```

## 🔐 Security Considerations

- The server runs with the same privileges as the user executing it
- No authentication is provided for HTTP/SSE modes
- For HTTP mode, bind to `localhost` unless specifically needed otherwise
- Virtual environments provide isolation for Python dependencies

## 🆚 vs. Docker Version

### Advantages of Local Node Version:
- ✅ No Docker installation required
- ✅ Direct file system access (no volume mounts)
- ✅ Faster startup (no container overhead)
- ✅ Easier to debug and troubleshoot

### Advantages of Docker Version:
- ✅ Complete isolation
- ✅ Consistent environment across systems
- ✅ No Python installation required on host

## 📄 License

This project follows the same MIT license as the original [markitdown](https://github.com/microsoft/markitdown) project.

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

## 🚫 Troubleshooting

### FFmpeg Warning
```
RuntimeWarning: Couldn't find ffmpeg or avconv - defaulting to ffmpeg, but may not work
```
**This warning is harmless!** It means:
- ✅ MarkItDown is working correctly
- ✅ All file types work (PDF, Word, Excel, images)
- ⚠️ Audio files (.mp3, .wav) processing will be limited

**To resolve**: Install FFmpeg (see [WINDOWS_SETUP.md](./WINDOWS_SETUP.md) for Windows)

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

## 🤝 Contributing

This is an unofficial wrapper for Microsoft's MarkItDown MCP server. For issues with the core MarkItDown functionality, please refer to the [original repository](https://github.com/microsoft/markitdown).

For issues specific to this wrapper:
1. Check the troubleshooting section
2. Verify your Python and Node.js installations
3. Test with the MCP Inspector

## 🙏 Acknowledgments

- **Microsoft AutoGen Team**: For creating the original MarkItDown and MCP server
- **Model Context Protocol**: For the MCP specification
- **Claude Desktop**: For MCP integration

---

**Note**: This is an unofficial wrapper for MarkItDown MCP. For the official Docker version, visit the [original repository](https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp).
