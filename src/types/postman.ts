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

export interface PostmanRequest {
  id?: string;
  name: string;
  description?: string;
  url: string | {
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
    disabled?: boolean;
    description?: string;
  }>;
  body?: {
    mode: 'raw' | 'formdata' | 'urlencoded' | 'binary' | 'graphql';
    raw?: string;
    formdata?: Array<{
      key: string;
      value: string;
      type?: 'text' | 'file';
      disabled?: boolean;
    }>;
    urlencoded?: Array<{
      key: string;
      value: string;
      disabled?: boolean;
    }>;
  };
  auth?: {
    type: string;
    [key: string]: any;
  };
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
    [key: string]: any;
  };
}

export interface PostmanApiResponse<T> {
  data?: T;
  error?: {
    name: string;
    message: string;
    details?: any;
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
  method: PostmanRequest['method'];
  description?: string;
  headers?: PostmanRequest['header'];
  body?: PostmanRequest['body'];
  folderId?: string;
}

export interface UpdateRequestRequest {
  name?: string;
  url?: string;
  method?: PostmanRequest['method'];
  description?: string;
  headers?: PostmanRequest['header'];
  body?: PostmanRequest['body'];
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
