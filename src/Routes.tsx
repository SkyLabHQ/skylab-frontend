import React, { ReactElement, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import App from "./App";
import Bag from "./pages/Bag";
import Home from "./pages/Home";
import Mint from "./pages/Mint";
import Game from "./pages/Game";
import Garden from "./pages/Garden";
import Attack from "./pages/Attack";
import Tutorial from "./pages/Tutorial";
import Mercury from "./pages/Mercury";
import Keyboard from "./pages/Keyboard";
import Distance from "./pages/Distance";
import SpendResource from "./pages/SpendResource";

export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return <></>;
};

const AppRoutes = (): ReactElement => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="mint" element={<Mint />} />
                <Route path="game" element={<Game />} />
                <Route path="game/tutorial" element={<Tutorial />} />
                <Route path="game/keyboard" element={<Keyboard />} />
                <Route path="game/distance" element={<Distance />} />
                <Route path="garden" element={<Garden />} />
                <Route path="attack" element={<Attack />} />
                <Route path="mercury" element={<Mercury />} />
                <Route path="spendresource" element={<SpendResource />} />

                {/* <Route path="bag" element={<Bag />} /> */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;
