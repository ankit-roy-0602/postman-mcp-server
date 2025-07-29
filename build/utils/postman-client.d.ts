import { PostmanWorkspace, PostmanCollection, PostmanCollectionDetail, PostmanEnvironment, PostmanRequest, PostmanFolder, CreateWorkspaceRequest, UpdateWorkspaceRequest, CreateCollectionRequest, UpdateCollectionRequest, CreateEnvironmentRequest, UpdateEnvironmentRequest, CreateRequestRequest, UpdateRequestRequest, CreateFolderRequest, MoveRequestRequest } from '../types/postman.js';
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
    createRequest(collectionId: string, request: CreateRequestRequest): Promise<PostmanRequest>;
    updateRequest(collectionId: string, requestId: string, updates: UpdateRequestRequest): Promise<PostmanRequest>;
    deleteRequest(collectionId: string, requestId: string): Promise<void>;
    getRequest(collectionId: string, requestId: string): Promise<PostmanRequest>;
    createFolder(collectionId: string, folder: CreateFolderRequest): Promise<PostmanFolder>;
    updateFolder(collectionId: string, folderId: string, updates: {
        name?: string;
        description?: string;
    }): Promise<PostmanFolder>;
    deleteFolder(collectionId: string, folderId: string): Promise<void>;
    moveRequest(collectionId: string, moveRequest: MoveRequestRequest): Promise<void>;
    private findRequestInCollection;
    private findFolderInCollection;
    private removeRequestFromCollection;
    private removeFolderFromCollection;
    private handleError;
}
//# sourceMappingURL=postman-client.d.ts.map