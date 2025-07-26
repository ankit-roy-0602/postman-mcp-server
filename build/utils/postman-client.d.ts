import { PostmanWorkspace, PostmanCollection, PostmanCollectionDetail, PostmanEnvironment, CreateWorkspaceRequest, UpdateWorkspaceRequest, CreateCollectionRequest, UpdateCollectionRequest, CreateEnvironmentRequest, UpdateEnvironmentRequest } from '../types/postman.js';
export declare class PostmanAPIClient {
    private client;
    private apiKey;
    constructor(apiKey: string);
    validateConnection(): Promise<void>;
    listWorkspaces(): Promise<PostmanWorkspace[]>;
    getWorkspace(workspaceId: string): Promise<PostmanWorkspace>;
    createWorkspace(workspace: CreateWorkspaceRequest): Promise<PostmanWorkspace>;
    updateWorkspace(workspaceId: string, updates: UpdateWorkspaceRequest): Promise<PostmanWorkspace>;
    deleteWorkspace(workspaceId: string): Promise<void>;
    listCollections(workspaceId?: string): Promise<PostmanCollection[]>;
    getCollection(collectionId: string): Promise<PostmanCollectionDetail>;
    createCollection(collection: CreateCollectionRequest): Promise<PostmanCollection>;
    updateCollection(collectionId: string, updates: UpdateCollectionRequest): Promise<PostmanCollection>;
    deleteCollection(collectionId: string): Promise<void>;
    listEnvironments(workspaceId?: string): Promise<PostmanEnvironment[]>;
    getEnvironment(environmentId: string): Promise<PostmanEnvironment>;
    createEnvironment(environment: CreateEnvironmentRequest): Promise<PostmanEnvironment>;
    updateEnvironment(environmentId: string, updates: UpdateEnvironmentRequest): Promise<PostmanEnvironment>;
    deleteEnvironment(environmentId: string): Promise<void>;
    private handleError;
}
//# sourceMappingURL=postman-client.d.ts.map