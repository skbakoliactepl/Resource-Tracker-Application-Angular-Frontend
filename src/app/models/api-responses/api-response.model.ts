// models/api-response.model.ts
export interface ApiResponse<T> {
    message: string;
    data: T;
    error: any;
    success: boolean;
}
