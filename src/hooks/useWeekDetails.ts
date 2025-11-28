import { useState, useEffect } from 'react';
import { integratedService, type OrderDetail } from '../api/services/IntegratedService';

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
                const sortedOrders = response.data.sort((a, b) => {
                    if (a.completed && !b.completed) return 1;
                    if (!a.completed && b.completed) return -1;

                    if (a.scannedQuantity !== b.scannedQuantity) {
                        return b.scannedQuantity - a.scannedQuantity;
                    }

                    return a.partNumber.localeCompare(b.partNumber);
                });

                setOrders(sortedOrders);
            } else {
                setError(response.message);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateOrder = (updatedOrder: OrderDetail) => {
        setOrders(prevOrders => {
            const updatedOrders = prevOrders.map(order =>
                order.id === updatedOrder.id ? updatedOrder : order
            );

            return updatedOrders.sort((a, b) => {
                if (a.completed && !b.completed) return 1;
                if (!a.completed && b.completed) return -1;

                const progressA = a.scannedQuantity;
                const progressB = b.scannedQuantity;
                if (progressA !== progressB) {
                    return progressB - progressA;
                }

                return a.partNumber.localeCompare(b.partNumber);
            });
        });
    };

    const moveOrderToTop = (orderId: number) => {
        setOrders(prevOrders => {
            const orderIndex = prevOrders.findIndex(order => order.id === orderId);
            if (orderIndex === -1) return prevOrders;

            const order = prevOrders[orderIndex];
            const otherOrders = prevOrders.filter((_, index) => index !== orderIndex);

            if (order.completed) {
                const nonCompleted = otherOrders.filter(o => !o.completed);
                const completed = otherOrders.filter(o => o.completed);
                return [...nonCompleted, order, ...completed];
            }

            return [order, ...otherOrders];
        });
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
        refetch,
        updateOrder,
        moveOrderToTop
    };
};