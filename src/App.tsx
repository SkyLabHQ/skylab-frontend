import "swiper/css/bundle";

import { Box } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import { isMobile } from "react-device-detect";
import Header from "./components/Header";
import { MobileNotification } from "./components/MobileNotification";

const App = ({ children }: React.PropsWithChildren<unknown>): ReactElement => {
    if (isMobile) {
        return (
            <Box minH="100vh" bg="black" color="white">
                <MobileNotification />
            </Box>
        );
    }
    return (
        // TO-DO: use color mode when implementing light/dark
        <Box minH="100vh" bg="black" color="white">
            <Header />
            {children}
            <Outlet />
        </Box>
    );
};

export default App;
