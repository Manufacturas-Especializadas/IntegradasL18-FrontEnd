import { useEffect, useState } from "react";
import { integratedService, type OrderDetail, type OrderSummary } from "../api/services/IntegratedService";


export const useReports = () => {
    const [weeks, setWeeks] = useState<OrderSummary[]>([]);
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
    const [weekDetails, setWeekDetails] = useState<OrderDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadWeeksSummary = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await integratedService.getWeeksSummary();
            setWeeks(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar las semanas");
        } finally {
            setLoading(false);
        }
    };

    const loadWeekDetails = async (weekNumber: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await integratedService.getWeekDetail(weekNumber);
            setWeekDetails(response.data);
            setSelectedWeek(weekNumber);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar los detalles");
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async (weekNumber: number, reportType: 'detailed' | 'summary' = 'detailed') => {
        try {
            setError(null);
            await integratedService.downloadReport(weekNumber, reportType);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al descargar el reporte');
            throw err;
        }
    };

    useEffect(() => {
        loadWeeksSummary();
    }, []);

    return {
        weeks,
        selectedWeek,
        weekDetails,
        loading,
        error,
        loadWeekDetails,
        downloadReport,
        refreshWeeks: loadWeeksSummary
    };
};