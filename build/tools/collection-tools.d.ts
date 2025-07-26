import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { PostmanAPIClient } from '../utils/postman-client.js';
export declare const collectionTools: Tool[];
export declare function handleCollectionTool(name: string, args: unknown, client: PostmanAPIClient): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=collection-tools.d.ts.map