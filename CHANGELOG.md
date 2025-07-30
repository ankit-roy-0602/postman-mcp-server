# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-07-30

### Added
- **NEW**: Collection Import/Export Tools - Seamless data migration capabilities
  - `export_collection` - Export collections to Postman, Insomnia, or OpenAPI formats
  - `export_collection_with_samples` - Export with comprehensive dummy data for immediate use
  - `export_workspace_collections` - Bulk export all collections from a workspace
  - `validate_collection_export` - Validate collection compatibility before export
  - `import_collection` - Import collections from JSON data with conflict resolution
  - `import_collection_from_file` - Import collections from local files
- **NEW**: Smart Dummy Data Generation
  - Intelligent query parameter generation based on endpoint patterns
  - Realistic request body generation for different content types
  - Environment variable extraction and template generation
  - Path variable detection and sample value generation
  - Authentication header templates (Bearer tokens, API keys)
- **NEW**: Multi-Format Support
  - Postman Collection v2.1 format with full feature support
  - Insomnia v4 export format for seamless workflow migration
  - OpenAPI 3.0 specification generation from collections
  - Environment template generation for all formats
- **NEW**: Advanced Export Features
  - Conflict resolution strategies (skip, overwrite, rename)
  - Validation before import/export operations
  - File system integration for local storage
  - Bulk workspace operations
  - Comprehensive error handling and reporting

### Enhanced
- **ENHANCED**: Format conversion utilities with intelligent data mapping
- **ENHANCED**: Type safety with comprehensive TypeScript interfaces for import/export
- **ENHANCED**: Test coverage with 135+ comprehensive unit tests
- **ENHANCED**: Jest configuration with proper ES module support

### Release Notes
- **MILESTONE**: First stable release (v1.0.0) with comprehensive API coverage
- **COMPLETE**: Full Postman API integration with all major features
- **PRODUCTION-READY**: Extensive testing and validation for enterprise use

## [0.1.4] - 2025-07-29

### Added
- **NEW**: Complete request and folder management tools
  - `create_request` - Create new API requests with full configuration support
  - `get_request` - Retrieve detailed request information
  - `update_request` - Update existing request configurations
  - `delete_request` - Remove requests from collections
  - `create_folder` - Create organizational folders within collections
  - `update_folder` - Update folder metadata and descriptions
  - `delete_folder` - Remove folders from collections
  - `move_request` - Move requests between folders or to collection root
- **ENHANCED**: Request creation with comprehensive support for:
  - All HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)
  - Custom headers with descriptions and enable/disable toggles
  - Multiple body types (raw, form-data, URL-encoded, binary, GraphQL)
  - Environment variable integration ({{variable_name}} syntax)
  - Request descriptions and metadata
- **ENHANCED**: Folder organization capabilities:
  - Nested folder support with parent-child relationships
  - Folder descriptions and metadata
  - Hierarchical request organization

### Improved
- **ENHANCED**: Collection structure handling with full request and folder hierarchy
- **ENHANCED**: Error handling and validation for all new operations
- **ENHANCED**: Type safety with comprehensive TypeScript interfaces
- **ENHANCED**: Test coverage with 95 comprehensive unit tests
- **IMPROVED**: Code formatting and linting compliance
- **IMPROVED**: API client robustness and error handling

### Fixed
- **FIXED**: ESLint issues with unnecessary type assertions (7 fixes)
- **FIXED**: Prettier formatting consistency across all source files
- **FIXED**: TypeScript compilation warnings and type safety issues

### Testing
- **ADDED**: Comprehensive test suite for request and folder tools (19 tests each)
- **ADDED**: Integration tests for all CRUD operations
- **ADDED**: Error handling and edge case testing
- **VERIFIED**: 100% test coverage for all tool modules
- **VERIFIED**: Live API integration testing with real Postman workspace

### Technical Details
- **ENHANCED**: Postman API client with full request/folder support
- **ENHANCED**: MCP tool registration and handler routing
- **ENHANCED**: Input validation with Zod schemas for all new tools
- **ENHANCED**: Response formatting and error handling consistency

## [0.1.2] - 2025-01-27

### Security
- **BREAKING**: Updated all dependencies to latest secure versions
- **ADDED**: Comprehensive security policy (SECURITY.md)
- **ADDED**: Automated security auditing via GitHub Actions
- **ADDED**: Socket.dev integration for supply chain security monitoring
- **ADDED**: Node.js version specification (.nvmrc)
- **IMPROVED**: Enhanced README with security badges and documentation
- **FIXED**: Addressed all Socket.dev supply chain vulnerability alerts

