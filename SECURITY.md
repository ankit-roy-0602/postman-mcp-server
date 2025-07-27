# Security Policy

## Supported Versions

We actively support the following versions of postman-mcp-server:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by emailing the maintainer or creating a private security advisory on GitHub.

### What to include in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Security Measures

This package implements the following security measures:

### Dependencies
- Regular dependency updates to latest secure versions
- Automated vulnerability scanning via npm audit
- Minimal dependency footprint to reduce attack surface

### Code Security
- TypeScript for type safety
- ESLint for code quality and security linting
- Comprehensive testing with Jest
- Input validation using Zod schemas

### Supply Chain Security
- Package integrity verification
- Locked dependency versions via package-lock.json
- Regular security audits

## Security Best Practices for Users

When using this package:

1. **Environment Variables**: Store sensitive data like API keys in environment variables, never in code
2. **Network Security**: Use HTTPS endpoints when possible
3. **Access Control**: Limit API key permissions to minimum required scope
4. **Regular Updates**: Keep the package updated to the latest version
5. **Monitoring**: Monitor your applications for unusual API usage patterns

## Postman API Security

When using this MCP server with Postman:

1. **API Key Management**: 
   - Use environment-specific API keys
   - Rotate API keys regularly
   - Never commit API keys to version control

2. **Workspace Security**:
   - Use team workspaces for collaboration
   - Implement proper access controls
   - Regular audit of workspace members

3. **Collection Security**:
   - Sanitize sensitive data in requests/responses
   - Use variables for sensitive values
   - Regular review of shared collections

## Incident Response

In case of a security incident:

1. Immediate assessment of impact
2. Notification to affected users
3. Rapid deployment of fixes
4. Post-incident review and improvements

## Contact

For security-related questions or concerns, please contact:
- GitHub: [@ankit-roy-0602](https://github.com/ankit-roy-0602)
- Repository: [postman-mcp-server](https://github.com/ankit-roy-0602/postman-mcp-server)
