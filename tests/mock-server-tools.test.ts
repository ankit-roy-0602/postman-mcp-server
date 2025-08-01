import { PostmanAPIClient } from '../src/utils/postman-client.js';
import { handleMockServerTool } from '../src/tools/mock-server-tools.js';

// Mock the PostmanAPIClient
jest.mock('../src/utils/postman-client.js');

describe('Mock Server Tools', () => {
  let mockClient: jest.Mocked<PostmanAPIClient>;

  beforeEach(() => {
    mockClient = new PostmanAPIClient('test-key') as jest.Mocked<PostmanAPIClient>;
    jest.clearAllMocks();
  });

  describe('list_mock_servers', () => {
    it('should list all mock servers', async () => {
      const mockServers = [
        {
          id: 'mock-1',
          name: 'Test Mock Server',
          url: 'https://mock-server-url.com',
          collection: 'collection-id',
          private: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          uid: 'uid-1',
          owner: 'owner-1',
        },
      ];

      mockClient.listMockServers.mockResolvedValue(mockServers);

      const result = await handleMockServerTool('list_mock_servers', {}, mockClient);

      expect(mockClient.listMockServers).toHaveBeenCalledWith();
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toBe(JSON.stringify(mockServers, null, 2));
    });
  });

  describe('get_mock_server', () => {
    it('should get a specific mock server', async () => {
      const mockServer = {
        id: 'mock-1',
        name: 'Test Mock Server',
        url: 'https://mock-server-url.com',
        collection: 'collection-id',
        private: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        uid: 'uid-1',
        owner: 'owner-1',
      };

      mockClient.getMockServer.mockResolvedValue(mockServer);

      const result = await handleMockServerTool(
        'get_mock_server',
        { mockId: 'mock-1' },
        mockClient
      );

      expect(mockClient.getMockServer).toHaveBeenCalledWith('mock-1');
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toBe(JSON.stringify(mockServer, null, 2));
    });
  });

  describe('create_mock_server', () => {
    it('should create a new mock server', async () => {
      const mockServer = {
        id: 'mock-1',
        name: 'New Mock Server',
        url: 'https://new-mock-server.com',
        collection: 'collection-id',
        private: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        uid: 'uid-1',
        owner: 'owner-1',
      };

      mockClient.createMockServer.mockResolvedValue(mockServer);

      const result = await handleMockServerTool(
        'create_mock_server',
        {
          name: 'New Mock Server',
          collectionId: 'collection-id',
          private: false,
        },
        mockClient
      );

      expect(mockClient.createMockServer).toHaveBeenCalledWith({
        name: 'New Mock Server',
        collectionId: 'collection-id',
        private: false,
      });
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toContain('Mock server created successfully');
      expect(result.content[0]?.text).toContain(JSON.stringify(mockServer, null, 2));
    });
  });

  describe('create_ai_mock_server', () => {
    it('should create an AI-powered mock server', async () => {
      const aiResult = {
        mockServer: {
          id: 'mock-1',
          name: 'AI Mock Server',
          url: 'https://ai-mock-server.com',
          collection: 'collection-id',
          private: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          uid: 'uid-1',
          owner: 'owner-1',
        },
        examplesGenerated: 5,
        summary: 'Created AI-powered mock server with 5 examples',
      };

      mockClient.createMockServerWithAIExamples.mockResolvedValue(aiResult);

      const result = await handleMockServerTool(
        'create_ai_mock_server',
        {
          name: 'AI Mock Server',
          collectionId: 'collection-id',
          generateRealisticData: true,
          includeErrorResponses: true,
        },
        mockClient
      );

      expect(mockClient.createMockServerWithAIExamples).toHaveBeenCalledWith(
        'collection-id',
        'AI Mock Server',
        {
          generateRealisticData: true,
          includeErrorResponses: true,
        }
      );
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toContain('AI-powered mock server created successfully');
      expect(result.content[0]?.text).toContain(aiResult.summary);
    });
  });

  describe('update_mock_server', () => {
    it('should update an existing mock server', async () => {
      const updatedMockServer = {
        id: 'mock-1',
        name: 'Updated Mock Server',
        url: 'https://updated-mock-server.com',
        collection: 'collection-id',
        private: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        uid: 'uid-1',
        owner: 'owner-1',
      };

      mockClient.updateMockServer.mockResolvedValue(updatedMockServer);

      const result = await handleMockServerTool(
        'update_mock_server',
        {
          mockId: 'mock-1',
          name: 'Updated Mock Server',
          private: true,
        },
        mockClient
      );

      expect(mockClient.updateMockServer).toHaveBeenCalledWith('mock-1', {
        name: 'Updated Mock Server',
        private: true,
      });
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toContain('Mock server updated successfully');
      expect(result.content[0]?.text).toContain(JSON.stringify(updatedMockServer, null, 2));
    });
  });

  describe('delete_mock_server', () => {
    it('should delete a mock server', async () => {
      mockClient.deleteMockServer.mockResolvedValue();

      const result = await handleMockServerTool(
        'delete_mock_server',
        { mockId: 'mock-1' },
        mockClient
      );

      expect(mockClient.deleteMockServer).toHaveBeenCalledWith('mock-1');
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toBe('Mock server mock-1 deleted successfully');
    });
  });

  describe('get_mock_server_call_logs', () => {
    it('should get call logs for a mock server', async () => {
      const callLogs = [
        {
          id: 'log-1',
          request: {
            method: 'GET',
            url: '/api/users',
            headers: { 'Content-Type': 'application/json' },
          },
          response: {
            code: 200,
            status: 'OK',
            headers: { 'Content-Type': 'application/json' },
            body: '{"users": []}',
          },
          timestamp: '2024-01-01T00:00:00Z',
        },
      ];

      mockClient.getMockServerCallLogs.mockResolvedValue(callLogs);

      const result = await handleMockServerTool(
        'get_mock_server_call_logs',
        { mockId: 'mock-1', limit: 10 },
        mockClient
      );

      expect(mockClient.getMockServerCallLogs).toHaveBeenCalledWith('mock-1', 10);
      expect(result.content).toHaveLength(1);
      expect(result.content[0]?.text).toBe(JSON.stringify(callLogs, null, 2));
    });
  });

  describe('error handling', () => {
    it('should throw error for unknown tool', async () => {
      await expect(
        handleMockServerTool('unknown_tool', {}, mockClient)
      ).rejects.toThrow('Unknown mock server tool: unknown_tool');
    });
  });
});
