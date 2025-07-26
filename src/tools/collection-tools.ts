import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { PostmanAPIClient } from '../utils/postman-client.js';

const ListCollectionsSchema = z.object({
  workspaceId: z.string().optional().describe('Optional workspace ID to filter collections'),
});

const GetCollectionSchema = z.object({
  collectionId: z.string().describe('The ID of the collection to retrieve'),
});

const CreateCollectionSchema = z.object({
  name: z.string().describe('Name of the collection'),
  description: z.string().optional().describe('Description of the collection'),
  workspaceId: z.string().optional().describe('Workspace ID where the collection will be created'),
});

const UpdateCollectionSchema = z.object({
  collectionId: z.string().describe('The ID of the collection to update'),
  name: z.string().optional().describe('New name for the collection'),
  description: z.string().optional().describe('New description for the collection'),
});

const DeleteCollectionSchema = z.object({
  collectionId: z.string().describe('The ID of the collection to delete'),
});

export const collectionTools: Tool[] = [
  {
    name: 'list_collections',
    description: 'List all collections, optionally filtered by workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'string',
          description: 'Optional workspace ID to filter collections',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_collection',
    description: 'Get detailed information about a specific collection including its structure',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection to retrieve',
        },
      },
      required: ['collectionId'],
    },
  },
  {
    name: 'create_collection',
    description: 'Create a new Postman collection',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the collection',
        },
        description: {
          type: 'string',
          description: 'Description of the collection',
        },
        workspaceId: {
          type: 'string',
          description: 'Workspace ID where the collection will be created',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_collection',
    description: 'Update an existing collection metadata',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection to update',
        },
        name: {
          type: 'string',
          description: 'New name for the collection',
        },
        description: {
          type: 'string',
          description: 'New description for the collection',
        },
      },
      required: ['collectionId'],
    },
  },
  {
    name: 'delete_collection',
    description: 'Delete a collection',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection to delete',
        },
      },
      required: ['collectionId'],
    },
  },
];

export async function handleCollectionTool(
  name: string,
  args: any,
  client: PostmanAPIClient
): Promise<any> {
  switch (name) {
    case 'list_collections': {
      const parsed = ListCollectionsSchema.parse(args);
      const collections = await client.listCollections(parsed.workspaceId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(collections, null, 2),
          },
        ],
      };
    }

    case 'get_collection': {
      const parsed = GetCollectionSchema.parse(args);
      const collection = await client.getCollection(parsed.collectionId);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(collection, null, 2),
          },
        ],
      };
    }

    case 'create_collection': {
      const parsed = CreateCollectionSchema.parse(args);
      const collectionData = {
        name: parsed.name,
        ...(parsed.description && { description: parsed.description }),
        ...(parsed.workspaceId && { workspaceId: parsed.workspaceId }),
      };
      const collection = await client.createCollection(collectionData);
      return {
        content: [
          {
            type: 'text',
            text: `Collection created successfully:\n${JSON.stringify(collection, null, 2)}`,
          },
        ],
      };
    }

    case 'update_collection': {
      const parsed = UpdateCollectionSchema.parse(args);
      const { collectionId, ...rest } = parsed;
      const updates = {
        ...(rest.name && { name: rest.name }),
        ...(rest.description && { description: rest.description }),
      };
      const collection = await client.updateCollection(collectionId, updates);
      return {
        content: [
          {
            type: 'text',
            text: `Collection updated successfully:\n${JSON.stringify(collection, null, 2)}`,
          },
        ],
      };
    }

    case 'delete_collection': {
      const parsed = DeleteCollectionSchema.parse(args);
      await client.deleteCollection(parsed.collectionId);
      return {
        content: [
          {
            type: 'text',
            text: `Collection ${parsed.collectionId} deleted successfully`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown collection tool: ${name}`);
  }
}
