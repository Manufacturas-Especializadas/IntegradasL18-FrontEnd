import type { OrderSummary } from "../../api/services/IntegratedService";

interface WeekCardProps {
    week: OrderSummary;
    onSelect: (weekNumber: number) => void;
    onDownload: (weekNumber: number, type: 'detailed' | 'summary') => void;
    isSelected: boolean;
}

export const WeekCard = ({ week, onSelect, onDownload, isSelected }: WeekCardProps) => {
    const progressColor = week.progressPercentage >= 90 ? 'bg-green-500' :
        week.progressPercentage >= 70 ? 'bg-yellow-500' :
            'bg-red-500';

    return (
        <div className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
            }`}>
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Semana {week.weekNumber}</h3>
                    <span className="text-sm text-gray-500">
                        {week.lastUpdate ? new Date(week.lastUpdate).toLocaleDateString() : 'Sin actualizar'}
                    </span>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progreso General</span>
                        <span className="font-semibold">{week.progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
                            style={{ width: `${Math.min(week.progressPercentage, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{week.totalOrders}</div>
                        <div className="text-sm text-blue-800">Total Órdenes</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{week.completedOrders}</div>
                        <div className="text-sm text-green-800">Completadas</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{week.pendingOrders}</div>
                        <div className="text-sm text-orange-800">Pendientes</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{week.totalQuantity}</div>
                        <div className="text-sm text-purple-800">Total Unidades</div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={() => onSelect(week.weekNumber)}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors hover:cursor-pointer ${isSelected
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {isSelected ? 'Seleccionado' : 'Ver Detalles'}
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onDownload(week.weekNumber, 'detailed')}
                            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                            transition-colors text-sm font-medium hover:cursor-pointer"
                        >
                            Detallado
                        </button>
                        <button
                            onClick={() => onDownload(week.weekNumber, 'summary')}
                            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                            transition-colors text-sm font-medium hover:cursor-pointer"
                        >
                            Resumen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};