import { Box } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import PlanetList from "./PlanetList";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import RightNav from "./RightNav";
import Header from "./Header";
import { usePilotInfo } from "@/hooks/usePilotInfo";

interface ChildProps {
    currentRound: number;
    onBack: () => void;
    onNextRound: (step: number | string) => void;
}

const MissionRound = ({ currentRound, onBack, onNextRound }: ChildProps) => {
    const { account } = useActiveWeb3React();
    const { activePilot } = usePilotInfo(account);

    const [active, setActive] = useState(1);
    const [showAllActivities, setShowAllActivities] = useState(false);

    return (
        <Box
            h={"100vh"}
            w={"100vw"}
            sx={{ color: "#000", fontWeight: 600 }}
            onClick={() => {}}
        >
            <Header onNextRound={onNextRound}></Header>
            <PlanetList
                active={active}
                showAllActivities={showAllActivities}
                onChangeActive={(index) => {
                    setActive(index);
                }}
                onChangeAllActivities={(flag) => {
                    setShowAllActivities(flag);
                }}
            ></PlanetList>
            <RightNav onNextRound={onNextRound}></RightNav>
        </Box>
    );
};

export default MissionRound;
