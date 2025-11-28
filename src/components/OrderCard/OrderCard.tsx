import { useState, useEffect } from 'react';
import type { OrderDetail } from '../../api/services/IntegratedService';

interface OrderCardProps {
    order: OrderDetail;
    onDelete?: (orderId: number) => void;
    isRecent?: boolean;
    position?: number;
}

export const OrderCard = ({ order, onDelete, isRecent = false, position }: OrderCardProps) => {
    const [isHighlighted, setIsHighlighted] = useState(false);

    // Efecto para resaltar la card cuando es reciente
    useEffect(() => {
        if (isRecent) {
            setIsHighlighted(true);
            const timer = setTimeout(() => {
                setIsHighlighted(false);
            }, 2000); // Remover el resaltado después de 2 segundos

            return () => clearTimeout(timer);
        }
    }, [isRecent]);

    const getProgressColor = (percentage: number) => {
        if (percentage >= 100) return 'bg-green-500';
        if (percentage >= 75) return 'bg-blue-500';
        if (percentage >= 50) return 'bg-yellow-500';
        if (percentage >= 25) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getStatusColor = (completed: boolean) => {
        return completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className={`
            bg-white rounded-lg shadow-md p-4 border-2 border-transparent transition-all duration-300 hover:shadow-lg
            ${isHighlighted
                ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }
            ${position === 1 ? 'ring-2 ring-blue-400' : ''}
        `}>
            {/* Indicador de posición reciente */}
            {isHighlighted && (
                <div className="absolute -top-2 -right-2">
                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        ¡NUEVO ESCANEO!
                    </span>
                </div>
            )}

            {/* Indicador de posición en el grid */}
            {position && position <= 3 && (
                <div className="absolute -top-2 -left-2">
                    <span className={`
                        text-white text-xs font-bold px-2 py-1 rounded-full
                        ${position === 1 ? 'bg-green-500' :
                            position === 2 ? 'bg-blue-500' :
                                'bg-purple-500'}
                    `}>
                        #{position}
                    </span>
                </div>
            )}

            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{order.partNumber}</h3>
                    <p className="text-sm text-gray-600">{order.type} • {order.pipeline}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.completed)}`}>
                    {order.completed ? 'Completado' : 'En Progreso'}
                </span>
            </div>

            <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>{order.scannedQuantity}/{order.amount} ({order.remaining} restantes)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(order.progressPercentage)}`}
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