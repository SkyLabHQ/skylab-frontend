import UserCard from "@/components/TacToc/UserCard";
import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import CircleIcon from "@/components/TacToc/assets/circle.svg";
import XIcon from "@/components/TacToc/assets/x.svg";

import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import Board from "@/components/TacToc/Board";
import Timer from "@/components/TacToc/Timer";

const TacToc = () => {
    const { setIsKnobVisible } = useKnobVisibility();
    const { account } = useActiveWeb3React();

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);
    return (
        <Box sx={{ padding: "27px 90px" }}>
            <Timer></Timer>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <UserCard
                    showButton
                    markIcon={CircleIcon}
                    address={"0x2f49Be6976324000da4Bd091B0217E217b81A93d"}
                    balance={"4556"}
                    currentBid={"15"}
                ></UserCard>
                <Board></Board>
                <UserCard
                    showButton={false}
                    markIcon={XIcon}
                    address={"0x2f49Be6976324000da4Bd091B0217E217b81A93d"}
                    balance={"4556"}
                    currentBid={"15"}
                ></UserCard>
            </Box>
        </Box>
    );
};

export default TacToc;
