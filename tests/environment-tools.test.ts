import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PostmanAPIClient } from '../src/utils/postman-client';
import { handleEnvironmentTool } from '../src/tools/environment-tools';

// Mock the PostmanAPIClient
jest.mock('../src/utils/postman-client');

describe('Environment Tools', () => {
  let mockClient: jest.Mocked<PostmanAPIClient>;

  beforeEach(() => {
    mockClient = {
      listEnvironments: jest.fn(),
      getEnvironment: jest.fn(),
      createEnvironment: jest.fn(),
      updateEnvironment: jest.fn(),
      deleteEnvironment: jest.fn(),
    } as any;
  });

  describe('list_environments', () => {
    it('should list all environments', async () => {
      const mockEnvironments = [
        {
          id: 'env-1',
          name: 'Development',
          values: [
            { key: 'API_URL', value: 'https://dev-api.example.com', type: 'default' as const },
          ],
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          owner: 'owner-123',
          uid: 'uid-123',
          isPublic: false,
        },
        {
          id: 'env-2',
          name: 'Production',
          values: [
            { key: 'API_URL', value: 'https://api.example.com', type: 'default' as const },
          ],
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          owner: 'owner-123',
          uid: 'uid-124',
          isPublic: false,
        },
      ];

      mockClient.listEnvironments.mockResolvedValue(mockEnvironments);

      const result = await handleEnvironmentTool('list_environments', {}, mockClient);

      expect(mockClient.listEnvironments).toHaveBeenCalledWith(undefined);
      expect(result.content[0]?.text).toBe(JSON.stringify(mockEnvironments, null, 2));
    });

    it('should list environments for a specific workspace', async () => {
      const mockEnvironments = [
        {
          id: 'env-1',
          name: 'Workspace Environment',
          values: [],
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          owner: 'owner-123',
          uid: 'uid-123',
          isPublic: false,
        },
      ];

      mockClient.listEnvironments.mockResolvedValue(mockEnvironments);

      const args = { workspaceId: 'workspace-123' };
      await handleEnvironmentTool('list_environments', args, mockClient);

      expect(mockClient.listEnvironments).toHaveBeenCalledWith('workspace-123');
    });
  });

  describe('get_environment', () => {
    it('should get an environment successfully', async () => {
      const mockEnvironment = {
        id: 'env-123',
        name: 'Test Environment',
        values: [
          { key: 'API_URL', value: 'https://test-api.example.com', type: 'default' as const },
          { key: 'API_KEY', value: 'secret-key', type: 'secret' as const },
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        owner: 'owner-123',
        uid: 'uid-123',
        isPublic: false,
      };

      mockClient.getEnvironment.mockResolvedValue(mockEnvironment);

      const args = { environmentId: 'env-123' };
      const result = await handleEnvironmentTool('get_environment', args, mockClient);

      expect(mockClient.getEnvironment).toHaveBeenCalledWith('env-123');
      expect(result.content[0]?.text).toBe(JSON.stringify(mockEnvironment, null, 2));
    });

    it('should handle missing environmentId', async () => {
      const args = {};

      await expect(
        handleEnvironmentTool('get_environment', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('create_environment', () => {
    it('should create an environment with minimal data', async () => {
      const mockEnvironment = {
        id: 'env-123',
        name: 'New Environment',
        values: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        owner: 'owner-123',
        uid: 'uid-123',
        isPublic: false,
      };

      mockClient.createEnvironment.mockResolvedValue(mockEnvironment);

      const args = { name: 'New Environment' };
      const result = await handleEnvironmentTool('create_environment', args, mockClient);

      expect(mockClient.createEnvironment).toHaveBeenCalledWith({
        name: 'New Environment',
      });
      expect(result.content[0]?.text).toContain('Environment created successfully');
      expect(result.content[0]?.text).toContain(JSON.stringify(mockEnvironment, null, 2));
    });

    it('should create an environment with variables and workspace', async () => {
      const mockEnvironment = {
        id: 'env-123',
        name: 'Detailed Environment',
        values: [
          { key: 'API_URL', value: 'https://api.example.com', type: 'default' as const },
          { key: 'API_KEY', value: 'secret-key', type: 'secret' as const, description: 'API authentication key' },
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        owner: 'owner-123',
        uid: 'uid-123',
        isPublic: false,
      };

      mockClient.createEnvironment.mockResolvedValue(mockEnvironment);

      const args = {
        name: 'Detailed Environment',
        values: [
          { key: 'API_URL', value: 'https://api.example.com', type: 'default' as const },
          { key: 'API_KEY', value: 'secret-key', type: 'secret' as const, description: 'API authentication key' },
        ],
        workspaceId: 'workspace-123',
      };

      await handleEnvironmentTool('create_environment', args, mockClient);

      expect(mockClient.createEnvironment).toHaveBeenCalledWith({
        name: 'Detailed Environment',
        values: [
          { key: 'API_URL', value: 'https://api.example.com', type: 'default' },
          { key: 'API_KEY', value: 'secret-key', type: 'secret', description: 'API authentication key' },
        ],
        workspaceId: 'workspace-123',
      });
    });

    it('should handle missing name', async () => {
      const args = { values: [] };

      await expect(
        handleEnvironmentTool('create_environment', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('update_environment', () => {
    it('should update an environment successfully', async () => {
      const mockEnvironment = {
        id: 'env-123',
        name: 'Updated Environment',
        values: [
          { key: 'API_URL', value: 'https://updated-api.example.com', type: 'default' as const },
        ],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
        owner: 'owner-123',
        uid: 'uid-123',
        isPublic: false,
      };

      mockClient.updateEnvironment.mockResolvedValue(mockEnvironment);

      const args = {
        environmentId: 'env-123',
        name: 'Updated Environment',
        values: [
          { key: 'API_URL', value: 'https://updated-api.example.com', type: 'default' as const },
        ],
      };

      const result = await handleEnvironmentTool('update_environment', args, mockClient);

      expect(mockClient.updateEnvironment).toHaveBeenCalledWith('env-123', {
        name: 'Updated Environment',
        values: [
          { key: 'API_URL', value: 'https://updated-api.example.com', type: 'default' },
        ],
      });
      expect(result.content[0]?.text).toContain('Environment updated successfully');
      expect(result.content[0]?.text).toContain(JSON.stringify(mockEnvironment, null, 2));
    });

    it('should update only provided fields', async () => {
      const mockEnvironment = {
        id: 'env-123',
        name: 'Updated Name Only',
        values: [],
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
        owner: 'owner-123',
        uid: 'uid-123',
        isPublic: false,
      };

      mockClient.updateEnvironment.mockResolvedValue(mockEnvironment);

      const args = {
        environmentId: 'env-123',
        name: 'Updated Name Only',
      };

      await handleEnvironmentTool('update_environment', args, mockClient);

      expect(mockClient.updateEnvironment).toHaveBeenCalledWith('env-123', {
        name: 'Updated Name Only',
      });
    });

    it('should handle missing environmentId', async () => {
      const args = { name: 'New Name' };

      await expect(
        handleEnvironmentTool('update_environment', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('delete_environment', () => {
    it('should delete an environment successfully', async () => {
      mockClient.deleteEnvironment.mockResolvedValue();

      const args = { environmentId: 'env-123' };
      const result = await handleEnvironmentTool('delete_environment', args, mockClient);

      expect(mockClient.deleteEnvironment).toHaveBeenCalledWith('env-123');
      expect(result.content[0]?.text).toBe('Environment env-123 deleted successfully');
    });

    it('should handle missing environmentId', async () => {
      const args = {};

      await expect(
        handleEnvironmentTool('delete_environment', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle unknown tool names', async () => {
      await expect(
        handleEnvironmentTool('unknown_tool', {}, mockClient)
      ).rejects.toThrow('Unknown environment tool: unknown_tool');
    });

    it('should propagate client errors', async () => {
      mockClient.createEnvironment.mockRejectedValue(new Error('API Error'));

      const args = { name: 'Test Environment' };

      await expect(
        handleEnvironmentTool('create_environment', args, mockClient)
      ).rejects.toThrow('API Error');
    });

    it('should handle network errors', async () => {
      mockClient.listEnvironments.mockRejectedValue(new Error('Network error'));

      await expect(
        handleEnvironmentTool('list_environments', {}, mockClient)
      ).rejects.toThrow('Network error');
    });

    it('should handle validation errors for variable types', async () => {
      const args = {
        name: 'Test Environment',
        values: [
          { key: 'API_URL', value: 'https://api.example.com', type: 'invalid_type' },
        ],
      };

      await expect(
        handleEnvironmentTool('create_environment', args, mockClient)
      ).rejects.toThrow();
    });
  });
});
