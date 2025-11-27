import React, { useState } from "react";
import { useProductionOrder } from "../../hooks/useProductionOrder";
import InputField from "../Inputs/InputField";

interface ProductionOrderFormProps {
    onSuccess?: (data: any) => void;
    onError?: (error: string) => void;
}

export const ProductionOrderForm = ({ onSuccess, onError }: ProductionOrderFormProps) => {
    const { uploadProductionOrder, loading, error, data } = useProductionOrder();

    const [formData, setFormData] = useState({
        weekNumber: "",
        file: null as File | null
    });

    const [formErrors, setFormErrors] = useState({
        weekNumber: "",
        file: ""
    });

    const validateForm = (): boolean => {
        const errors = {
            weekNumber: "",
            file: ""
        };

        const weekNumber = parseInt(formData.weekNumber);
        if (!formData.weekNumber.trim()) {
            errors.weekNumber = "El número de semana es requerido";
        } else if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 53) {
            errors.weekNumber = "El número de semana debe estar entre 1 y 53";
        }

        if (!formData.file) {
            errors.file = "El archivo Excel es requrido";
        } else {
            const allowedExtensions = [".xlsx", ".xls"];
            const fileExtension = formData.file.name.toLowerCase().substring(formData.file.name.lastIndexOf("."));
            if (!allowedExtensions.includes(fileExtension)) {
                errors.file = "El archivo debe ser un excel (.xlsx o .xls)";
            }
        }

        setFormErrors(errors);

        return !errors.weekNumber && !errors.file;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const result = await uploadProductionOrder({
                weekNumber: parseInt(formData.weekNumber),
                file: formData.file!
            });

            if (result.success && onSuccess) {
                onSuccess(result);
            } else if (!result.success && onError) {
                onError(result.message);
            }

            if (result.success) {
                setFormData({ weekNumber: "", file: null });
            }
        } catch (err: any) {
            if (onError) {
                onError(err instanceof Error ? err.message : "Error desconocido");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, file }));
        if (file) {
            setFormErrors(prev => ({ ...prev, file: "" }));
        }
    };

    const handleWeekNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value == "" || /^\d+$/.test(value)) {
            setFormData(prev => ({ ...prev, weekNumber: value }));
            if (value) {
                setFormErrors(prev => ({ ...prev, weekNumber: "" }));
            }
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField
                label="Número de la semana"
                type="text"
                value={formData.weekNumber}
                onChange={handleWeekNumberChange}
                error={formErrors.weekNumber}
                required
            />

            <div className="relative mb-4 font-sans">
                <input
                    type="file"
                    id="file-upload"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className={`
                            block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            border border-gray-300 rounded-md
                            hover:cursor-pointer
                            ${formErrors.file ? 'border-red-500' : ''}
                        `}
                />
                {formErrors.file && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.file}</p>
                )}
                {formData.file && (
                    <p className="mt-2 text-sm text-gray-600">
                        Archivo seleccionado: <strong>{formData.file.name}</strong>
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`
                        w-full py-3 px-4 rounded-md text-white font-semibold
                        transition-colors duration-200 hover:cursor-pointer
                        ${loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }
                    `}
            >
                {loading ? 'Procesando...' : 'Subir orden de producción'}
            </button>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {data && data.success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-700 text-sm font-semibold">
                        ✅ {data.message}
                    </p>
                    {data.recordsProcessed > 0 && (
                        <p className="text-green-600 text-sm mt-1">
                            Registros procesados: <strong>{data.recordsProcessed}</strong>
                        </p>
                    )}
                    {data.errors && data.errors.length > 0 && (
                        <div className="mt-2">
                            <p className="text-yellow-700 text-sm font-semibold">
                                Advertencias ({data.errors.length}):
                            </p>
                            <ul className="text-yellow-600 text-xs mt-1 list-disc list-inside">
                                {data.errors.slice(0, 5).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                                {data.errors.length > 5 && (
                                    <li>... y {data.errors.length - 5} más</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </form>
    );
};