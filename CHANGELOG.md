# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/ankit-roy-0602/postman-mcp-server/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ankit-roy-0602/postman-mcp-server/releases/tag/v0.1.0
