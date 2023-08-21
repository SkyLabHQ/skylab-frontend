import UserCard from "@/components/TacToc/UserCard";
import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CircleIcon from "@/components/TacToc/assets/circle.svg";
import XIcon from "@/components/TacToc/assets/x.svg";
import Board from "@/components/TacToc/Board";
import Timer from "@/components/TacToc/Timer";
import LevelInfo from "./LevelInfo";
import ToolBar from "./Toolbar";

interface TacTocProps {}
const TacTocPage = ({}: TacTocProps) => {
    return (
        <Box
            sx={{
                padding: "27px 90px",
                position: "relative",
                width: "100vw",
                height: "100vh",
            }}
        >
            <LevelInfo></LevelInfo>
            <Timer></Timer>
            <ToolBar></ToolBar>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "10vh",
                }}
            >
                <UserCard
                    showAdvantageTip
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
