import type { OrderDetail } from "../../api/services/IntegratedService";

interface WeekDetailsProps {
    weekNumber: number;
    details: OrderDetail[];
    onDownload: (weekNumber: number, type: 'detailed' | 'summary') => void;
}

export const WeekDetails = ({ weekNumber, details, onDownload }: WeekDetailsProps) => {
    const completedOrders = details.filter(order => order.completed);
    const pendingOrders = details.filter(order => !order.completed);
    const totalProgress = details.reduce((acc, order) => acc + order.progressPercentage, 0) / details.length;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Detalles - Semana {weekNumber}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {details.length} órdenes · {completedOrders.length} completadas · {pendingOrders.length} pendientes
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => onDownload(weekNumber, 'detailed')}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors 
                            font-medium flex items-center gap-2 hover:cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Reporte detallado
                        </button>
                        <button
                            onClick={() => onDownload(weekNumber, 'summary')}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors 
                            font-medium flex items-center gap-2 hover:cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Reporte resumen
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-2xl font-bold text-blue-600">{details.length}</div>
                        <div className="text-sm text-gray-600">Total órdenes</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-green-200">
                        <div className="text-2xl font-bold text-green-600">{completedOrders.length}</div>
                        <div className="text-sm text-gray-600">Completadas</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200">
                        <div className="text-2xl font-bold text-orange-600">{pendingOrders.length}</div>
                        <div className="text-sm text-gray-600">Pendientes</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-200">
                        <div className="text-2xl font-bold text-purple-600">{totalProgress.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">Progreso promedio</div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Número de Parte
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tubería
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Progreso
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {details.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.partNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{order.type}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{order.pipeline}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${order.completed ? 'bg-green-500' : 'bg-blue-500'
                                                    }`}
                                                style={{ width: `${Math.min(order.progressPercentage, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-12">
                                            {order.progressPercentage.toFixed(1)}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.completed
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.completed ? 'COMPLETADO' : 'EN PROGRESO'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};