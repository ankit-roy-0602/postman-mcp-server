import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { PostmanAPIClient } from '../utils/postman-client.js';
import { FormatConverter } from '../utils/format-converters.js';
import { DummyDataGenerator } from '../utils/dummy-data-generator.js';
import { ExportOptions, ImportOptions, ExportResult, ValidationResult } from '../types/import-export.js';
import * as fs from 'fs';
import * as path from 'path';

const ExportCollectionSchema = z.object({
  collectionId: z.string().describe('The ID of the collection to export'),
  format: z.enum(['postman', 'insomnia', 'openapi']).optional().default('postman').describe('Export format'),
  includeDummyData: z.boolean().optional().default(true).describe('Include generated dummy data'),
  generateEnvironmentTemplate: z.boolean().optional().default(true).describe('Generate environment template'),
  outputPath: z.string().optional().describe('Local file path to save the export (optional)')
});

const ExportCollectionWithSamplesSchema = z.object({
  collectionId: z.string().describe('The ID of the collection to export'),
  format: z.enum(['postman', 'insomnia', 'openapi']).optional().default('postman').describe('Export format'),
  outputPath: z.string().optional().describe('Local file path to save the export (optional)')
});

const ExportWorkspaceCollectionsSchema = z.object({
  workspaceId: z.string().describe('The ID of the workspace to export collections from'),
  format: z.enum(['postman', 'insomnia', 'openapi']).optional().default('postman').describe('Export format'),
  includeDummyData: z.boolean().optional().default(true).describe('Include generated dummy data'),
  outputDirectory: z.string().optional().describe('Local directory to save exports (optional)')
});

const ValidateCollectionExportSchema = z.object({
  collectionId: z.string().describe('The ID of the collection to validate'),
  format: z.enum(['postman', 'insomnia', 'openapi']).optional().default('postman').describe('Format to validate against')
});

const ImportCollectionSchema = z.object({
  collectionData: z.string().describe('JSON string of the collection data to import'),
  targetWorkspaceId: z.string().optional().describe('Target workspace ID (optional)'),
  conflictResolution: z.enum(['skip', 'overwrite', 'rename']).optional().default('rename').describe('How to handle conflicts'),
  validateBeforeImport: z.boolean().optional().default(true).describe('Validate before importing')
});

const ImportCollectionFromFileSchema = z.object({
  filePath: z.string().describe('Path to the collection file to import'),
  targetWorkspaceId: z.string().optional().describe('Target workspace ID (optional)'),
  conflictResolution: z.enum(['skip', 'overwrite', 'rename']).optional().default('rename').describe('How to handle conflicts'),
  validateBeforeImport: z.boolean().optional().default(true).describe('Validate before importing')
});

export const importExportTools: Tool[] = [
  {
    name: 'export_collection',
    description: 'Export a Postman collection to various formats with optional dummy data generation',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection to export'
        },
        format: {
          type: 'string',
          enum: ['postman', 'insomnia', 'openapi'],
          description: 'Export format',
          default: 'postman'
        },
        includeDummyData: {
          type: 'boolean',
          description: 'Include generated dummy data',
          default: true
        },
        generateEnvironmentTemplate: {
          type: 'boolean',
          description: 'Generate environment template',
          default: true
        },
        outputPath: {
          type: 'string',
          description: 'Local file path to save the export (optional)'
        }
      },
      required: ['collectionId']
    }
  },
  {
    name: 'export_collection_with_samples',
    description: 'Export a collection with comprehensive dummy data for immediate use in Postman/Insomnia',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection to export'
        },
        format: {
          type: 'string',
          enum: ['postman', 'insomnia', 'openapi'],
          description: 'Export format',
          default: 'postman'
        },
        outputPath: {
          type: 'string',
          description: 'Local file path to save the export (optional)'
        }
      },
      required: ['collectionId']
    }
  },
  {
    name: 'export_workspace_collections',
    description: 'Export all collections from a workspace with dummy data',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: {
          type: 'string',
          description: 'The ID of the workspace to export collections from'
        },
        format: {
          type: 'string',
          enum: ['postman', 'insomnia', 'openapi'],
          description: 'Export format',
          default: 'postman'
        },
        includeDummyData: {
          type: 'boolean',
          description: 'Include generated dummy data',
          default: true
        },
        outputDirectory: {
          type: 'string',
          description: 'Local directory to save exports (optional)'
        }
      },
      required: ['workspaceId']
    }
  },
  {
    name: 'validate_collection_export',
    description: 'Validate a collection export for compatibility with target format',
    inputSchema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'string',
          description: 'The ID of the collection to validate'
        },
        format: {
          type: 'string',
          enum: ['postman', 'insomnia', 'openapi'],
          description: 'Format to validate against',
          default: 'postman'
        }
      },
      required: ['collectionId']
    }
  },
  {
    name: 'import_collection',
    description: 'Import a collection from JSON data',
    inputSchema: {
      type: 'object',
      properties: {
        collectionData: {
          type: 'string',
          description: 'JSON string of the collection data to import'
        },
        targetWorkspaceId: {
          type: 'string',
          description: 'Target workspace ID (optional)'
        },
        conflictResolution: {
          type: 'string',
          enum: ['skip', 'overwrite', 'rename'],
          description: 'How to handle conflicts',
          default: 'rename'
        },
        validateBeforeImport: {
          type: 'boolean',
          description: 'Validate before importing',
          default: true
        }
      },
      required: ['collectionData']
    }
  },
  {
    name: 'import_collection_from_file',
    description: 'Import a collection from a local file',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'Path to the collection file to import'
        },
        targetWorkspaceId: {
          type: 'string',
          description: 'Target workspace ID (optional)'
        },
        conflictResolution: {
          type: 'string',
          enum: ['skip', 'overwrite', 'rename'],
          description: 'How to handle conflicts',
          default: 'rename'
        },
        validateBeforeImport: {
          type: 'boolean',
          description: 'Validate before importing',
          default: true
        }
      },
      required: ['filePath']
    }
  }
];

