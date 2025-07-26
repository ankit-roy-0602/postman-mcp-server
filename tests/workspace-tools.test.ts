import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PostmanAPIClient } from '../src/utils/postman-client';
import { workspaceTools } from '../src/tools/workspace-tools';

// Mock the PostmanAPIClient
jest.mock('../src/utils/postman-client');

describe('Workspace Tools', () => {
  let mockClient: jest.Mocked<PostmanAPIClient>;

  beforeEach(() => {
    mockClient = new PostmanAPIClient('test-key') as jest.Mocked<PostmanAPIClient>;
  });

  describe('list_workspaces', () => {
    it('should return all workspaces when API call succeeds', async () => {
      const mockWorkspaces = {
        workspaces: [
          {
            id: 'workspace-1',
            name: 'Test Workspace 1',
            type: 'personal',
            description: 'Test description 1'
          },
          {
            id: 'workspace-2',
            name: 'Test Workspace 2',
            type: 'team',
            description: 'Test description 2'
          }
        ]
      };

      mockClient.get.mockResolvedValue({ data: mockWorkspaces });

      const result = await workspaceTools.list_workspaces.handler({});

      expect(mockClient.get).toHaveBeenCalledWith('/workspaces');
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: expect.stringContaining('Found 2 workspaces')
          }
        ]
      });
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.get.mockRejectedValue(error);

      await expect(workspaceTools.list_workspaces.handler({}))
        .rejects.toThrow('Failed to list workspaces: API Error');
    });
  });

  describe('get_workspace', () => {
    it('should return workspace details when API call succeeds', async () => {
      const mockWorkspace = {
        workspace: {
          id: 'workspace-1',
          name: 'Test Workspace',
          type: 'personal',
          description: 'Test description',
          collections: [],
          environments: []
        }
      };

      mockClient.get.mockResolvedValue({ data: mockWorkspace });

      const result = await workspaceTools.get_workspace.handler({
        workspaceId: 'workspace-1'
      });

      expect(mockClient.get).toHaveBeenCalledWith('/workspaces/workspace-1');
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: expect.stringContaining('Test Workspace')
          }
        ]
      });
    });

    it('should throw error for missing workspaceId', async () => {
      await expect(workspaceTools.get_workspace.handler({}))
        .rejects.toThrow('Workspace ID is required');
    });
  });

  describe('create_workspace', () => {
    it('should create workspace successfully', async () => {
      const mockResponse = {
        workspace: {
          id: 'new-workspace-id',
          name: 'New Workspace',
          type: 'personal',
          description: 'New workspace description'
        }
      };

      mockClient.post.mockResolvedValue({ data: mockResponse });

      const result = await workspaceTools.create_workspace.handler({
        name: 'New Workspace',
        type: 'personal',
        description: 'New workspace description'
      });

      expect(mockClient.post).toHaveBeenCalledWith('/workspaces', {
        workspace: {
          name: 'New Workspace',
          type: 'personal',
          description: 'New workspace description'
        }
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: expect.stringContaining('Successfully created workspace')
          }
        ]
      });
    });

    it('should throw error for missing name', async () => {
      await expect(workspaceTools.create_workspace.handler({
        type: 'personal'
      })).rejects.toThrow('Workspace name is required');
    });

    it('should throw error for invalid type', async () => {
      await expect(workspaceTools.create_workspace.handler({
        name: 'Test',
        type: 'invalid'
      })).rejects.toThrow('Workspace type must be either "personal" or "team"');
    });
  });

  describe('update_workspace', () => {
    it('should update workspace successfully', async () => {
      const mockResponse = {
        workspace: {
          id: 'workspace-1',
          name: 'Updated Workspace',
          type: 'personal',
          description: 'Updated description'
        }
      };

      mockClient.put.mockResolvedValue({ data: mockResponse });

      const result = await workspaceTools.update_workspace.handler({
        workspaceId: 'workspace-1',
        name: 'Updated Workspace',
        description: 'Updated description'
      });

      expect(mockClient.put).toHaveBeenCalledWith('/workspaces/workspace-1', {
        workspace: {
          name: 'Updated Workspace',
          description: 'Updated description'
        }
      });

      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: expect.stringContaining('Successfully updated workspace')
          }
        ]
      });
    });
  });

  describe('delete_workspace', () => {
    it('should delete workspace successfully', async () => {
      mockClient.delete.mockResolvedValue({ data: {} });

      const result = await workspaceTools.delete_workspace.handler({
        workspaceId: 'workspace-1'
      });

      expect(mockClient.delete).toHaveBeenCalledWith('/workspaces/workspace-1');
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: expect.stringContaining('Successfully deleted workspace')
          }
        ]
      });
    });
  });
});
