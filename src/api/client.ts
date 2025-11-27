import { API_CONFIG } from "../config/api";

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.baseUrl;
    }

    private getAuthHeaders(): Record<string, string> {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
            let errorMessage = `HTTP Error: ${response.status} - ${response.statusText}`;

            try {
                const errorText = await response.text();
                if (errorText) {
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorJson.title || errorText;
                    } catch {
                        errorMessage = errorText;
                    }
                }
            } catch {
                errorMessage = `HTTP Error: ${response.status} - ${response.statusText}`;
            }

            throw new Error(errorMessage);
        }

        if (response.status === 204 || response.status === 205) {
            return null as unknown as T;
        }

        if (contentType && contentType.includes("application/json")) {
            return response.json() as Promise<T>;
        }

        return null as unknown as T;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers: Record<string, string> = {};

        const authHeaders = this.getAuthHeaders();
        if (authHeaders.Authorization) {
            headers['Authorization'] = authHeaders.Authorization;
        }

        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const finalHeaders = {
            ...headers,
            ...this.normalizeHeaders(options.headers),
        };

        const response = await fetch(url, {
            headers: finalHeaders,
            ...options,
        });

        return this.handleResponse<T>(response);
    }

    private normalizeHeaders(headers?: HeadersInit): Record<string, string> {
        if (!headers) return {};

        if (headers instanceof Headers) {
            const result: Record<string, string> = {};
            headers.forEach((value, key) => {
                result[key] = value;
            });
            return result;
        }

        if (Array.isArray(headers)) {
            return Object.fromEntries(headers);
        }

        return headers as Record<string, string>;
    }

    get<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        const options: RequestInit = {
            method: "POST",
        };

        if (data instanceof FormData) {
            options.body = data;
        } else if (data) {
            options.body = JSON.stringify(data);
        }

        return this.request<T>(endpoint, options);
    }

    async put<T>(endpoint: string, data: any): Promise<T> {
        const options: RequestInit = {
            method: "PUT",
        };

        if (data instanceof FormData) {
            options.body = data;
        } else if (data) {
            options.body = JSON.stringify(data);
        }

        return this.request<T>(endpoint, options);
    }

    async patch<T>(endpoint: string, data: any): Promise<T> {
        const options: RequestInit = {
            method: "PATCH",
        };

        if (data instanceof FormData) {
            options.body = data;
        } else if (data) {
            options.body = JSON.stringify(data);
        }

        return this.request<T>(endpoint, options);
    }

    delete<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    async downloadFile(endpoint: string, filename: string, data?: any): Promise<void> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers = this.getAuthHeaders();
        const options: RequestInit = {
            method: data ? "POST" : "GET",
            headers: headers,
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP Error: ${response.status}`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    }
}

export const apiClient = new ApiClient();