### Dependencies
- **UPDATED**: @modelcontextprotocol/sdk from ^0.6.0 to ^1.17.0
- **UPDATED**: @types/jest from ^29.5.14 to ^30.0.0
- **UPDATED**: @types/node from ^22.10.2 to ^24.1.0
- **UPDATED**: @typescript-eslint/eslint-plugin from ^8.18.2 to ^8.38.0
- **UPDATED**: @typescript-eslint/parser from ^8.18.2 to ^8.38.0
- **UPDATED**: eslint from ^9.18.0 to ^9.32.0
- **UPDATED**: jest from ^29.7.0 to ^30.0.5
- **UPDATED**: prettier from ^3.4.2 to ^3.6.2
- **UPDATED**: typescript from ^5.7.2 to ^5.8.3
- **UPDATED**: zod from ^3.24.1 to ^3.25.76

### Infrastructure
- **ADDED**: Daily security audit workflow
- **ADDED**: Dependency review for pull requests (compatible with all repository types)
- **ADDED**: Socket.dev configuration for supply chain monitoring
- **ADDED**: GitHub security setup guide for advanced features
- **FIXED**: Security workflow compatibility with private repositories
- **FIXED**: CI/CD pipeline startup validation for environments without API keys
- **IMPROVED**: Enhanced CI/CD security practices
- **IMPROVED**: Graceful handling of missing API keys in test/CI environments

### Documentation
- **ENHANCED**: README with comprehensive security section
- **ADDED**: Security reporting guidelines
- **ADDED**: Best practices for secure usage
- **IMPROVED**: Badge display with security indicators

### Added
- Request management tools (planned)
- Folder organization tools (planned)
- Collection import/export functionality (planned)
- Mock server integration (planned)

## [0.1.0] - 2025-01-26

### Added
- Initial release of Postman MCP Server
- Comprehensive Postman API client with error handling
- Workspace management tools:
  - `list_workspaces` - List all available workspaces
  - `get_workspace` - Get detailed workspace information
  - `create_workspace` - Create new workspaces (personal/team)
  - `update_workspace` - Update workspace metadata
  - `delete_workspace` - Delete workspaces
- Collection management tools:
  - `list_collections` - List collections within workspaces
  - `get_collection` - Get collection details with full structure
  - `create_collection` - Create new collections
  - `update_collection` - Update collection metadata
  - `delete_collection` - Delete collections
- Environment management tools:
  - `list_environments` - List environments in workspaces
  - `get_environment` - Get environment details and variables
  - `create_environment` - Create new environments with variables
  - `update_environment` - Update environment variables
  - `delete_environment` - Delete environments
  - Support for secret, default, and custom variable types
- TypeScript implementation with strict type checking
- Comprehensive error handling for API interactions
- Rate limiting and network error handling
- Development tooling setup:
  - ESLint configuration with TypeScript support
  - Prettier code formatting
  - Jest testing framework
  - GitHub Actions CI/CD pipeline
- Documentation:
  - Comprehensive README with usage examples
  - Contributing guidelines
  - Code of Conduct
  - API documentation for all tools
- Open source project structure:
  - MIT License
  - Issue and PR templates
  - Semantic versioning
  - Conventional commit messages

### Technical Details
- Built with TypeScript and Node.js 18+
- Uses Model Context Protocol (MCP) SDK
- Axios for HTTP client with proper error handling
- Zod for input validation and type safety
- Comprehensive test coverage setup
- Automated build and release pipeline

### Dependencies
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `axios` - HTTP client for Postman API
- `zod` - Schema validation and type safety

### Development Dependencies
- `typescript` - TypeScript compiler
- `eslint` - Code linting
- `prettier` - Code formatting
- `jest` - Testing framework
- `@types/*` - TypeScript type definitions

[Unreleased]: https://github.com/ankit-roy-0602/postman-mcp-server/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ankit-roy-0602/postman-mcp-server/compare/v0.1.4...v1.0.0
[0.1.4]: https://github.com/ankit-roy-0602/postman-mcp-server/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/ankit-roy-0602/postman-mcp-server/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/ankit-roy-0602/postman-mcp-server/compare/v0.1.0...v0.1.2
[0.1.0]: https://github.com/ankit-roy-0602/postman-mcp-server/releases/tag/v0.1.0
