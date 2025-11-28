import { useState, useRef, useEffect } from 'react';
import { useScan } from '../../hooks/useScan';

interface ScanInputProps {
    weekNumber: number;
    onScanSuccess: (result: any) => void;
    disabled?: boolean;
}

export const ScanInput = ({ weekNumber, onScanSuccess, disabled = false }: ScanInputProps) => {
    const [barcode, setBarcode] = useState('');
    const [quantity, setQuantity] = useState('');
    const [scanMode, setScanMode] = useState<'barcode' | 'quantity'>('barcode');
    const barcodeInputRef = useRef<HTMLInputElement>(null);
    const quantityInputRef = useRef<HTMLInputElement>(null);

    const { scanPart, scanning, scanResult, scanError, resetScan } = useScan();

    useEffect(() => {
        if (disabled) return;

        if (scanMode === 'barcode' && barcodeInputRef.current) {
            barcodeInputRef.current.focus();
        } else if (scanMode === 'quantity' && quantityInputRef.current) {
            quantityInputRef.current.focus();
        }
    }, [scanMode, disabled]);

    useEffect(() => {
        if (scanResult) {
            if (scanResult.success) {
                onScanSuccess(scanResult);
                setBarcode('');
                setQuantity('');
                setScanMode('barcode');
                resetScan();

                setTimeout(() => {
                    if (barcodeInputRef.current) {
                        barcodeInputRef.current.focus();
                    }
                }, 100);
            }
        }
    }, [scanResult, onScanSuccess, resetScan]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!barcode.trim() || scanning || disabled) {
            return;
        }

        const quantityValue = parseInt(quantity) || 1;

        try {
            await scanPart(barcode, weekNumber, quantityValue);
        } catch (error) {
            console.error('Error scanning:', error);
        }
    };

    const handleBarcodeKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && barcode.trim()) {
            e.preventDefault();
            setScanMode('quantity');
        }
    };

    const handleQuantityKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }

        if (e.key === 'Escape') {
            setScanMode('barcode');
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setQuantity(value);
        }
    };

    const resetForm = () => {
        setBarcode('');
        setQuantity('1');
        setScanMode('barcode');
        resetScan();

        if (barcodeInputRef.current) {
            barcodeInputRef.current.focus();
        }
    };

    return (
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Escaneo Rápido</h3>
                <div className="flex items-center space-x-2 text-sm">
                    <span className={`px-2 py-1 rounded ${scanMode === 'barcode' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                        Paso 1: Código
                    </span>
                    <span>→</span>
                    <span className={`px-2 py-1 rounded ${scanMode === 'quantity' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                        Paso 2: Cantidad
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Código de Barras
                        </label>
                        <input
                            ref={barcodeInputRef}
                            type="text"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            onKeyDown={handleBarcodeKeyDown}
                            disabled={disabled || scanning || scanMode === 'quantity'}
                            className="block w-full border border-gray-300 rounded-md 
                            shadow-md py-3 px-4 focus:outline-none text-lg"
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck="false"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cantidad
                        </label>
                        <input
                            ref={quantityInputRef}
                            type="text"
                            value={quantity}
                            onChange={handleQuantityChange}
                            onKeyDown={handleQuantityKeyDown}
                            disabled={disabled || scanning || !barcode.trim()}
                            className="block w-full border border-gray-300 rounded-md 
                            shadow-md py-3 px-4 focus:outline-none text-lg"
                        />
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button
                        type="submit"
                        disabled={!barcode.trim() || scanning || disabled}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 
                        focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex 
                        items-center justify-center hover:cursor-pointer"
                    >
                        {scanning ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Procesando...
                            </div>
                        ) : (
                            `Agregar ${quantity} unidad${quantity !== '1' ? 'es' : ''}`
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={resetForm}
                        disabled={scanning}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 focus:ring-2 
                        focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors
                        hover:cursor-pointer"
                    >
                        Limpiar
                    </button>
                </div>

                {scanError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm font-medium">❌ {scanError}</p>
                    </div>
                )}

                {scanResult?.success && (
                    <div className={`p-3 rounded-lg border ${scanResult.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                        }`}>
                        <p className={`text-sm font-medium ${scanResult.completed ? 'text-green-700' : 'text-blue-700'
                            }`}>
                            {scanResult.completed ? '✅ ' : '📦 '}
                            {scanResult.message}
                        </p>
                        {scanResult.order && (
                            <div className="mt-2 text-xs text-gray-600">
                                <span className="font-semibold">{scanResult.order.partNumber}</span>
                                {' • '}
                                <span>Total: {scanResult.scannedQuantity}/{scanResult.requiredQuantity}</span>
                                {' • '}
                                <span>{scanResult.remaining} restantes</span>
                            </div>
                        )}
                    </div>
                )}
            </form>

            {!disabled && (
                <div className="flex items-center justify-center mt-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className={`w-2 h-2 rounded-full ${scanMode === 'barcode' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                            }`}></div>
                        <span>
                            {scanMode === 'barcode'
                                ? 'Ingresa el código de barras y presiona Enter'
                                : 'Ingresa la cantidad y presiona Enter para agregar'
                            }
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};