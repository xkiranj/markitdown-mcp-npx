# Windows Installation Guide for Optional Dependencies

This guide helps you install optional dependencies for MarkItDown MCP NPX on Windows.

## 🎵 FFmpeg (for audio file processing)

FFmpeg is needed to process audio files (.mp3, .wav, etc.) and extract speech transcription.

### Method 1: Using Chocolatey (Recommended)

1. **Install Chocolatey** (if not already installed):
   - Open PowerShell as Administrator
   - Run: `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`

2. **Install FFmpeg**:
   ```powershell
   choco install ffmpeg
   ```

3. **Verify installation**:
   ```powershell
   ffmpeg -version
   ```

### Method 2: Manual Installation

1. **Download FFmpeg**:
   - Go to https://ffmpeg.org/download.html#build-windows
   - Download the latest release build
   - Extract to `C:\ffmpeg`

2. **Add to PATH**:
   - Open System Properties → Advanced → Environment Variables
   - In System Variables, find and edit "Path"
   - Add `C:\ffmpeg\bin`
   - Click OK and restart Command Prompt

3. **Verify installation**:
   ```cmd
   ffmpeg -version
   ```

### Method 3: Using winget

```powershell
winget install ffmpeg
```

## 📷 ExifTool (for advanced image metadata)

ExifTool extracts detailed metadata from images and other files.

### Method 1: Using Chocolatey

```powershell
choco install exiftool
```

### Method 2: Manual Installation

1. **Download ExifTool**:
   - Go to https://exiftool.org/
   - Download "Windows Executable"
   - Extract `exiftool(-k).exe` to `C:\Windows\System32` and rename to `exiftool.exe`

2. **Verify installation**:
   ```cmd
   exiftool -ver
   ```

## 🧪 Testing Your Installation

After installing the optional dependencies, test your MarkItDown MCP setup:

```bash
# Test the NPX wrapper
node C:\Users\ekirjad\MCP\markitdown-mcp-npx\bin\markitdown-mcp-npx.js --help

# You should see:
# ✓ ffmpeg found - audio file processing available
# ✓ exiftool found - advanced image metadata available
```

## ❓ Troubleshooting

### "Command not found" errors

1. **Restart your terminal** after installation
2. **Check PATH**: Ensure the tools are in your system PATH
3. **Verify installation**: Run `where ffmpeg` and `where exiftool`

### Permission errors

- Run PowerShell/Command Prompt **as Administrator** when installing
- Some antivirus software may block downloads - temporarily disable if needed

### Still getting warnings?

- The warnings are **harmless** - MarkItDown works fine without these tools
- They're only needed for specific file types (audio files and advanced image metadata)
- Most common use cases (PDF, Word, Excel, basic images) work without them

## 💡 What Each Tool Does

| Tool | Purpose | File Types | Required? |
|------|---------|------------|-----------|
| **FFmpeg** | Audio processing & transcription | .mp3, .wav, .m4a | Optional |
| **ExifTool** | Advanced image metadata | .jpg, .png, .tiff | Optional |

**✅ Core MarkItDown functionality works perfectly without these tools!**

They're only needed for specialized use cases like transcribing audio files or extracting GPS coordinates from photos.
