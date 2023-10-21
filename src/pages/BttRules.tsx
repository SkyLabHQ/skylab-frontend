import { Box } from "@chakra-ui/react";
import React from "react";
import BttRulesPage from "@/components/BttRules";
import MercuryBg from "../components/Tournament/assets/mercury-bg.png";
import BlueBg from "../components/Tournament/assets/blue-bg.png";
import TournamentHelmet from "@/components/Helmet/TournamentHelmet";
const BttRules = () => {
    return (
        <>
            <TournamentHelmet></TournamentHelmet>
            <Box
                w="100vw"
                h="100vh"
                pos="relative"
                backgroundImage={`url(${MercuryBg}), url(${BlueBg})`}
                backgroundPosition="center center, 0 0"
                backgroundSize={"cover, cover"}
                backgroundRepeat={"no-repeat, no-repeat"}
                overflow="hidden"
                fontFamily="Orbitron"
                sx={{}}
            >
                <BttRulesPage></BttRulesPage>
            </Box>
        </>
    );
};

export default BttRules;
