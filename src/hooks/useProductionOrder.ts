import { useState } from "react";
import { integratedService, type ProductionOrderForm, type ProductionOrderResponse } from "../api/services/IntegratedService";

export const useProductionOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ProductionOrderResponse | null>(null);

    const uploadProductionOrder = async (formData: ProductionOrderForm) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const result = await integratedService.productionOrder(formData);
            setData(result);
            return result;
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido al subir la orden";
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setLoading(false);
        setError(null);
        setData(null);
    };

    return {
        uploadProductionOrder,
        loading,
        error,
        data,
        reset
    };
};