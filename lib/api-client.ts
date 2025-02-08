import { IVideo } from "@/models/Video";

type videoFormData = Omit<IVideo, "_id">;
type fetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: fetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options;

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        };

        const response = await fetch(`/api${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return response.json();
    }

    async getVideos() {
        return await this.fetch<IVideo[]>('/videos');
    }

    async getVideo(id: string) {
        return await this.fetch<IVideo>(`/videos/${id}`)
    }

    async createVideo(videoData: videoFormData) {
        return await this.fetch('/videos', {
            method: "POST",
            body: videoData,
        })
    }
}

export const apiClient = new ApiClient();