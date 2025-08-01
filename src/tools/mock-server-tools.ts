import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { PostmanAPIClient } from '../utils/postman-client.js';

const ListMockServersSchema = z.object({});

const GetMockServerSchema = z.object({
  mockId: z.string().describe('The ID of the mock server to retrieve'),
});

const CreateMockServerSchema = z.object({
  name: z.string().describe('Name of the mock server'),
  collectionId: z
    .string()
    .describe('ID of the collection to create mock server for'),
  environmentId: z
    .string()
    .optional()
    .describe('Optional environment ID to use'),
  private: z
    .boolean()
    .optional()
    .describe('Whether the mock server should be private'),
  versionTag: z.string().optional().describe('Version tag for the collection'),
  config: z
    .object({
      headers: z
        .array(
          z.object({
            key: z.string(),
            value: z.string(),
          })
        )
        .optional()
        .describe('Default headers for mock responses'),
      matchBody: z
        .boolean()
        .optional()
        .describe('Whether to match request body'),
      matchQueryParams: z
        .boolean()
        .optional()
        .describe('Whether to match query parameters'),
      matchWildcards: z
        .boolean()
        .optional()
        .describe('Whether to match wildcards'),
      delay: z
        .object({
          type: z.enum(['fixed', 'random']),
          preset: z.enum(['low', 'medium', 'high']).optional(),
          value: z.number().optional(),
        })
        .optional()
        .describe('Response delay configuration'),
    })
    .optional()
    .describe('Mock server configuration'),
});

const CreateAIMockServerSchema = z.object({
  name: z.string().describe('Name of the AI-powered mock server'),
  collectionId: z
    .string()
    .describe('ID of the collection to create mock server for'),
  environmentId: z
    .string()
    .optional()
    .describe('Optional environment ID to use'),
  private: z
    .boolean()
    .optional()
    .describe('Whether the mock server should be private'),
  generateRealisticData: z
    .boolean()
    .optional()
    .describe('Generate realistic data using Postman dynamic variables'),
  includeErrorResponses: z
    .boolean()
    .optional()
    .describe('Include error response examples (400, 401, 404, 500)'),
  responseDelay: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .describe('Response delay preset'),
});

const UpdateMockServerSchema = z.object({
  mockId: z.string().describe('The ID of the mock server to update'),
  name: z.string().optional().describe('New name for the mock server'),
  environmentId: z.string().optional().describe('New environment ID'),
  private: z
    .boolean()
    .optional()
    .describe('Whether the mock server should be private'),
  config: z
    .object({
      headers: z
        .array(
          z.object({
            key: z.string(),
            value: z.string(),
          })
        )
        .optional()
        .describe('Default headers for mock responses'),
      matchBody: z
        .boolean()
        .optional()
        .describe('Whether to match request body'),
      matchQueryParams: z
        .boolean()
        .optional()
        .describe('Whether to match query parameters'),
      matchWildcards: z
        .boolean()
        .optional()
        .describe('Whether to match wildcards'),
      delay: z
        .object({
          type: z.enum(['fixed', 'random']),
          preset: z.enum(['low', 'medium', 'high']).optional(),
          value: z.number().optional(),
        })
        .optional()
        .describe('Response delay configuration'),
    })
    .optional()
    .describe('Mock server configuration'),
});

const DeleteMockServerSchema = z.object({
  mockId: z.string().describe('The ID of the mock server to delete'),
});

const GetMockServerCallLogsSchema = z.object({
  mockId: z.string().describe('The ID of the mock server to get call logs for'),
  limit: z
    .number()
    .optional()
    .describe('Maximum number of call logs to retrieve'),
});

