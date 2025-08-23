const fetchApi = async (url: string, options?: RequestInit): Promise<Response> => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error('Fetch API error:', error);
        throw error;
    }
}

interface IApiService {
    get: (endpoint: string) => any;
    post: (endpoint: string, data: any) => any;
    update: (endpoint: string, data: any) => any;
    delete(endpoint: string, id: string): any;
}


export class ApiService implements IApiService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get(endpoint: string): Promise<any> {
        const response = await fetchApi(`${this.baseUrl}/${endpoint}`);
        return response.json();
    }

    async post(endpoint: string, data: any): Promise<any> {
        const response = await fetchApi(`${this.baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async update(endpoint: string, data: any) {
        const response = await fetchApi(`${this.baseUrl}/${endpoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    async delete(endpoint: string) {
        const response = await fetchApi(`${this.baseUrl}/${endpoint}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    }

    // Additional methods (put, delete, etc.) can be added here
}
