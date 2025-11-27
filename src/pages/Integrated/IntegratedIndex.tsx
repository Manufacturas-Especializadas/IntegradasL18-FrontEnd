import { useEffect, useState } from "react";
import { Modal } from "../../components/Modal/Modal";
import { ProductionOrderForm } from "../../components/ProductionOrderForm/ProductionOrderForm";
import { useWeeksSummary } from "../../hooks/useWeeksSummary";
import { useWeekDetails } from "../../hooks/useWeekDetails";
import { Tabs } from "../../components/Tabs/Tabs";
import { OrderCard } from "../../components/OrderCard/OrderCard";
import { ScanInput } from "../../components/ScanInput/ScanInput";

export const IntegratedIndex = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

    const { weeks, loading: weeksLoading, error: weeksError, refetch: refecthWeeks } = useWeeksSummary();
    const { orders, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useWeekDetails(selectedWeek);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        refecthWeeks();
        if (selectedWeek) {
            refetchOrders();
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleWeekSelect = (weekNumber: number) => {
        setSelectedWeek(weekNumber);
    };

    const handleScanSuccess = (scanResult: any) => {
        console.log('Escaneo exitoso:', scanResult);
        refetchOrders();

        if (scanResult.completed) {
        }
    };

    useEffect(() => {
        if (weeks.length > 0 && !selectedWeek) {
            setSelectedWeek(weeks[0].weekNumber);
        }
    }, [weeks, selectedWeek]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 uppercase">
                        Integradas L-18
                    </h1>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Órdenes de producción
                            </h2>
                            <p className="text-gray-600">
                                Gestiona las órdens de producción por semana
                            </p>
                        </div>
                        <button
                            onClick={handleOpenModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors 
                                duration-200 shadow-md flex items-center hover:shadow-lg transform hover:-translate-y-0.5 hover:cursor-pointer"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva orden
                        </button>
                    </div>

                    {
                        weeksLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Cargando semanas...</p>
                            </div>
                        ) : weeksError ? (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <p className="text-red-700">Error: {weeksError}</p>
                            </div>
                        ) : (
                            <Tabs
                                weeks={weeks}
                                selectedWeek={selectedWeek}
                                onWeekSelect={handleWeekSelect}
                            />
                        )
                    }

                    {selectedWeek && (
                        <div className="mt-6">
                            <ScanInput
                                weekNumber={selectedWeek}
                                onScanSuccess={handleScanSuccess}
                                disabled={ordersLoading}
                            />

                            {ordersLoading ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-gray-600">Cargando órdenes...</p>
                                </div>
                            ) : ordersError ? (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <p className="text-red-700">Error: {ordersError}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {orders.map((order) => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="SUBIR ORDEN DE PRODUCCION"
            >
                <ProductionOrderForm />
            </Modal>
        </div>
    );
};