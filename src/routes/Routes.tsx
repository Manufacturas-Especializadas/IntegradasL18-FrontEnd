import { Route, Routes } from "react-router-dom";
import { IntegratedIndex } from "../pages/Integrated/IntegratedIndex";

export const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<IntegratedIndex />} />
        </Routes>
    );
};