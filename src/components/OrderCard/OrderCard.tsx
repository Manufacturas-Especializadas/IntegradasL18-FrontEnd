import type { OrderDetail } from "../../api/services/IntegratedService";

interface Props {
    order: OrderDetail;
    onScan?: (order: OrderDetail) => void;
    onDelete?: (orderId: number) => void;
};

export const OrderCard = ({ order, onScan, onDelete }: Props) => {
    const getProgressColor = (percentage: number) => {
        if (percentage >= 100) return "bg-green-500";
        if (percentage >= 75) return "bg-blue-500";
        if (percentage >= 50) return "bg-yellow-500";
        if (percentage >= 25) return "bg-orange-500";

        return "bg-red-500";
    };

    const getStatusColor = (completed: boolean) => {
        return completed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {order.partNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {order.type} • {order.pipeline}
                    </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.completed)
                    }`}>
                    {order.completed ? "Completado" : "En progreso"}
                </span>
            </div>

            <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>{order.scannedQuantity}/{order.amount} ({order.remaining} restantes)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${getProgressColor(order.progressPercentage)}`}
                        style={{ width: `${Math.min(order.progressPercentage, 100)}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Creado: {new Date(order.createdAt).toLocaleDateString()}</span>
                {order.completedDate && (
                    <span>Completado: {new Date(order.completedDate).toLocaleDateString()}</span>
                )}
            </div>

            <div className="flex space-x-2 mt-3">
                {!order.completed && onScan && (
                    <button
                        onClick={() => onScan(order)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                    >
                        Escanear
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(order.id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                    >
                        Eliminar
                    </button>
                )}
            </div>
        </div>
    );
};