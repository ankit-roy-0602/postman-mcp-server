import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PostmanAPIClient } from '../src/utils/postman-client';
import { handleImportExportTool } from '../src/tools/import-export-tools';
import { FormatConverter } from '../src/utils/format-converters';
import { DummyDataGenerator } from '../src/utils/dummy-data-generator';
import * as fs from 'fs';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

// Mock PostmanAPIClient
jest.mock('../src/utils/postman-client', () => ({
  PostmanAPIClient: jest.fn().mockImplementation(() => ({
    getCollection: jest.fn(),
    listCollections: jest.fn(),
    createCollection: jest.fn()
  }))
}));

describe('Import/Export Tools', () => {
  let mockClient: jest.Mocked<PostmanAPIClient>;
  let mockCollection: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockClient = new PostmanAPIClient('test-key') as jest.Mocked<PostmanAPIClient>;
    
    mockCollection = {
      info: {
        name: 'Test Collection',
        description: 'A test collection',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: [
        {
          name: 'Get Users',
          request: {
            method: 'GET',
            url: {
              raw: 'https://api.example.com/users',
              protocol: 'https',
              host: ['api', 'example', 'com'],
              path: ['users']
            },
            header: []
          }
        },
        {
          name: 'Create User',
          request: {
            method: 'POST',
            url: {
              raw: 'https://api.example.com/users',
              protocol: 'https',
              host: ['api', 'example', 'com'],
              path: ['users']
            },
            header: [
              {
                key: 'Content-Type',
                value: 'application/json'
              }
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify({
                name: 'John Doe',
                email: 'john@example.com'
              })
            }
          }
        }
      ],
      variable: []
    };

    mockClient.getCollection.mockResolvedValue(mockCollection);
    mockClient.listCollections.mockResolvedValue([
      { id: 'col1', name: 'Collection 1', uid: 'uid1', owner: 'owner1', public: false, schema: '', updatedAt: '', createdAt: '', lastUpdatedBy: '' },
      { id: 'col2', name: 'Collection 2', uid: 'uid2', owner: 'owner2', public: false, schema: '', updatedAt: '', createdAt: '', lastUpdatedBy: '' }
    ]);
  });

  describe('export_collection', () => {
    it('should export collection in Postman format with dummy data', async () => {
      const args = {
        collectionId: 'test-collection-id',
        format: 'postman',
        includeDummyData: true,
        generateEnvironmentTemplate: true
      };

      const result = await handleImportExportTool('export_collection', args, mockClient);
      const exportResult = JSON.parse(result.content[0]?.text || '{}');

      expect(exportResult.success).toBe(true);
      expect(exportResult.format).toBe('postman');
      expect(exportResult.collectionData).toBeDefined();
      expect(exportResult.collectionData.info.name).toBe('Test Collection');
      expect(exportResult.environmentData).toBeDefined();
      expect(mockClient.getCollection).toHaveBeenCalledWith('test-collection-id');
    });

    it('should export collection in Insomnia format', async () => {
      const args = {
        collectionId: 'test-collection-id',
        format: 'insomnia',
        includeDummyData: true
      };

      const result = await handleImportExportTool('export_collection', args, mockClient);
      const exportResult = JSON.parse(result.content[0]?.text || '{}');

      expect(exportResult.success).toBe(true);
      expect(exportResult.format).toBe('insomnia');
      expect(exportResult.collectionData._type).toBe('export');
      expect(exportResult.collectionData.__export_format).toBe(4);
    });

    it('should export collection in OpenAPI format', async () => {
      const args = {
        collectionId: 'test-collection-id',
        format: 'openapi'
      };

      const result = await handleImportExportTool('export_collection', args, mockClient);
      const exportResult = JSON.parse(result.content[0]?.text || '{}');

      expect(exportResult.success).toBe(true);
      expect(exportResult.format).toBe('openapi');
      expect(exportResult.collectionData.openapi).toBe('3.0.0');
      expect(exportResult.collectionData.info.title).toBe('Test Collection');
    });

    it('should save to file when outputPath is provided', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.writeFileSync.mockImplementation(() => {});

      const args = {
        collectionId: 'test-collection-id',
        format: 'postman',
        outputPath: '/tmp/test-collection.json'
      };

      const result = await handleImportExportTool('export_collection', args, mockClient);
      const exportResult = JSON.parse(result.content[0]?.text || '{}');

      expect(exportResult.success).toBe(true);
      expect(exportResult.filePath).toBe('/tmp/test-collection.json');
      expect(mockFs.writeFileSync).toHaveBeenCalled();
    });

    it('should handle export errors gracefully', async () => {
      mockClient.getCollection.mockRejectedValue(new Error('Collection not found'));

      const args = {
        collectionId: 'invalid-collection-id',
        format: 'postman'
      };

      const result = await handleImportExportTool('export_collection', args, mockClient);
      const exportResult = JSON.parse(result.content[0]?.text || '{}');

      expect(exportResult.success).toBe(false);
      expect(exportResult.errors).toContain('Collection not found');
    });
  });

  describe('export_collection_with_samples', () => {
    it('should export collection with comprehensive dummy data', async () => {
      const args = {
        collectionId: 'test-collection-id',
        format: 'postman'
      };

      const result = await handleImportExportTool('export_collection_with_samples', args, mockClient);
      const exportResult = JSON.parse(result.content[0]?.text || '{}');

      expect(exportResult.success).toBe(true);
      expect(exportResult.collectionData).toBeDefined();
      expect(exportResult.environmentData).toBeDefined();
      
      // Check that dummy data was added
      const items = exportResult.collectionData.item;
      expect(items).toBeDefined();
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe('export_workspace_collections', () => {
    it('should export all collections from a workspace', async () => {
      const args = {
        workspaceId: 'test-workspace-id',
        format: 'postman',
        includeDummyData: true
      };

      const result = await handleImportExportTool('export_workspace_collections', args, mockClient);
      const exportResults = JSON.parse(result.content[0]?.text || '[]');

      expect(Array.isArray(exportResults)).toBe(true);
      expect(exportResults.length).toBe(2);
      expect(exportResults[0].success).toBe(true);
      expect(exportResults[1].success).toBe(true);
      expect(mockClient.listCollections).toHaveBeenCalledWith('test-workspace-id');
    });
  });

  describe('validate_collection_export', () => {
    it('should validate collection for export compatibility', async () => {
      const args = {
        collectionId: 'test-collection-id',
        format: 'postman'
      };

      const result = await handleImportExportTool('validate_collection_export', args, mockClient);
      const validationResult = JSON.parse(result.content[0]?.text || '{}');

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.format).toBe('postman');
      expect(validationResult.compatibility.postman).toBe(true);
      expect(validationResult.errors).toHaveLength(0);
    });

    it('should detect validation errors', async () => {
      const invalidCollection = {
        ...mockCollection,
        info: {
          ...mockCollection.info,
          name: '' // Invalid: empty name
        }
      };
      mockClient.getCollection.mockResolvedValue(invalidCollection);

      const args = {
        collectionId: 'test-collection-id',
        format: 'postman'
      };

      const result = await handleImportExportTool('validate_collection_export', args, mockClient);
      const validationResult = JSON.parse(result.content[0]?.text || '{}');

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errors).toContain('Collection name is required');
    });
  });

  describe('import_collection', () => {
    it('should import collection from JSON data', async () => {
      const newCollection = { id: 'new-collection-id', name: 'Imported Collection' };
      mockClient.createCollection.mockResolvedValue(newCollection as any);
      mockClient.listCollections.mockResolvedValue([]);

      const args = {
        collectionData: JSON.stringify(mockCollection),
        targetWorkspaceId: 'target-workspace-id',
        conflictResolution: 'rename'
      };

      const result = await handleImportExportTool('import_collection', args, mockClient);
      const importResult = JSON.parse(result.content[0]?.text || '{}');

      expect(importResult.success).toBe(true);
      expect(importResult.collectionId).toBe('new-collection-id');
      expect(mockClient.createCollection).toHaveBeenCalledWith({
        name: 'Test Collection',
        description: 'A test collection',
        workspaceId: 'target-workspace-id'
      });
    });

    it('should handle name conflicts with rename strategy', async () => {
      const existingCollections = [
        { id: 'existing-1', name: 'Test Collection', uid: '', owner: '', public: false, schema: '', updatedAt: '', createdAt: '', lastUpdatedBy: '' },
        { id: 'existing-2', name: 'Test Collection (1)', uid: '', owner: '', public: false, schema: '', updatedAt: '', createdAt: '', lastUpdatedBy: '' }
      ];
      mockClient.listCollections.mockResolvedValue(existingCollections);
      mockClient.createCollection.mockResolvedValue({ id: 'new-id', name: 'Test Collection (2)' } as any);

      const args = {
        collectionData: JSON.stringify(mockCollection),
        conflictResolution: 'rename'
      };

      const result = await handleImportExportTool('import_collection', args, mockClient);
      const importResult = JSON.parse(result.content[0]?.text || '{}');

      expect(importResult.success).toBe(true);
      expect(mockClient.createCollection).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Collection (2)',
          description: 'A test collection'
        })
      );
    });

    it('should handle invalid JSON data', async () => {
      const args = {
        collectionData: 'invalid json',
        validateBeforeImport: true
      };

      const result = await handleImportExportTool('import_collection', args, mockClient);
      const importResult = JSON.parse(result.content[0]?.text || '{}');

      expect(importResult.success).toBe(false);
      expect(importResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('import_collection_from_file', () => {
    it('should import collection from file', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(mockCollection));
      mockClient.createCollection.mockResolvedValue({ id: 'new-id', name: 'Test Collection' } as any);
      mockClient.listCollections.mockResolvedValue([]);

      const args = {
        filePath: '/tmp/test-collection.json',
        targetWorkspaceId: 'target-workspace-id'
      };

      const result = await handleImportExportTool('import_collection_from_file', args, mockClient);
      const importResult = JSON.parse(result.content[0]?.text || '{}');

      expect(importResult.success).toBe(true);
      expect(mockFs.existsSync).toHaveBeenCalledWith('/tmp/test-collection.json');
      expect(mockFs.readFileSync).toHaveBeenCalledWith('/tmp/test-collection.json', 'utf8');
    });

    it('should handle file not found error', async () => {
      mockFs.existsSync.mockReturnValue(false);

      const args = {
        filePath: '/tmp/nonexistent.json'
      };

      const result = await handleImportExportTool('import_collection_from_file', args, mockClient);
      const importResult = JSON.parse(result.content[0]?.text || '{}');

      expect(importResult.success).toBe(false);
      expect(importResult.errors).toContain('File not found: /tmp/nonexistent.json');
    });
  });
});

