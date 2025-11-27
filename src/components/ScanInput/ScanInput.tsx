import React, { useEffect, useRef, useState } from "react";
import { useScan } from "../../hooks/useScan";

interface Props {
    weekNumber: number;
    onScanSuccess: (result: any) => void;
    disabled?: boolean;
}

export const ScanInput = ({ weekNumber, onScanSuccess, disabled = false }: Props) => {
    const [barcode, setBarcode] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { scanPart, scanning, scanResult, scanError, resetScan } = useScan();

    useEffect(() => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus();
        }
    }, [disabled]);

    useEffect(() => {
        if (scanResult) {
            onScanSuccess(scanResult);
            setBarcode("");
            resetScan();

            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    }, [scanResult, onScanSuccess, resetScan]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!barcode.trim() || scanning || disabled) {
            return;
        }

        try {
            await scanPart(barcode, weekNumber);
        } catch (error) {
            console.error("Error scanning: ", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <div className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escanear código de barras..."
                            disabled={disabled || scanning}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-lg"
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck="false"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!barcode.trim() || scanning || disabled}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 
                        disabled:cursor-not-allowed transition-colors"
                    >
                        {
                            scanning ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Escaneando...
                                </div>
                            ) : (
                                "Escanear"
                            )
                        }
                    </button>
                </div>

                {
                    scanError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm font-medium">❌ {scanError}</p>
                        </div>
                    )
                }

                {
                    scanResult?.success && (
                        <div className={`p-3 rounded-lg border ${scanResult.completed
                            ? "bg-green-50 border-green-200"
                            : "bg-blue-50 border-blue-200"
                            }`}>
                            <p className={`text-sm font-medium ${scanResult.completed ? 'text-green-700' : 'text-blue-700'
                                }`}>
                                {scanResult.completed ? '✅ ' : '📦 '}
                                {scanResult.message}
                            </p>
                            {
                                scanResult.order && (
                                    <div className="mt-2 text-xs text-gray-600">
                                        <span className="font-semibold">{scanResult.order.partNumber}</span>
                                        {' • '}
                                        <span>Progreso: {scanResult.scannedQuantity}/{scanResult.requiredQuantity}</span>
                                        {' • '}
                                        <span>{scanResult.remaining} restantes</span>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </form>
            {
                !disabled && (
                    <div className="flex items-center justify-center mt-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Listo para escanear - Semana {weekNumber}</span>
                        </div>
                    </div>
                )
            }
        </div>
    );
};