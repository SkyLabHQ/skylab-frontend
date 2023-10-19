import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const BttHelmet = () => {
    useEffect(() => {
        const link: any =
            document.querySelector("link[rel*='icon']") ||
            document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "icon";
        link.href = "/btt-icon.png";
        document.getElementsByTagName("head")[0].appendChild(link);
    }, []);

    return (
        <Helmet>
            <title>Bid Tac Toe</title>
        </Helmet>
    );
};

export default BttHelmet;