describe('DummyDataGenerator', () => {
  let generator: DummyDataGenerator;

  beforeEach(() => {
    generator = new DummyDataGenerator();
  });

  describe('queryParams', () => {
    it('should generate query parameters for GET requests', () => {
      const params = generator.queryParams('/api/users', 'GET');
      
      expect(params.length).toBeGreaterThan(0);
      expect(params.some(p => p.key === 'page')).toBe(true);
      expect(params.some(p => p.key === 'limit')).toBe(true);
      expect(params.some(p => p.key === 'format')).toBe(true);
    });

    it('should generate search parameters for search endpoints', () => {
      const params = generator.queryParams('/api/search', 'GET');
      
      expect(params.some(p => p.key === 'q')).toBe(true);
    });

    it('should not generate query parameters when disabled', () => {
      const configuredGenerator = new DummyDataGenerator({ generateQueryParams: false });
      const params = configuredGenerator.queryParams('/api/users', 'GET');
      
      expect(params).toHaveLength(0);
    });
  });

  describe('requestBody', () => {
    it('should generate JSON body for POST requests', () => {
      const body = generator.requestBody('POST', 'application/json');
      
      expect(body).toBeDefined();
      expect(body.mode).toBe('raw');
      expect(body.raw).toBeDefined();
      
      const parsedBody = JSON.parse(body.raw);
      expect(parsedBody.name).toBeDefined();
      expect(parsedBody.status).toBe('active');
    });

    it('should generate form data for multipart requests', () => {
      const body = generator.requestBody('POST', 'multipart/form-data');
      
      expect(body).toBeDefined();
      expect(body.mode).toBe('formdata');
      expect(body.formdata).toBeDefined();
      expect(Array.isArray(body.formdata)).toBe(true);
    });

    it('should not generate body for GET requests', () => {
      const body = generator.requestBody('GET', 'application/json');
      
      expect(body).toBeUndefined();
    });
  });

  describe('headers', () => {
    it('should generate headers for requests with body', () => {
      const headers = generator.headers('POST', true);
      
      expect(headers.length).toBeGreaterThan(0);
      expect(headers.some(h => h.key === 'Content-Type')).toBe(true);
      expect(headers.some(h => h.key === 'Authorization')).toBe(true);
    });

    it('should generate headers for requests without body', () => {
      const headers = generator.headers('GET', false);
      
      expect(headers.length).toBeGreaterThan(0);
      expect(headers.some(h => h.key === 'Accept')).toBe(true);
      expect(headers.some(h => h.key === 'Authorization')).toBe(true);
    });
  });

  describe('pathVariables', () => {
    it('should extract path variables from URL', () => {
      const variables = generator.pathVariables('/api/users/{id}/posts/{postId}');
      
      expect(variables['id']).toBeDefined();
      expect(variables['postId']).toBeDefined();
    });

    it('should generate appropriate values for common variable names', () => {
      const variables = generator.pathVariables('/api/users/{userId}');
      
      expect(variables['userId']).toBe('usr_123456');
    });
  });

  describe('generateEnvironmentVariables', () => {
    it('should extract environment variables from collection', () => {
      const collectionWithVars = {
        item: [
          {
            request: {
              url: '{{base_url}}/api/users',
              header: [
                { key: 'Authorization', value: 'Bearer {{access_token}}' }
              ]
            }
          }
        ]
      };

      const envVars = generator.generateEnvironmentVariables(collectionWithVars);
      
      expect(envVars.length).toBeGreaterThan(0);
      expect(envVars.some(v => v.key === 'base_url')).toBe(true);
      expect(envVars.some(v => v.key === 'access_token')).toBe(true);
    });

    it('should mark secret variables appropriately', () => {
      const collectionWithSecrets = {
        item: [
          {
            request: {
              header: [
                { key: 'X-API-Key', value: '{{api_key}}' },
                { key: 'Authorization', value: 'Bearer {{token}}' }
              ]
            }
          }
        ]
      };

      const envVars = generator.generateEnvironmentVariables(collectionWithSecrets);
      
      const apiKeyVar = envVars.find(v => v.key === 'api_key');
      const tokenVar = envVars.find(v => v.key === 'token');
      
      expect(apiKeyVar?.type).toBe('secret');
      expect(tokenVar?.type).toBe('secret');
    });
  });
});

