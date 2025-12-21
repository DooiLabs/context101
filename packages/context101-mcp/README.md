# Context101 MCP Server

FastMCP-based MCP server exposing Context101 course tools.

This server is remote-only: all course data and progress are fetched from `https://api.context101.org`.

## Development

```bash
pnpm install
pnpm run build
node dist/index.js --transport stdio
```
