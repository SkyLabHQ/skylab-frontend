import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const HomeHelmet = () => {
    useEffect(() => {
        const link: any =
            document.querySelector("link[rel*='icon']") ||
            document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "icon";
        link.href = "/favicon.svg";
        document.getElementsByTagName("head")[0].appendChild(link);
    }, []);

    return (
        <Helmet>
            <title>Skylab</title>
        </Helmet>
    );
};

export default HomeHelmet;
