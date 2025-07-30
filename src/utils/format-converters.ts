import {
  PostmanCollectionDetail,
  PostmanRequest,
  PostmanFolder,
} from '../types/postman.js';
import {
  CollectionExportData,
  InsomniaExportData,
  OpenAPIExportData,
} from '../types/import-export.js';
import { DummyDataGenerator } from './dummy-data-generator.js';

export class FormatConverter {
  private dummyDataGenerator: DummyDataGenerator;

  constructor() {
    this.dummyDataGenerator = new DummyDataGenerator();
  }

  // Convert Postman collection to Postman v2.1 format with dummy data
  toPostmanV21(
    collection: PostmanCollectionDetail,
    includeDummyData: boolean = true
  ): CollectionExportData {
    const exportData: CollectionExportData = {
      info: {
        name: collection.info.name,
        ...(collection.info.description && {
          description: collection.info.description,
        }),
        schema:
          'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        version: {
          major: 1,
          minor: 0,
          patch: 0,
        },
      },
      item: this.processItems(collection.item, includeDummyData),
      variable: collection.variable || [],
    };

    if (collection.auth) {
      exportData.auth = collection.auth;
    }

    return exportData;
  }

  // Convert to Insomnia v4 format
  toInsomniaV4(
    collection: PostmanCollectionDetail,
    includeDummyData: boolean = true
  ): InsomniaExportData {
    const resources: unknown[] = [];
    const workspaceId = this.generateId();

    // Create workspace
    resources.push({
      _id: workspaceId,
      _type: 'workspace',
      name: collection.info.name,
      description: collection.info.description || '',
      parentId: null,
      created: Date.now(),
      modified: Date.now(),
    });

    // Create environment
    const environmentId = this.generateId();
    const envVars = includeDummyData
      ? this.dummyDataGenerator.generateEnvironmentVariables(collection)
      : [];

    resources.push({
      _id: environmentId,
      _type: 'environment',
      name: 'Base Environment',
      data: this.convertToInsomniaEnvironment(envVars),
      dataPropertyOrder: null,
      color: null,
      isPrivate: false,
      metaSortKey: Date.now(),
      parentId: workspaceId,
      created: Date.now(),
      modified: Date.now(),
    });

    // Process collection items
    this.processItemsForInsomnia(
      collection.item,
      resources,
      workspaceId,
      includeDummyData
    );

    return {
      _type: 'export',
      __export_format: 4,
      __export_date: new Date().toISOString(),
      __export_source: 'postman-mcp-server',
      resources,
    };
  }

  // Convert to OpenAPI 3.0 format
  toOpenAPI30(collection: PostmanCollectionDetail): OpenAPIExportData {
    const openapi: OpenAPIExportData = {
      openapi: '3.0.0',
      info: {
        title: collection.info.name,
        version: '1.0.0',
        ...(collection.info.description && {
          description: collection.info.description,
        }),
      },
      servers: [
        {
          url: 'https://api.example.com',
          description: 'API Server',
        },
      ],
      paths: {} as Record<string, unknown>,
      components: {
        schemas: {},
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
          apiKey: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key',
          },
        },
      },
    };

    this.processItemsForOpenAPI(collection.item, openapi);
    return openapi;
  }

  private processItems(
    items: Array<PostmanRequest | PostmanFolder>,
    includeDummyData: boolean
  ): unknown[] {
    return items.map(item => {
      if ('request' in item) {
        // It's a request
        return this.enhanceRequest(item, includeDummyData);
      } else {
        // It's a folder
        return {
          name: item.name,
          description: item.description,
          item: item.item ? this.processItems(item.item, includeDummyData) : [],
        };
      }
    });
  }

  private enhanceRequest(
    request: PostmanRequest,
    includeDummyData: boolean
  ): unknown {
    if (!includeDummyData) {
      return request;
    }

    const enhanced = { ...request };
    const method = request.request.method;
    const url =
      typeof request.request.url === 'string'
        ? request.request.url
        : request.request.url?.raw || '';

    // Enhance URL with query parameters
    if (typeof enhanced.request.url === 'object') {
      const queryParams = this.dummyDataGenerator.queryParams(url, method);
      if (queryParams.length > 0) {
        enhanced.request.url.query = [
          ...(enhanced.request.url.query || []),
          ...queryParams.map(param => ({
            key: param.key,
            value: param.value,
            description: param.description,
            disabled: false,
          })),
        ];
      }
    }

    // Enhance headers
    const generatedHeaders = this.dummyDataGenerator.headers(
      method,
      ['POST', 'PUT', 'PATCH'].includes(method)
    );
    const existingHeaders = enhanced.request.header || [];
    const headerKeys = new Set(existingHeaders.map(h => h.key.toLowerCase()));

    generatedHeaders.forEach(header => {
      if (!headerKeys.has(header.key.toLowerCase())) {
        existingHeaders.push({
          key: header.key,
          value: header.value,
          description: header.description,
          disabled: false,
        });
      }
    });
    enhanced.request.header = existingHeaders;

    // Enhance body
    if (['POST', 'PUT', 'PATCH'].includes(method) && !enhanced.request.body) {
      const contentType =
        existingHeaders.find(h => h.key.toLowerCase() === 'content-type')
          ?.value || 'application/json';
      const generatedBody = this.dummyDataGenerator.requestBody(
        method,
        contentType
      );
      if (
        generatedBody &&
        typeof generatedBody === 'object' &&
        'mode' in generatedBody
      ) {
        const bodyObj = generatedBody as { mode: string; raw?: string };
        if (
          bodyObj.mode === 'raw' ||
          bodyObj.mode === 'formdata' ||
          bodyObj.mode === 'urlencoded' ||
          bodyObj.mode === 'binary' ||
          bodyObj.mode === 'graphql'
        ) {
          enhanced.request.body = bodyObj as {
            mode: 'raw' | 'formdata' | 'urlencoded' | 'binary' | 'graphql';
            raw?: string;
          };
        }
      }
    }

    return enhanced;
  }

  private processItemsForInsomnia(
    items: Array<PostmanRequest | PostmanFolder>,
    resources: unknown[],
    parentId: string,
    includeDummyData: boolean
  ): void {
    items.forEach(item => {
      if ('request' in item) {
        // It's a request
        const requestId = this.generateId();
        const method = item.request.method;
        const url =
          typeof item.request.url === 'string'
            ? item.request.url
            : item.request.url?.raw || '';

        const insomniaRequest: Record<string, unknown> = {
          _id: requestId,
          _type: 'request',
          name: item.name,
          description: item.description || '',
          url: this.processUrlForInsomnia(url, method, includeDummyData),
          method: method,
          headers: this.processHeadersForInsomnia(
            item.request.header || [],
            method,
            includeDummyData
          ),
          body: this.processBodyForInsomnia(
            item.request.body,
            method,
            includeDummyData
          ),
          parameters: [],
          authentication: {},
          metaSortKey: Date.now(),
          isPrivate: false,
          settingStoreCookies: true,
          settingSendCookies: true,
          settingDisableRenderRequestBody: false,
          settingEncodeUrl: true,
          settingRebuildPath: true,
          settingFollowRedirects: 'global',
          parentId: parentId,
          created: Date.now(),
          modified: Date.now(),
        };

        resources.push(insomniaRequest);
      } else {
        // It's a folder
        const folderId = this.generateId();
        resources.push({
          _id: folderId,
          _type: 'request_group',
          name: item.name,
          description: item.description || '',
          environment: {},
          environmentPropertyOrder: null,
          metaSortKey: Date.now(),
          parentId: parentId,
          created: Date.now(),
          modified: Date.now(),
        });

        if (item.item) {
          this.processItemsForInsomnia(
            item.item,
            resources,
            folderId,
            includeDummyData
          );
        }
      }
    });
  }

  private processItemsForOpenAPI(
    items: Array<PostmanRequest | PostmanFolder>,
    openapi: OpenAPIExportData
  ): void {
    items.forEach(item => {
      if ('request' in item) {
        // It's a request
        const method = item.request.method.toLowerCase();
        const url =
          typeof item.request.url === 'string'
            ? item.request.url
            : item.request.url?.raw || '';
        const path = this.extractPathFromUrl(url);

        if (!openapi.paths[path]) {
          openapi.paths[path] = {};
        }

        const pathItem = openapi.paths[path] as Record<string, unknown>;
        if (pathItem) {
          pathItem[method] = {
            summary: item.name,
            description: item.description || '',
            parameters: this.extractParametersForOpenAPI(item),
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          example: 'Success',
                        },
                      },
                    },
                  },
                },
              },
            },
          };

          // Add request body for POST/PUT/PATCH
          if (['post', 'put', 'patch'].includes(method)) {
            const methodItem = pathItem[method] as Record<string, unknown>;
            if (methodItem) {
              methodItem['requestBody'] = {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', example: 'Sample Item' },
                        description: {
                          type: 'string',
                          example: 'Sample description',
                        },
                        status: { type: 'string', example: 'active' },
                      },
                    },
                  },
                },
              };
            }
          }
        }
      } else if (item.item) {
        // It's a folder, process recursively
        this.processItemsForOpenAPI(item.item, openapi);
      }
    });
  }

  private processUrlForInsomnia(
    url: string,
    method: string,
    includeDummyData: boolean
  ): string {
    if (!includeDummyData) return url;

    try {
      const urlObj = new URL(
        url.startsWith('http') ? url : `https://api.example.com${url}`
      );
      const queryParams = this.dummyDataGenerator.queryParams(url, method);

      queryParams.forEach(param => {
        if (!urlObj.searchParams.has(param.key)) {
          urlObj.searchParams.set(param.key, param.value);
        }
      });

      return urlObj.toString();
    } catch {
      return url;
    }
  }

  private processHeadersForInsomnia(
    headers: unknown[],
    method: string,
    includeDummyData: boolean
  ): unknown[] {
    if (!includeDummyData) return headers;

    const generatedHeaders = this.dummyDataGenerator.headers(
      method,
      ['POST', 'PUT', 'PATCH'].includes(method)
    );
    const existingHeaderKeys = new Set(
      headers
        .map(h =>
          h && typeof h === 'object' && 'key' in h && typeof h.key === 'string'
            ? h.key.toLowerCase()
            : null
        )
        .filter(Boolean)
    );

    const enhancedHeaders = [...headers];
    generatedHeaders.forEach(header => {
      if (!existingHeaderKeys.has(header.key.toLowerCase())) {
        enhancedHeaders.push({
          name: header.key,
          value: header.value,
          description: header.description || '',
          disabled: false,
        });
      }
    });

    return enhancedHeaders;
  }

  private processBodyForInsomnia(
    body: unknown,
    method: string,
    includeDummyData: boolean
  ): unknown {
    if (!includeDummyData || !['POST', 'PUT', 'PATCH'].includes(method)) {
      return body || {};
    }

    if (body) return body;

    const generatedBody = this.dummyDataGenerator.requestBody(method);
    if (
      generatedBody &&
      typeof generatedBody === 'object' &&
      'mode' in generatedBody
    ) {
      const bodyObj = generatedBody as { mode: string; raw?: string };
      if (bodyObj.mode === 'raw') {
        return {
          mimeType: 'application/json',
          text: bodyObj.raw || '',
        };
      }
    }

    return {
      mimeType: 'application/json',
      text: JSON.stringify(
        {
          name: 'Sample Item',
          description: 'Sample description',
          status: 'active',
        },
        null,
        2
      ),
    };
  }

  private convertToInsomniaEnvironment(
    envVars: Array<{ key: string; value: string }>
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    envVars.forEach(envVar => {
      data[envVar.key] = envVar.value;
    });
    return data;
  }

  private extractPathFromUrl(url: string): string {
    try {
      const urlObj = new URL(
        url.startsWith('http') ? url : `https://api.example.com${url}`
      );
      return urlObj.pathname || '/';
    } catch {
      // If URL parsing fails, try to extract path manually
      const pathMatch = url.match(/^(?:https?:\/\/[^/]+)?(\/.*)?$/);
      return pathMatch && pathMatch[1]
        ? pathMatch[1].split('?')[0] || '/'
        : '/';
    }
  }

  private extractParametersForOpenAPI(request: PostmanRequest): unknown[] {
    const parameters: unknown[] = [];
    const url =
      typeof request.request.url === 'string'
        ? request.request.url
        : request.request.url?.raw || '';

    // Extract path parameters
    const pathParams = this.dummyDataGenerator.pathVariables(url);
    Object.keys(pathParams).forEach(paramName => {
      parameters.push({
        name: paramName,
        in: 'path',
        required: true,
        schema: {
          type: 'string',
          example: pathParams[paramName],
        },
      });
    });

    // Extract query parameters
    if (typeof request.request.url === 'object' && request.request.url?.query) {
      request.request.url.query.forEach(param => {
        const parameter: Record<string, unknown> = {
          name: param.key,
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            example: param.value,
          },
        };

        if ('description' in param && param.description) {
          parameter['description'] = param.description;
        }

        parameters.push(parameter);
      });
    }

    return parameters;
  }

  private generateId(): string {
    return 'req_' + Math.random().toString(36).substr(2, 9);
  }
}
