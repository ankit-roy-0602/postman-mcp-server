#!/usr/bin/env node
import { PostmanMCPServer } from './server.js';
async function main() {
    const server = new PostmanMCPServer();
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        await server.stop();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        await server.stop();
        process.exit(0);
    });
    try {
        await server.start();
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map