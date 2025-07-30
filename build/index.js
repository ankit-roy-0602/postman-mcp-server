#!/usr/bin/env node
import { PostmanMCPServer } from './server.js';
function showHelp() {
    console.log(`
Postman MCP Server v1.0.0

A Model Context Protocol (MCP) server for Postman API integration.

Usage:
  postman-mcp-server [options]

Options:
  --help, -h     Show this help message
  --version, -v  Show version information

Environment Variables:
  POSTMAN_API_KEY  Your Postman API key (required)

Configuration:
  Add this server to your MCP client configuration:

  {
    "mcpServers": {
      "postman": {
        "command": "postman-mcp-server",
        "env": {
          "POSTMAN_API_KEY": "your-postman-api-key-here"
        }
      }
    }
  }

For more information, visit:
https://github.com/ankit-roy-0602/postman-mcp-server
`);
}
function showVersion() {
    console.log('1.0.0');
}
async function main() {
    const args = process.argv.slice(2);
    // Handle CLI arguments
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }
    if (args.includes('--version') || args.includes('-v')) {
        showVersion();
        process.exit(0);
    }
    const server = new PostmanMCPServer();
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        await server.stop();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        await server.stop();
        process.exit(0);
    });
    try {
        await server.start();
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map