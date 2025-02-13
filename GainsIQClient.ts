import { AddSetRequest, AddSetResponse, WorkoutSet } from "./types";

export class GainsIQClient {
    private apiUrl: string;
  
    constructor(apiUrl: string, authToken?: string) {
      this.apiUrl = apiUrl;
    }
  
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const headers = new Headers(options.headers);
      headers.set("Content-Type", "application/json");
  
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        ...options,
        headers,
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
  
      return response.json();
    }
  
    async getWorkoutSets(): Promise<WorkoutSet[]> {
      return this.request<WorkoutSet[]>("/workout-sets");
    }
  
    async addWorkoutSet(data: AddSetRequest): Promise<AddSetResponse> {
      return this.request<AddSetResponse>("/workout-sets", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  
    async deleteWorkoutSet(setId: string): Promise<void> {
      await this.request(`/workout-sets/${setId}`, { method: "DELETE" });
    }
  }