import React, { ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Bag from "./pages/Bag";
import Home from "./pages/Home";
import Mint from "./pages/Mint";

const AppRoutes = (): ReactElement => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="mint" element={<Mint />} />
                    <Route path="bag" element={<Bag />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
