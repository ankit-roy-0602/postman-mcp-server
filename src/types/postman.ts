export interface PostmanWorkspace {
  id: string;
  name: string;
  type: 'personal' | 'team';
  description?: string;
  visibility: 'private' | 'public' | 'team';
  createdAt: string;
  updatedAt: string;
}

export interface PostmanCollection {
  id: string;
  name: string;
  description?: string;
  schema: string;
  updatedAt: string;
  createdAt: string;
  lastUpdatedBy: string;
  uid: string;
  owner: string;
  public: boolean;
  fork?: {
    label: string;
    createdAt: string;
    from: string;
  };
}

export interface PostmanCollectionInfo {
  name: string;
  description?: string;
  schema: string;
  version?: {
    major: number;
    minor: number;
    patch: number;
  };
}

export interface PostmanVariable {
  key: string;
  value: string;
  type?: 'default' | 'secret';
  description?: string;
}

export interface PostmanEnvironment {
  id: string;
  name: string;
  values: PostmanVariable[];
  createdAt: string;
  updatedAt: string;
  owner: string;
  uid: string;
  isPublic: boolean;
}

export interface PostmanRequestDetails {
  url:
    | string
    | {
        raw: string;
        protocol?: string;
        host?: string[];
        port?: string;
        path?: string[];
        query?: Array<{
          key: string;
          value: string;
          disabled?: boolean;
        }>;
      };
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  header?: Array<{
    key: string;
    value: string;
    disabled?: boolean | undefined;
    description?: string | undefined;
  }>;
  body?: {
    mode: 'raw' | 'formdata' | 'urlencoded' | 'binary' | 'graphql';
    raw?: string | undefined;
    formdata?:
      | Array<{
          key: string;
          value: string;
          type?: 'text' | 'file' | undefined;
          disabled?: boolean | undefined;
        }>
      | undefined;
    urlencoded?:
      | Array<{
          key: string;
          value: string;
          disabled?: boolean | undefined;
        }>
      | undefined;
  };
  auth?: {
    type: string;
    [key: string]: unknown;
  };
}

export interface PostmanRequest {
  id?: string;
  name: string;
  description?: string;
  request: PostmanRequestDetails;
  response?: MockServerExample[];
}

export interface PostmanFolder {
  id?: string;
  name: string;
  description?: string;
  item?: Array<PostmanRequest | PostmanFolder>;
}

export interface PostmanCollectionDetail {
  info: PostmanCollectionInfo;
  item: Array<PostmanRequest | PostmanFolder>;
  variable?: PostmanVariable[];
  auth?: {
    type: string;
    [key: string]: unknown;
  };
}

export interface PostmanApiResponse<T> {
  data?: T;
  error?: {
    name: string;
    message: string;
    details?: unknown;
  };
}

export interface CreateWorkspaceRequest {
  name: string;
  type: 'personal' | 'team';
  description?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
  workspaceId?: string;
}

export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
}

export interface CreateEnvironmentRequest {
  name: string;
  values?: PostmanVariable[];
  workspaceId?: string;
}

export interface UpdateEnvironmentRequest {
  name?: string;
  values?: PostmanVariable[];
}

export interface CreateRequestRequest {
  name: string;
  url: string;
  method: PostmanRequestDetails['method'];
  description?: string;
  headers?: PostmanRequestDetails['header'];
  body?: PostmanRequestDetails['body'];
  folderId?: string;
}

export interface UpdateRequestRequest {
  name?: string;
  url?: string;
  method?: PostmanRequestDetails['method'];
  description?: string;
  headers?: PostmanRequestDetails['header'];
  body?: PostmanRequestDetails['body'];
}

export interface CreateFolderRequest {
  name: string;
  description?: string;
  parentFolderId?: string;
}

export interface MoveRequestRequest {
  requestId: string;
  targetFolderId?: string;
  targetCollectionId?: string;
}

// Mock Server Types
export interface PostmanMockServer {
  id: string;
  name: string;
  url: string;
  collection: string;
  environment?: string;
  private: boolean;
  versionTag?: string;
  createdAt: string;
  updatedAt: string;
  uid: string;
  owner: string;
  config?: {
    headers?: Array<{
      key: string;
      value: string;
    }>;
    matchBody?: boolean;
    matchQueryParams?: boolean;
    matchWildcards?: boolean;
    delay?: {
      type: 'fixed' | 'random';
      preset?: 'low' | 'medium' | 'high';
      value?: number;
    };
  };
}

export interface MockServerExample {
  id?: string;
  name: string;
  request: {
    method: string;
    url: string;
    headers?: Array<{
      key: string;
      value: string;
    }>;
    body?: PostmanRequestDetails['body'];
  };
  response: {
    name: string;
    status: string;
    code: number;
    headers?: Array<{
      key: string;
      value: string;
    }>;
    body?: string;
    _postman_previewlanguage?: string;
  };
}

export interface CreateMockServerRequest {
  name: string;
  collectionId: string;
  environmentId?: string;
  private?: boolean;
  versionTag?: string;
  config?: {
    headers?: Array<{
      key: string;
      value: string;
    }>;
    matchBody?: boolean;
    matchQueryParams?: boolean;
    matchWildcards?: boolean;
    delay?: {
      type: 'fixed' | 'random';
      preset?: 'low' | 'medium' | 'high';
      value?: number;
    };
  };
}

export interface UpdateMockServerRequest {
  name?: string;
  environmentId?: string;
  private?: boolean;
  config?: {
    headers?: Array<{
      key: string;
      value: string;
    }>;
    matchBody?: boolean;
    matchQueryParams?: boolean;
    matchWildcards?: boolean;
    delay?: {
      type: 'fixed' | 'random';
      preset?: 'low' | 'medium' | 'high';
      value?: number;
    };
  };
}

export interface MockServerCallLog {
  id: string;
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: string;
  };
  response: {
    code: number;
    status: string;
    headers: Record<string, string>;
    body?: string;
  };
  servedBy?: {
    mockId?: string;
    exampleId?: string;
  };
  timestamp: string;
}
