import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const TournamentHelmet = () => {
    useEffect(() => {
        const link: any =
            document.querySelector("link[rel*='icon']") ||
            document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "icon";
        link.href = "/tournament.jpg";
        document.getElementsByTagName("head")[0].appendChild(link);
    }, []);

    return (
        <Helmet>
            <title>Tournament</title>
        </Helmet>
    );
};

export default TournamentHelmet;
