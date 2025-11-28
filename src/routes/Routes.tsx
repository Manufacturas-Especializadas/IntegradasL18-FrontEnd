import { Route, Routes } from "react-router-dom";
import { IntegratedIndex } from "../pages/Integrated/IntegratedIndex";
import { ReportsIndex } from "../pages/Reports/ReportsIndex";

export const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<IntegratedIndex />} />
            <Route path="/reportes" element={<ReportsIndex />} />
        </Routes>
    );
};