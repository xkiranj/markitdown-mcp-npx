#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * NPX wrapper for MarkItDown MCP Server
 * This script automatically sets up Python environment and runs markitdown-mcp
 */

class MarkItDownMCPRunner {
    constructor() {
        this.pythonCmd = this.detectPython();
        this.tempDir = path.join(os.tmpdir(), 'markitdown-mcp-npx');
        this.venvPath = path.join(this.tempDir, 'venv');
        this.isWindows = os.platform() === 'win32';
    }

    /**
     * Log message only if not in STDIO mode (to avoid interfering with MCP communication)
     */
    log(message, forceLog = false) {
        const args = process.argv.slice(2);
        const isHttpMode = args.includes('--http') || args.includes('--sse') || args.includes('--help') || args.includes('-h');
        
        if (isHttpMode || forceLog) {
            console.log(message);
        }
    }

    /**
     * Log error message
     */
    logError(message, forceLog = false) {
        const args = process.argv.slice(2);
        const isHttpMode = args.includes('--http') || args.includes('--sse') || args.includes('--help') || args.includes('-h');
        
        if (isHttpMode || forceLog) {
            console.error(message);
        }
    }

    /**
     * Check for optional system dependencies
     */
    checkOptionalDependencies() {
        const warnings = [];
        
        // Check for ffmpeg (needed for audio file processing)
        try {
            require('child_process').execSync('ffmpeg -version', { stdio: 'pipe' });
            this.log('✓ ffmpeg found - audio file processing available');
        } catch (error) {
            warnings.push('⚠️  ffmpeg not found - audio file processing will be limited');
            warnings.push('   Install: https://ffmpeg.org/download.html');
        }
        
        // Check for exiftool (needed for advanced image metadata)
        try {
            require('child_process').execSync('exiftool -ver', { stdio: 'pipe' });
            this.log('✓ exiftool found - advanced image metadata available');
        } catch (error) {
            warnings.push('⚠️  exiftool not found - some image metadata features limited');
            warnings.push('   Install: https://exiftool.org/');
        }
        
        if (warnings.length > 0) {
            this.log('');
            this.log('📋 Optional Dependencies:');
            warnings.forEach(warning => this.log(warning));
            this.log('');
            this.log('💡 These are optional - MarkItDown will work without them');
            this.log('   Most file types (PDF, Word, Excel, images) work fine without these tools');
            this.log('   Only needed for: audio files (.mp3, .wav) and advanced image metadata');
            this.log('');
        }
    }

    /**
     * Detect available Python command
     */
    detectPython() {
        const pythonCmds = ['python', 'python3'];
        
        for (const cmd of pythonCmds) {
            try {
                const result = require('child_process').execSync(`${cmd} --version`, { 
                    encoding: 'utf8', 
                    stdio: 'pipe' 
                });
                if (result.includes('Python 3.')) {
                    this.log(`✓ Found Python: ${cmd}`);
                    return cmd;
                }
            } catch (error) {
                // Continue to next command
            }
        }
        
        throw new Error('Python 3.10+ is required but not found. Please install Python and ensure it\'s in your PATH.');
    }

    /**
     * Get virtual environment activation command
     */
    getVenvActivateCmd() {
        if (this.isWindows) {
            return path.join(this.venvPath, 'Scripts', 'activate.bat');
        } else {
            return `source ${path.join(this.venvPath, 'bin', 'activate')}`;
        }
    }

    /**
     * Get Python executable path in virtual environment
     */
    getVenvPython() {
        if (this.isWindows) {
            return path.join(this.venvPath, 'Scripts', 'python.exe');
        } else {
            return path.join(this.venvPath, 'bin', 'python');
        }
    }

    /**
     * Check if virtual environment exists and has markitdown-mcp installed
     */
    async checkVenvExists() {
        try {
            if (!fs.existsSync(this.venvPath)) {
                return false;
            }
            
            const venvPython = this.getVenvPython();
            if (!fs.existsSync(venvPython)) {
                return false;
            }

            // Check if markitdown-mcp is installed
            return new Promise((resolve) => {
                const checkProcess = spawn(venvPython, ['-m', 'pip', 'show', 'markitdown-mcp'], {
                    stdio: 'pipe'
                });
                
                checkProcess.on('exit', (code) => {
                    resolve(code === 0);
                });
                
                checkProcess.on('error', () => {
                    resolve(false);
                });
            });
        } catch (error) {
            return false;
        }
    }

    /**
     * Create virtual environment
     */
    async createVenv() {
        this.log('📦 Creating Python virtual environment...');
        
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }

