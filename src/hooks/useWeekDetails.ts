import { useEffect, useState } from "react"
import { integratedService, type OrderDetail } from "../api/services/IntegratedService"


export const useWeekDetails = (weekNumber: number | null) => {
    const [orders, setOrders] = useState<OrderDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeekDetails = async (weekNum: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await integratedService.getWeekDetail(weekNum);
            if (response.success) {
                setOrders(response.data);
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
        if (weekNumber !== null) {
            fetchWeekDetails(weekNumber);
        } else {
            setOrders([]);
        }
    }, [weekNumber]);

    const refetch = () => {
        if (weekNumber !== null) {
            fetchWeekDetails(weekNumber);
        }
    };

    return {
        orders,
        loading,
        error,
        refetch
    }
};