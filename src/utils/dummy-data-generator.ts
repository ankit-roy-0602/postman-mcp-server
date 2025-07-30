import {
  DummyDataGenerators,
  DummyDataConfig,
} from '../types/import-export.js';

export class DummyDataGenerator implements DummyDataGenerators {
  private config: DummyDataConfig;

  constructor(config: DummyDataConfig = {}) {
    this.config = {
      generateQueryParams: true,
      generateRequestBodies: true,
      generateHeaders: true,
      useRealisticValues: true,
      ...config,
    };
  }

  queryParams(
    url: string,
    method: string
  ): Array<{ key: string; value: string; description?: string }> {
    if (!this.config.generateQueryParams) return [];

    const params: Array<{ key: string; value: string; description?: string }> =
      [];

    // Extract existing query params from URL
    try {
      const urlObj = new URL(
        url.startsWith('http') ? url : `https://api.example.com${url}`
      );
      urlObj.searchParams.forEach((value, key) => {
        if (!value || value.startsWith('{{')) {
          params.push({
            key,
            value: this.generateValueForParam(key),
            description: this.generateParamDescription(key),
          });
        }
      });
    } catch {
      // If URL parsing fails, continue with method-based generation
    }

    // Add common query parameters based on method and URL patterns
    if (method === 'GET') {
      if (url.includes('/users') || url.includes('/user')) {
        if (!params.some(p => p.key === 'page')) {
          params.push({
            key: 'page',
            value: '1',
            description: 'Page number for pagination',
          });
        }
        if (!params.some(p => p.key === 'limit')) {
          params.push({
            key: 'limit',
            value: '10',
            description: 'Number of items per page',
          });
        }
        if (!params.some(p => p.key === 'sort')) {
          params.push({
            key: 'sort',
            value: 'created_at',
            description: 'Sort field',
          });
        }
      }

      if (url.includes('/search')) {
        if (!params.some(p => p.key === 'q')) {
          params.push({
            key: 'q',
            value: 'example search',
            description: 'Search query',
          });
        }
      }

      if (url.includes('/filter')) {
        if (!params.some(p => p.key === 'status')) {
          params.push({
            key: 'status',
            value: 'active',
            description: 'Filter by status',
          });
        }
      }

      // Add format parameter for APIs
      if (!params.some(p => p.key === 'format')) {
        params.push({
          key: 'format',
          value: 'json',
          description: 'Response format',
        });
      }
    }

    return params;
  }

  requestBody(
    method: string,
    contentType: string = 'application/json'
  ): unknown {
    if (!this.config.generateRequestBodies) return undefined;
    if (['GET', 'HEAD', 'DELETE'].includes(method)) return undefined;

    switch (contentType.toLowerCase()) {
      case 'application/json':
        return this.generateJSONBody(method);

      case 'application/x-www-form-urlencoded':
        return {
          mode: 'urlencoded',
          urlencoded: this.generateFormData(),
        };

      case 'multipart/form-data':
        return {
          mode: 'formdata',
          formdata: this.generateFormData(true),
        };

      case 'text/plain':
        return {
          mode: 'raw',
          raw: 'Sample text content for the request body',
        };

      case 'application/xml':
        return {
          mode: 'raw',
          raw: this.generateXMLBody(),
        };

      default:
        return this.generateJSONBody(method);
    }
  }

  headers(
    method: string,
    hasBody: boolean = false
  ): Array<{ key: string; value: string; description?: string }> {
    if (!this.config.generateHeaders) return [];

    const headers: Array<{ key: string; value: string; description?: string }> =
      [];

    // Content-Type header for requests with body
    if (hasBody && ['POST', 'PUT', 'PATCH'].includes(method)) {
      headers.push({
        key: 'Content-Type',
        value: 'application/json',
        description: 'Content type of the request body',
      });
    }

    // Accept header
    headers.push({
      key: 'Accept',
      value: 'application/json',
      description: 'Accepted response content types',
    });

    // Authorization header
    headers.push({
      key: 'Authorization',
      value: 'Bearer {{access_token}}',
      description: 'Authentication token',
    });

    // User-Agent
    headers.push({
      key: 'User-Agent',
      value: 'PostmanMCPServer/1.0',
      description: 'Client identifier',
    });

    // API Key header (alternative auth method)
    headers.push({
      key: 'X-API-Key',
      value: '{{api_key}}',
      description: 'API key for authentication',
    });

    return headers;
  }

