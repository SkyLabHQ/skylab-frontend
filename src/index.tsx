import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { HashRouter } from "react-router-dom";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import { Provider } from "react-redux";

import {
    getLibrary,
    getNetworkLibrary,
    NETWORK_CONTEXT_NAME,
} from "./utils/web3Utils";
import Web3ReactManager from "./components/Web3ReactManager";
import store from "./redux/store";
import { GlobalStyles } from "./constants";
import AppRoutes, { ScrollToTop } from "./Routes";
import "./i18n";
import theme from "./theme";

import { KnobVisibilityContextProvider } from "./contexts/KnobVisibilityContext";

const Web3ProviderNetwork = createWeb3ReactRoot(NETWORK_CONTEXT_NAME);

if (window && window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false;
}

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ColorModeScript />
            <ChakraProvider theme={theme}>
                <Global styles={GlobalStyles} />
                <HashRouter>
                    <Web3ReactProvider getLibrary={getLibrary}>
                        <Web3ProviderNetwork getLibrary={getNetworkLibrary}>
                            <Web3ReactManager>
                                <KnobVisibilityContextProvider>
                                    <Fragment>
                                        <ScrollToTop />
                                        <AppRoutes />
                                    </Fragment>
                                </KnobVisibilityContextProvider>
                            </Web3ReactManager>
                        </Web3ProviderNetwork>
                    </Web3ReactProvider>
                </HashRouter>
            </ChakraProvider>
        </Provider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
