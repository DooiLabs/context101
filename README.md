<p align="center">
  <a href="https://roadmap.sh/"><img width="32" height="32" alt="image" src="https://github.com/user-attachments/assets/dc125163-b253-49f0-b6d2-5920c2bfc573" />
</a>
  <h2 align="center"><a href="https://roadmap.sh">Context101</a></h2>
  <p align="center">Learn coding directly in your AI code editor<p>
  <p align="center">
    <a href="https://roadmap.sh/roadmaps">
    	<img src="https://img.shields.io/badge/%E2%9C%A8-Roadmaps%20-0a0a0a.svg?style=flat&colorA=0a0a0a" alt="roadmaps" />
    </a>
    <a href="https://roadmap.sh/best-practices">
    	<img src="https://img.shields.io/badge/%E2%9C%A8-Best%20Practices-0a0a0a.svg?style=flat&colorA=0a0a0a" alt="best practices" />
    </a>
    <a href="https://roadmap.sh/questions">
    	<img src="https://img.shields.io/badge/%E2%9C%A8-Questions-0a0a0a.svg?style=flat&colorA=0a0a0a" alt="videos" />
    </a>
    <a href="https://www.youtube.com/channel/UCA0H2KIWgWTwpTFjSxp0now?sub_confirmation=1">
    	<img src="https://img.shields.io/badge/%E2%9C%A8-YouTube%20Channel-0a0a0a.svg?style=flat&colorA=0a0a0a" alt="roadmaps" />
    </a>
  </p>
</p>
<br>
<img width="1722" height="1079" alt="Screenshot 2025-12-22 at 3 34 45 PM" src="https://github.com/user-attachments/assets/452e3579-ee7f-482a-ab67-7debf75ba925" />

![](https://i.imgur.com/waxVImv.png)

The AI-native way to learn coding, powered by a MCP based course.

### [View all Roadmaps](https://roadmap.sh) &nbsp;&middot;&nbsp; [Best Practices](https://roadmap.sh/best-practices) &nbsp;&middot;&nbsp; [Questions](https://roadmap.sh/questions)

![](https://i.imgur.com/waxVImv.png)

# Context101 MCP — Learn Coding Inside Your AI Code Editor

Context101 is an **MCP server**.
Add it to your AI code editor (Cursor / VS Code / Windsurf / Claude Code / etc.) and **learn coding without leaving your editor**.

## ✅ What it does

LLMs are great at explaining code, but learning gets messy since conversations aren't structured.

Context101 solves that by delivering a structured course (steps, checkpoints, quizes) **directly into your editor’s AI chat** via MCP.

* ✅ Learn-by-building, inside the editor
* ✅ No tab switching
* ✅ Structured guidance (step → code → feedback → next step)

## 🛠 Installation

### Requirements

* Node.js >= 18
* Any MCP client (Cursor, VS Code, Windsurf, Claude Code, etc.)

### Cursor / Any MCP client (Local, via npx)

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

> Cursor tip: you can place it in `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project).

## 🧠 Usage

Once installed, just talk to your editor as usual:

```txt
Teach me React step-by-step by building a small project.
```

```txt
I want to learn backend fundamentals with checkpoints and exercises.
```

Context101 will inject the course context so your editor AI can guide you cleanly and consistently.

## 📚 Courses

More coming — the idea is simple:
**courses should live where you code.**


## 📄 License

MIT