        return new Promise((resolve, reject) => {
            const venvProcess = spawn(this.pythonCmd, ['-m', 'venv', this.venvPath], {
                stdio: 'inherit'
            });

            venvProcess.on('exit', (code) => {
                if (code === 0) {
                    this.log('✓ Virtual environment created');
                    resolve();
                } else {
                    reject(new Error(`Failed to create virtual environment (exit code: ${code})`));
                }
            });

            venvProcess.on('error', (error) => {
                reject(new Error(`Failed to create virtual environment: ${error.message}`));
            });
        });
    }

    /**
     * Install markitdown-mcp in virtual environment
     */
    async installMarkItDown() {
        this.log('📥 Installing markitdown-mcp...');
        
        const venvPython = this.getVenvPython();
        
        return new Promise((resolve, reject) => {
            const installProcess = spawn(venvPython, ['-m', 'pip', 'install', 'markitdown-mcp'], {
                stdio: 'inherit'
            });

            installProcess.on('exit', (code) => {
                if (code === 0) {
                    this.log('✓ markitdown-mcp installed successfully');
                    resolve();
                } else {
                    reject(new Error(`Failed to install markitdown-mcp (exit code: ${code})`));
                }
            });

            installProcess.on('error', (error) => {
                reject(new Error(`Failed to install markitdown-mcp: ${error.message}`));
            });
        });
    }

    /**
     * Run markitdown-mcp with the provided arguments
     */
    async runMarkItDown(args) {
        const venvPython = this.getVenvPython();
        const isHttpMode = args.includes('--http') || args.includes('--sse');
        
        // Only show debug info in HTTP mode to avoid interfering with STDIO MCP communication
        if (isHttpMode) {
            this.log('🚀 Starting MarkItDown MCP server...');
            this.log(`🔍 Debug: Python path: ${venvPython}`);
            this.log(`🔍 Debug: Args: ${JSON.stringify(args)}`);
            this.log(`🔍 Debug: Full command: ${venvPython} -m markitdown_mcp ${args.join(' ')}`);
        }
        
        // Verify the Python executable exists
        if (!fs.existsSync(venvPython)) {
            throw new Error(`Python executable not found at: ${venvPython}`);
        }
        
        // Spawn the markitdown-mcp process
        // In STDIO mode, we need completely transparent communication
        const mcpProcess = spawn(venvPython, ['-m', 'markitdown_mcp'].concat(args), {
            stdio: 'inherit'
        });

        // Handle process events (silently in STDIO mode)
        mcpProcess.on('error', (error) => {
            this.logError(`❌ Error starting MCP server: ${error.message}`, true);
            process.exit(1);
        });

        mcpProcess.on('exit', (code, signal) => {
            // In STDIO mode, exit silently
            if (isHttpMode) {
                if (signal) {
                    this.log(`🔄 MCP server terminated by signal: ${signal}`);
                } else if (code !== 0) {
                    this.logError(`❌ MCP server exited with code: ${code}`);
                }
            }
            process.exit(code || 0);
        });

        // Handle termination signals
        process.on('SIGINT', () => {
            mcpProcess.kill('SIGINT');
        });

        process.on('SIGTERM', () => {
            mcpProcess.kill('SIGTERM');
        });
    }

    /**
     * Main execution method
     */
    async run() {
        try {
            const args = process.argv.slice(2);
            const isSetupMode = args.includes('--help') || args.includes('-h') || 
                               !(await this.checkVenvExists());
            
            // Only show header during setup or help
            if (isSetupMode) {
                this.log('🔍 MarkItDown MCP NPX Wrapper', true);
                this.log('================================', true);
            }
            
            // Handle --help quickly without setup
            if (args.includes('--help') || args.includes('-h')) {
                this.log('MarkItDown MCP NPX Wrapper', true);
                this.log('', true);
                this.log('Usage: markitdown-mcp-npx [options]', true);
                this.log('', true);
                this.log('Options:', true);
                this.log('  --http           Run with Streamable HTTP and SSE transport (default: STDIO)', true);
                this.log('  --sse            Alias for --http (deprecated)', true);
                this.log('  --host HOST      Host to bind to (default: 127.0.0.1)', true);
                this.log('  --port PORT      Port to listen on (default: 3001)', true);
                this.log('  --help, -h       Show this help message', true);
                this.log('', true);
                this.log('Examples:', true);
                this.log('  markitdown-mcp-npx                                # STDIO mode', true);
                this.log('  markitdown-mcp-npx --http                         # HTTP mode', true);
                this.log('  markitdown-mcp-npx --http --host 0.0.0.0 --port 8080  # Custom host/port', true);
                return;
            }
            
            // Check if virtual environment exists and is ready
            const venvReady = await this.checkVenvExists();
            
            if (!venvReady) {
                this.log('⚙️  Setting up MarkItDown MCP environment...', true);
                await this.createVenv();
                await this.installMarkItDown();
                this.log('✅ Environment setup complete!', true);
                this.log('', true);
            } else {
                this.log('✓ Environment already set up');
            }
            
            // Check for optional system dependencies
            this.checkOptionalDependencies();
            
            // Run markitdown-mcp
            await this.runMarkItDown(args);
            
        } catch (error) {
            this.logError(`❌ Error: ${error.message}`, true);
            this.logError('', true);
            this.logError('💡 Troubleshooting:', true);
            this.logError('   1. Ensure Python 3.10+ is installed and available in PATH', true);
            this.logError('   2. Check internet connectivity for package installation', true);
            this.logError('   3. Verify write permissions to temporary directory', true);
            process.exit(1);
        }
    }
}

// Run the application
if (require.main === module) {
    const runner = new MarkItDownMCPRunner();
    runner.run();
}

module.exports = MarkItDownMCPRunner;
