import React, { ReactElement, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Mint from "./pages/Mint";
import Game from "./pages/Game";
import Garden from "./pages/Garden";
import Attack from "./pages/Attack";
import Activities from "./pages/Activities";
import SpendResource from "./pages/SpendResource";
import TacToe from "./pages/TacToe";
import TacToeMode from "./pages/TacToeMode";
import BttHistory from "./pages/BttHistory";
import BttPlayBack from "./pages/BttPlayBack";
import BttLiveGame from "./pages/BttLiveGame";
import BttRules from "./pages/BttRules";
import useActiveWeb3React from "./hooks/useActiveWeb3React";
import ConnectWalletPage from "./components/ConnectWalletPage";

export const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return <></>;
};

const AppRoutes = (): ReactElement => {
    const { account } = useActiveWeb3React();
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="mint" element={<Mint />} />
                <Route path="game" element={<Game />} />
                <Route path="garden" element={<Garden />} />
                <Route path="attack" element={<Attack />} />
                <Route path="activities" element={<Activities />} />
                <Route path="spendresource" element={<SpendResource />} />
                <Route path="/btt/game" element={<TacToe />}></Route>
                <Route path="/btt/mode" element={<TacToeMode />}></Route>
                <Route path="/btt/history" element={<BttHistory />}></Route>
                <Route path="/btt/playback" element={<BttPlayBack />}></Route>
                <Route path="/btt/live" element={<BttLiveGame />}></Route>
                <Route path="/btt/rules" element={<BttRules />}></Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
