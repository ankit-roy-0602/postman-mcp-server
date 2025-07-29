import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PostmanAPIClient } from '../src/utils/postman-client';
import { handleWorkspaceTool } from '../src/tools/workspace-tools';

// Mock the PostmanAPIClient
jest.mock('../src/utils/postman-client');

describe('Workspace Tools', () => {
  let mockClient: jest.Mocked<PostmanAPIClient>;

  beforeEach(() => {
    mockClient = {
      listWorkspaces: jest.fn(),
      getWorkspace: jest.fn(),
      createWorkspace: jest.fn(),
      updateWorkspace: jest.fn(),
      deleteWorkspace: jest.fn(),
    } as any;
  });

  describe('list_workspaces', () => {
    it('should list all workspaces', async () => {
      const mockWorkspaces = [
        {
          id: 'ws-1',
          name: 'Personal Workspace',
          type: 'personal' as const,
          description: 'My personal workspace',
          visibility: 'private' as const,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          id: 'ws-2',
          name: 'Team Workspace',
          type: 'team' as const,
          description: 'Our team workspace',
          visibility: 'team' as const,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ];

      mockClient.listWorkspaces.mockResolvedValue(mockWorkspaces);

      const result = await handleWorkspaceTool('list_workspaces', {}, mockClient);

      expect(mockClient.listWorkspaces).toHaveBeenCalledWith();
      expect(result.content[0]?.text).toBe(JSON.stringify(mockWorkspaces, null, 2));
    });

    it('should handle empty workspace list', async () => {
      mockClient.listWorkspaces.mockResolvedValue([]);

      const result = await handleWorkspaceTool('list_workspaces', {}, mockClient);

      expect(mockClient.listWorkspaces).toHaveBeenCalledWith();
      expect(result.content[0]?.text).toBe(JSON.stringify([], null, 2));
    });
  });

  describe('get_workspace', () => {
    it('should get a workspace successfully', async () => {
      const mockWorkspace = {
        id: 'ws-123',
        name: 'Test Workspace',
        type: 'personal' as const,
        description: 'A test workspace',
        visibility: 'private' as const,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      mockClient.getWorkspace.mockResolvedValue(mockWorkspace);

      const args = { workspaceId: 'ws-123' };
      const result = await handleWorkspaceTool('get_workspace', args, mockClient);

      expect(mockClient.getWorkspace).toHaveBeenCalledWith('ws-123');
      expect(result.content[0]?.text).toBe(JSON.stringify(mockWorkspace, null, 2));
    });

    it('should handle missing workspaceId', async () => {
      const args = {};

      await expect(
        handleWorkspaceTool('get_workspace', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('create_workspace', () => {
    it('should create a personal workspace', async () => {
      const mockWorkspace = {
        id: 'ws-123',
        name: 'New Personal Workspace',
        type: 'personal' as const,
        visibility: 'private' as const,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      mockClient.createWorkspace.mockResolvedValue(mockWorkspace);

      const args = {
        name: 'New Personal Workspace',
        type: 'personal' as const,
      };

      const result = await handleWorkspaceTool('create_workspace', args, mockClient);

      expect(mockClient.createWorkspace).toHaveBeenCalledWith({
        name: 'New Personal Workspace',
        type: 'personal',
      });
      expect(result.content[0]?.text).toContain('Workspace created successfully');
      expect(result.content[0]?.text).toContain(JSON.stringify(mockWorkspace, null, 2));
    });

    it('should create a team workspace with description', async () => {
      const mockWorkspace = {
        id: 'ws-123',
        name: 'New Team Workspace',
        type: 'team' as const,
        description: 'A workspace for our team',
        visibility: 'team' as const,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      mockClient.createWorkspace.mockResolvedValue(mockWorkspace);

      const args = {
        name: 'New Team Workspace',
        type: 'team' as const,
        description: 'A workspace for our team',
      };

      await handleWorkspaceTool('create_workspace', args, mockClient);

      expect(mockClient.createWorkspace).toHaveBeenCalledWith({
        name: 'New Team Workspace',
        type: 'team',
        description: 'A workspace for our team',
      });
    });

    it('should handle missing required fields', async () => {
      const args = { name: 'Test Workspace' }; // Missing type

      await expect(
        handleWorkspaceTool('create_workspace', args, mockClient)
      ).rejects.toThrow();
    });

    it('should handle invalid workspace type', async () => {
      const args = {
        name: 'Test Workspace',
        type: 'invalid_type',
      };

      await expect(
        handleWorkspaceTool('create_workspace', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('update_workspace', () => {
    it('should update a workspace successfully', async () => {
      const mockWorkspace = {
        id: 'ws-123',
        name: 'Updated Workspace',
        type: 'personal' as const,
        description: 'Updated description',
        visibility: 'private' as const,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      };

      mockClient.updateWorkspace.mockResolvedValue(mockWorkspace);

      const args = {
        workspaceId: 'ws-123',
        name: 'Updated Workspace',
        description: 'Updated description',
      };

      const result = await handleWorkspaceTool('update_workspace', args, mockClient);

      expect(mockClient.updateWorkspace).toHaveBeenCalledWith('ws-123', {
        name: 'Updated Workspace',
        description: 'Updated description',
      });
      expect(result.content[0]?.text).toContain('Workspace updated successfully');
      expect(result.content[0]?.text).toContain(JSON.stringify(mockWorkspace, null, 2));
    });

    it('should update only provided fields', async () => {
      const mockWorkspace = {
        id: 'ws-123',
        name: 'Updated Name Only',
        type: 'personal' as const,
        visibility: 'private' as const,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      };

      mockClient.updateWorkspace.mockResolvedValue(mockWorkspace);

      const args = {
        workspaceId: 'ws-123',
        name: 'Updated Name Only',
      };

      await handleWorkspaceTool('update_workspace', args, mockClient);

      expect(mockClient.updateWorkspace).toHaveBeenCalledWith('ws-123', {
        name: 'Updated Name Only',
      });
    });

    it('should handle missing workspaceId', async () => {
      const args = { name: 'New Name' };

      await expect(
        handleWorkspaceTool('update_workspace', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('delete_workspace', () => {
    it('should delete a workspace successfully', async () => {
      mockClient.deleteWorkspace.mockResolvedValue();

      const args = { workspaceId: 'ws-123' };
      const result = await handleWorkspaceTool('delete_workspace', args, mockClient);

      expect(mockClient.deleteWorkspace).toHaveBeenCalledWith('ws-123');
      expect(result.content[0]?.text).toBe('Workspace ws-123 deleted successfully');
    });

    it('should handle missing workspaceId', async () => {
      const args = {};

      await expect(
        handleWorkspaceTool('delete_workspace', args, mockClient)
      ).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle unknown tool names', async () => {
      await expect(
        handleWorkspaceTool('unknown_tool', {}, mockClient)
      ).rejects.toThrow('Unknown workspace tool: unknown_tool');
    });

    it('should propagate client errors', async () => {
      mockClient.createWorkspace.mockRejectedValue(new Error('API Error'));

      const args = { name: 'Test Workspace', type: 'personal' as const };

      await expect(
        handleWorkspaceTool('create_workspace', args, mockClient)
      ).rejects.toThrow('API Error');
    });

    it('should handle network errors', async () => {
      mockClient.listWorkspaces.mockRejectedValue(new Error('Network error'));

      await expect(
        handleWorkspaceTool('list_workspaces', {}, mockClient)
      ).rejects.toThrow('Network error');
    });

    it('should handle permission errors', async () => {
      mockClient.deleteWorkspace.mockRejectedValue(new Error('Insufficient permissions'));

      const args = { workspaceId: 'ws-123' };

      await expect(
        handleWorkspaceTool('delete_workspace', args, mockClient)
      ).rejects.toThrow('Insufficient permissions');
    });
  });
});
