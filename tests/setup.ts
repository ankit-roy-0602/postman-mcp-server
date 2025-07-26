// Jest setup file
import { jest } from '@jest/globals';

// Mock environment variables for tests
process.env['POSTMAN_API_KEY'] = 'test-api-key';

// Global test timeout
jest.setTimeout(30000);
