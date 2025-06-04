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
     * Check for optional system dependencies
     */
    checkOptionalDependencies() {
        const warnings = [];
        
        // Check for ffmpeg (needed for audio file processing)
        try {
            require('child_process').execSync('ffmpeg -version', { stdio: 'pipe' });
            console.log('✓ ffmpeg found - audio file processing available');
        } catch (error) {
            warnings.push('⚠️  ffmpeg not found - audio file processing will be limited');
            warnings.push('   Install: https://ffmpeg.org/download.html');
        }
        
        // Check for exiftool (needed for advanced image metadata)
        try {
            require('child_process').execSync('exiftool -ver', { stdio: 'pipe' });
            console.log('✓ exiftool found - advanced image metadata available');
        } catch (error) {
            warnings.push('⚠️  exiftool not found - some image metadata features limited');
            warnings.push('   Install: https://exiftool.org/');
        }
        
        if (warnings.length > 0) {
            console.log('');
            console.log('📋 Optional Dependencies:');
            warnings.forEach(warning => console.log(warning));
            console.log('');
            console.log('💡 These are optional - MarkItDown will work without them');
            console.log('   Most file types (PDF, Word, Excel, images) work fine without these tools');
            console.log('   Only needed for: audio files (.mp3, .wav) and advanced image metadata');
            console.log('');
        }
    }

    /**
     * Detect available Python command
     */
    detectPython() {
        const pythonCmds = ['python3', 'python'];
        
        for (const cmd of pythonCmds) {
            try {
                const result = require('child_process').execSync(`${cmd} --version`, { 
                    encoding: 'utf8', 
                    stdio: 'pipe' 
                });
                if (result.includes('Python 3.')) {
                    console.log(`✓ Found Python: ${cmd}`);
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
        console.log('📦 Creating Python virtual environment...');
        
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }

        return new Promise((resolve, reject) => {
            const venvProcess = spawn(this.pythonCmd, ['-m', 'venv', this.venvPath], {
                stdio: 'inherit'
            });

            venvProcess.on('exit', (code) => {
                if (code === 0) {
                    console.log('✓ Virtual environment created');
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
        console.log('📥 Installing markitdown-mcp...');
        
        const venvPython = this.getVenvPython();
        
        return new Promise((resolve, reject) => {
            const installProcess = spawn(venvPython, ['-m', 'pip', 'install', 'markitdown-mcp'], {
                stdio: 'inherit'
            });

            installProcess.on('exit', (code) => {
                if (code === 0) {
                    console.log('✓ markitdown-mcp installed successfully');
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
        
        console.log('🚀 Starting MarkItDown MCP server...');
        
        // Spawn the markitdown-mcp process
        const mcpProcess = spawn(venvPython, ['-m', 'markitdown_mcp'].concat(args), {
            stdio: 'inherit'
        });

        // Handle process events
        mcpProcess.on('error', (error) => {
            console.error(`❌ Error starting MCP server: ${error.message}`);
            process.exit(1);
        });

        mcpProcess.on('exit', (code, signal) => {
            if (signal) {
                console.log(`🔄 MCP server terminated by signal: ${signal}`);
            } else if (code !== 0) {
                console.error(`❌ MCP server exited with code: ${code}`);
            }
            process.exit(code || 0);
        });

        // Handle termination signals
        process.on('SIGINT', () => {
            console.log('\\n🛑 Received SIGINT, shutting down...');
            mcpProcess.kill('SIGINT');
        });

        process.on('SIGTERM', () => {
            console.log('\\n🛑 Received SIGTERM, shutting down...');
            mcpProcess.kill('SIGTERM');
        });
    }

    /**
     * Main execution method
     */
    async run() {
        try {
            console.log('🔍 MarkItDown MCP NPX Wrapper');
            console.log('================================');
            
            // Parse command line arguments
            const args = process.argv.slice(2);
            
            // Handle --help quickly without setup
            if (args.includes('--help') || args.includes('-h')) {
                console.log('MarkItDown MCP NPX Wrapper');
                console.log('');
                console.log('Usage: markitdown-mcp-npx [options]');
                console.log('');
                console.log('Options:');
                console.log('  --http           Run with Streamable HTTP and SSE transport (default: STDIO)');
                console.log('  --sse            Alias for --http (deprecated)');
                console.log('  --host HOST      Host to bind to (default: 127.0.0.1)');
                console.log('  --port PORT      Port to listen on (default: 3001)');
                console.log('  --help, -h       Show this help message');
                console.log('');
                console.log('Examples:');
                console.log('  markitdown-mcp-npx                                # STDIO mode');
                console.log('  markitdown-mcp-npx --http                         # HTTP mode');
                console.log('  markitdown-mcp-npx --http --host 0.0.0.0 --port 8080  # Custom host/port');
                return;
            }
            
            // Check if virtual environment exists and is ready
            const venvReady = await this.checkVenvExists();
            
            if (!venvReady) {
                console.log('⚙️  Setting up MarkItDown MCP environment...');
                await this.createVenv();
                await this.installMarkItDown();
                console.log('✅ Environment setup complete!');
                console.log('');
            } else {
                console.log('✓ Environment already set up');
            }
            
            // Check for optional system dependencies
            this.checkOptionalDependencies();
            
            // Run markitdown-mcp
            await this.runMarkItDown(args);
            
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
            console.error('');
            console.error('💡 Troubleshooting:');
            console.error('   1. Ensure Python 3.10+ is installed and available in PATH');
            console.error('   2. Check internet connectivity for package installation');
            console.error('   3. Verify write permissions to temporary directory');
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