export async function handleImportExportTool(
  name: string,
  args: unknown,
  client: PostmanAPIClient
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const formatConverter = new FormatConverter();
  const dummyDataGenerator = new DummyDataGenerator();

  switch (name) {
    case 'export_collection': {
      const parsed = ExportCollectionSchema.parse(args);
      const result = await exportCollection(client, formatConverter, dummyDataGenerator, parsed);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }

    case 'export_collection_with_samples': {
      const parsed = ExportCollectionWithSamplesSchema.parse(args);
      const exportOptions = {
        ...parsed,
        includeDummyData: true,
        generateEnvironmentTemplate: true
      };
      const result = await exportCollection(client, formatConverter, dummyDataGenerator, exportOptions);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }

    case 'export_workspace_collections': {
      const parsed = ExportWorkspaceCollectionsSchema.parse(args);
      const result = await exportWorkspaceCollections(client, formatConverter, dummyDataGenerator, parsed);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }

    case 'validate_collection_export': {
      const parsed = ValidateCollectionExportSchema.parse(args);
      const result = await validateCollectionExport(client, formatConverter, parsed);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }

    case 'import_collection': {
      const parsed = ImportCollectionSchema.parse(args);
      const result = await importCollection(client, parsed);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }

    case 'import_collection_from_file': {
      const parsed = ImportCollectionFromFileSchema.parse(args);
      const result = await importCollectionFromFile(client, parsed);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }

    default:
      throw new Error(`Unknown import/export tool: ${name}`);
  }
}

