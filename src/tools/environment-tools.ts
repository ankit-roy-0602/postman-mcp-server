import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { PostmanAPIClient } from '../utils/postman-client.js';

const PostmanVariableSchema = z.object({
  key: z.string().describe('Variable key'),
  value: z.string().describe('Variable value'),
  type: z.enum(['default', 'secret']).optional().describe('Variable type'),
  description: z.string().optional().describe('Variable description'),
});

const ListEnvironmentsSchema = z.object({
  workspaceId: z
    .string()
    .optional()
    .describe('Optional workspace ID to filter environments'),
});

const GetEnvironmentSchema = z.object({
  environmentId: z.string().describe('The ID of the environment to retrieve'),
});

const CreateEnvironmentSchema = z.object({
  name: z.string().describe('Name of the environment'),
  values: z
    .array(PostmanVariableSchema)
    .optional()
    .describe('Environment variables'),
  workspaceId: z
    .string()
    .optional()
    .describe('Workspace ID where the environment will be created'),
});

const UpdateEnvironmentSchema = z.object({
  environmentId: z.string().describe('The ID of the environment to update'),
  name: z.string().optional().describe('New name for the environment'),
  values: z
    .array(PostmanVariableSchema)
    .optional()
    .describe('Updated environment variables'),
});

const DeleteEnvironmentSchema = z.object({
  environmentId: z.string().describe('The ID of the environment to delete'),
});

export const environmentTools: Tool[] = [
  {
    name: 'list_environments',
    description: 'List all environments, optionally filtered by workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'string',
          description: 'Optional workspace ID to filter environments',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_environment',
    description:
      'Get detailed information about a specific environment including variables',
    inputSchema: {
      type: 'object',
      properties: {
        environmentId: {
          type: 'string',
          description: 'The ID of the environment to retrieve',
        },
      },
      required: ['environmentId'],
    },
  },
  {
    name: 'create_environment',
    description: 'Create a new Postman environment with variables',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the environment',
        },
        values: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                description: 'Variable key',
              },
              value: {
                type: 'string',
                description: 'Variable value',
              },
              type: {
                type: 'string',
                enum: ['default', 'secret'],
                description: 'Variable type',
              },
              description: {
                type: 'string',
                description: 'Variable description',
              },
            },
            required: ['key', 'value'],
          },
          description: 'Environment variables',
        },
        workspaceId: {
          type: 'string',
          description: 'Workspace ID where the environment will be created',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_environment',
    description: 'Update an existing environment and its variables',
    inputSchema: {
      type: 'object',
      properties: {
        environmentId: {
          type: 'string',
          description: 'The ID of the environment to update',
        },
        name: {
          type: 'string',
          description: 'New name for the environment',
        },
        values: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                description: 'Variable key',
              },
              value: {
                type: 'string',
                description: 'Variable value',
              },
              type: {
                type: 'string',
                enum: ['default', 'secret'],
                description: 'Variable type',
              },
              description: {
                type: 'string',
                description: 'Variable description',
              },
            },
            required: ['key', 'value'],
          },
          description: 'Updated environment variables',
        },
      },
      required: ['environmentId'],
    },
  },
  {
    name: 'delete_environment',
    description: 'Delete an environment',
    inputSchema: {
      type: 'object',
      properties: {
        environmentId: {
          type: 'string',
          description: 'The ID of the environment to delete',
        },
      },
      required: ['environmentId'],
    },
  },
];

export async function handleEnvironmentTool(
  name: string,
  args: unknown,
  client: PostmanAPIClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case 'list_environments': {
      const parsed = ListEnvironmentsSchema.parse(args);
      const environments = await client.listEnvironments(parsed.workspaceId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(environments, null, 2),
          },
        ],
      };
    }

    case 'get_environment': {
      const parsed = GetEnvironmentSchema.parse(args);
      const environment = await client.getEnvironment(parsed.environmentId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(environment, null, 2),
          },
        ],
      };
    }

    case 'create_environment': {
      const parsed = CreateEnvironmentSchema.parse(args);
      const environmentData = {
        name: parsed.name,
        ...(parsed.values && {
          values: parsed.values.map(v => ({
            key: v.key,
            value: v.value,
            ...(v.type && { type: v.type }),
            ...(v.description && { description: v.description }),
          })),
        }),
        ...(parsed.workspaceId && { workspaceId: parsed.workspaceId }),
      };
      const environment = await client.createEnvironment(environmentData);
      return {
        content: [
          {
            type: 'text',
            text: `Environment created successfully:\n${JSON.stringify(environment, null, 2)}`,
          },
        ],
      };
    }

    case 'update_environment': {
      const parsed = UpdateEnvironmentSchema.parse(args);
      const { environmentId, ...rest } = parsed;
      const updates = {
        ...(rest.name && { name: rest.name }),
        ...(rest.values && {
          values: rest.values.map(v => ({
            key: v.key,
            value: v.value,
            ...(v.type && { type: v.type }),
            ...(v.description && { description: v.description }),
          })),
        }),
      };
      const environment = await client.updateEnvironment(
        environmentId,
        updates
      );
      return {
        content: [
          {
            type: 'text',
            text: `Environment updated successfully:\n${JSON.stringify(environment, null, 2)}`,
          },
        ],
      };
    }

    case 'delete_environment': {
      const parsed = DeleteEnvironmentSchema.parse(args);
      await client.deleteEnvironment(parsed.environmentId);
      return {
        content: [
          {
            type: 'text',
            text: `Environment ${parsed.environmentId} deleted successfully`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown environment tool: ${name}`);
  }
}
