import { useGameContext } from "@/pages/TacToe";
import { Box, Image, Text } from "@chakra-ui/react";
import { useTour } from "@reactour/tour";
import React from "react";
import TutorialIcon from "./assets/tutorial-icon.svg";
import useSkyToast from "@/hooks/useSkyToast";
import {
    useBidTacToeFactoryRetry,
    useBidTacToeGameRetry,
} from "@/hooks/useRetryContract";
import { handleError } from "@/utils/error";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";
import BidTacToeTutorial from "./BidTacToeTutorial";

const ToolBar = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight ? params.testflight === "true" : false;

    const toast = useSkyToast();
    const { opInfo, bidTacToeGameAddress, tokenId } = useGameContext();
    const { tacToeGameRetryWrite } = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );

    const { tacToeFactoryRetryWrite } = useBidTacToeFactoryRetry(tokenId);

    const handleSurrender = async () => {
        if (!opInfo.address) {
            try {
                await tacToeFactoryRetryWrite("withdrawFromQueue", [], 250000);
                const url = istest
                    ? `/tactoe/mode?tokenId=${tokenId}&testflight=true`
                    : `/tactoe/mode?tokenId=${tokenId}`;
                navigate(url);
            } catch (e) {
                console.log(e);
                toast(handleError(e));
            }
        } else {
            try {
                await tacToeGameRetryWrite("surrender", [], 250000);
            } catch (e) {
                console.log(e);
                toast(handleError(e));
            }
        }
    };

    return (
        <Box
            sx={{
                position: "absolute",
                right: "0",
                top: "0",
                display: "flex",
                alignItems: "center",
                "& > div": {
                    cursor: "pointer",
                },
            }}
        >
            <Box
                sx={{
                    borderRadius: "18px",
                    height: "58px",
                    width: "58px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                    marginRight: "14px",
                }}
            >
                <BidTacToeTutorial icon={TutorialIcon}></BidTacToeTutorial>
            </Box>
            <Box
                onClick={handleSurrender}
                sx={{
                    borderRadius: "18px",
                    height: "58px",
                    width: "58px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                }}
            >
                <Text sx={{ fontSize: "28px" }}>Quit</Text>
            </Box>
        </Box>
    );
};

export default ToolBar;
