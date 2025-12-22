# ✍️ Context101

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=context7&config=eyJ1cmwiOiJodHRwczovL21jcC5jb250ZXh0Ny5jb20vbWNwIn0%3D) [<img alt="Install in VS Code (npx)" src="https://img.shields.io/badge/Install%20in%20VS%20Code-0098FF?style=for-the-badge&logo=visualstudiocode&logoColor=white">](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%7B%22name%22%3A%22context7%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40upstash%2Fcontext7-mcp%40latest%22%5D%7D)


Learn coding inside your AI code editor. Context101 is the AI-native way to learn coding, powered by a MCP based course.

<img
  src="https://github.com/user-attachments/assets/58c60b9c-b963-4b96-8e99-75ff041454b9"
  alt="Context101 Screenshot"
  width="100%"
/>

### 👩‍💻 How to learn with Context101

**Step 1** Add context101 mcp server to your AI code editor (cursor/windsurf/antigravity/etc). 
Add this to your MCP config:

```json
{
  "mcpServers": {
    "context101": {
      "command": "npx",
      "args": ["-y", "@dooi/context101"]
    }
  }
}
```
**Step 2** Once installed, just talk to your editor as usual:

```txt
Teach me React step-by-step by building a small project.
```

```txt
I want to learn backend fundamentals with checkpoints and exercises.
```

Context101 will inject the course context so your editor AI can guide you cleanly and consistently.


<img src="vscode/assets/demo.gif" width="520px" />

### 📝 Languages supported

- Python
- JavaScript
- TypeScript
- JSX and TSX files
- C and C++
- PHP
- Java
- C#
- Ruby
- Rust
- Dart
- Go
- 🚧 More under construction

### 📑 Docstring formats supported

- JSDoc
- reST
- NumPy
- DocBlock
- Doxygen
- Javadoc
- GoDoc
- XML
- Google
- 🚧 More under construction

### 🚨 Disclaimer

We never store your code, but your code does leave your machine.

---

### More information

[Website](https://context101.org/)
[Twitter](https://twitter.com/context101.org)
