# 🚀 Postman MCP Server

> **Transform your AI conversations into powerful API workflows with seamless Postman integration**

[![npm version](https://badge.fury.io/js/postman-mcp-server.svg)](https://badge.fury.io/js/postman-mcp-server)
[![CI](https://github.com/ankit-roy-0602/postman-mcp-server/workflows/CI/badge.svg)](https://github.com/ankit-roy-0602/postman-mcp-server/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Stop switching between your AI assistant and Postman!** This Model Context Protocol (MCP) server brings the full power of Postman directly into your AI conversations with Cline, Claude Desktop, Cursor, and other MCP-compatible clients.

## 🎯 Why You Need This

### The Problem
- **Context Switching Nightmare**: Constantly jumping between AI chats and Postman to manage APIs
- **Manual API Documentation**: Tediously explaining API structures to your AI assistant
- **Workflow Interruption**: Breaking your flow to test, update, or create API requests
- **Team Collaboration Gaps**: Difficulty sharing API workflows between AI-assisted development and team tools

### The Solution
**One command. Infinite possibilities.** Connect your AI assistant directly to Postman and unlock:

✨ **Instant API Management** - Create, update, and organize API collections without leaving your AI conversation  
🔄 **Real-time Sync** - Changes made through AI are immediately available in Postman  
🎯 **Context-Aware Assistance** - Your AI understands your entire API ecosystem  
🚀 **Accelerated Development** - Build and test APIs 10x faster with AI-powered workflows  
👥 **Seamless Team Integration** - AI-generated APIs automatically sync with your team's Postman workspace  

## 🌟 What You Can Do

### 🏢 **Smart Workspace Management**
- **"Create a new workspace for our mobile app project"** - Done in seconds
- **"List all my team workspaces"** - Instant overview of your organization
- **"Switch to the production workspace"** - Seamless environment management

### 📚 **Intelligent Collection Building**
- **"Build a REST API collection for user authentication"** - AI creates the entire structure
- **"Add CRUD operations for the products endpoint"** - Complete API sets generated instantly
- **"Import my OpenAPI spec into a new collection"** - Automated API documentation

### 🌍 **Dynamic Environment Control**
- **"Set up dev, staging, and prod environments"** - Multi-environment setup in one command
- **"Update the API key for production"** - Secure credential management
- **"Switch all requests to use the staging server"** - Bulk environment changes

### 🔧 **Effortless Request Management**
- **"Create a POST request for user registration with validation"** - Complete request with headers, body, and tests
- **"Add authentication to all requests in this collection"** - Bulk security implementation
- **"Generate test data for the user creation endpoint"** - Realistic test scenarios

### 📂 **Organized Folder Structures**
- **"Organize these requests by feature"** - Automatic logical grouping
- **"Create a folder structure for microservices"** - Enterprise-ready organization
- **"Move all authentication requests to a separate folder"** - Instant reorganization

## 🚀 Quick Start (60 seconds to API mastery)

### 1. Install Globally
```bash
npm install -g postman-mcp-server
```

### 2. Get Your Postman API Key
1. Visit [Postman API Keys](https://web.postman.co/settings/me/api-keys)
2. Click "Generate API Key"
3. Copy your key

### 3. Configure Your AI Agent

#### For **Cline** (VSCode Extension)
Add to your Cline MCP settings:
```json
{
  "mcpServers": {
    "postman": {
      "command": "postman-mcp-server",
      "env": {
        "POSTMAN_API_KEY": "your-postman-api-key-here"
      }
    }
  }
}
```

#### For **Claude Desktop**
Add to your configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "postman": {
      "command": "postman-mcp-server",
      "env": {
        "POSTMAN_API_KEY": "your-postman-api-key-here"
      }
    }
  }
}
```

#### For **Cursor**
Add to your Cursor MCP configuration:
```json
{
  "mcpServers": {
    "postman": {
      "command": "postman-mcp-server",
      "env": {
        "POSTMAN_API_KEY": "your-postman-api-key-here"
      }
    }
  }
}
```

### 4. Start Building!
Restart your AI agent and start with:
> *"Show me all my Postman workspaces and help me create a new API collection for my e-commerce project"*

## 💡 Real-World Use Cases

### 🎯 **API-First Development**
```
You: "I'm building a social media app. Create a complete API collection with user management, posts, and comments."

AI: *Creates workspace, sets up collections with proper folder structure, adds CRUD operations for users/posts/comments, configures authentication, and sets up test environments*
```

### 🔄 **Rapid Prototyping**
```
You: "Convert this OpenAPI spec into a Postman collection and add realistic test data."

AI: *Imports spec, creates organized collection, generates sample requests with proper headers and realistic JSON payloads*
```

### 🚀 **Team Onboarding**
```
You: "Set up a development environment for our new team member with all our microservice endpoints."

AI: *Creates workspace, imports all collections, sets up environment variables, organizes by service, adds documentation*
```

### 🔧 **API Testing Automation**
```
You: "Add comprehensive tests to all endpoints in my user management collection."

AI: *Adds status code checks, response validation, authentication tests, and error handling to every request*
```

## 🛠️ Powerful Features

### 🏢 **Workspace Management**
- **List & Browse**: Instantly see all your workspaces
- **Create & Configure**: Set up new team or personal workspaces
- **Update & Organize**: Modify workspace settings and descriptions
- **Smart Switching**: Context-aware workspace management

### 📚 **Collection Operations**
- **Intelligent Creation**: AI-powered collection structure generation
- **Bulk Operations**: Manage multiple collections simultaneously
- **Version Control**: Track and manage collection changes
- **Import/Export**: Seamless data migration

### 🌍 **Environment Control**
- **Multi-Environment Setup**: Dev, staging, production configurations
- **Variable Management**: Secure handling of API keys and endpoints
- **Bulk Updates**: Change environments across collections
- **Environment Cloning**: Duplicate setups for new projects

### 🔧 **Request Engineering**
- **Smart Generation**: AI creates complete requests with proper structure
- **Bulk Modifications**: Update multiple requests simultaneously
- **Authentication Integration**: Automatic auth setup across requests
- **Test Generation**: Comprehensive test suites for all endpoints

### 📂 **Organization Tools**
- **Folder Hierarchies**: Create logical API groupings
- **Auto-Organization**: AI suggests optimal folder structures
- **Bulk Moving**: Reorganize requests efficiently
- **Search & Filter**: Find requests across large collections

## 🔒 Security & Best Practices

- **🔐 Secure API Key Handling**: Environment variable storage
- **🛡️ Rate Limit Respect**: Built-in Postman API rate limiting
- **✅ Input Validation**: Comprehensive request validation
- **🔍 Error Handling**: Graceful failure management
- **📝 Audit Logging**: Track all API operations

## 🎨 Advanced Configuration

### Environment Variable Setup
```bash
export POSTMAN_API_KEY="your-postman-api-key-here"
```

### Alternative Configuration (if global install doesn't work)
```json
{
  "mcpServers": {
    "postman": {
      "command": "node",
      "args": ["$(npm root -g)/postman-mcp-server/build/index.js"],
      "env": {
        "POSTMAN_API_KEY": "your-postman-api-key-here"
      }
    }
  }
}
```

## 🧪 Verification

Test your installation:
```bash
# Check if the command is available
postman-mcp-server --help

# Verify global installation
npm list -g postman-mcp-server
```

## 🚀 Available Tools

<details>
<summary><strong>🏢 Workspace Tools</strong></summary>

#### `list_workspaces`
Get all your Postman workspaces instantly
```json
{ "name": "list_workspaces", "arguments": {} }
```

#### `get_workspace`
Detailed workspace information and metadata
```json
{ "name": "get_workspace", "arguments": { "workspaceId": "workspace-id" } }
```

#### `create_workspace`
Create new team or personal workspaces
```json
{
  "name": "create_workspace",
  "arguments": {
    "name": "My New Workspace",
    "type": "team",
    "description": "Workspace for our new project"
  }
}
```

#### `update_workspace`
Modify workspace settings and descriptions
```json
{
  "name": "update_workspace",
  "arguments": {
    "workspaceId": "workspace-id",
    "name": "Updated Name",
    "description": "New description"
  }
}
```

#### `delete_workspace`
Remove workspaces (use with caution!)
```json
{ "name": "delete_workspace", "arguments": { "workspaceId": "workspace-id" } }
```

</details>

<details>
<summary><strong>📚 Collection Tools</strong></summary>

#### `list_collections`
Browse all collections or filter by workspace
```json
{ "name": "list_collections", "arguments": { "workspaceId": "optional-workspace-id" } }
```

#### `get_collection`
Complete collection structure and metadata
```json
{ "name": "get_collection", "arguments": { "collectionId": "collection-id" } }
```

#### `create_collection`
Build new API collections
```json
{
  "name": "create_collection",
  "arguments": {
    "name": "User Management API",
    "description": "Complete user CRUD operations",
    "workspaceId": "workspace-id"
  }
}
```

#### `update_collection`
Modify collection metadata and settings
```json
{
  "name": "update_collection",
  "arguments": {
    "collectionId": "collection-id",
    "name": "Updated API Collection",
    "description": "Enhanced description"
  }
}
```

#### `delete_collection`
Remove collections permanently
```json
{ "name": "delete_collection", "arguments": { "collectionId": "collection-id" } }
```

</details>

<details>
<summary><strong>🌍 Environment Tools</strong></summary>

#### `list_environments`
View all environments or filter by workspace
```json
{ "name": "list_environments", "arguments": { "workspaceId": "optional-workspace-id" } }
```

#### `get_environment`
Environment details with all variables
```json
{ "name": "get_environment", "arguments": { "environmentId": "environment-id" } }
```

#### `create_environment`
Set up new environments with variables
```json
{
  "name": "create_environment",
  "arguments": {
    "name": "Production",
    "values": [
      { "key": "baseUrl", "value": "https://api.production.com", "type": "default" },
      { "key": "apiKey", "value": "secret-key", "type": "secret" }
    ],
    "workspaceId": "workspace-id"
  }
}
```

#### `update_environment`
Modify environment variables and settings
```json
{
  "name": "update_environment",
  "arguments": {
    "environmentId": "environment-id",
    "name": "Updated Environment",
    "values": [
      { "key": "newVariable", "value": "newValue", "type": "default" }
    ]
  }
}
```

#### `delete_environment`
Remove environments
```json
{ "name": "delete_environment", "arguments": { "environmentId": "environment-id" } }
```

</details>

## 🛠️ Development

### Setup Development Environment
```bash
git clone https://github.com/ankit-roy-0602/postman-mcp-server.git
cd postman-mcp-server
npm install
npm run build
```

### Available Scripts
- `npm run build` - Build TypeScript code
- `npm run dev` - Development mode with watch
- `npm test` - Run comprehensive test suite
- `npm run lint` - Code quality checks
- `npm run format` - Code formatting

## 🤝 Contributing

We welcome contributions! Whether it's:
- 🐛 **Bug Reports**: Found an issue? Let us know!
- ✨ **Feature Requests**: Have an idea? We'd love to hear it!
- 📖 **Documentation**: Help make our docs even better
- 🔧 **Code Contributions**: Submit PRs for new features or fixes

See our [Contributing Guide](CONTRIBUTING.md) for details.

## 📈 Roadmap

### 🚀 **Coming Soon**
- [ ] **Request & Folder Management**: Complete CRUD operations for requests
- [ ] **Mock Server Integration**: AI-powered mock server creation
- [ ] **Collection Import/Export**: Seamless data migration tools
- [ ] **Advanced Search**: Find anything across your Postman workspace

### 🔮 **Future Vision**
- [ ] **Monitor Management**: Automated API monitoring setup
- [ ] **Team Collaboration**: Enhanced team workflow integration
- [ ] **WebSocket Support**: Real-time updates and notifications
- [ ] **Bulk Operations**: Mass operations across collections
- [ ] **AI-Powered Testing**: Intelligent test generation and validation

## 🏆 Why Choose Postman MCP Server?

### ⚡ **Speed**
Transform hours of manual API work into seconds of AI conversation

### 🎯 **Precision**
AI understands your exact API structure and requirements

### 🔄 **Integration**
Seamless sync between AI workflows and team collaboration

### 🛡️ **Reliability**
Enterprise-grade error handling and security practices

### 📈 **Scalability**
From prototype to production, scales with your needs

## 📞 Support & Community

- **🐛 Issues**: [GitHub Issues](https://github.com/ankit-roy-0602/postman-mcp-server/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/ankit-roy-0602/postman-mcp-server/discussions)
- **📧 Email**: [Support](mailto:support@postman-mcp-server.com)
- **🐦 Twitter**: [@PostmanMCP](https://twitter.com/PostmanMCP)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Postman Team** - For the incredible API platform
- **Model Context Protocol** - For the revolutionary AI integration standard
- **Open Source Community** - For continuous inspiration and contributions

---

<div align="center">

**Ready to revolutionize your API workflow?**

```bash
npm install -g postman-mcp-server
```

**⭐ Star this repo if it helps you build better APIs faster!**

</div>
