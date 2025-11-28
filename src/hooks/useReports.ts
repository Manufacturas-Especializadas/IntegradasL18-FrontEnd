import { useState, useEffect } from 'react';
import { integratedService, type OrderDetail, type OrderSummary } from '../api/services/IntegratedService';


export const useReports = () => {
    const [weeks, setWeeks] = useState<OrderSummary[]>([]);
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
    const [weekDetails, setWeekDetails] = useState<OrderDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadWeeksSummary = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await integratedService.getWeeksSummary();
            const sortedWeeks = response.data.sort((a, b) => b.weekNumber - a.weekNumber);
            setWeeks(sortedWeeks);

            if (sortedWeeks.length > 0 && !selectedWeek) {
                await loadWeekDetails(sortedWeeks[0].weekNumber);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar las semanas');
        } finally {
            setLoading(false);
        }
    };

    const loadWeekDetails = async (weekNumber: number) => {
        try {
            setDetailsLoading(true);
            setError(null);
            const response = await integratedService.getWeekDetail(weekNumber);
            setWeekDetails(response.data);
            setSelectedWeek(weekNumber);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los detalles');
        } finally {
            setDetailsLoading(false);
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
        detailsLoading,
        error,
        loadWeekDetails,
        downloadReport,
        refreshWeeks: loadWeeksSummary
    };
};