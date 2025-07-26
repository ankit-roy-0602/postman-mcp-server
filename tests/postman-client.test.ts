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
  });
});
