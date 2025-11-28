const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API base URL is not defined in environment variables");
}

export const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        integrated: {
            scan: "/api/Integrated/Scan",
            productionOrderIncrease: "/api/Integrated/ProductionOrderIncrease",
            generateReport: "/api/Integrated/GenerateReport/",
            weeksSummary: "/api/Integrated/Weeks/summary",
            weekByNumber: "/api/Integrated/Week/"
        }
    }
};