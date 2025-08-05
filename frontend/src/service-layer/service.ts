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


export class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetchApi(`${this.baseUrl}${endpoint}`);
        return response.json();
    }

    async post<T, D = unknown>(endpoint: string, data: D): Promise<T> {
        const response = await fetchApi(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    }

    // Additional methods (put, delete, etc.) can be added here
}
