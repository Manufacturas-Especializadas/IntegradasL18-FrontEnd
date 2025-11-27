import { API_CONFIG } from "../../config/api";
import { apiClient } from "../client";

export interface ProductionOrderForm {
    weekNumber: number;
    file: File;
};

export interface ProductionOrderResponse {
    success: boolean;
    message: string;
    recordsProcessed: number;
    errors: string[];
};

export interface OrderSummary {
    weekNumber: number;
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalQuantity: number;
    scannedQuantity: number;
    progressPercentage: number;
    lastUpdate: string | null;
};

export interface OrderDetail {
    id: number;
    type: string;
    partNumber: string;
    pipeline: string;
    amount: number;
    scannedQuantity: number;
    completed: boolean;
    createdAt: string;
    completedDate: string | null;
    remaining: number;
    progressPercentage: number;
};

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T
};

class IntegratedService {
    private productionOrderEndpoint = API_CONFIG.endpoints.integrated.productionOrderIncrease;
    private weekSummaryEndpoint = API_CONFIG.endpoints.integrated.weeksSummary;
    private weekByNumberEndpoint = API_CONFIG.endpoints.integrated.weekByNumber;


    async getWeeksSummary(): Promise<ApiResponse<OrderSummary[]>> {
        return apiClient.get<ApiResponse<OrderSummary[]>>(this.weekSummaryEndpoint);
    };

    async getWeekDetail(weekNumber: number): Promise<ApiResponse<OrderDetail[]>> {
        return apiClient.get<ApiResponse<OrderDetail[]>>(`${this.weekByNumberEndpoint}${weekNumber}`);
    };

    async productionOrder(formData: ProductionOrderForm): Promise<ProductionOrderResponse> {
        const requestFormData = new FormData();
        requestFormData.append('file', formData.file);
        requestFormData.append('weekNumber', formData.weekNumber.toString());

        const response = await apiClient.post<ProductionOrderResponse>(
            this.productionOrderEndpoint,
            requestFormData
        );

        return response;
    };
};

export const integratedService = new IntegratedService();