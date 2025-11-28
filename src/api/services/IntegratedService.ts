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

export interface ScanRequest {
    partNumber: string;
    weekNumber: number;
    quantity: number;
};

export interface ScanResponse {
    success: boolean;
    message: string;
    partNumber: string;
    scannedQuantity: number;
    requiredQuantity: number;
    addedQuantity: number;
    completed: boolean;
    remaining: number;
    progressPercentage: number;
    order?: OrderDetail;
};

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T
};

class IntegratedService {
    private scanEndpoint = API_CONFIG.endpoints.integrated.scan;
    private productionOrderEndpoint = API_CONFIG.endpoints.integrated.productionOrderIncrease;
    private generateReportEndpoint = API_CONFIG.endpoints.integrated.generateReport;
    private weekSummaryEndpoint = API_CONFIG.endpoints.integrated.weeksSummary;
    private weekByNumberEndpoint = API_CONFIG.endpoints.integrated.weekByNumber;


    async getWeeksSummary(): Promise<ApiResponse<OrderSummary[]>> {
        return apiClient.get<ApiResponse<OrderSummary[]>>(this.weekSummaryEndpoint);
    };

    async getWeekDetail(weekNumber: number): Promise<ApiResponse<OrderDetail[]>> {
        return apiClient.get<ApiResponse<OrderDetail[]>>(`${this.weekByNumberEndpoint}${weekNumber}`);
    };

    async scanPart(request: ScanRequest): Promise<ScanResponse> {
        return apiClient.post(this.scanEndpoint, request);
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

    async downloadReport(weekNumber: number, reportType: 'detailed' | 'summary' = 'detailed'): Promise<void> {
        const endpoint = `${this.generateReportEndpoint}${weekNumber}?reportType=${reportType}`;
        const filename = `Reporte_Semana_${weekNumber}_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`;

        await apiClient.downloadFile(endpoint, filename);
    };
};

export const integratedService = new IntegratedService();