export const mockServerTools: Tool[] = [
  {
    name: 'list_mock_servers',
    description: 'List all mock servers in your Postman account',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_mock_server',
    description: 'Get detailed information about a specific mock server',
    inputSchema: {
      type: 'object',
      properties: {
        mockId: {
          type: 'string',
          description: 'The ID of the mock server to retrieve',
        },
      },
      required: ['mockId'],
    },
  },
  {
    name: 'create_mock_server',
    description: 'Create a new mock server from a collection',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the mock server',
        },
        collectionId: {
          type: 'string',
          description: 'ID of the collection to create mock server for',
        },
        environmentId: {
          type: 'string',
          description: 'Optional environment ID to use',
        },
        private: {
          type: 'boolean',
          description: 'Whether the mock server should be private',
        },
        versionTag: {
          type: 'string',
          description: 'Version tag for the collection',
        },
        config: {
          type: 'object',
          properties: {
            headers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  value: { type: 'string' },
                },
                required: ['key', 'value'],
              },
              description: 'Default headers for mock responses',
            },
            matchBody: {
              type: 'boolean',
              description: 'Whether to match request body',
            },
            matchQueryParams: {
              type: 'boolean',
              description: 'Whether to match query parameters',
            },
            matchWildcards: {
              type: 'boolean',
              description: 'Whether to match wildcards',
            },
            delay: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['fixed', 'random'],
                },
                preset: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                },
                value: {
                  type: 'number',
                },
              },
              required: ['type'],
              description: 'Response delay configuration',
            },
          },
          description: 'Mock server configuration',
        },
      },
      required: ['name', 'collectionId'],
    },
  },
  {
    name: 'create_ai_mock_server',
    description:
      'Create an AI-powered mock server with automatically generated realistic examples and error responses',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the AI-powered mock server',
        },
        collectionId: {
          type: 'string',
          description: 'ID of the collection to create mock server for',
        },
        environmentId: {
          type: 'string',
          description: 'Optional environment ID to use',
        },
        private: {
          type: 'boolean',
          description: 'Whether the mock server should be private',
        },
        generateRealisticData: {
          type: 'boolean',
          description:
            'Generate realistic data using Postman dynamic variables (default: true)',
        },
        includeErrorResponses: {
          type: 'boolean',
          description:
            'Include error response examples (400, 401, 404, 500) (default: true)',
        },
        responseDelay: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description: 'Response delay preset',
        },
      },
      required: ['name', 'collectionId'],
    },
  },
  {
    name: 'update_mock_server',
    description: 'Update an existing mock server configuration',
    inputSchema: {
      type: 'object',
      properties: {
        mockId: {
          type: 'string',
          description: 'The ID of the mock server to update',
        },
        name: {
          type: 'string',
          description: 'New name for the mock server',
        },
        environmentId: {
          type: 'string',
          description: 'New environment ID',
        },
        private: {
          type: 'boolean',
          description: 'Whether the mock server should be private',
        },
        config: {
          type: 'object',
          properties: {
            headers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  value: { type: 'string' },
                },
                required: ['key', 'value'],
              },
              description: 'Default headers for mock responses',
            },
            matchBody: {
              type: 'boolean',
              description: 'Whether to match request body',
            },
            matchQueryParams: {
              type: 'boolean',
              description: 'Whether to match query parameters',
            },
            matchWildcards: {
              type: 'boolean',
              description: 'Whether to match wildcards',
            },
            delay: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['fixed', 'random'],
                },
                preset: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                },
                value: {
                  type: 'number',
                },
              },
              required: ['type'],
              description: 'Response delay configuration',
            },
          },
          description: 'Mock server configuration',
        },
      },
      required: ['mockId'],
    },
  },
  {
    name: 'delete_mock_server',
    description: 'Delete a mock server',
    inputSchema: {
      type: 'object',
      properties: {
        mockId: {
          type: 'string',
          description: 'The ID of the mock server to delete',
        },
      },
      required: ['mockId'],
    },
  },
  {
    name: 'get_mock_server_call_logs',
    description: 'Get call logs for a mock server to see how it has been used',
    inputSchema: {
      type: 'object',
      properties: {
        mockId: {
          type: 'string',
          description: 'The ID of the mock server to get call logs for',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of call logs to retrieve',
        },
      },
      required: ['mockId'],
    },
  },
];

