# Contributing to MarkItDown MCP NPX

Thank you for your interest in contributing to this NPX wrapper for Microsoft's MarkItDown MCP server!

## 🤝 How to Contribute

### Reporting Issues
- Check existing issues first
- Use clear, descriptive titles
- Include your environment details (Node.js version, Python version, OS)
- Provide reproduction steps

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the use case and benefits
- Consider compatibility with the original Docker version

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test your changes**:
   ```bash
   npm test
   # or
   node test.js
   ```
5. **Commit with clear messages**:
   ```bash
   git commit -m "Add: brief description of your change"
   ```
6. **Push and create a Pull Request**

## 🧪 Testing

Before submitting:
- Run the test suite: `npm test`
- Test with MCP Inspector
- Verify compatibility with Claude Desktop
- Test on different platforms if possible

## 📝 Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow existing code patterns
- Handle errors gracefully

## 🎯 Development Focus Areas

- **Cross-platform compatibility**: Windows, macOS, Linux
- **Error handling**: Graceful degradation and helpful error messages
- **Performance**: Minimize setup time and resource usage
- **Documentation**: Keep README and examples up to date

## 🙏 Acknowledgments

This project builds upon Microsoft's excellent work:
- [MarkItDown](https://github.com/microsoft/markitdown)
- [MarkItDown MCP](https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
