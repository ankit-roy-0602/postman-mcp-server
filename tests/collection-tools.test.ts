import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PostmanAPIClient } from '../src/utils/postman-client';
import { handleCollectionTool } from '../src/tools/collection-tools';

// Mock the PostmanAPIClient
jest.mock('../src/utils/postman-client');

describe('Collection Tools', () => {
  let mockClient: jest.Mocked<PostmanAPIClient>;

  beforeEach(() => {
    mockClient = {
      listCollections: jest.fn(),
      getCollection: jest.fn(),
      createCollection: jest.fn(),
      updateCollection: jest.fn(),
      deleteCollection: jest.fn(),
    } as any;
  });

  describe('list_collections', () => {
    it('should list all collections', async () => {
      const mockCollections = [
        {
          id: 'col-1',
          name: 'Collection 1',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
          updatedAt: '2023-01-01T00:00:00.000Z',
          createdAt: '2023-01-01T00:00:00.000Z',
          lastUpdatedBy: 'user-123',
          uid: 'uid-123',
          owner: 'owner-123',
          public: false,
        },
        {
          id: 'col-2',
          name: 'Collection 2',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
          updatedAt: '2023-01-01T00:00:00.000Z',
          createdAt: '2023-01-01T00:00:00.000Z',
          lastUpdatedBy: 'user-123',
          uid: 'uid-124',
          owner: 'owner-123',
          public: false,
        },
      ];

      mockClient.listCollections.mockResolvedValue(mockCollections);

      const result = await handleCollectionTool('list_collections', {}, mockClient);

      expect(mockClient.listCollections).toHaveBeenCalledWith(undefined);
      expect(result.content[0]?.text).toBe(JSON.stringify(mockCollections, null, 2));
    });

    it('should list collections for a specific workspace', async () => {
      const mockCollections = [
        {
          id: 'col-1',
          name: 'Workspace Collection',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
          updatedAt: '2023-01-01T00:00:00.000Z',
          createdAt: '2023-01-01T00:00:00.000Z',
          lastUpdatedBy: 'user-123',
          uid: 'uid-123',
          owner: 'owner-123',
          public: false,
        },
      ];

      mockClient.listCollections.mockResolvedValue(mockCollections);

      const args = { workspaceId: 'workspace-123' };
      await handleCollectionTool('list_collections', args, mockClient);

      expect(mockClient.listCollections).toHaveBeenCalledWith('workspace-123');
    });
  });

  describe('get_collection', () => {
    it('should get a collection successfully', async () => {
      const mockCollection = {
        info: {
          name: 'Test Collection',
          description: 'A test collection',
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        },
        item: [],
      };

      mockClient.getCollection.mockResolvedValue(mockCollection);

      const args = { collectionId: 'col-123' };
      const result = await handleCollectionTool('get_collection', args, mockClient);

      expect(mockClient.getCollection).toHaveBeenCalledWith('col-123');
      expect(result.content[0]?.text).toBe(JSON.stringify(mockCollection, null, 2));
    });

    it('should handle missing collectionId', async () => {
      const args = {};

      await expect(
        handleCollectionTool('get_collection', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('create_collection', () => {
    it('should create a collection with minimal data', async () => {
      const mockCollection = {
        id: 'col-123',
        name: 'New Collection',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        lastUpdatedBy: 'user-123',
        uid: 'uid-123',
        owner: 'owner-123',
        public: false,
      };

      mockClient.createCollection.mockResolvedValue(mockCollection);

      const args = { name: 'New Collection' };
      const result = await handleCollectionTool('create_collection', args, mockClient);

      expect(mockClient.createCollection).toHaveBeenCalledWith({
        name: 'New Collection',
      });
      expect(result.content[0]?.text).toContain('Collection created successfully');
      expect(result.content[0]?.text).toContain(JSON.stringify(mockCollection, null, 2));
    });

    it('should create a collection with description and workspace', async () => {
      const mockCollection = {
        id: 'col-123',
        name: 'Detailed Collection',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        lastUpdatedBy: 'user-123',
        uid: 'uid-123',
        owner: 'owner-123',
        public: false,
      };

      mockClient.createCollection.mockResolvedValue(mockCollection);

      const args = {
        name: 'Detailed Collection',
        description: 'A collection with description',
        workspaceId: 'workspace-123',
      };

      await handleCollectionTool('create_collection', args, mockClient);

      expect(mockClient.createCollection).toHaveBeenCalledWith({
        name: 'Detailed Collection',
        description: 'A collection with description',
        workspaceId: 'workspace-123',
      });
    });

    it('should handle missing name', async () => {
      const args = { description: 'Missing name' };

      await expect(
        handleCollectionTool('create_collection', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('update_collection', () => {
    it('should update a collection successfully', async () => {
      const mockCollection = {
        id: 'col-123',
        name: 'Updated Collection',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
        lastUpdatedBy: 'user-123',
        uid: 'uid-123',
        owner: 'owner-123',
        public: false,
      };

      mockClient.updateCollection.mockResolvedValue(mockCollection);

      const args = {
        collectionId: 'col-123',
        name: 'Updated Collection',
        description: 'Updated description',
      };

      const result = await handleCollectionTool('update_collection', args, mockClient);

      expect(mockClient.updateCollection).toHaveBeenCalledWith('col-123', {
        name: 'Updated Collection',
        description: 'Updated description',
      });
      expect(result.content[0]?.text).toContain('Collection updated successfully');
      expect(result.content[0]?.text).toContain(JSON.stringify(mockCollection, null, 2));
    });

    it('should update only provided fields', async () => {
      const mockCollection = {
        id: 'col-123',
        name: 'Updated Name Only',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
        lastUpdatedBy: 'user-123',
        uid: 'uid-123',
        owner: 'owner-123',
        public: false,
      };

      mockClient.updateCollection.mockResolvedValue(mockCollection);

      const args = {
        collectionId: 'col-123',
        name: 'Updated Name Only',
      };

      await handleCollectionTool('update_collection', args, mockClient);

      expect(mockClient.updateCollection).toHaveBeenCalledWith('col-123', {
        name: 'Updated Name Only',
      });
    });

    it('should handle missing collectionId', async () => {
      const args = { name: 'New Name' };

      await expect(
        handleCollectionTool('update_collection', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('delete_collection', () => {
    it('should delete a collection successfully', async () => {
      mockClient.deleteCollection.mockResolvedValue();

      const args = { collectionId: 'col-123' };
      const result = await handleCollectionTool('delete_collection', args, mockClient);

      expect(mockClient.deleteCollection).toHaveBeenCalledWith('col-123');
      expect(result.content[0]?.text).toBe('Collection col-123 deleted successfully');
    });

    it('should handle missing collectionId', async () => {
      const args = {};

      await expect(
        handleCollectionTool('delete_collection', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle unknown tool names', async () => {
      await expect(
        handleCollectionTool('unknown_tool', {}, mockClient)
      ).rejects.toThrow('Unknown collection tool: unknown_tool');
    });

    it('should propagate client errors', async () => {
      mockClient.createCollection.mockRejectedValue(new Error('API Error'));

      const args = { name: 'Test Collection' };

      await expect(
        handleCollectionTool('create_collection', args, mockClient)
      ).rejects.toThrow('API Error');
    });

    it('should handle network errors', async () => {
      mockClient.listCollections.mockRejectedValue(new Error('Network error'));

      await expect(
        handleCollectionTool('list_collections', {}, mockClient)
      ).rejects.toThrow('Network error');
    });
  });
});
