import { useState } from "react";
import { useReports } from "../../hooks/useReports";
import { ErrorAlert } from "../../components/ErrorAlert/ErrorAlert";
import { WeekSelector } from "../../components/WeekSelector/WeekSelector";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { WeekDetails } from "../../components/WeekDetails/WeekDetails";
import { useNavigate } from "react-router-dom";


export const ReportsIndex = () => {
    const {
        weeks,
        selectedWeek,
        weekDetails,
        loading,
        detailsLoading,
        error,
        loadWeekDetails,
        downloadReport,
        refreshWeeks
    } = useReports();

    const [downloading, setDownloading] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleDownload = async (weekNumber: number, type: 'detailed' | 'summary') => {
        try {
            setDownloading(weekNumber);
            await downloadReport(weekNumber, type);
        } catch (err) {
            console.error('Download error:', err);
        } finally {
            setDownloading(null);
        }
    };

    const handleWeekSelect = (weekNumber: number) => {
        loadWeekDetails(weekNumber);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes de Producción</h1>
                    <p className="text-gray-600">
                        Sistema de gestión y seguimiento de órdenes de producción semanales
                    </p>
                </div>

                {error && (
                    <ErrorAlert
                        message={error}
                        onRetry={refreshWeeks}
                    />
                )}

                <div className="mb-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-50 
                        transition-colors duration-200 hover:cursor-pointer border border-gray-200"
                        aria-label="Volver atrás"
                    >
                        <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                    </button>
                </div>

                <div className="block lg:hidden space-y-6">
                    <WeekSelector
                        weeks={weeks}
                        selectedWeek={selectedWeek}
                        onWeekSelect={handleWeekSelect}
                        loading={loading}
                    />

                    {selectedWeek ? (
                        <>
                            {detailsLoading ? (
                                <div className="bg-white rounded-xl shadow-lg p-8">
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                <WeekDetails
                                    weekNumber={selectedWeek}
                                    details={weekDetails}
                                    onDownload={handleDownload}
                                />
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-4 text-xl font-medium text-gray-900">Selecciona una semana</h3>
                            <p className="mt-2 text-gray-500">
                                Elige una semana de la lista para ver los detalles.
                            </p>
                        </div>
                    )}
                </div>

                <div className="hidden lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    <div className="lg:col-span-1 xl:col-span-1">
                        <div className="sticky top-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">Semanas</h2>
                                <button
                                    onClick={refreshWeeks}
                                    className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    title="Actualizar lista"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                            <WeekSelector
                                weeks={weeks}
                                selectedWeek={selectedWeek}
                                onWeekSelect={handleWeekSelect}
                                loading={loading}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-3 xl:col-span-4">
                        {selectedWeek ? (
                            <>
                                {detailsLoading ? (
                                    <div className="bg-white rounded-xl shadow-lg p-12">
                                        <LoadingSpinner />
                                    </div>
                                ) : (
                                    <WeekDetails
                                        weekNumber={selectedWeek}
                                        details={weekDetails}
                                        onDownload={handleDownload}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-4 text-xl font-medium text-gray-900">Selecciona una semana</h3>
                                <p className="mt-2 text-gray-500">
                                    Elige una semana de la lista para ver los detalles y descargar reportes.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {downloading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
                            <div className="flex items-center gap-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Descargando reporte</p>
                                    <p className="text-sm text-gray-600">Semana {downloading}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};