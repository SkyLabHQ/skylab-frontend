import React, { ReactElement, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import App from "./App";
import Bag from "./pages/Bag";
import Home from "./pages/Home";
import Mint from "./pages/Mint";
import Game from "./pages/Game";
import Garden from "./pages/Garden";
import Attack from "./pages/Attack";

export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const AppRoutes = (): ReactElement => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="mint" element={<Mint />} />
                <Route path="game" element={<Game />} />
                <Route path="garden" element={<Garden />} />
                <Route path="attack" element={<Attack />} />
                {/* <Route path="bag" element={<Bag />} /> */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;
