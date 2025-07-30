export interface ExportOptions {
  includeDummyData?: boolean;
  includeEnvironmentVariables?: boolean;
  format?: 'postman' | 'insomnia' | 'openapi';
  outputPath?: string;
  generateEnvironmentTemplate?: boolean;
}

export interface ImportOptions {
  targetWorkspaceId?: string;
  conflictResolution?: 'skip' | 'overwrite' | 'rename';
  validateBeforeImport?: boolean;
  dryRun?: boolean;
}

export interface DummyDataConfig {
  generateQueryParams?: boolean;
  generateRequestBodies?: boolean;
  generateHeaders?: boolean;
  useRealisticValues?: boolean;
  customTemplates?: Record<string, unknown>;
}

export interface ExportResult {
  success: boolean;
  collectionData?: unknown;
  environmentData?: unknown;
  filePath?: string;
  errors: string[];
  warnings: string[];
  format: string;
}

export interface ImportResult {
  success: boolean;
  collectionId?: string;
  environmentId?: string;
  errors?: string[];
  warnings?: string[];
  skippedItems?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  format?: string;
  compatibility: {
    postman: boolean;
    insomnia: boolean;
  };
}

export interface DummyDataGenerators {
  queryParams: (
    url: string,
    method: string
  ) => Array<{ key: string; value: string; description?: string }>;
  requestBody: (method: string, contentType?: string) => unknown;
  headers: (
    method: string,
    hasBody?: boolean
  ) => Array<{ key: string; value: string; description?: string }>;
  pathVariables: (url: string) => Record<string, string>;
}

export interface EnvironmentTemplate {
  name: string;
  values: Array<{
    key: string;
    value: string;
    type?: 'default' | 'secret';
    description?: string;
  }>;
}

export interface CollectionExportData {
  info: {
    name: string;
    description?: string;
    schema: string;
    version?: {
      major: number;
      minor: number;
      patch: number;
    };
  };
  item: unknown[];
  variable?: Array<{
    key: string;
    value: string;
    type?: string;
  }>;
  auth?: unknown;
  event?: unknown[];
}

export interface InsomniaExportData {
  _type: 'export';
  __export_format: number;
  __export_date: string;
  __export_source: string;
  resources: unknown[];
}

export interface OpenAPIExportData {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, unknown>;
  components?: {
    schemas?: Record<string, unknown>;
    securitySchemes?: Record<string, unknown>;
  };
}
