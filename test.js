#!/usr/bin/env node

/**
 * Test script for MarkItDown MCP NPX
 * This script performs basic validation of the setup
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class Tester {
    constructor() {
        this.passed = 0;
        this.failed = 0;
    }

    async test(name, testFn) {
        process.stdout.write(`🧪 ${name}... `);
        try {
            await testFn();
            console.log('✅ PASS');
            this.passed++;
        } catch (error) {
            console.log(`❌ FAIL: ${error.message}`);
            this.failed++;
        }
    }

    async checkNodeVersion() {
        return new Promise((resolve, reject) => {
            exec('node --version', (error, stdout) => {
                if (error) {
                    reject(new Error('Node.js not found'));
                    return;
                }
                const version = stdout.trim();
                const majorVersion = parseInt(version.replace('v', '').split('.')[0]);
                if (majorVersion < 16) {
                    reject(new Error(`Node.js version ${version} is too old (need 16+)`));
                    return;
                }
                resolve();
            });
        });
    }

    async checkPythonVersion() {
        return new Promise((resolve, reject) => {
            const pythonCmds = ['python', 'python3'];
            
            const tryCommand = (cmd) => {
                exec(`${cmd} --version`, (error, stdout, stderr) => {
                    if (error) {
                        // Try next command
                        const nextCmd = pythonCmds.shift();
                        if (nextCmd) {
                            tryCommand(nextCmd);
                        } else {
                            reject(new Error('Python 3.10+ not found'));
                        }
                        return;
                    }
                    
                    const output = stdout || stderr;
                    const match = output.match(/Python (\d+)\.(\d+)/);
                    if (!match) {
                        reject(new Error('Could not parse Python version'));
                        return;
                    }
                    
                    const major = parseInt(match[1]);
                    const minor = parseInt(match[2]);
                    
                    if (major < 3 || (major === 3 && minor < 10)) {
                        reject(new Error(`Python version ${major}.${minor} is too old (need 3.10+)`));
                        return;
                    }
                    
                    resolve();
                });
            };
            
            tryCommand(pythonCmds.shift());
        });
    }

    async checkPackageJson() {
        const packagePath = path.join(__dirname, 'package.json');
        if (!fs.existsSync(packagePath)) {
            throw new Error('package.json not found');
        }
        
        const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        if (!packageData.bin || !packageData.bin['markitdown-mcp-npx']) {
            throw new Error('Binary not defined in package.json');
        }
    }

    async checkBinaryExists() {
        const binaryPath = path.join(__dirname, 'bin', 'markitdown-mcp-npx.js');
        if (!fs.existsSync(binaryPath)) {
            throw new Error('Binary script not found');
        }
    }

    async checkBinaryExecutable() {
        return new Promise((resolve, reject) => {
            const binaryPath = path.join(__dirname, 'bin', 'markitdown-mcp-npx.js');
            const process = spawn('node', [binaryPath, '--help'], {
                stdio: 'pipe'
            });

            let output = '';
            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                output += data.toString();
            });

            process.on('exit', (code) => {
                if (code === 0 || output.includes('MarkItDown MCP')) {
                    resolve();
                } else {
                    reject(new Error(`Binary execution failed with code ${code}`));
                }
            });

            process.on('error', (error) => {
                reject(new Error(`Failed to execute binary: ${error.message}`));
            });

            // Timeout after 5 seconds
            const timeoutId = setTimeout(() => {
                process.kill();
                reject(new Error('Binary execution timed out'));
            }, 5000);
            
            process.on('exit', () => {
                clearTimeout(timeoutId);
            });
        });
    }

    async run() {
        console.log('🔍 MarkItDown MCP NPX - Test Suite');
        console.log('=====================================');
        console.log('');

        await this.test('Node.js version check', () => this.checkNodeVersion());
        await this.test('Python version check', () => this.checkPythonVersion());
        await this.test('Package.json validation', () => this.checkPackageJson());
        await this.test('Binary script exists', () => this.checkBinaryExists());
        await this.test('Binary script executable', () => this.checkBinaryExecutable());

        console.log('');
        console.log('📊 Test Results:');
        console.log(`   ✅ Passed: ${this.passed}`);
        console.log(`   ❌ Failed: ${this.failed}`);
        console.log(`   📈 Success Rate: ${Math.round((this.passed / (this.passed + this.failed)) * 100)}%`);

        if (this.failed === 0) {
            console.log('');
            console.log('🎉 All tests passed! The NPX wrapper should work correctly.');
            console.log('');
            console.log('💡 Next steps:');
            console.log('   1. Test with: npx markitdown-mcp-npx --help');
            console.log('   2. Test with MCP Inspector: npx @modelcontextprotocol/inspector');
            console.log('   3. Configure Claude Desktop (see TESTING.md)');
        } else {
            console.log('');
            console.log('⚠️  Some tests failed. Please resolve the issues before using the NPX wrapper.');
            process.exit(1);
        }
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    const tester = new Tester();
    tester.run().catch(error => {
        console.error(`💥 Test runner failed: ${error.message}`);
        process.exit(1);
    });
}

module.exports = Tester;
