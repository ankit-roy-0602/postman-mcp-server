import { describe, it, expect } from '@jest/globals';
import { DummyDataGenerator } from '../src/utils/dummy-data-generator';
import { FormatConverter } from '../src/utils/format-converters';

describe('Import/Export Basic Functionality', () => {
  describe('DummyDataGenerator', () => {
    let generator: DummyDataGenerator;

    beforeEach(() => {
      generator = new DummyDataGenerator();
    });

    it('should generate query parameters for GET requests', () => {
      const params = generator.queryParams('/api/users', 'GET');
      
      expect(params.length).toBeGreaterThan(0);
      expect(params.some(p => p.key === 'page')).toBe(true);
      expect(params.some(p => p.key === 'limit')).toBe(true);
    });

    it('should generate request body for POST requests', () => {
      const body = generator.requestBody('POST', 'application/json') as { mode: string; raw: string };
      
      expect(body).toBeDefined();
      expect(body.mode).toBe('raw');
      expect(body.raw).toBeDefined();
      
      const parsedBody = JSON.parse(body.raw);
      expect(parsedBody.name).toBeDefined();
      expect(parsedBody.status).toBe('active');
    });

    it('should generate headers for requests', () => {
      const headers = generator.headers('POST', true);
      
      expect(headers.length).toBeGreaterThan(0);
      expect(headers.some(h => h.key === 'Content-Type')).toBe(true);
      expect(headers.some(h => h.key === 'Authorization')).toBe(true);
    });

    it('should extract path variables from URL', () => {
      const variables = generator.pathVariables('/api/users/{id}/posts/{postId}');
      
      expect(variables['id']).toBeDefined();
      expect(variables['postId']).toBeDefined();
    });

    it('should generate environment variables from collection', () => {
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

    it('should convert to Postman v2.1 format', () => {
      const result = converter.toPostmanV21(mockCollection, false);
      
      expect(result.info.name).toBe('Test API');
      expect(result.info.schema).toBe('https://schema.getpostman.com/json/collection/v2.1.0/collection.json');
      expect(result.item).toBeDefined();
      expect(result.item.length).toBe(1);
    });

    it('should convert to Insomnia v4 format', () => {
      const result = converter.toInsomniaV4(mockCollection, false);
      
      expect(result._type).toBe('export');
      expect(result.__export_format).toBe(4);
      expect(result.resources).toBeDefined();
      expect(result.resources.length).toBeGreaterThan(0);
    });

    it('should convert to OpenAPI 3.0 format', () => {
      const result = converter.toOpenAPI30(mockCollection);
      
      expect(result.openapi).toBe('3.0.0');
      expect(result.info.title).toBe('Test API');
      expect(result.paths).toBeDefined();
    });
  });
});
