import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { PostmanAPIClient } from '../utils/postman-client.js';

const CreateRequestSchema = z.object({
  collectionId: z
    .string()
    .describe('The ID of the collection to add the request to'),
  name: z.string().describe('Name of the request'),
  url: z.string().describe('URL for the request'),
  method: z
    .enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])
    .describe('HTTP method'),
  description: z.string().optional().describe('Description of the request'),
  headers: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
        disabled: z.boolean().optional(),
        description: z.string().optional(),
      })
    )
    .optional()
    .describe('Request headers'),
  body: z
    .object({
      mode: z.enum(['raw', 'formdata', 'urlencoded', 'binary', 'graphql']),
      raw: z.string().optional(),
      formdata: z
        .array(
          z.object({
            key: z.string(),
            value: z.string(),
            type: z.enum(['text', 'file']).optional(),
            disabled: z.boolean().optional(),
          })
        )
        .optional(),
      urlencoded: z
        .array(
          z.object({
            key: z.string(),
            value: z.string(),
            disabled: z.boolean().optional(),
          })
        )
        .optional(),
    })
    .optional()
    .describe('Request body'),
  folderId: z
    .string()
    .optional()
    .describe('ID of the folder to add the request to (optional)'),
});

const GetRequestSchema = z.object({
  collectionId: z
    .string()
    .describe('The ID of the collection containing the request'),
  requestId: z.string().describe('The ID of the request to retrieve'),
});

const UpdateRequestSchema = z.object({
  collectionId: z
    .string()
    .describe('The ID of the collection containing the request'),
  requestId: z.string().describe('The ID of the request to update'),
  name: z.string().optional().describe('New name for the request'),
  url: z.string().optional().describe('New URL for the request'),
  method: z
    .enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])
    .optional()
    .describe('New HTTP method'),
  description: z
    .string()
    .optional()
    .describe('New description for the request'),
  headers: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
        disabled: z.boolean().optional(),
        description: z.string().optional(),
      })
    )
    .optional()
    .describe('New request headers'),
  body: z
    .object({
      mode: z.enum(['raw', 'formdata', 'urlencoded', 'binary', 'graphql']),
      raw: z.string().optional(),
      formdata: z
        .array(
          z.object({
            key: z.string(),
            value: z.string(),
            type: z.enum(['text', 'file']).optional(),
            disabled: z.boolean().optional(),
          })
        )
        .optional(),
      urlencoded: z
        .array(
          z.object({
            key: z.string(),
            value: z.string(),
            disabled: z.boolean().optional(),
          })
        )
        .optional(),
    })
    .optional()
    .describe('New request body'),
});

const DeleteRequestSchema = z.object({
  collectionId: z
    .string()
    .describe('The ID of the collection containing the request'),
  requestId: z.string().describe('The ID of the request to delete'),
});

const CreateFolderSchema = z.object({
  collectionId: z
    .string()
    .describe('The ID of the collection to add the folder to'),
  name: z.string().describe('Name of the folder'),
  description: z.string().optional().describe('Description of the folder'),
  parentFolderId: z
    .string()
    .optional()
    .describe('ID of the parent folder (optional)'),
});

const UpdateFolderSchema = z.object({
  collectionId: z
    .string()
    .describe('The ID of the collection containing the folder'),
  folderId: z.string().describe('The ID of the folder to update'),
  name: z.string().optional().describe('New name for the folder'),
  description: z.string().optional().describe('New description for the folder'),
});

const DeleteFolderSchema = z.object({
  collectionId: z
    .string()
    .describe('The ID of the collection containing the folder'),
  folderId: z.string().describe('The ID of the folder to delete'),
});

const MoveRequestSchema = z.object({
  collectionId: z
    .string()
    .describe('The ID of the collection containing the request'),
  requestId: z.string().describe('The ID of the request to move'),
  targetFolderId: z
    .string()
    .optional()
    .describe('ID of the target folder (omit to move to collection root)'),
});

