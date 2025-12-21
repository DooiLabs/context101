# Context101 FastMCP Server

FastMCP-based MCP server exposing Context101 course tools.

This server is remote-only: all course data and progress are fetched from `https://api.context101.org`.

## Development

```bash
pnpm install
pnpm run build
node dist/index.js --transport stdio
```

## HTTP transport

```bash
node dist/index.js --transport http --port 3000
```