describe('FormatConverter', () => {
  let converter: FormatConverter;
  let mockCollection: any;

  beforeEach(() => {
    converter = new FormatConverter();
    mockCollection = {
      info: {
        name: 'Test API',
        description: 'Test API Collection',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: [
        {
          name: 'Get Users',
          request: {
            method: 'GET',
            url: {
              raw: 'https://api.example.com/users?page=1',
              query: [
                { key: 'page', value: '1' }
              ]
            },
            header: []
          }
        }
      ],
      variable: []
    };
  });

  describe('toPostmanV21', () => {
    it('should convert to Postman v2.1 format', () => {
      const result = converter.toPostmanV21(mockCollection, false);
      
      expect(result.info.name).toBe('Test API');
      expect(result.info.schema).toBe('https://schema.getpostman.com/json/collection/v2.1.0/collection.json');
      expect(result.item).toBeDefined();
      expect(result.item.length).toBe(1);
    });

    it('should include dummy data when requested', () => {
      const result = converter.toPostmanV21(mockCollection, true);
      
      expect(result.item[0].request.header.length).toBeGreaterThan(0);
    });
  });

  describe('toInsomniaV4', () => {
    it('should convert to Insomnia v4 format', () => {
      const result = converter.toInsomniaV4(mockCollection, false);
      
      expect(result._type).toBe('export');
      expect(result.__export_format).toBe(4);
      expect(result.resources).toBeDefined();
      expect(result.resources.length).toBeGreaterThan(0);
    });

    it('should create workspace and environment resources', () => {
      const result = converter.toInsomniaV4(mockCollection, true);
      
      const workspace = result.resources.find(r => r._type === 'workspace');
      const environment = result.resources.find(r => r._type === 'environment');
      
      expect(workspace).toBeDefined();
      expect(environment).toBeDefined();
      expect(workspace.name).toBe('Test API');
    });
  });

  describe('toOpenAPI30', () => {
    it('should convert to OpenAPI 3.0 format', () => {
      const result = converter.toOpenAPI30(mockCollection);
      
      expect(result.openapi).toBe('3.0.0');
      expect(result.info.title).toBe('Test API');
      expect(result.paths).toBeDefined();
    });

    it('should create paths from collection requests', () => {
      const result = converter.toOpenAPI30(mockCollection);
      
      expect(Object.keys(result.paths).length).toBeGreaterThan(0);
    });
  });
});
