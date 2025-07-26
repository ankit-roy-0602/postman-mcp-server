import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { PostmanAPIClient } from '../utils/postman-client.js';
export declare const environmentTools: Tool[];
export declare function handleEnvironmentTool(name: string, args: unknown, client: PostmanAPIClient): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=environment-tools.d.ts.map