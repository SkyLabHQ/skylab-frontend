import { Box } from "@chakra-ui/react";
import React from "react";
import UserCard from "./UserCard";
import CircleIcon from "@/components/TacToc/assets/circle.svg";
import XIcon from "@/components/TacToc/assets/x.svg";
import Board from "@/components/TacToc/Board";
import Timer from "@/components/TacToc/Timer";

const TacTocTutorial = ({}) => {
    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
                top: 0,
                left: 0,
                background: "#303030",
            }}
        >
            <Box sx={{ padding: "27px 90px", position: "relative" }}>
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
        </Box>
    );
};

export default TacTocTutorial;
