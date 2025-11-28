import type { OrderSummary } from "../../api/services/IntegratedService";

interface WeekSelectorProps {
    weeks: OrderSummary[];
    selectedWeek: number | null;
    onWeekSelect: (weekNumber: number) => void;
    loading?: boolean;
}

export const WeekSelector = ({ weeks, selectedWeek, onWeekSelect, loading }: WeekSelectorProps) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Semanas de Producción</h2>
                <p className="text-gray-600 text-sm mt-1">
                    {weeks.length} semana{weeks.length !== 1 ? 's' : ''} disponible{weeks.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {weeks.map((week) => {
                    const progressColor = week.progressPercentage >= 90 ? 'bg-green-500' :
                        week.progressPercentage >= 70 ? 'bg-yellow-500' :
                            'bg-red-500';

                    const isSelected = selectedWeek === week.weekNumber;

                    return (
                        <div
                            key={week.weekNumber}
                            className={`border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                                }`}
                            onClick={() => onWeekSelect(week.weekNumber)}
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-800'
                                            }`}>
                                            Semana {week.weekNumber}
                                        </h3>
                                        {isSelected && (
                                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                                                Seleccionada
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {week.lastUpdate ? new Date(week.lastUpdate).toLocaleDateString() : 'Sin fecha'}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Progreso General</span>
                                        <span className="font-semibold">{week.progressPercentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${progressColor}`}
                                            style={{ width: `${Math.min(week.progressPercentage, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="text-center">
                                        <div className="font-bold text-gray-700">{week.totalOrders}</div>
                                        <div className="text-gray-500">Órdenes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-green-600">{week.completedOrders}</div>
                                        <div className="text-gray-500">Completadas</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-orange-600">{week.pendingOrders}</div>
                                        <div className="text-gray-500">Pendientes</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {weeks.length === 0 && (
                    <div className="p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-4 text-sm font-medium text-gray-900">No hay semanas disponibles</h3>
                        <p className="mt-1 text-sm text-gray-500">No se encontraron reportes de producción.</p>
                    </div>
                )}
            </div>
        </div>
    );
};