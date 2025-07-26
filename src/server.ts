import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { PostmanAPIClient } from './utils/postman-client.js';
import { workspaceTools, handleWorkspaceTool } from './tools/workspace-tools.js';
import { collectionTools, handleCollectionTool } from './tools/collection-tools.js';
import { environmentTools, handleEnvironmentTool } from './tools/environment-tools.js';

export class PostmanMCPServer {
  private server: Server;
  private postmanClient: PostmanAPIClient;

  constructor() {
    this.server = new Server(
      {
        name: 'postman-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Postman client
    const apiKey = process.env['POSTMAN_API_KEY'];
    if (!apiKey) {
      throw new Error('POSTMAN_API_KEY environment variable is required');
    }
    this.postmanClient = new PostmanAPIClient(apiKey);

    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          ...workspaceTools,
          ...collectionTools,
          ...environmentTools,
        ],
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Workspace tools
        if (workspaceTools.some(tool => tool.name === name)) {
          return await handleWorkspaceTool(name, args, this.postmanClient);
        }

        // Collection tools
        if (collectionTools.some(tool => tool.name === name)) {
          return await handleCollectionTool(name, args, this.postmanClient);
        }

        // Environment tools
        if (environmentTools.some(tool => tool.name === name)) {
          return await handleEnvironmentTool(name, args, this.postmanClient);
        }

        throw new Error(`Unknown tool: ${name}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async start(): Promise<void> {
    // Validate API connection on startup
    try {
      await this.postmanClient.validateConnection();
      console.error('✅ Successfully connected to Postman API');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to connect to Postman API: ${errorMessage}`);
      process.exit(1);
    }

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🚀 Postman MCP Server started');
  }

  async stop(): Promise<void> {
    await this.server.close();
    console.error('🛑 Postman MCP Server stopped');
  }
}