export const requestFolderTools: Tool[] = [
  {
    name: 'create_request',
    description: 'Create a new request in a Postman collection',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection to add the request to',
        },
        name: {
          type: 'string',
          description: 'Name of the request',
        },
        url: {
          type: 'string',
          description: 'URL for the request',
        },
        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
          description: 'HTTP method',
        },
        description: {
          type: 'string',
          description: 'Description of the request',
        },
        headers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              value: { type: 'string' },
              disabled: { type: 'boolean' },
              description: { type: 'string' },
            },
            required: ['key', 'value'],
          },
          description: 'Request headers',
        },
        body: {
          type: 'object',
          properties: {
            mode: {
              type: 'string',
              enum: ['raw', 'formdata', 'urlencoded', 'binary', 'graphql'],
            },
            raw: { type: 'string' },
            formdata: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  value: { type: 'string' },
                  type: { type: 'string', enum: ['text', 'file'] },
                  disabled: { type: 'boolean' },
                },
                required: ['key', 'value'],
              },
            },
            urlencoded: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  value: { type: 'string' },
                  disabled: { type: 'boolean' },
                },
                required: ['key', 'value'],
              },
            },
          },
          required: ['mode'],
          description: 'Request body',
        },
        folderId: {
          type: 'string',
          description: 'ID of the folder to add the request to (optional)',
        },
      },
      required: ['collectionId', 'name', 'url', 'method'],
    },
  },
  {
    name: 'get_request',
    description: 'Get detailed information about a specific request',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection containing the request',
        },
        requestId: {
          type: 'string',
          description: 'The ID of the request to retrieve',
        },
      },
      required: ['collectionId', 'requestId'],
    },
  },
  {
    name: 'update_request',
    description: 'Update an existing request',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection containing the request',
        },
        requestId: {
          type: 'string',
          description: 'The ID of the request to update',
        },
        name: {
          type: 'string',
          description: 'New name for the request',
        },
        url: {
          type: 'string',
          description: 'New URL for the request',
        },
        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
          description: 'New HTTP method',
        },
        description: {
          type: 'string',
          description: 'New description for the request',
        },
        headers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              value: { type: 'string' },
              disabled: { type: 'boolean' },
              description: { type: 'string' },
            },
            required: ['key', 'value'],
          },
          description: 'New request headers',
        },
        body: {
          type: 'object',
          properties: {
            mode: {
              type: 'string',
              enum: ['raw', 'formdata', 'urlencoded', 'binary', 'graphql'],
            },
            raw: { type: 'string' },
            formdata: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  value: { type: 'string' },
                  type: { type: 'string', enum: ['text', 'file'] },
                  disabled: { type: 'boolean' },
                },
                required: ['key', 'value'],
              },
            },
            urlencoded: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  key: { type: 'string' },
                  value: { type: 'string' },
                  disabled: { type: 'boolean' },
                },
                required: ['key', 'value'],
              },
            },
          },
          required: ['mode'],
          description: 'New request body',
        },
      },
      required: ['collectionId', 'requestId'],
    },
  },
  {
    name: 'delete_request',
    description: 'Delete a request from a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection containing the request',
        },
        requestId: {
          type: 'string',
          description: 'The ID of the request to delete',
        },
      },
      required: ['collectionId', 'requestId'],
    },
  },
  {
    name: 'create_folder',
    description: 'Create a new folder in a Postman collection',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection to add the folder to',
        },
        name: {
          type: 'string',
          description: 'Name of the folder',
        },
        description: {
          type: 'string',
          description: 'Description of the folder',
        },
        parentFolderId: {
          type: 'string',
          description: 'ID of the parent folder (optional)',
        },
      },
      required: ['collectionId', 'name'],
    },
  },
  {
    name: 'update_folder',
    description: 'Update an existing folder',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection containing the folder',
        },
        folderId: {
          type: 'string',
          description: 'The ID of the folder to update',
        },
        name: {
          type: 'string',
          description: 'New name for the folder',
        },
        description: {
          type: 'string',
          description: 'New description for the folder',
        },
      },
      required: ['collectionId', 'folderId'],
    },
  },
  {
    name: 'delete_folder',
    description: 'Delete a folder from a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection containing the folder',
        },
        folderId: {
          type: 'string',
          description: 'The ID of the folder to delete',
        },
      },
      required: ['collectionId', 'folderId'],
    },
  },
  {
    name: 'move_request',
    description:
      'Move a request to a different folder or to the collection root',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection containing the request',
        },
        requestId: {
          type: 'string',
          description: 'The ID of the request to move',
        },
        targetFolderId: {
          type: 'string',
          description:
            'ID of the target folder (omit to move to collection root)',
        },
      },
      required: ['collectionId', 'requestId'],
    },
  },
];