export async function handleMockServerTool(
  name: string,
  args: unknown,
  client: PostmanAPIClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case 'list_mock_servers': {
      ListMockServersSchema.parse(args);
      const mockServers = await client.listMockServers();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockServers, null, 2),
          },
        ],
      };
    }

    case 'get_mock_server': {
      const parsed = GetMockServerSchema.parse(args);
      const mockServer = await client.getMockServer(parsed.mockId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockServer, null, 2),
          },
        ],
      };
    }

    case 'create_mock_server': {
      const parsed = CreateMockServerSchema.parse(args);
      const mockServerRequest: {
        name: string;
        collectionId: string;
        environmentId?: string;
        private?: boolean;
        versionTag?: string;
        config?: {
          headers?: Array<{ key: string; value: string }>;
          matchBody?: boolean;
          matchQueryParams?: boolean;
          matchWildcards?: boolean;
          delay?: {
            type: 'fixed' | 'random';
            preset?: 'low' | 'medium' | 'high';
            value?: number;
          };
        };
      } = {
        name: parsed.name,
        collectionId: parsed.collectionId,
      };

      if (parsed.environmentId !== undefined)
        mockServerRequest.environmentId = parsed.environmentId;
      if (parsed.private !== undefined)
        mockServerRequest.private = parsed.private;
      if (parsed.versionTag !== undefined)
        mockServerRequest.versionTag = parsed.versionTag;
      if (parsed.config !== undefined) {
        mockServerRequest.config = {};
        if (parsed.config.headers !== undefined) {
          mockServerRequest.config.headers = parsed.config.headers;
        }
        if (parsed.config.matchBody !== undefined) {
          mockServerRequest.config.matchBody = parsed.config.matchBody;
        }
        if (parsed.config.matchQueryParams !== undefined) {
          mockServerRequest.config.matchQueryParams =
            parsed.config.matchQueryParams;
        }
        if (parsed.config.matchWildcards !== undefined) {
          mockServerRequest.config.matchWildcards =
            parsed.config.matchWildcards;
        }
        if (parsed.config.delay !== undefined) {
          mockServerRequest.config.delay = {
            type: parsed.config.delay.type,
          };
          if (parsed.config.delay.preset !== undefined) {
            mockServerRequest.config.delay.preset = parsed.config.delay.preset;
          }
          if (parsed.config.delay.value !== undefined) {
            mockServerRequest.config.delay.value = parsed.config.delay.value;
          }
        }
      }

      const mockServer = await client.createMockServer(mockServerRequest);
      return {
        content: [
          {
            type: 'text',
            text: `Mock server created successfully:\n${JSON.stringify(mockServer, null, 2)}`,
          },
        ],
      };
    }

    case 'create_ai_mock_server': {
      const parsed = CreateAIMockServerSchema.parse(args);
      const options: {
        environmentId?: string;
        private?: boolean;
        generateRealisticData?: boolean;
        includeErrorResponses?: boolean;
        responseDelay?: 'low' | 'medium' | 'high';
      } = {};

      if (parsed.environmentId !== undefined)
        options.environmentId = parsed.environmentId;
      if (parsed.private !== undefined) options.private = parsed.private;
      if (parsed.generateRealisticData !== undefined)
        options.generateRealisticData = parsed.generateRealisticData;
      if (parsed.includeErrorResponses !== undefined)
        options.includeErrorResponses = parsed.includeErrorResponses;
      if (parsed.responseDelay !== undefined)
        options.responseDelay = parsed.responseDelay;

      const result = await client.createMockServerWithAIExamples(
        parsed.collectionId,
        parsed.name,
        options
      );
      return {
        content: [
          {
            type: 'text',
            text: `AI-powered mock server created successfully!\n\n${result.summary}\n\nMock Server Details:\n${JSON.stringify(result.mockServer, null, 2)}`,
          },
        ],
      };
    }

    case 'update_mock_server': {
      const parsed = UpdateMockServerSchema.parse(args);
      const { mockId, ...rest } = parsed;
      const updates: {
        name?: string;
        environmentId?: string;
        private?: boolean;
        config?: {
          headers?: Array<{ key: string; value: string }>;
          matchBody?: boolean;
          matchQueryParams?: boolean;
          matchWildcards?: boolean;
          delay?: {
            type: 'fixed' | 'random';
            preset?: 'low' | 'medium' | 'high';
            value?: number;
          };
        };
      } = {};

      if (rest.name) updates.name = rest.name;
      if (rest.environmentId) updates.environmentId = rest.environmentId;
      if (rest.private !== undefined) updates.private = rest.private;
      if (rest.config) {
        updates.config = {};
        if (rest.config.headers !== undefined) {
          updates.config.headers = rest.config.headers;
        }
        if (rest.config.matchBody !== undefined) {
          updates.config.matchBody = rest.config.matchBody;
        }
        if (rest.config.matchQueryParams !== undefined) {
          updates.config.matchQueryParams = rest.config.matchQueryParams;
        }
        if (rest.config.matchWildcards !== undefined) {
          updates.config.matchWildcards = rest.config.matchWildcards;
        }
        if (rest.config.delay !== undefined) {
          updates.config.delay = {
            type: rest.config.delay.type,
          };
          if (rest.config.delay.preset !== undefined) {
            updates.config.delay.preset = rest.config.delay.preset;
          }
          if (rest.config.delay.value !== undefined) {
            updates.config.delay.value = rest.config.delay.value;
          }
        }
      }

      const mockServer = await client.updateMockServer(mockId, updates);
      return {
        content: [
          {
            type: 'text',
            text: `Mock server updated successfully:\n${JSON.stringify(mockServer, null, 2)}`,
          },
        ],
      };
    }

    case 'delete_mock_server': {
      const parsed = DeleteMockServerSchema.parse(args);
      await client.deleteMockServer(parsed.mockId);
      return {
        content: [
          {
            type: 'text',
            text: `Mock server ${parsed.mockId} deleted successfully`,
          },
        ],
      };
    }

    case 'get_mock_server_call_logs': {
      const parsed = GetMockServerCallLogsSchema.parse(args);
      const logs = await client.getMockServerCallLogs(
        parsed.mockId,
        parsed.limit
      );
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(logs, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown mock server tool: ${name}`);
  }
}
