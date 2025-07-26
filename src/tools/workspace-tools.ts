import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { PostmanAPIClient } from '../utils/postman-client.js';

const ListWorkspacesSchema = z.object({});

const GetWorkspaceSchema = z.object({
  workspaceId: z.string().describe('The ID of the workspace to retrieve'),
});

const CreateWorkspaceSchema = z.object({
  name: z.string().describe('Name of the workspace'),
  type: z.enum(['personal', 'team']).describe('Type of workspace'),
  description: z.string().optional().describe('Description of the workspace'),
});

const UpdateWorkspaceSchema = z.object({
  workspaceId: z.string().describe('The ID of the workspace to update'),
  name: z.string().optional().describe('New name for the workspace'),
  description: z
    .string()
    .optional()
    .describe('New description for the workspace'),
});

const DeleteWorkspaceSchema = z.object({
  workspaceId: z.string().describe('The ID of the workspace to delete'),
});

export const workspaceTools: Tool[] = [
  {
    name: 'list_workspaces',
    description: 'List all available Postman workspaces',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_workspace',
    description: 'Get detailed information about a specific workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'string',
          description: 'The ID of the workspace to retrieve',
        },
      },
      required: ['workspaceId'],
    },
  },
  {
    name: 'create_workspace',
    description: 'Create a new Postman workspace',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the workspace',
        },
        type: {
          type: 'string',
          enum: ['personal', 'team'],
          description: 'Type of workspace',
        },
        description: {
          type: 'string',
          description: 'Description of the workspace',
        },
      },
      required: ['name', 'type'],
    },
  },
  {
    name: 'update_workspace',
    description: 'Update an existing workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'string',
          description: 'The ID of the workspace to update',
        },
        name: {
          type: 'string',
          description: 'New name for the workspace',
        },
        description: {
          type: 'string',
          description: 'New description for the workspace',
        },
      },
      required: ['workspaceId'],
    },
  },
  {
    name: 'delete_workspace',
    description: 'Delete a workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'string',
          description: 'The ID of the workspace to delete',
        },
      },
      required: ['workspaceId'],
    },
  },
];

export async function handleWorkspaceTool(
  name: string,
  args: unknown,
  client: PostmanAPIClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case 'list_workspaces': {
      ListWorkspacesSchema.parse(args);
      const workspaces = await client.listWorkspaces();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(workspaces, null, 2),
          },
        ],
      };
    }

    case 'get_workspace': {
      const parsed = GetWorkspaceSchema.parse(args);
      const workspace = await client.getWorkspace(parsed.workspaceId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(workspace, null, 2),
          },
        ],
      };
    }

    case 'create_workspace': {
      const parsed = CreateWorkspaceSchema.parse(args);
      const workspaceData = {
        name: parsed.name,
        type: parsed.type,
        ...(parsed.description && { description: parsed.description }),
      };
      const workspace = await client.createWorkspace(workspaceData);
      return {
        content: [
          {
            type: 'text',
            text: `Workspace created successfully:\n${JSON.stringify(workspace, null, 2)}`,
          },
        ],
      };
    }

    case 'update_workspace': {
      const parsed = UpdateWorkspaceSchema.parse(args);
      const { workspaceId, ...rest } = parsed;
      const updates = {
        ...(rest.name && { name: rest.name }),
        ...(rest.description && { description: rest.description }),
      };
      const workspace = await client.updateWorkspace(workspaceId, updates);
      return {
        content: [
          {
            type: 'text',
            text: `Workspace updated successfully:\n${JSON.stringify(workspace, null, 2)}`,
          },
        ],
      };
    }

    case 'delete_workspace': {
      const parsed = DeleteWorkspaceSchema.parse(args);
      await client.deleteWorkspace(parsed.workspaceId);
      return {
        content: [
          {
            type: 'text',
            text: `Workspace ${parsed.workspaceId} deleted successfully`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown workspace tool: ${name}`);
  }
}
