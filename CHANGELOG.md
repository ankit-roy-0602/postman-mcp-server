# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
- **IMPROVED**: Enhanced CI/CD security practices

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

[Unreleased]: https://github.com/ankit-roy-0602/postman-mcp-server/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ankit-roy-0602/postman-mcp-server/releases/tag/v0.1.0
