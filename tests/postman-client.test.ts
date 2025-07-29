import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PostmanAPIClient } from '../src/utils/postman-client';

// Mock axios module
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
  isAxiosError: jest.fn(),
}));

describe('PostmanAPIClient', () => {
  let client: PostmanAPIClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    const axios = require('axios');
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    
    axios.create.mockReturnValue(mockAxiosInstance);
    client = new PostmanAPIClient('test-api-key');
  });

  describe('constructor', () => {
    it('should create client with API key', () => {
      expect(() => new PostmanAPIClient('valid-key')).not.toThrow();
    });
  });

  describe('listWorkspaces', () => {
    it('should return workspaces when API call succeeds', async () => {
      const mockWorkspaces = [
        { id: '1', name: 'Workspace 1', type: 'personal' },
        { id: '2', name: 'Workspace 2', type: 'team' }
      ];
      mockAxiosInstance.get.mockResolvedValue({ data: { workspaces: mockWorkspaces } });

      const result = await client.listWorkspaces();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/workspaces');
      expect(result).toEqual(mockWorkspaces);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(client.listWorkspaces()).rejects.toThrow('Failed to list workspaces');
    });
  });

  describe('getWorkspace', () => {
    it('should return workspace details', async () => {
      const mockWorkspace = { id: '1', name: 'Test Workspace', type: 'personal' };
      mockAxiosInstance.get.mockResolvedValue({ data: { workspace: mockWorkspace } });

      const result = await client.getWorkspace('1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/workspaces/1');
      expect(result).toEqual(mockWorkspace);
    });
  });

  describe('createWorkspace', () => {
    it('should create workspace successfully', async () => {
      const newWorkspace = { name: 'New Workspace', type: 'personal' as const };
      const mockResponse = { id: '123', ...newWorkspace };
      mockAxiosInstance.post.mockResolvedValue({ data: { workspace: mockResponse } });

      const result = await client.createWorkspace(newWorkspace);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/workspaces', { workspace: newWorkspace });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('validateConnection', () => {
    it('should validate connection successfully', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: {} });

      await expect(client.validateConnection()).resolves.not.toThrow();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/me');
    });

    it('should throw error for invalid API key', async () => {
      const axios = require('axios');
      const error = { response: { status: 401 } };
      mockAxiosInstance.get.mockRejectedValue(error);
      axios.isAxiosError.mockReturnValue(true);

      await expect(client.validateConnection()).rejects.toThrow('Invalid Postman API key');
    });
  });

  describe('error handling', () => {
    it('should handle 404 errors', async () => {
      const axios = require('axios');
      const error = { response: { status: 404 } };
      mockAxiosInstance.get.mockRejectedValue(error);
      axios.isAxiosError.mockReturnValue(true);

      await expect(client.getWorkspace('nonexistent')).rejects.toThrow('Resource not found');
    });

    it('should handle rate limiting', async () => {
      const axios = require('axios');
      const error = { response: { status: 429 } };
      mockAxiosInstance.get.mockRejectedValue(error);
      axios.isAxiosError.mockReturnValue(true);

      await expect(client.listWorkspaces()).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('collections', () => {
    it('should list collections', async () => {
      const mockCollections = [{ id: '1', name: 'Collection 1' }];
      mockAxiosInstance.get.mockResolvedValue({ data: { collections: mockCollections } });

      const result = await client.listCollections();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections');
      expect(result).toEqual(mockCollections);
    });

    it('should list collections for workspace', async () => {
      const mockCollections = [{ id: '1', name: 'Collection 1' }];
      mockAxiosInstance.get.mockResolvedValue({ data: { collections: mockCollections } });

      const result = await client.listCollections('workspace-1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections?workspace=workspace-1');
      expect(result).toEqual(mockCollections);
    });
  });

  describe('environments', () => {
    it('should list environments', async () => {
      const mockEnvironments = [{ id: '1', name: 'Environment 1' }];
      mockAxiosInstance.get.mockResolvedValue({ data: { environments: mockEnvironments } });

      const result = await client.listEnvironments();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/environments');
      expect(result).toEqual(mockEnvironments);
    });

    it('should list environments for workspace', async () => {
      const mockEnvironments = [{ id: '1', name: 'Environment 1' }];
      mockAxiosInstance.get.mockResolvedValue({ data: { environments: mockEnvironments } });

      const result = await client.listEnvironments('workspace-1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/environments?workspace=workspace-1');
      expect(result).toEqual(mockEnvironments);
    });

    it('should get environment', async () => {
      const mockEnvironment = { id: '1', name: 'Environment 1', values: [] };
      mockAxiosInstance.get.mockResolvedValue({ data: { environment: mockEnvironment } });

      const result = await client.getEnvironment('1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/environments/1');
      expect(result).toEqual(mockEnvironment);
    });

    it('should create environment', async () => {
      const newEnvironment = { name: 'Test Env', values: [] };
      const mockResponse = { id: '123', ...newEnvironment };
      mockAxiosInstance.post.mockResolvedValue({ data: { environment: mockResponse } });

      const result = await client.createEnvironment(newEnvironment);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/environments', { 
        environment: { name: 'Test Env', values: [] }
      });
      expect(result).toEqual(mockResponse);
    });

    it('should create environment in workspace', async () => {
      const newEnvironment = { name: 'Test Env', values: [], workspaceId: 'workspace-1' };
      const mockResponse = { id: '123', name: 'Test Env', values: [] };
      mockAxiosInstance.post.mockResolvedValue({ data: { environment: mockResponse } });

      const result = await client.createEnvironment(newEnvironment);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/environments?workspace=workspace-1', { 
        environment: { name: 'Test Env', values: [] }
      });
      expect(result).toEqual(mockResponse);
    });

    it('should update environment', async () => {
      const updates = { name: 'Updated Env', values: [{ key: 'test', value: 'value' }] };
      const mockResponse = { id: '123', ...updates };
      mockAxiosInstance.put.mockResolvedValue({ data: { environment: mockResponse } });

      const result = await client.updateEnvironment('123', updates);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/environments/123', { 
        environment: updates
      });
      expect(result).toEqual(mockResponse);
    });

    it('should delete environment', async () => {
      mockAxiosInstance.delete.mockResolvedValue({});

      await client.deleteEnvironment('123');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/environments/123');
    });
  });

  describe('requests', () => {
    it('should create request', async () => {
      const mockCollection = {
        info: { name: 'Test Collection' },
        item: []
      };
      const newRequest = {
        name: 'Test Request',
        url: 'https://api.example.com',
        method: 'GET' as const
      };
      
      mockAxiosInstance.get.mockResolvedValue({ data: { collection: mockCollection } });
      mockAxiosInstance.put.mockResolvedValue({});

      const result = await client.createRequest('col-123', newRequest);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/col-123');
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/collections/col-123', { 
        collection: expect.objectContaining({
          item: expect.arrayContaining([
            expect.objectContaining({
              name: 'Test Request',
              request: expect.objectContaining({
                method: 'GET',
                url: { raw: 'https://api.example.com' }
              })
            })
          ])
        })
      });
      expect(result.name).toBe('Test Request');
    });

    it('should get request', async () => {
      const mockCollection = {
        info: { name: 'Test Collection' },
        item: [{
          id: 'req-123',
          name: 'Test Request',
          request: { method: 'GET', url: { raw: 'https://api.example.com' } }
        }]
      };
      
      mockAxiosInstance.get.mockResolvedValue({ data: { collection: mockCollection } });

      const result = await client.getRequest('col-123', 'req-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/col-123');
      expect(result.name).toBe('Test Request');
    });

    it('should update request', async () => {
      const mockCollection = {
        info: { name: 'Test Collection' },
        item: [{
          id: 'req-123',
          name: 'Test Request',
          request: { method: 'GET', url: { raw: 'https://api.example.com' }, header: [] }
        }]
      };
      const updates = { name: 'Updated Request', method: 'POST' as const };
      
      mockAxiosInstance.get.mockResolvedValue({ data: { collection: mockCollection } });
      mockAxiosInstance.put.mockResolvedValue({});

      const result = await client.updateRequest('col-123', 'req-123', updates);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/col-123');
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/collections/col-123', { 
        collection: expect.any(Object)
      });
      expect(result.name).toBe('Updated Request');
    });

    it('should delete request', async () => {
      const mockCollection = {
        info: { name: 'Test Collection' },
        item: [{
          id: 'req-123',
          name: 'Test Request',
          request: { method: 'GET', url: { raw: 'https://api.example.com' } }
        }]
      };
      
      mockAxiosInstance.get.mockResolvedValue({ data: { collection: mockCollection } });
      mockAxiosInstance.put.mockResolvedValue({});

      await client.deleteRequest('col-123', 'req-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/col-123');
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/collections/col-123', { 
        collection: expect.objectContaining({
          item: []
        })
      });
    });

    it('should move request', async () => {
      const mockCollection = {
        info: { name: 'Test Collection' },
        item: [
          {
            id: 'req-123',
            name: 'Test Request',
            request: { method: 'GET', url: { raw: 'https://api.example.com' } }
          },
          {
            id: 'folder-123',
            name: 'Test Folder',
            item: []
          }
        ]
      };
      
      mockAxiosInstance.get.mockResolvedValue({ data: { collection: mockCollection } });
      mockAxiosInstance.put.mockResolvedValue({});

      await client.moveRequest('col-123', { requestId: 'req-123', targetFolderId: 'folder-123' });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/col-123');
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/collections/col-123', { 
        collection: expect.any(Object)
      });
    });
  });

  describe('folders', () => {
    it('should create folder', async () => {
      const mockCollection = {
        info: { name: 'Test Collection' },
        item: []
      };
      const newFolder = { name: 'Test Folder' };
      
      mockAxiosInstance.get.mockResolvedValue({ data: { collection: mockCollection } });
      mockAxiosInstance.put.mockResolvedValue({});

      const result = await client.createFolder('col-123', newFolder);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/col-123');
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/collections/col-123', { 
        collection: expect.objectContaining({
          item: expect.arrayContaining([
            expect.objectContaining({
              name: 'Test Folder',
              item: []
            })
          ])
        })
      });
      expect(result.name).toBe('Test Folder');
    });

    it('should update folder', async () => {
      const mockCollection = {
        info: { name: 'Test Collection' },
        item: [{
          id: 'folder-123',
          name: 'Test Folder',
          item: []
        }]
      };
      const updates = { name: 'Updated Folder', description: 'Updated description' };
      
      mockAxiosInstance.get.mockResolvedValue({ data: { collection: mockCollection } });
      mockAxiosInstance.put.mockResolvedValue({});

      const result = await client.updateFolder('col-123', 'folder-123', updates);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/col-123');
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/collections/col-123', { 
        collection: expect.any(Object)
      });
      expect(result.name).toBe('Updated Folder');
    });

    it('should delete folder', async () => {
      const mockCollection = {
        info: { name: 'Test Collection' },
        item: [{
          id: 'folder-123',
          name: 'Test Folder',
          item: []
        }]
      };
      
      mockAxiosInstance.get.mockResolvedValue({ data: { collection: mockCollection } });
      mockAxiosInstance.put.mockResolvedValue({});

      await client.deleteFolder('col-123', 'folder-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/col-123');
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/collections/col-123', { 
        collection: expect.objectContaining({
          item: []
        })
      });
    });
  });

  describe('workspace management', () => {
    it('should update workspace', async () => {
      const mockWorkspace = { id: '1', name: 'Updated Workspace', type: 'personal' };
      mockAxiosInstance.put.mockResolvedValue({ data: { workspace: mockWorkspace } });

      const result = await client.updateWorkspace('1', { name: 'Updated Workspace' });

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/workspaces/1', {
        workspace: { name: 'Updated Workspace' }
      });
      expect(result).toEqual(mockWorkspace);
    });

    it('should delete workspace', async () => {
      mockAxiosInstance.delete.mockResolvedValue({});

      await client.deleteWorkspace('1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/workspaces/1');
    });
  });

  describe('collection management', () => {
    it('should get collection details', async () => {
      const mockCollection = {
        info: { name: 'Test Collection', schema: 'v2.1.0' },
        item: []
      };
      mockAxiosInstance.get.mockResolvedValue({ data: { collection: mockCollection } });

      const result = await client.getCollection('col-123');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/collections/col-123');
      expect(result).toEqual(mockCollection);
    });

    it('should update collection', async () => {
      const mockCollection = { id: '1', name: 'Updated Collection' };
      mockAxiosInstance.put.mockResolvedValue({ data: { collection: mockCollection } });

      const result = await client.updateCollection('1', { name: 'Updated Collection' });

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/collections/1', {
        collection: { info: { name: 'Updated Collection' } }
      });
      expect(result).toEqual(mockCollection);
    });

    it('should delete collection', async () => {
      mockAxiosInstance.delete.mockResolvedValue({});

      await client.deleteCollection('1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/collections/1');
    });
  });
});
