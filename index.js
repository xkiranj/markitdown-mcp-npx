/**
 * MarkItDown MCP NPX - Main Entry Point
 * 
 * This module provides an NPX-compatible wrapper for Microsoft's MarkItDown MCP server,
 * eliminating the need for Docker while maintaining full compatibility.
 */

const MarkItDownMCPRunner = require('./bin/markitdown-mcp-npx.js');

/**
 * Export the main runner class for programmatic usage
 */
module.exports = MarkItDownMCPRunner;

/**
 * CLI entry point when run directly
 */
if (require.main === module) {
    console.log('ℹ️  Note: For NPX usage, use: npx markitdown-mcp-npx');
    console.log('   Running directly from index.js...');
    console.log('');
    
    const runner = new MarkItDownMCPRunner();
    runner.run();
}
