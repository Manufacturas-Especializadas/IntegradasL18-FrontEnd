interface ErrorAlertProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorAlert = ({ message, onRetry }: ErrorAlertProps) => {
    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
                <div className="shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="text-red-800 font-medium">{message}</p>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="text-red-800 hover:text-red-900 font-medium text-sm underline"
                    >
                        Reintentar
                    </button>
                )}
            </div>
        </div>
    );
};