import toast, { type ToastOptions } from "react-hot-toast";

export const useToast = () => {
    const defaultOptions: ToastOptions = {
        duration: 3000,
        position: "top-right"
    };

    const showToast = {
        success: (message: string, options?: ToastOptions) => {
            toast.success(message, { ...defaultOptions, ...options });
        },
        error: (message: string, option?: ToastOptions) => {
            toast.error(message, { ...defaultOptions, ...option });
        },
        loading: (message: string, option?: ToastOptions) => {
            toast.loading(message, { ...defaultOptions, ...option });
        },
        custom: (message: string, option?: ToastOptions) => {
            toast(message, { ...defaultOptions, ...option });
        },
        dismiss: (toasId?: string) => {
            toast.dismiss(toasId);
        }
    };

    return showToast;
};