async function exportCollection(
  client: PostmanAPIClient,
  formatConverter: FormatConverter,
  dummyDataGenerator: DummyDataGenerator,
  options: any
): Promise<ExportResult> {
  try {
    // Get the collection
    const collection = await client.getCollection(options.collectionId);
    
    let exportData: any;
    let environmentData: any;

    // Convert to requested format
    switch (options.format) {
      case 'postman':
        exportData = formatConverter.toPostmanV21(collection, options.includeDummyData);
        break;
      case 'insomnia':
        exportData = formatConverter.toInsomniaV4(collection, options.includeDummyData);
        break;
      case 'openapi':
        exportData = formatConverter.toOpenAPI30(collection);
        break;
      default:
        exportData = formatConverter.toPostmanV21(collection, options.includeDummyData);
    }

    // Generate environment template if requested
    if (options.generateEnvironmentTemplate && options.includeDummyData) {
      const envVars = dummyDataGenerator.generateEnvironmentVariables(collection);
      environmentData = {
        name: `${collection.info.name} Environment`,
        values: envVars
      };
    }

    // Save to file if path provided
    let filePath: string | undefined;
    if (options.outputPath) {
      const dir = path.dirname(options.outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(options.outputPath, JSON.stringify(exportData, null, 2));
      filePath = options.outputPath;

      // Save environment file if generated
      if (environmentData) {
        const envPath = options.outputPath.replace(/\.[^/.]+$/, '.environment.json');
        fs.writeFileSync(envPath, JSON.stringify(environmentData, null, 2));
      }
    }

    const result: ExportResult = {
      success: true,
      collectionData: exportData,
      environmentData,
      format: options.format,
      errors: [],
      warnings: []
    };

    if (filePath) {
      result.filePath = filePath;
    }

    return result;

  } catch (error) {
    return {
      success: false,
      format: options.format,
      errors: [error instanceof Error ? error.message : String(error)],
      warnings: []
    };
  }
}

async function exportWorkspaceCollections(
  client: PostmanAPIClient,
  formatConverter: FormatConverter,
  dummyDataGenerator: DummyDataGenerator,
  options: any
): Promise<ExportResult[]> {
  try {
    // Get all collections in the workspace
    const collections = await client.listCollections(options.workspaceId);
    const results: ExportResult[] = [];

    for (const collectionSummary of collections) {
      const exportOptions = {
        collectionId: collectionSummary.id,
        format: options.format,
        includeDummyData: options.includeDummyData,
        generateEnvironmentTemplate: true,
        outputPath: options.outputDirectory ? 
          path.join(options.outputDirectory, `${collectionSummary.name}.${options.format}.json`) : 
          undefined
      };

      const result = await exportCollection(client, formatConverter, dummyDataGenerator, exportOptions);
      results.push(result);
    }

    return results;

  } catch (error) {
    return [{
      success: false,
      format: options.format,
      errors: [error instanceof Error ? error.message : String(error)],
      warnings: []
    }];
  }
}

async function validateCollectionExport(
  client: PostmanAPIClient,
  formatConverter: FormatConverter,
  options: any
): Promise<ValidationResult> {
  try {
    const collection = await client.getCollection(options.collectionId);
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!collection.info.name) {
      errors.push('Collection name is required');
    }

    if (!collection.item || collection.item.length === 0) {
      warnings.push('Collection has no requests');
    }

    // Format-specific validation
    let exportData: any;
    try {
      switch (options.format) {
        case 'postman':
          exportData = formatConverter.toPostmanV21(collection, true);
          break;
        case 'insomnia':
          exportData = formatConverter.toInsomniaV4(collection, true);
          break;
        case 'openapi':
          exportData = formatConverter.toOpenAPI30(collection);
          break;
      }
    } catch (error) {
      errors.push(`Failed to convert to ${options.format}: ${error instanceof Error ? error.message : String(error)}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      format: options.format,
      compatibility: {
        postman: options.format === 'postman' && errors.length === 0,
        insomnia: options.format === 'insomnia' && errors.length === 0
      }
    };

  } catch (error) {
    return {
      isValid: false,
      errors: [error instanceof Error ? error.message : String(error)],
      warnings: [],
      format: options.format,
      compatibility: {
        postman: false,
        insomnia: false
      }
    };
  }
}

async function importCollection(
  client: PostmanAPIClient,
  options: any
): Promise<any> {
  try {
    // Parse the collection data
    const collectionData = JSON.parse(options.collectionData);
    
    // Basic validation
    if (options.validateBeforeImport) {
      if (!collectionData.info || !collectionData.info.name) {
        throw new Error('Invalid collection: missing name');
      }
    }

    // Handle name conflicts
    let finalName = collectionData.info.name;
    if (options.conflictResolution === 'rename') {
      const existingCollections = await client.listCollections(options.targetWorkspaceId);
      const existingNames = existingCollections.map(c => c.name);
      let counter = 1;
      while (existingNames.includes(finalName)) {
        finalName = `${collectionData.info.name} (${counter})`;
        counter++;
      }
      collectionData.info.name = finalName;
    }

    // Create the collection
    const createRequest = {
      name: finalName,
      description: collectionData.info.description,
      workspaceId: options.targetWorkspaceId
    };

    const newCollection = await client.createCollection(createRequest);

    return {
      success: true,
      collectionId: newCollection.id,
      errors: [],
      warnings: [],
      skippedItems: []
    };

  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : String(error)],
      warnings: [],
      skippedItems: []
    };
  }
}

async function importCollectionFromFile(
  client: PostmanAPIClient,
  options: any
): Promise<any> {
  try {
    // Read the file
    if (!fs.existsSync(options.filePath)) {
      throw new Error(`File not found: ${options.filePath}`);
    }

    const fileContent = fs.readFileSync(options.filePath, 'utf8');
    
    // Import using the collection data
    const importOptions = {
      ...options,
      collectionData: fileContent
    };

    return await importCollection(client, importOptions);

  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : String(error)],
      warnings: [],
      skippedItems: []
    };
  }
}