  pathVariables(url: string): Record<string, string> {
    const variables: Record<string, string> = {};

    // Extract path variables (e.g., /users/:id, /users/{id})
    const pathVarRegex = /[:{]([^}/:]+)[}]?/g;
    let match;

    while ((match = pathVarRegex.exec(url)) !== null) {
      const varName = match[1];
      if (varName) {
        variables[varName] = this.generateValueForParam(varName);
      }
    }

    return variables;
  }

  private generateValueForParam(paramName: string): string {
    const lowerParam = paramName.toLowerCase();

    // ID patterns
    if (lowerParam.includes('id')) {
      if (lowerParam.includes('user')) return 'usr_123456';
      if (lowerParam.includes('product')) return 'prod_789012';
      if (lowerParam.includes('order')) return 'ord_345678';
      return '12345';
    }

    // Email patterns
    if (lowerParam.includes('email')) return 'user@example.com';

    // Name patterns
    if (lowerParam.includes('name')) return 'John Doe';
    if (lowerParam.includes('username')) return 'johndoe';

    // Status patterns
    if (lowerParam.includes('status')) return 'active';

    // Pagination
    if (lowerParam === 'page') return '1';
    if (lowerParam === 'limit' || lowerParam === 'size') return '10';
    if (lowerParam === 'offset') return '0';

    // Search
    if (lowerParam.includes('search') || lowerParam === 'q') return 'example';

    // Dates
    if (lowerParam.includes('date')) return '2024-01-01';
    if (lowerParam.includes('time')) return '2024-01-01T00:00:00Z';

    // Boolean
    if (lowerParam.includes('active') || lowerParam.includes('enabled'))
      return 'true';

    // Default
    return 'sample_value';
  }

  private generateParamDescription(paramName: string): string {
    const lowerParam = paramName.toLowerCase();

    if (lowerParam.includes('id')) return `Unique identifier for ${paramName}`;
    if (lowerParam === 'page') return 'Page number for pagination';
    if (lowerParam === 'limit' || lowerParam === 'size')
      return 'Number of items to return';
    if (lowerParam === 'offset') return 'Number of items to skip';
    if (lowerParam.includes('search') || lowerParam === 'q')
      return 'Search query string';
    if (lowerParam.includes('sort')) return 'Field to sort by';
    if (lowerParam.includes('order')) return 'Sort order (asc/desc)';
    if (lowerParam.includes('filter')) return 'Filter criteria';
    if (lowerParam.includes('status')) return 'Status filter';

    return `Parameter: ${paramName}`;
  }

  private generateJSONBody(method: string): unknown {
    const body: {
      mode: string;
      options: { raw: { language: string } };
      raw?: string;
    } = {
      mode: 'raw',
      options: {
        raw: {
          language: 'json',
        },
      },
    };

    let jsonData: Record<string, unknown> = {};

    switch (method) {
      case 'POST':
        jsonData = {
          name: 'Sample Item',
          description: 'This is a sample item created via API',
          status: 'active',
          metadata: {
            created_by: 'api_user',
            tags: ['sample', 'demo'],
          },
        };
        break;

      case 'PUT':
        jsonData = {
          id: 12345,
          name: 'Updated Item',
          description: 'This item has been updated',
          status: 'active',
          updated_at: '2024-01-01T00:00:00Z',
        };
        break;

      case 'PATCH':
        jsonData = {
          status: 'inactive',
          updated_at: '2024-01-01T00:00:00Z',
        };
        break;

      default:
        jsonData = {
          data: 'sample_value',
        };
    }

    body.raw = JSON.stringify(jsonData, null, 2);
    return body;
  }

  private generateFormData(isMultipart: boolean = false): Array<{
    key: string;
    value: string;
    type?: string;
    description?: string;
  }> {
    const formData: Array<{
      key: string;
      value: string;
      type?: string;
      description?: string;
    }> = [
      { key: 'name', value: 'Sample Name', description: 'Item name' },
      {
        key: 'description',
        value: 'Sample description',
        description: 'Item description',
      },
      { key: 'status', value: 'active', description: 'Item status' },
    ];

    if (isMultipart) {
      formData.push({
        key: 'file',
        value: '',
        type: 'file',
        description: 'File upload',
      });
    }

    return formData;
  }

  private generateXMLBody(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<request>
    <name>Sample Item</name>
    <description>This is a sample XML request</description>
    <status>active</status>
    <metadata>
        <created_by>api_user</created_by>
        <tags>
            <tag>sample</tag>
            <tag>demo</tag>
        </tags>
    </metadata>
</request>`;
  }

  // Generate environment variables from collection
  generateEnvironmentVariables(collectionData: unknown): Array<{
    key: string;
    value: string;
    type?: string;
    description?: string;
  }> {
    const variables = new Set<string>();
    const envVars: Array<{
      key: string;
      value: string;
      type?: string;
      description?: string;
    }> = [];

    // Extract variables from URLs, headers, and bodies
    this.extractVariablesFromCollection(collectionData, variables);

    // Convert to environment format
    variables.forEach(varName => {
      envVars.push({
        key: varName,
        value: this.generateEnvironmentValue(varName),
        type: this.isSecretVariable(varName) ? 'secret' : 'default',
        description: this.generateEnvironmentDescription(varName),
      });
    });

    return envVars;
  }

  private extractVariablesFromCollection(
    item: unknown,
    variables: Set<string>
  ): void {
    if (Array.isArray(item)) {
      item.forEach(subItem =>
        this.extractVariablesFromCollection(subItem, variables)
      );
      return;
    }

    if (typeof item === 'object' && item !== null) {
      Object.values(item).forEach(value => {
        if (typeof value === 'string') {
          const matches = value.match(/\{\{([^}]+)\}\}/g);
          if (matches) {
            matches.forEach(match => {
              const varName = match.slice(2, -2);
              variables.add(varName);
            });
          }
        } else {
          this.extractVariablesFromCollection(value, variables);
        }
      });
    }
  }

  private generateEnvironmentValue(varName: string): string {
    const lowerVar = varName.toLowerCase();

    if (lowerVar.includes('url') || lowerVar.includes('host'))
      return 'https://api.example.com';
    if (lowerVar.includes('token') || lowerVar.includes('key'))
      return 'your_api_key_here';
    if (lowerVar.includes('user')) return 'demo_user';
    if (lowerVar.includes('password')) return 'demo_password';
    if (lowerVar.includes('version')) return 'v1';
    if (lowerVar.includes('port')) return '443';

    return 'sample_value';
  }

  private isSecretVariable(varName: string): boolean {
    const lowerVar = varName.toLowerCase();
    return (
      lowerVar.includes('token') ||
      lowerVar.includes('key') ||
      lowerVar.includes('password') ||
      lowerVar.includes('secret')
    );
  }

  private generateEnvironmentDescription(varName: string): string {
    const lowerVar = varName.toLowerCase();

    if (lowerVar.includes('url') || lowerVar.includes('host'))
      return 'Base URL for the API';
    if (lowerVar.includes('token')) return 'Authentication token';
    if (lowerVar.includes('key')) return 'API key for authentication';
    if (lowerVar.includes('version')) return 'API version';
    if (lowerVar.includes('user')) return 'Username for authentication';
    if (lowerVar.includes('password')) return 'Password for authentication';

    return `Environment variable: ${varName}`;
  }
}
