import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { PostmanAPIClient } from './utils/postman-client.js';
import { workspaceTools, handleWorkspaceTool } from './tools/workspace-tools.js';
import { collectionTools, handleCollectionTool } from './tools/collection-tools.js';
import { environmentTools, handleEnvironmentTool } from './tools/environment-tools.js';
import { requestFolderTools, handleRequestFolderTool } from './tools/request-folder-tools.js';
export class PostmanMCPServer {
    server;
    postmanClient;
    constructor() {
        this.server = new Server({
            name: 'postman-mcp-server',
            version: '0.1.4',
        }, {
            capabilities: {
                tools: {},
            },
        });
        // Initialize Postman client
        const apiKey = process.env['POSTMAN_API_KEY'];
        if (!apiKey) {
            // In CI/test environments, we might not have an API key
            if (process.env['CI'] || process.env['NODE_ENV'] === 'test') {
                console.error('⚠️  Running in CI/test mode without Postman API key');
                // Create a dummy client that will fail gracefully
                this.postmanClient = new PostmanAPIClient('dummy-key-for-ci');
            }
            else {
                throw new Error('POSTMAN_API_KEY environment variable is required');
            }
        }
        else {
            this.postmanClient = new PostmanAPIClient(apiKey);
        }
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        // List tools handler
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    ...workspaceTools,
                    ...collectionTools,
                    ...environmentTools,
                    ...requestFolderTools,
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
                // Request and Folder tools
                if (requestFolderTools.some(tool => tool.name === name)) {
                    return await handleRequestFolderTool(name, args, this.postmanClient);
                }
                throw new Error(`Unknown tool: ${name}`);
            }
            catch (error) {
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
    async start() {
        // Validate API connection on startup (skip in CI/test environments)
        const isCI = process.env['CI'] || process.env['NODE_ENV'] === 'test';
        if (!isCI) {
            try {
                await this.postmanClient.validateConnection();
                console.error('✅ Successfully connected to Postman API');
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`❌ Failed to connect to Postman API: ${errorMessage}`);
                process.exit(1);
            }
        }
        else {
            console.error('⚠️  Skipping API validation in CI/test environment');
        }
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('🚀 Postman MCP Server started');
    }
    async stop() {
        await this.server.close();
        console.error('🛑 Postman MCP Server stopped');
    }
}
//# sourceMappingURL=server.js.map