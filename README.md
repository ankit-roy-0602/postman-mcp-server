# Postman MCP Server

A Model Context Protocol (MCP) server that provides comprehensive integration with the Postman API, enabling seamless management of workspaces, collections, environments, requests, and folder structures through MCP-compatible clients.

## Features

### 🏢 Workspace Management
- List all workspaces
- Get detailed workspace information
- Create new workspaces (personal/team)
- Update workspace metadata
- Delete workspaces

### 📚 Collection Management
- List collections within workspaces
- Get collection details with full structure
- Create new collections
- Update collection metadata and variables
- Delete collections

### 🌍 Environment Management
- List environments in workspaces
- Get environment details and variables
- Create new environments with variables
- Update environment variables
- Delete environments
- Support for secret, default, and custom variable types

### 🔧 Request Management
- Add new HTTP requests to collections
- Update existing requests (method, URL, headers, body)
- Move requests between folders
- Delete requests
- Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)

### 📂 Folder Organization
- Create nested folder structures
- Organize requests within folders
- Support for hierarchical folder paths

## Installation

### Prerequisites
- Node.js 18.0.0 or higher
- A Postman account with API access
- Postman API key

### Install from npm
```bash
npm install -g postman-mcp-server
```

### Install from source
```bash
git clone https://github.com/ankit-roy-0602/postman-mcp-server.git
cd postman-mcp-server
npm install
npm run build
```

## Configuration

### MCP Client Configuration

Add the server to your MCP client configuration file:

```json
{
  "mcpServers": {
    "postman": {
      "command": "node",
      "args": ["/path/to/postman-mcp-server/build/index.js"],
      "env": {
        "POSTMAN_API_KEY": "your-postman-api-key-here"
      }
    }
  }
}
```

### Getting Your Postman API Key

1. Go to [Postman API Keys](https://web.postman.co/settings/me/api-keys)
2. Click "Generate API Key"
3. Give it a name and click "Generate API Key"
4. Copy the generated key and use it in your configuration

## Available Tools

### Workspace Tools

#### `list_workspaces`
List all available Postman workspaces.

**Parameters:** None

**Example:**
```json
{
  "name": "list_workspaces",
  "arguments": {}
}
```

#### `get_workspace`
Get detailed information about a specific workspace.

**Parameters:**
- `workspaceId` (string): The ID of the workspace to retrieve

#### `create_workspace`
Create a new Postman workspace.

**Parameters:**
- `name` (string): Name of the workspace
- `type` (string): Type of workspace ("personal" or "team")
- `description` (string, optional): Description of the workspace

#### `update_workspace`
Update an existing workspace.

**Parameters:**
- `workspaceId` (string): The ID of the workspace to update
- `name` (string, optional): New name for the workspace
- `description` (string, optional): New description for the workspace

#### `delete_workspace`
Delete a workspace.

**Parameters:**
- `workspaceId` (string): The ID of the workspace to delete

### Collection Tools

#### `list_collections`
List all collections, optionally filtered by workspace.

**Parameters:**
- `workspaceId` (string, optional): Optional workspace ID to filter collections

#### `get_collection`
Get detailed information about a specific collection including its structure.

**Parameters:**
- `collectionId` (string): The ID of the collection to retrieve

#### `create_collection`
Create a new Postman collection.

**Parameters:**
- `name` (string): Name of the collection
- `description` (string, optional): Description of the collection
- `workspaceId` (string, optional): Workspace ID where the collection will be created

#### `update_collection`
Update an existing collection metadata.

**Parameters:**
- `collectionId` (string): The ID of the collection to update
- `name` (string, optional): New name for the collection
- `description` (string, optional): New description for the collection

#### `delete_collection`
Delete a collection.

**Parameters:**
- `collectionId` (string): The ID of the collection to delete

### Environment Tools

#### `list_environments`
List all environments, optionally filtered by workspace.

**Parameters:**
- `workspaceId` (string, optional): Optional workspace ID to filter environments

#### `get_environment`
Get detailed information about a specific environment including variables.

**Parameters:**
- `environmentId` (string): The ID of the environment to retrieve

#### `create_environment`
Create a new Postman environment with variables.

**Parameters:**
- `name` (string): Name of the environment
- `values` (array, optional): Environment variables
  - `key` (string): Variable key
  - `value` (string): Variable value
  - `type` (string, optional): Variable type ("default" or "secret")
  - `description` (string, optional): Variable description
- `workspaceId` (string, optional): Workspace ID where the environment will be created

#### `update_environment`
Update an existing environment and its variables.

**Parameters:**
- `environmentId` (string): The ID of the environment to update
- `name` (string, optional): New name for the environment
- `values` (array, optional): Updated environment variables

#### `delete_environment`
Delete an environment.

**Parameters:**
- `environmentId` (string): The ID of the environment to delete

## Development

### Setup Development Environment

```bash
git clone https://github.com/ankit-roy-0602/postman-mcp-server.git
cd postman-mcp-server
npm install
```

### Available Scripts

- `npm run build` - Build the TypeScript code
- `npm run dev` - Build in watch mode
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

The project uses ESLint and Prettier for code quality and formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format:check

# Format code
npm run format
```

## Error Handling

The server provides comprehensive error handling for common scenarios:

- **Invalid API Key**: Clear error message when the Postman API key is invalid or missing
- **Rate Limiting**: Automatic handling of Postman API rate limits
- **Network Issues**: Graceful handling of network connectivity problems
- **Resource Not Found**: Proper error messages for non-existent resources
- **Permission Issues**: Clear feedback for insufficient permissions

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Run linting and formatting
7. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/ankit-roy-0602/postman-mcp-server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ankit-roy-0602/postman-mcp-server/discussions)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## Roadmap

- [ ] Request and folder management tools
- [ ] Collection import/export functionality
- [ ] Mock server integration
- [ ] Monitor management
- [ ] Team and user management
- [ ] Advanced search and filtering
- [ ] Bulk operations support
- [ ] WebSocket support for real-time updates

## Related Projects

- [Model Context Protocol](https://github.com/modelcontextprotocol/specification)
- [Postman API Documentation](https://documenter.getpostman.com/view/631643/JsLs/)
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)
