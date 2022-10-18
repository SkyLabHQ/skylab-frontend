import React, { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Bag from "./pages/Bag";
import Home from "./pages/Home";
import Mint from "./pages/Mint";
import Game from "./pages/Game";
import Attack from "./pages/Attack";

const AppRoutes = (): ReactElement => {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="mint" element={<Mint />} />
                <Route path="game" element={<Game />} />
                <Route path="attack" element={<Attack />} />
                {/* <Route path="bag" element={<Bag />} /> */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;
