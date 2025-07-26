import axios from 'axios';
export class PostmanAPIClient {
    client;
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.client = axios.create({
            baseURL: 'https://api.getpostman.com',
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });
    }
    async validateConnection() {
        try {
            await this.client.get('/me');
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid Postman API key');
                }
                throw new Error(`Failed to connect to Postman API: ${error.message}`);
            }
            throw error;
        }
    }
    // Workspace Management
    async listWorkspaces() {
        try {
            const response = await this.client.get('/workspaces');
            return response.data.workspaces;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to list workspaces');
        }
    }
    async getWorkspace(workspaceId) {
        try {
            const response = await this.client.get(`/workspaces/${workspaceId}`);
            return response.data.workspace;
        }
        catch (error) {
            throw this.handleError(error, `Failed to get workspace ${workspaceId}`);
        }
    }
    async createWorkspace(workspace) {
        try {
            const response = await this.client.post('/workspaces', { workspace });
            return response.data.workspace;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to create workspace');
        }
    }
    async updateWorkspace(workspaceId, updates) {
        try {
            const response = await this.client.put(`/workspaces/${workspaceId}`, {
                workspace: updates,
            });
            return response.data.workspace;
        }
        catch (error) {
            throw this.handleError(error, `Failed to update workspace ${workspaceId}`);
        }
    }
    async deleteWorkspace(workspaceId) {
        try {
            await this.client.delete(`/workspaces/${workspaceId}`);
        }
        catch (error) {
            throw this.handleError(error, `Failed to delete workspace ${workspaceId}`);
        }
    }
    // Collection Management
    async listCollections(workspaceId) {
        try {
            const url = workspaceId
                ? `/collections?workspace=${workspaceId}`
                : '/collections';
            const response = await this.client.get(url);
            return response.data.collections;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to list collections');
        }
    }
    async getCollection(collectionId) {
        try {
            const response = await this.client.get(`/collections/${collectionId}`);
            return response.data.collection;
        }
        catch (error) {
            throw this.handleError(error, `Failed to get collection ${collectionId}`);
        }
    }
    async createCollection(collection) {
        try {
            const collectionData = {
                info: {
                    name: collection.name,
                    description: collection.description,
                    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
                },
                item: [],
            };
            const url = collection.workspaceId
                ? `/collections?workspace=${collection.workspaceId}`
                : '/collections';
            const response = await this.client.post(url, { collection: collectionData });
            return response.data.collection;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to create collection');
        }
    }
    async updateCollection(collectionId, updates) {
        try {
            const response = await this.client.put(`/collections/${collectionId}`, {
                collection: { info: updates },
            });
            return response.data.collection;
        }
        catch (error) {
            throw this.handleError(error, `Failed to update collection ${collectionId}`);
        }
    }
    async deleteCollection(collectionId) {
        try {
            await this.client.delete(`/collections/${collectionId}`);
        }
        catch (error) {
            throw this.handleError(error, `Failed to delete collection ${collectionId}`);
        }
    }
    // Environment Management
    async listEnvironments(workspaceId) {
        try {
            const url = workspaceId
                ? `/environments?workspace=${workspaceId}`
                : '/environments';
            const response = await this.client.get(url);
            return response.data.environments;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to list environments');
        }
    }
    async getEnvironment(environmentId) {
        try {
            const response = await this.client.get(`/environments/${environmentId}`);
            return response.data.environment;
        }
        catch (error) {
            throw this.handleError(error, `Failed to get environment ${environmentId}`);
        }
    }
    async createEnvironment(environment) {
        try {
            const environmentData = {
                name: environment.name,
                values: environment.values || [],
            };
            const url = environment.workspaceId
                ? `/environments?workspace=${environment.workspaceId}`
                : '/environments';
            const response = await this.client.post(url, { environment: environmentData });
            return response.data.environment;
        }
        catch (error) {
            throw this.handleError(error, 'Failed to create environment');
        }
    }
    async updateEnvironment(environmentId, updates) {
        try {
            const response = await this.client.put(`/environments/${environmentId}`, {
                environment: updates,
            });
            return response.data.environment;
        }
        catch (error) {
            throw this.handleError(error, `Failed to update environment ${environmentId}`);
        }
    }
    async deleteEnvironment(environmentId) {
        try {
            await this.client.delete(`/environments/${environmentId}`);
        }
        catch (error) {
            throw this.handleError(error, `Failed to delete environment ${environmentId}`);
        }
    }
    handleError(error, message) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data;
            if (status === 401) {
                return new Error('Invalid or expired Postman API key');
            }
            if (status === 403) {
                return new Error('Insufficient permissions for this operation');
            }
            if (status === 404) {
                return new Error('Resource not found');
            }
            if (status === 429) {
                return new Error('Rate limit exceeded. Please try again later');
            }
            const errorMessage = data?.error?.message || error.message;
            return new Error(`${message}: ${errorMessage}`);
        }
        return new Error(`${message}: ${String(error)}`);
    }
}
//# sourceMappingURL=postman-client.js.map