export async function handleRequestFolderTool(
  name: string,
  args: unknown,
  client: PostmanAPIClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  switch (name) {
    case 'create_request': {
      const parsed = CreateRequestSchema.parse(args);
      const requestData = {
        name: parsed.name,
        url: parsed.url,
        method: parsed.method,
        ...(parsed.description && { description: parsed.description }),
        ...(parsed.headers && { headers: parsed.headers }),
        ...(parsed.body && { body: parsed.body }),
        ...(parsed.folderId && { folderId: parsed.folderId }),
      };
      const request = await client.createRequest(
        parsed.collectionId,
        requestData
      );
      return {
        content: [
          {
            type: 'text',
            text: `Request created successfully:\n${JSON.stringify(request, null, 2)}`,
          },
        ],
      };
    }

    case 'get_request': {
      const parsed = GetRequestSchema.parse(args);
      const request = await client.getRequest(
        parsed.collectionId,
        parsed.requestId
      );
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(request, null, 2),
          },
        ],
      };
    }

    case 'update_request': {
      const parsed = UpdateRequestSchema.parse(args);
      const { collectionId, requestId, ...rest } = parsed;
      const updates = {
        ...(rest.name && { name: rest.name }),
        ...(rest.url && { url: rest.url }),
        ...(rest.method && { method: rest.method }),
        ...(rest.description && { description: rest.description }),
        ...(rest.headers && { headers: rest.headers }),
        ...(rest.body && { body: rest.body }),
      };
      const request = await client.updateRequest(
        collectionId,
        requestId,
        updates
      );
      return {
        content: [
          {
            type: 'text',
            text: `Request updated successfully:\n${JSON.stringify(request, null, 2)}`,
          },
        ],
      };
    }

    case 'delete_request': {
      const parsed = DeleteRequestSchema.parse(args);
      await client.deleteRequest(parsed.collectionId, parsed.requestId);
      return {
        content: [
          {
            type: 'text',
            text: `Request ${parsed.requestId} deleted successfully`,
          },
        ],
      };
    }

    case 'create_folder': {
      const parsed = CreateFolderSchema.parse(args);
      const folderData = {
        name: parsed.name,
        ...(parsed.description && { description: parsed.description }),
        ...(parsed.parentFolderId && { parentFolderId: parsed.parentFolderId }),
      };
      const folder = await client.createFolder(parsed.collectionId, folderData);
      return {
        content: [
          {
            type: 'text',
            text: `Folder created successfully:\n${JSON.stringify(folder, null, 2)}`,
          },
        ],
      };
    }

    case 'update_folder': {
      const parsed = UpdateFolderSchema.parse(args);
      const { collectionId, folderId, ...rest } = parsed;
      const updates = {
        ...(rest.name && { name: rest.name }),
        ...(rest.description && { description: rest.description }),
      };
      const folder = await client.updateFolder(collectionId, folderId, updates);
      return {
        content: [
          {
            type: 'text',
            text: `Folder updated successfully:\n${JSON.stringify(folder, null, 2)}`,
          },
        ],
      };
    }

    case 'delete_folder': {
      const parsed = DeleteFolderSchema.parse(args);
      await client.deleteFolder(parsed.collectionId, parsed.folderId);
      return {
        content: [
          {
            type: 'text',
            text: `Folder ${parsed.folderId} deleted successfully`,
          },
        ],
      };
    }

    case 'move_request': {
      const parsed = MoveRequestSchema.parse(args);
      const moveData = {
        requestId: parsed.requestId,
        ...(parsed.targetFolderId && { targetFolderId: parsed.targetFolderId }),
      };
      await client.moveRequest(parsed.collectionId, moveData);
      return {
        content: [
          {
            type: 'text',
            text: `Request ${parsed.requestId} moved successfully`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown request/folder tool: ${name}`);
  }
}
