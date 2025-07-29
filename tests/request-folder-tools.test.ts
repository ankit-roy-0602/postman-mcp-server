import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PostmanAPIClient } from '../src/utils/postman-client';
import { handleRequestFolderTool } from '../src/tools/request-folder-tools';

// Mock the PostmanAPIClient
jest.mock('../src/utils/postman-client');

describe('Request and Folder Tools', () => {
  let mockClient: jest.Mocked<PostmanAPIClient>;

  beforeEach(() => {
    mockClient = {
      createRequest: jest.fn(),
      getRequest: jest.fn(),
      updateRequest: jest.fn(),
      deleteRequest: jest.fn(),
      createFolder: jest.fn(),
      updateFolder: jest.fn(),
      deleteFolder: jest.fn(),
      moveRequest: jest.fn(),
    } as any;
  });

  describe('create_request', () => {
    it('should create a request successfully', async () => {
      const mockRequest = {
        id: 'req-123',
        name: 'Test Request',
        request: {
          method: 'GET' as const,
          url: { raw: 'https://api.example.com/test' },
          header: [],
        },
      };

      mockClient.createRequest.mockResolvedValue(mockRequest);

      const args = {
        collectionId: 'col-123',
        name: 'Test Request',
        url: 'https://api.example.com/test',
        method: 'GET',
      };

      const result = await handleRequestFolderTool('create_request', args, mockClient);

      expect(mockClient.createRequest).toHaveBeenCalledWith('col-123', {
        name: 'Test Request',
        url: 'https://api.example.com/test',
        method: 'GET',
      });
      expect(result.content[0]?.text).toContain('Request created successfully');
      expect(result.content[0]?.text).toContain(JSON.stringify(mockRequest, null, 2));
    });

    it('should create a request with headers and body', async () => {
      const mockRequest = {
        id: 'req-123',
        name: 'POST Request',
        request: {
          method: 'POST' as const,
          url: { raw: 'https://api.example.com/users' },
          header: [{ key: 'Content-Type', value: 'application/json' }],
          body: { mode: 'raw' as const, raw: '{"name": "John"}' },
        },
      };

      mockClient.createRequest.mockResolvedValue(mockRequest);

      const args = {
        collectionId: 'col-123',
        name: 'POST Request',
        url: 'https://api.example.com/users',
        method: 'POST',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
        body: { mode: 'raw', raw: '{"name": "John"}' },
      };

      const result = await handleRequestFolderTool('create_request', args, mockClient);

      expect(mockClient.createRequest).toHaveBeenCalledWith('col-123', {
        name: 'POST Request',
        url: 'https://api.example.com/users',
        method: 'POST',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
        body: { mode: 'raw', raw: '{"name": "John"}' },
      });
      expect(result.content[0]?.text).toContain('Request created successfully');
    });

    it('should create a request in a folder', async () => {
      const mockRequest = {
        id: 'req-123',
        name: 'Folder Request',
        request: {
          method: 'GET' as const,
          url: { raw: 'https://api.example.com/test' },
          header: [],
        },
      };

      mockClient.createRequest.mockResolvedValue(mockRequest);

      const args = {
        collectionId: 'col-123',
        name: 'Folder Request',
        url: 'https://api.example.com/test',
        method: 'GET',
        folderId: 'folder-123',
      };

      await handleRequestFolderTool('create_request', args, mockClient);

      expect(mockClient.createRequest).toHaveBeenCalledWith('col-123', {
        name: 'Folder Request',
        url: 'https://api.example.com/test',
        method: 'GET',
        folderId: 'folder-123',
      });
    });

    it('should handle validation errors', async () => {
      const args = {
        collectionId: 'col-123',
        name: 'Test Request',
        // Missing required url and method
      };

      await expect(
        handleRequestFolderTool('create_request', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('get_request', () => {
    it('should get a request successfully', async () => {
      const mockRequest = {
        id: 'req-123',
        name: 'Test Request',
        request: {
          method: 'GET' as const,
          url: { raw: 'https://api.example.com/test' },
          header: [],
        },
      };

      mockClient.getRequest.mockResolvedValue(mockRequest);

      const args = {
        collectionId: 'col-123',
        requestId: 'req-123',
      };

      const result = await handleRequestFolderTool('get_request', args, mockClient);

      expect(mockClient.getRequest).toHaveBeenCalledWith('col-123', 'req-123');
      expect(result.content[0]?.text).toBe(JSON.stringify(mockRequest, null, 2));
    });
  });

  describe('update_request', () => {
    it('should update a request successfully', async () => {
      const mockRequest = {
        id: 'req-123',
        name: 'Updated Request',
        request: {
          method: 'POST' as const,
          url: { raw: 'https://api.example.com/updated' },
          header: [],
        },
      };

      mockClient.updateRequest.mockResolvedValue(mockRequest);

      const args = {
        collectionId: 'col-123',
        requestId: 'req-123',
        name: 'Updated Request',
        method: 'POST',
        url: 'https://api.example.com/updated',
      };

      const result = await handleRequestFolderTool('update_request', args, mockClient);

      expect(mockClient.updateRequest).toHaveBeenCalledWith('col-123', 'req-123', {
        name: 'Updated Request',
        method: 'POST',
        url: 'https://api.example.com/updated',
      });
      expect(result.content[0]?.text).toContain('Request updated successfully');
    });

    it('should update only provided fields', async () => {
      const mockRequest = {
        id: 'req-123',
        name: 'Updated Name Only',
        request: {
          method: 'GET' as const,
          url: { raw: 'https://api.example.com/test' },
          header: [],
        },
      };

      mockClient.updateRequest.mockResolvedValue(mockRequest);

      const args = {
        collectionId: 'col-123',
        requestId: 'req-123',
        name: 'Updated Name Only',
      };

      await handleRequestFolderTool('update_request', args, mockClient);

      expect(mockClient.updateRequest).toHaveBeenCalledWith('col-123', 'req-123', {
        name: 'Updated Name Only',
      });
    });
  });

  describe('delete_request', () => {
    it('should delete a request successfully', async () => {
      mockClient.deleteRequest.mockResolvedValue();

      const args = {
        collectionId: 'col-123',
        requestId: 'req-123',
      };

      const result = await handleRequestFolderTool('delete_request', args, mockClient);

      expect(mockClient.deleteRequest).toHaveBeenCalledWith('col-123', 'req-123');
      expect(result.content[0]?.text).toBe('Request req-123 deleted successfully');
    });
  });

  describe('create_folder', () => {
    it('should create a folder successfully', async () => {
      const mockFolder = {
        id: 'folder-123',
        name: 'Test Folder',
        item: [],
      };

      mockClient.createFolder.mockResolvedValue(mockFolder);

      const args = {
        collectionId: 'col-123',
        name: 'Test Folder',
      };

      const result = await handleRequestFolderTool('create_folder', args, mockClient);

      expect(mockClient.createFolder).toHaveBeenCalledWith('col-123', {
        name: 'Test Folder',
      });
      expect(result.content[0]?.text).toContain('Folder created successfully');
      expect(result.content[0]?.text).toContain(JSON.stringify(mockFolder, null, 2));
    });

    it('should create a folder with description and parent', async () => {
      const mockFolder = {
        id: 'folder-123',
        name: 'Nested Folder',
        description: 'A nested folder',
        item: [],
      };

      mockClient.createFolder.mockResolvedValue(mockFolder);

      const args = {
        collectionId: 'col-123',
        name: 'Nested Folder',
        description: 'A nested folder',
        parentFolderId: 'parent-folder-123',
      };

      await handleRequestFolderTool('create_folder', args, mockClient);

      expect(mockClient.createFolder).toHaveBeenCalledWith('col-123', {
        name: 'Nested Folder',
        description: 'A nested folder',
        parentFolderId: 'parent-folder-123',
      });
    });
  });

  describe('update_folder', () => {
    it('should update a folder successfully', async () => {
      const mockFolder = {
        id: 'folder-123',
        name: 'Updated Folder',
        description: 'Updated description',
        item: [],
      };

      mockClient.updateFolder.mockResolvedValue(mockFolder);

      const args = {
        collectionId: 'col-123',
        folderId: 'folder-123',
        name: 'Updated Folder',
        description: 'Updated description',
      };

      const result = await handleRequestFolderTool('update_folder', args, mockClient);

      expect(mockClient.updateFolder).toHaveBeenCalledWith('col-123', 'folder-123', {
        name: 'Updated Folder',
        description: 'Updated description',
      });
      expect(result.content[0]?.text).toContain('Folder updated successfully');
    });
  });

  describe('delete_folder', () => {
    it('should delete a folder successfully', async () => {
      mockClient.deleteFolder.mockResolvedValue();

      const args = {
        collectionId: 'col-123',
        folderId: 'folder-123',
      };

      const result = await handleRequestFolderTool('delete_folder', args, mockClient);

      expect(mockClient.deleteFolder).toHaveBeenCalledWith('col-123', 'folder-123');
      expect(result.content[0]?.text).toBe('Folder folder-123 deleted successfully');
    });
  });

  describe('move_request', () => {
    it('should move a request to a folder', async () => {
      mockClient.moveRequest.mockResolvedValue();

      const args = {
        collectionId: 'col-123',
        requestId: 'req-123',
        targetFolderId: 'folder-123',
      };

      const result = await handleRequestFolderTool('move_request', args, mockClient);

      expect(mockClient.moveRequest).toHaveBeenCalledWith('col-123', {
        requestId: 'req-123',
        targetFolderId: 'folder-123',
      });
      expect(result.content[0]?.text).toBe('Request req-123 moved successfully');
    });

    it('should move a request to collection root', async () => {
      mockClient.moveRequest.mockResolvedValue();

      const args = {
        collectionId: 'col-123',
        requestId: 'req-123',
      };

      await handleRequestFolderTool('move_request', args, mockClient);

      expect(mockClient.moveRequest).toHaveBeenCalledWith('col-123', {
        requestId: 'req-123',
      });
    });
  });

  describe('error handling', () => {
    it('should handle unknown tool names', async () => {
      await expect(
        handleRequestFolderTool('unknown_tool', {}, mockClient)
      ).rejects.toThrow('Unknown request/folder tool: unknown_tool');
    });

    it('should propagate client errors', async () => {
      mockClient.createRequest.mockRejectedValue(new Error('API Error'));

      const args = {
        collectionId: 'col-123',
        name: 'Test Request',
        url: 'https://api.example.com/test',
        method: 'GET',
      };

      await expect(
        handleRequestFolderTool('create_request', args, mockClient)
      ).rejects.toThrow('API Error');
    });
  });
});
