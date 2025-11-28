import { useState } from "react";
import { integratedService, type ScanRequest, type ScanResponse } from "../api/services/IntegratedService";

export const useScan = () => {
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResponse | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);

    const scanPart = async (partNumber: string, weekNumber: number, quantity: number) => {
        setScanning(true);
        setScanError(null);
        setScanResult(null);

        try {
            const request: ScanRequest = {
                partNumber: partNumber.trim(),
                weekNumber,
                quantity
            };

            const result = await integratedService.scanPart(request);
            setScanResult(result);

            if (!result.success) {
                setScanError(result.message);
            }

            return result;
        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : "Error desconocido al escanear";
            setScanError(errorMessage);
            throw err
        } finally {
            setScanning(false);
        }
    };

    const resetScan = () => {
        setScanning(false);
        setScanResult(null);
        setScanError(null);
    };

    return {
        scanPart,
        scanning,
        scanResult,
        scanError,
        resetScan
    };
};