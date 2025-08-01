import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  PostmanWorkspace,
  PostmanCollection,
  PostmanCollectionDetail,
  PostmanEnvironment,
  PostmanRequest,
  PostmanFolder,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  CreateEnvironmentRequest,
  UpdateEnvironmentRequest,
  CreateRequestRequest,
  UpdateRequestRequest,
  CreateFolderRequest,
  MoveRequestRequest,
  PostmanMockServer,
  MockServerExample,
  CreateMockServerRequest,
  UpdateMockServerRequest,
  MockServerCallLog,
} from '../types/postman.js';

export class PostmanAPIClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://api.getpostman.com',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async validateConnection(): Promise<void> {
    try {
      await this.client.get('/me');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid Postman API key');
        }
        throw new Error(`Failed to connect to Postman API: ${error.message}`);
      }
      throw error;
    }
  }

  // Workspace Management
  async listWorkspaces(): Promise<PostmanWorkspace[]> {
    try {
      const response: AxiosResponse<{ workspaces: PostmanWorkspace[] }> =
        await this.client.get('/workspaces');
      return response.data.workspaces;
    } catch (error) {
      throw this.handleError(error, 'Failed to list workspaces');
    }
  }

  async getWorkspace(workspaceId: string): Promise<PostmanWorkspace> {
    try {
      const response: AxiosResponse<{ workspace: PostmanWorkspace }> =
        await this.client.get(`/workspaces/${workspaceId}`);
      return response.data.workspace;
    } catch (error) {
      throw this.handleError(error, `Failed to get workspace ${workspaceId}`);
    }
  }

  async createWorkspace(
    workspace: CreateWorkspaceRequest
  ): Promise<PostmanWorkspace> {
    try {
      const response: AxiosResponse<{ workspace: PostmanWorkspace }> =
        await this.client.post('/workspaces', { workspace });
      return response.data.workspace;
    } catch (error) {
      throw this.handleError(error, 'Failed to create workspace');
    }
  }

  async updateWorkspace(
    workspaceId: string,
    updates: UpdateWorkspaceRequest
  ): Promise<PostmanWorkspace> {
    try {
      const response: AxiosResponse<{ workspace: PostmanWorkspace }> =
        await this.client.put(`/workspaces/${workspaceId}`, {
          workspace: updates,
        });
      return response.data.workspace;
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to update workspace ${workspaceId}`
      );
    }
  }

  async deleteWorkspace(workspaceId: string): Promise<void> {
    try {
      await this.client.delete(`/workspaces/${workspaceId}`);
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to delete workspace ${workspaceId}`
      );
    }
  }

  // Collection Management
  async listCollections(workspaceId?: string): Promise<PostmanCollection[]> {
    try {
      const url = workspaceId
        ? `/collections?workspace=${workspaceId}`
        : '/collections';
      const response: AxiosResponse<{ collections: PostmanCollection[] }> =
        await this.client.get(url);
      return response.data.collections;
    } catch (error) {
      throw this.handleError(error, 'Failed to list collections');
    }
  }

  async getCollection(collectionId: string): Promise<PostmanCollectionDetail> {
    try {
      const response: AxiosResponse<{ collection: PostmanCollectionDetail }> =
        await this.client.get(`/collections/${collectionId}`);
      return response.data.collection;
    } catch (error) {
      throw this.handleError(error, `Failed to get collection ${collectionId}`);
    }
  }

  async createCollection(
    collection: CreateCollectionRequest
  ): Promise<PostmanCollection> {
    try {
      const collectionData = {
        info: {
          name: collection.name,
          description: collection.description,
          schema:
            'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        },
        item: [],
      };

      const url = collection.workspaceId
        ? `/collections?workspace=${collection.workspaceId}`
        : '/collections';

      const response: AxiosResponse<{ collection: PostmanCollection }> =
        await this.client.post(url, { collection: collectionData });
      return response.data.collection;
    } catch (error) {
      throw this.handleError(error, 'Failed to create collection');
    }
  }

  async updateCollection(
    collectionId: string,
    updates: UpdateCollectionRequest
  ): Promise<PostmanCollection> {
    try {
      const response: AxiosResponse<{ collection: PostmanCollection }> =
        await this.client.put(`/collections/${collectionId}`, {
          collection: { info: updates },
        });
      return response.data.collection;
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to update collection ${collectionId}`
      );
    }
  }

  async deleteCollection(collectionId: string): Promise<void> {
    try {
      await this.client.delete(`/collections/${collectionId}`);
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to delete collection ${collectionId}`
      );
    }
  }

  // Environment Management
  async listEnvironments(workspaceId?: string): Promise<PostmanEnvironment[]> {
    try {
      const url = workspaceId
        ? `/environments?workspace=${workspaceId}`
        : '/environments';
      const response: AxiosResponse<{ environments: PostmanEnvironment[] }> =
        await this.client.get(url);
      return response.data.environments;
    } catch (error) {
      throw this.handleError(error, 'Failed to list environments');
    }
  }

  async getEnvironment(environmentId: string): Promise<PostmanEnvironment> {
    try {
      const response: AxiosResponse<{ environment: PostmanEnvironment }> =
        await this.client.get(`/environments/${environmentId}`);
      return response.data.environment;
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to get environment ${environmentId}`
      );
    }
  }

  async createEnvironment(
    environment: CreateEnvironmentRequest
  ): Promise<PostmanEnvironment> {
    try {
      const environmentData = {
        name: environment.name,
        values: environment.values || [],
      };

      const url = environment.workspaceId
        ? `/environments?workspace=${environment.workspaceId}`
        : '/environments';

      const response: AxiosResponse<{ environment: PostmanEnvironment }> =
        await this.client.post(url, { environment: environmentData });
      return response.data.environment;
    } catch (error) {
      throw this.handleError(error, 'Failed to create environment');
    }
  }

  async updateEnvironment(
    environmentId: string,
    updates: UpdateEnvironmentRequest
  ): Promise<PostmanEnvironment> {
    try {
      const response: AxiosResponse<{ environment: PostmanEnvironment }> =
        await this.client.put(`/environments/${environmentId}`, {
          environment: updates,
        });
      return response.data.environment;
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to update environment ${environmentId}`
      );
    }
  }

  async deleteEnvironment(environmentId: string): Promise<void> {
    try {
      await this.client.delete(`/environments/${environmentId}`);
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to delete environment ${environmentId}`
      );
    }
  }

  // Request Management
  async createRequest(
    collectionId: string,
    request: CreateRequestRequest
  ): Promise<PostmanRequest> {
    try {
      // First get the collection to modify its structure
      const collection = await this.getCollection(collectionId);

      const newRequest: PostmanRequest = {
        name: request.name,
        request: {
          method: request.method,
          header: request.headers || [],
          url: {
            raw: request.url,
          },
          ...(request.body && { body: request.body }),
        },
        ...(request.description && { description: request.description }),
      };

      // Add request to the appropriate location (folder or collection root)
      if (request.folderId) {
        // Find the folder and add the request to it
        const folder = this.findFolderInCollection(
          collection,
          request.folderId
        );
        if (!folder) {
          throw new Error(`Folder with ID ${request.folderId} not found`);
        }
        if (!folder.item) folder.item = [];
        folder.item.push(newRequest);
      } else {
        // Add to collection root
        collection.item.push(newRequest);
      }

      // Update the collection with the new request
      await this.client.put(`/collections/${collectionId}`, { collection });

      return newRequest;
    } catch (error) {
      throw this.handleError(error, 'Failed to create request');
    }
  }

  async updateRequest(
    collectionId: string,
    requestId: string,
    updates: UpdateRequestRequest
  ): Promise<PostmanRequest> {
    try {
      const collection = await this.getCollection(collectionId);
      const request = this.findRequestInCollection(collection, requestId);

      if (!request) {
        throw new Error(`Request with ID ${requestId} not found`);
      }

      // Update request properties
      if (updates.name) request.name = updates.name;
      if (updates.description) request.description = updates.description;
      if (updates.method) request.request.method = updates.method;
      if (updates.url) request.request.url = { raw: updates.url };
      if (updates.headers) request.request.header = updates.headers;
      if (updates.body) request.request.body = updates.body;

      // Update the collection
      await this.client.put(`/collections/${collectionId}`, { collection });

      return request;
    } catch (error) {
      throw this.handleError(error, `Failed to update request ${requestId}`);
    }
  }

  async deleteRequest(collectionId: string, requestId: string): Promise<void> {
    try {
      const collection = await this.getCollection(collectionId);
      const removed = this.removeRequestFromCollection(collection, requestId);

      if (!removed) {
        throw new Error(`Request with ID ${requestId} not found`);
      }

      // Update the collection
      await this.client.put(`/collections/${collectionId}`, { collection });
    } catch (error) {
      throw this.handleError(error, `Failed to delete request ${requestId}`);
    }
  }

  async getRequest(
    collectionId: string,
    requestId: string
  ): Promise<PostmanRequest> {
    try {
      const collection = await this.getCollection(collectionId);
      const request = this.findRequestInCollection(collection, requestId);

      if (!request) {
        throw new Error(`Request with ID ${requestId} not found`);
      }

      return request;
    } catch (error) {
      throw this.handleError(error, `Failed to get request ${requestId}`);
    }
  }

  // Folder Management
  async createFolder(
    collectionId: string,
    folder: CreateFolderRequest
  ): Promise<PostmanFolder> {
    try {
      const collection = await this.getCollection(collectionId);

      const newFolder: PostmanFolder = {
        name: folder.name,
        ...(folder.description && { description: folder.description }),
        item: [],
      };

      if (folder.parentFolderId) {
        // Add to parent folder
        const parentFolder = this.findFolderInCollection(
          collection,
          folder.parentFolderId
        );
        if (!parentFolder) {
          throw new Error(
            `Parent folder with ID ${folder.parentFolderId} not found`
          );
        }
        if (!parentFolder.item) parentFolder.item = [];
        parentFolder.item.push(newFolder);
      } else {
        // Add to collection root
        collection.item.push(newFolder);
      }

      // Update the collection
      await this.client.put(`/collections/${collectionId}`, { collection });

      return newFolder;
    } catch (error) {
      throw this.handleError(error, 'Failed to create folder');
    }
  }

  async updateFolder(
    collectionId: string,
    folderId: string,
    updates: { name?: string; description?: string }
  ): Promise<PostmanFolder> {
    try {
      const collection = await this.getCollection(collectionId);
      const folder = this.findFolderInCollection(collection, folderId);

      if (!folder) {
        throw new Error(`Folder with ID ${folderId} not found`);
      }

      if (updates.name) folder.name = updates.name;
      if (updates.description) folder.description = updates.description;

      // Update the collection
      await this.client.put(`/collections/${collectionId}`, { collection });

      return folder;
    } catch (error) {
      throw this.handleError(error, `Failed to update folder ${folderId}`);
    }
  }

  async deleteFolder(collectionId: string, folderId: string): Promise<void> {
    try {
      const collection = await this.getCollection(collectionId);
      const removed = this.removeFolderFromCollection(collection, folderId);

      if (!removed) {
        throw new Error(`Folder with ID ${folderId} not found`);
      }

      // Update the collection
      await this.client.put(`/collections/${collectionId}`, { collection });
    } catch (error) {
      throw this.handleError(error, `Failed to delete folder ${folderId}`);
    }
  }

  async moveRequest(
    collectionId: string,
    moveRequest: MoveRequestRequest
  ): Promise<void> {
    try {
      const collection = await this.getCollection(collectionId);

      // Find and remove the request from its current location
      const request = this.findRequestInCollection(
        collection,
        moveRequest.requestId
      );
      if (!request) {
        throw new Error(`Request with ID ${moveRequest.requestId} not found`);
      }

      this.removeRequestFromCollection(collection, moveRequest.requestId);

      // Add to new location
      if (moveRequest.targetFolderId) {
        const targetFolder = this.findFolderInCollection(
          collection,
          moveRequest.targetFolderId
        );
        if (!targetFolder) {
          throw new Error(
            `Target folder with ID ${moveRequest.targetFolderId} not found`
          );
        }
        if (!targetFolder.item) targetFolder.item = [];
        targetFolder.item.push(request);
      } else {
        // Move to collection root
        collection.item.push(request);
      }

      // Update the collection
      await this.client.put(`/collections/${collectionId}`, { collection });
    } catch (error) {
      throw this.handleError(error, 'Failed to move request');
    }
  }

  // Helper methods for navigating collection structure
  private findRequestInCollection(
    collection: PostmanCollectionDetail,
    requestId: string
  ): PostmanRequest | null {
    const findInItems = (
      items: Array<PostmanRequest | PostmanFolder>
    ): PostmanRequest | null => {
      for (const item of items) {
        if ('request' in item && item.id === requestId) {
          return item;
        }
        if ('item' in item && !('request' in item)) {
          const folder = item;
          if (folder.item) {
            const found = findInItems(folder.item);
            if (found) return found;
          }
        }
      }
      return null;
    };

    return findInItems(collection.item);
  }

  private findFolderInCollection(
    collection: PostmanCollectionDetail,
    folderId: string
  ): PostmanFolder | null {
    const findInItems = (
      items: Array<PostmanRequest | PostmanFolder>
    ): PostmanFolder | null => {
      for (const item of items) {
        if ('item' in item && !('request' in item)) {
          const folder = item;
          if (folder.id === folderId) return folder;
          if (folder.item) {
            const found = findInItems(folder.item);
            if (found) return found;
          }
        }
      }
      return null;
    };

    return findInItems(collection.item);
  }

  private removeRequestFromCollection(
    collection: PostmanCollectionDetail,
    requestId: string
  ): boolean {
    const removeFromItems = (
      items: Array<PostmanRequest | PostmanFolder>
    ): boolean => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item && 'request' in item && item.id === requestId) {
          items.splice(i, 1);
          return true;
        }
        if (item && 'item' in item && !('request' in item)) {
          const folder = item;
          if (folder.item && removeFromItems(folder.item)) return true;
        }
      }
      return false;
    };

    return removeFromItems(collection.item);
  }

  private removeFolderFromCollection(
    collection: PostmanCollectionDetail,
    folderId: string
  ): boolean {
    const removeFromItems = (
      items: Array<PostmanRequest | PostmanFolder>
    ): boolean => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item && 'item' in item && !('request' in item)) {
          const folder = item;
          if (folder.id === folderId) {
            items.splice(i, 1);
            return true;
          }
          if (folder.item && removeFromItems(folder.item)) return true;
        }
      }
      return false;
    };

    return removeFromItems(collection.item);
  }

  // Mock Server Management
  async listMockServers(): Promise<PostmanMockServer[]> {
    try {
      const response: AxiosResponse<{ mocks: PostmanMockServer[] }> =
        await this.client.get('/mocks');
      return response.data.mocks;
    } catch (error) {
      throw this.handleError(error, 'Failed to list mock servers');
    }
  }

  async getMockServer(mockId: string): Promise<PostmanMockServer> {
    try {
      const response: AxiosResponse<{ mock: PostmanMockServer }> =
        await this.client.get(`/mocks/${mockId}`);
      return response.data.mock;
    } catch (error) {
      throw this.handleError(error, `Failed to get mock server ${mockId}`);
    }
  }

  async createMockServer(
    mockServer: CreateMockServerRequest
  ): Promise<PostmanMockServer> {
    try {
      const mockData = {
        name: mockServer.name,
        collection: mockServer.collectionId,
        ...(mockServer.environmentId && {
          environment: mockServer.environmentId,
        }),
        private: mockServer.private ?? false,
        ...(mockServer.versionTag && { versionTag: mockServer.versionTag }),
        ...(mockServer.config && { config: mockServer.config }),
      };

      const response: AxiosResponse<{ mock: PostmanMockServer }> =
        await this.client.post('/mocks', { mock: mockData });
      return response.data.mock;
    } catch (error) {
      throw this.handleError(error, 'Failed to create mock server');
    }
  }

  async updateMockServer(
    mockId: string,
    updates: UpdateMockServerRequest
  ): Promise<PostmanMockServer> {
    try {
      const updateData = {
        ...(updates.name && { name: updates.name }),
        ...(updates.environmentId && { environment: updates.environmentId }),
        ...(updates.private !== undefined && { private: updates.private }),
        ...(updates.config && { config: updates.config }),
      };

      const response: AxiosResponse<{ mock: PostmanMockServer }> =
        await this.client.put(`/mocks/${mockId}`, { mock: updateData });
      return response.data.mock;
    } catch (error) {
      throw this.handleError(error, `Failed to update mock server ${mockId}`);
    }
  }

  async deleteMockServer(mockId: string): Promise<void> {
    try {
      await this.client.delete(`/mocks/${mockId}`);
    } catch (error) {
      throw this.handleError(error, `Failed to delete mock server ${mockId}`);
    }
  }

  async getMockServerCallLogs(
    mockId: string,
    limit?: number
  ): Promise<MockServerCallLog[]> {
    try {
      const url = limit
        ? `/mocks/${mockId}/call-logs?limit=${limit}`
        : `/mocks/${mockId}/call-logs`;
      const response: AxiosResponse<{ logs: MockServerCallLog[] }> =
        await this.client.get(url);
      return response.data.logs;
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to get call logs for mock server ${mockId}`
      );
    }
  }

  // AI-powered mock server creation methods
  async createMockServerWithAIExamples(
    collectionId: string,
    mockServerName: string,
    options: {
      environmentId?: string;
      private?: boolean;
      generateRealisticData?: boolean;
      includeErrorResponses?: boolean;
      responseDelay?: 'low' | 'medium' | 'high';
    } = {}
  ): Promise<{
    mockServer: PostmanMockServer;
    examplesGenerated: number;
    summary: string;
  }> {
    try {
      // Get the collection to analyze its structure
      const collection = await this.getCollection(collectionId);

      // Generate AI-powered examples for all requests
      const examplesGenerated = await this.generateAIExamplesForCollection(
        collection,
        options.generateRealisticData ?? true,
        options.includeErrorResponses ?? true
      );

      // Create the mock server with AI-optimized configuration
      const mockServerConfig = {
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'X-Powered-By', value: 'Postman-AI-Mock' },
        ],
        matchBody: true,
        matchQueryParams: true,
        matchWildcards: true,
        ...(options.responseDelay && {
          delay: {
            type: 'fixed' as const,
            preset: options.responseDelay,
          },
        }),
      };

      const mockServer = await this.createMockServer({
        name: mockServerName,
        collectionId,
        ...(options.environmentId && { environmentId: options.environmentId }),
        private: options.private ?? false,
        config: mockServerConfig,
      });

      return {
        mockServer,
        examplesGenerated,
        summary: `Created AI-powered mock server "${mockServerName}" with ${examplesGenerated} generated examples. Mock URL: ${mockServer.url}`,
      };
    } catch (error) {
      throw this.handleError(error, 'Failed to create AI-powered mock server');
    }
  }

  private async generateAIExamplesForCollection(
    collection: PostmanCollectionDetail,
    generateRealisticData: boolean,
    includeErrorResponses: boolean
  ): Promise<number> {
    let examplesGenerated = 0;

    const processItems = async (
      items: Array<PostmanRequest | PostmanFolder>
    ): Promise<void> => {
      for (const item of items) {
        if ('request' in item) {
          // This is a request - generate examples
          const examples = this.generateAIExamplesForRequest(
            item,
            generateRealisticData,
            includeErrorResponses
          );

          // Add examples to the request
          if (!item.response) {
            (item as unknown as { response: MockServerExample[] }).response =
              examples;
          } else {
            const itemWithResponse = item as unknown as {
              response: MockServerExample[];
            };
            itemWithResponse.response = [
              ...itemWithResponse.response,
              ...examples,
            ];
          }

          examplesGenerated += examples.length;
        } else if ('item' in item) {
          // This is a folder - process recursively
          if (item.item) {
            await processItems(item.item);
          }
        }
      }
    };

    await processItems(collection.item);

    // Update the collection with the new examples
    await this.client.put(`/collections/${collection.info.name}`, {
      collection,
    });

    return examplesGenerated;
  }

  private generateAIExamplesForRequest(
    request: PostmanRequest,
    generateRealisticData: boolean,
    includeErrorResponses: boolean
  ): MockServerExample[] {
    const examples: MockServerExample[] = [];
    const method = request.request.method;

    // Generate success response
    const successExample = this.generateSuccessExample(
      request,
      generateRealisticData
    );
    examples.push(successExample);

    // Generate error responses if requested
    if (includeErrorResponses) {
      const errorExamples = this.generateErrorExamples(request, method);
      examples.push(...errorExamples);
    }

    return examples;
  }

  private generateSuccessExample(
    request: PostmanRequest,
    generateRealisticData: boolean
  ): MockServerExample {
    const method = request.request.method;
    const url =
      typeof request.request.url === 'string'
        ? request.request.url
        : request.request.url.raw;

    let responseBody: Record<string, unknown> | null = null;
    let statusCode = 200;

    switch (method) {
      case 'GET':
        if (url.includes('/users') || url.includes('/user')) {
          responseBody = this.generateUserData(generateRealisticData);
        } else if (url.includes('/products') || url.includes('/product')) {
          responseBody = this.generateProductData(generateRealisticData);
        } else if (url.includes('/orders') || url.includes('/order')) {
          responseBody = this.generateOrderData(generateRealisticData);
        } else {
          responseBody = this.generateGenericGetResponse(
            url,
            generateRealisticData
          );
        }
        break;

      case 'POST':
        statusCode = 201;
        responseBody = this.generateCreateResponse(url, generateRealisticData);
        break;

      case 'PUT':
      case 'PATCH':
        responseBody = this.generateUpdateResponse(url, generateRealisticData);
        break;

      case 'DELETE':
        statusCode = 204;
        responseBody = null;
        break;

      default:
        responseBody = { message: 'Success', data: null };
    }

    return {
      name: `${method} Success Response`,
      request: {
        method,
        url,
        headers: request.request.header || [],
        ...(request.request.body && { body: request.request.body }),
      },
      response: {
        name: `${method} Success`,
        status: this.getStatusText(statusCode),
        code: statusCode,
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'X-Response-Time', value: '{{$randomInt}}ms' },
        ],
        body: responseBody ? JSON.stringify(responseBody, null, 2) : '',
        _postman_previewlanguage: 'json',
      },
    };
  }

  private generateErrorExamples(
    request: PostmanRequest,
    method: string
  ): MockServerExample[] {
    const examples: MockServerExample[] = [];
    const url =
      typeof request.request.url === 'string'
        ? request.request.url
        : request.request.url.raw;

    // 400 Bad Request
    examples.push({
      name: `${method} Bad Request`,
      request: {
        method,
        url,
        headers: request.request.header || [],
      },
      response: {
        name: 'Bad Request',
        status: 'Bad Request',
        code: 400,
        headers: [{ key: 'Content-Type', value: 'application/json' }],
        body: JSON.stringify(
          {
            error: 'Bad Request',
            message: 'Invalid request parameters',
            code: 400,
          },
          null,
          2
        ),
        _postman_previewlanguage: 'json',
      },
    });

    // 401 Unauthorized
    examples.push({
      name: `${method} Unauthorized`,
      request: {
        method,
        url,
        headers: [],
      },
      response: {
        name: 'Unauthorized',
        status: 'Unauthorized',
        code: 401,
        headers: [{ key: 'Content-Type', value: 'application/json' }],
        body: JSON.stringify(
          {
            error: 'Unauthorized',
            message: 'Authentication required',
            code: 401,
          },
          null,
          2
        ),
        _postman_previewlanguage: 'json',
      },
    });

    // 404 Not Found (for GET, PUT, PATCH, DELETE)
    if (['GET', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      examples.push({
        name: `${method} Not Found`,
        request: {
          method,
          url,
          headers: request.request.header || [],
        },
        response: {
          name: 'Not Found',
          status: 'Not Found',
          code: 404,
          headers: [{ key: 'Content-Type', value: 'application/json' }],
          body: JSON.stringify(
            {
              error: 'Not Found',
              message: 'Resource not found',
              code: 404,
            },
            null,
            2
          ),
          _postman_previewlanguage: 'json',
        },
      });
    }

    // 500 Internal Server Error
    examples.push({
      name: `${method} Server Error`,
      request: {
        method,
        url,
        headers: request.request.header || [],
      },
      response: {
        name: 'Internal Server Error',
        status: 'Internal Server Error',
        code: 500,
        headers: [{ key: 'Content-Type', value: 'application/json' }],
        body: JSON.stringify(
          {
            error: 'Internal Server Error',
            message: 'An unexpected error occurred',
            code: 500,
          },
          null,
          2
        ),
        _postman_previewlanguage: 'json',
      },
    });

    return examples;
  }

  private generateUserData(realistic: boolean): Record<string, unknown> {
    if (realistic) {
      return {
        id: '{{$randomUUID}}',
        name: '{{$randomFullName}}',
        email: '{{$randomEmail}}',
        username: '{{$randomUserName}}',
        avatar: '{{$randomImageUrl}}',
        createdAt: '{{$isoTimestamp}}',
        updatedAt: '{{$isoTimestamp}}',
        profile: {
          bio: '{{$randomLoremSentence}}',
          location: '{{$randomCity}}',
          website: '{{$randomUrl}}',
        },
        preferences: {
          theme: '{{$randomArrayElement(["light", "dark"])}}',
          notifications: '{{$randomBoolean}}',
        },
      };
    }
    return {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
    };
  }

  private generateProductData(realistic: boolean): Record<string, unknown> {
    if (realistic) {
      return {
        id: '{{$randomUUID}}',
        name: '{{$randomProductName}}',
        description: '{{$randomLoremParagraph}}',
        price: '{{$randomPrice}}',
        currency: 'USD',
        category: '{{$randomProductCategory}}',
        sku: '{{$randomAlphaNumeric}}',
        inStock: '{{$randomBoolean}}',
        quantity: '{{$randomInt}}',
        images: ['{{$randomImageUrl}}', '{{$randomImageUrl}}'],
        createdAt: '{{$isoTimestamp}}',
        updatedAt: '{{$isoTimestamp}}',
      };
    }
    return {
      id: 1,
      name: 'Sample Product',
      price: 29.99,
      description: 'A sample product',
    };
  }

  private generateOrderData(realistic: boolean): Record<string, unknown> {
    if (realistic) {
      return {
        id: '{{$randomUUID}}',
        orderNumber: '{{$randomAlphaNumeric}}',
        customerId: '{{$randomUUID}}',
        status:
          '{{$randomArrayElement(["pending", "processing", "shipped", "delivered", "cancelled"])}}',
        total: '{{$randomPrice}}',
        currency: 'USD',
        items: [
          {
            productId: '{{$randomUUID}}',
            name: '{{$randomProductName}}',
            quantity: '{{$randomInt}}',
            price: '{{$randomPrice}}',
          },
        ],
        shippingAddress: {
          street: '{{$randomStreetAddress}}',
          city: '{{$randomCity}}',
          state: '{{$randomState}}',
          zipCode: '{{$randomZipCode}}',
          country: '{{$randomCountry}}',
        },
        createdAt: '{{$isoTimestamp}}',
        updatedAt: '{{$isoTimestamp}}',
      };
    }
    return {
      id: 1,
      orderNumber: 'ORD-001',
      status: 'pending',
      total: 99.99,
    };
  }

  private generateGenericGetResponse(
    url: string,
    realistic: boolean
  ): Record<string, unknown> {
    if (realistic) {
      return {
        data: [
          {
            id: '{{$randomUUID}}',
            name: '{{$randomWords}}',
            description: '{{$randomLoremSentence}}',
            createdAt: '{{$isoTimestamp}}',
            updatedAt: '{{$isoTimestamp}}',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: '{{$randomInt}}',
          totalPages: '{{$randomInt}}',
        },
      };
    }
    return {
      data: [{ id: 1, name: 'Sample Item' }],
      pagination: { page: 1, limit: 10, total: 1 },
    };
  }

  private generateCreateResponse(
    url: string,
    realistic: boolean
  ): Record<string, unknown> {
    if (realistic) {
      return {
        id: '{{$randomUUID}}',
        name: '{{$randomWords}}',
        description: '{{$randomLoremSentence}}',
        status: 'active',
        createdAt: '{{$isoTimestamp}}',
        updatedAt: '{{$isoTimestamp}}',
      };
    }
    return {
      id: 1,
      name: 'Created Item',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  }

  private generateUpdateResponse(
    url: string,
    realistic: boolean
  ): Record<string, unknown> {
    if (realistic) {
      return {
        id: '{{$randomUUID}}',
        name: '{{$randomWords}}',
        description: '{{$randomLoremSentence}}',
        status: 'updated',
        updatedAt: '{{$isoTimestamp}}',
      };
    }
    return {
      id: 1,
      name: 'Updated Item',
      status: 'updated',
      updatedAt: new Date().toISOString(),
    };
  }

  private getStatusText(code: number): string {
    const statusTexts: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
    };
    return statusTexts[code] || 'Unknown';
  }

  private handleError(error: unknown, message: string): Error {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data as
        | { error?: { message?: string } }
        | undefined;

      if (status === 401) {
        return new Error('Invalid or expired Postman API key');
      }

      if (status === 403) {
        return new Error('Insufficient permissions for this operation');
      }

      if (status === 404) {
        return new Error('Resource not found');
      }

      if (status === 429) {
        return new Error('Rate limit exceeded. Please try again later');
      }

      const errorMessage = data?.error?.message || error.message;
      return new Error(`${message}: ${errorMessage}`);
    }

    return new Error(`${message}: ${String(error)}`);
  }
}
