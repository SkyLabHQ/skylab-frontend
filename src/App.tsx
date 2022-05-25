import { Box } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

const App = ({ children }: React.PropsWithChildren<unknown>): ReactElement => {
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
