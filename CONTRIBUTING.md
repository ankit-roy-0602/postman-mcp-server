# Contributing to Postman MCP Server

Thank you for your interest in contributing to the Postman MCP Server! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Git
- A Postman account with API access (for testing)

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/postman-mcp-server.git
   cd postman-mcp-server
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ankit-roy-0602/postman-mcp-server.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # For testing, you'll need a Postman API key
   export POSTMAN_API_KEY=your-api-key-here
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

6. **Run tests**
   ```bash
   npm test
   ```

## Making Changes

### Branch Naming

Use descriptive branch names with the following prefixes:
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Examples:
- `feat/add-request-management-tools`
- `fix/environment-variable-validation`
- `docs/update-api-documentation`

### Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Write code following our [code style guidelines](#code-style)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run format:check
   npm test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Create a Pull Request**

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- workspace-tools.test.ts
```

### Writing Tests

- Write unit tests for all new functions and classes
- Write integration tests for API interactions
- Use descriptive test names that explain what is being tested
- Follow the existing test patterns and structure

Example test structure:
```typescript
describe('WorkspaceTools', () => {
  describe('listWorkspaces', () => {
    it('should return all workspaces when API call succeeds', async () => {
      // Test implementation
    });

    it('should throw error when API call fails', async () => {
      // Test implementation
    });
  });
});
```

### Test Coverage

- Maintain at least 80% test coverage
- Focus on testing critical paths and error conditions
- Mock external dependencies (Postman API calls)

## Code Style

### TypeScript Guidelines

- Use TypeScript strict mode
- Provide explicit return types for functions
- Use interfaces for object types
- Prefer `const` over `let` when possible
- Use meaningful variable and function names

### Formatting

We use Prettier for code formatting:
```bash
# Check formatting
npm run format:check

# Fix formatting
npm run format
```

### Linting

We use ESLint for code linting:
```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Code Organization

- Keep files focused and single-purpose
- Use barrel exports (index.ts files) for clean imports
- Group related functionality in directories
- Follow the existing project structure

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```
feat: add request management tools

Add tools for creating, updating, and deleting HTTP requests
within Postman collections.

Closes #123
```

```
fix: handle rate limiting in API client

Add exponential backoff retry logic when Postman API
returns 429 status code.

Fixes #456
```

## Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Update documentation if needed
3. Add changelog entry if applicable
4. Rebase your branch on the latest main branch

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Changelog updated (if applicable)
```

### Review Process

1. All PRs require at least one review
2. Address all review comments
3. Ensure CI checks pass
4. Squash commits if requested
5. Maintainer will merge when approved

## Issue Guidelines

### Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)
- Relevant error messages or logs

### Feature Requests

When requesting features, please include:
- Clear description of the feature
- Use case and motivation
- Proposed implementation approach (if any)
- Any relevant examples or mockups

### Issue Labels

We use the following labels to categorize issues:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- `MAJOR` version for incompatible API changes
- `MINOR` version for backwards-compatible functionality additions
- `PATCH` version for backwards-compatible bug fixes

### Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release commit
4. Tag the release
5. Push to GitHub
6. Create GitHub release
7. Publish to npm

## Development Tips

### Debugging

- Use `console.error()` for server-side logging (goes to stderr)
- Test with actual Postman API when possible
- Use mock data for unit tests

### MCP Protocol

- Follow MCP specification for tool definitions
- Use proper JSON schemas for input validation
- Provide clear error messages
- Test with MCP clients like Claude Desktop

### API Integration

- Handle rate limiting gracefully
- Provide meaningful error messages
- Cache responses when appropriate
- Use proper HTTP status codes

## Getting Help

- Check existing issues and discussions
- Join our community discussions
- Ask questions in issues with the `question` label
- Reach out to maintainers for guidance

## Recognition

Contributors will be recognized in:
- `CONTRIBUTORS.md` file
- Release notes for significant contributions
- GitHub contributors page

Thank you for contributing to Postman MCP Server! 🚀
