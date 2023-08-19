import UserCard from "@/components/TacToc/UserCard";
import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CircleIcon from "@/components/TacToc/assets/circle.svg";
import XIcon from "@/components/TacToc/assets/x.svg";
import { useTour } from "@reactour/tour";

import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import Board from "@/components/TacToc/Board";
import Timer from "@/components/TacToc/Timer";
import ToolBar from "./Toolbar";

interface TacTocProps {
    onShowTutorial: (show: boolean) => void;
}
const TacTocPage = ({ onShowTutorial }: TacTocProps) => {
    return (
        <Box
            sx={{
                padding: "27px 90px",
                position: "relative",
                background: "#303030",
                width: "100vw",
                height: "100vh",
            }}
        >
            <Timer></Timer>
            <ToolBar onShowTutorial={onShowTutorial}></ToolBar>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "10vh",
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

export default TacTocPage;
