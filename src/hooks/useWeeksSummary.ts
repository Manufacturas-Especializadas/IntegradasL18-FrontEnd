import { useEffect, useState } from "react"
import { integratedService, type OrderSummary } from "../api/services/IntegratedService"


export const useWeeksSummary = () => {
    const [weeks, setWeeks] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeeksSummary = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await integratedService.getWeeksSummary();
            if (response.success) {
                setWeeks(response.data);
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeeksSummary();
    }, []);

    const refetch = () => {
        fetchWeeksSummary();
    };

    return {
        weeks,
        loading,
        error,
        refetch
    };
};