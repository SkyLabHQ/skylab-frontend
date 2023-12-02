import {
    Box,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    useClipboard,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import TutorialIcon from "./assets/tutorial-icon.svg";
import ShareIcon from "./assets/share.svg";
import BidTacToeTutorial from "./BidTacToeTutorial";
import LinkIcon from "./assets/link.svg";
import TwIcon from "./assets/tw.svg";
import QuitModal from "./QuitModal";
import { useGameContext } from "@/pages/TacToe";
import useSkyToast from "@/hooks/useSkyToast";
import { CHAIN_NAMES } from "@/utils/web3Utils";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { shortenAddressWithout0x } from "@/utils";
import KeyBoard from "../BttComponents/KeyBoard";

const ShareLink = ({
    isOpen,
    onToggle,
    onClose,
}: {
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
}) => {
    const { chainId } = useActiveWeb3React();
    const { bidTacToeGameAddress, myInfo, istest } = useGameContext();
    const toast = useSkyToast();
    const inviteLink = useMemo(() => {
        if (!bidTacToeGameAddress) return "";

        const testflight = istest ? "&testflight=true" : "";
        return `${
            window.location.origin
        }/#/btt/live?gameAddress=${bidTacToeGameAddress}&chainId=${chainId}&burner=${shortenAddressWithout0x(
            myInfo.burner,
        )}${testflight}`;
    }, [bidTacToeGameAddress, myInfo]);

    const { onCopy } = useClipboard(inviteLink);
    const handleCopyLink = () => {
        onCopy();
        toast("Link copied");
    };
    const handleShareTw = () => {
        const testflight = istest ? "&testflight=true" : "";
        const text = `${
            window.location.host
        }/#/btt/live?gameAddress=${bidTacToeGameAddress}&chainId=${chainId}&burner=${shortenAddressWithout0x(
            myInfo.burner,
        )}${testflight}
⭕️❌⭕️❌Watch me play Bid tac toe and crush the opponent！⭕️❌⭕️❌
Bid tac toe, a fully on-chain PvP game of psychology and strategy, on ${
            CHAIN_NAMES[chainId]
        }
(Twitter)@skylabHQ`;

        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        );
    };
    return (
        <Popover
            closeOnBlur={false}
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
        >
            <PopoverTrigger>
                <Box
                    onClick={() => {
                        onToggle();
                    }}
                    sx={{
                        borderRadius: "0.5208vw",
                        height: "2.3958vw",
                        width: "2.3958vw",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #fff",
                        marginRight: "0.7292vw",
                    }}
                >
                    <Image
                        src={ShareIcon}
                        sx={{
                            width: "1.5625vw",
                            height: "1.5625vw",
                        }}
                    ></Image>
                </Box>
            </PopoverTrigger>
            <PopoverContent
                sx={{
                    backgroundColor: "#fff",
                    color: "#000",
                    width: "11vw",
                    padding: "0px",
                    "& .chakra-popover__arrow": {
                        background: "#fff !important",
                    },
                    "&:focus": {
                        outline: "none !important",
                        boxShadow: "none !important",
                    },
                }}
            >
                <PopoverArrow />
                <PopoverBody
                    sx={{
                        padding: "0.4167vw 0.625vw",
                    }}
                >
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                            onClick={handleCopyLink}
                        >
                            <Image
                                src={LinkIcon}
                                sx={{
                                    marginRight: "0.5208vw",
                                    width: "1.25vw",
                                }}
                            ></Image>
                            <Text
                                sx={{
                                    fontSize: "0.7292vw",
                                    fontWeight: "bold",
                                }}
                            >
                                Live game invite link
                            </Text>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                            onClick={handleShareTw}
                        >
                            <Image
                                src={TwIcon}
                                sx={{
                                    marginRight: "0.5208vw",
                                    width: "1.25vw",
                                }}
                            ></Image>
                            <Text
                                sx={{
                                    fontSize: "0.7292vw",
                                    fontWeight: "bold",
                                }}
                            >
                                Share Link to Twitter{" "}
                            </Text>
                        </Box>
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

const ToolBar = ({ quitType }: { quitType?: "wait" | "game" }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        isOpen: keyBoardOpen,
        onToggle: keyBoardOnToggle,
        onClose: keyBoardOnClose,
    } = useDisclosure();

    const {
        isOpen: shareOpen,
        onToggle: shareOnToggle,
        onClose: shareOnClose,
    } = useDisclosure({
        defaultIsOpen: true,
    });

    return (
        <Box
            sx={{
                position: "absolute",
                right: "3.125vw ",
                top: "1.4063vw",

                display: "flex",
                alignItems: "center",
                "& > div": {
                    cursor: "pointer",
                },
            }}
        >
            {quitType === "game" && (
                <KeyBoard
                    isOpen={keyBoardOpen}
                    onToggle={() => {
                        keyBoardOnToggle();
                        shareOnClose();
                    }}
                    onClose={keyBoardOnClose}
                ></KeyBoard>
            )}
            {quitType === "game" && (
                <ShareLink
                    isOpen={shareOpen}
                    onToggle={shareOnToggle}
                    onClose={shareOnClose}
                ></ShareLink>
            )}
            <Box
                sx={{
                    borderRadius: "0.5208vw",
                    height: "2.3958vw",
                    width: "2.3958vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                    marginRight: "0.7292vw",
                }}
            >
                <BidTacToeTutorial>
                    <Image
                        src={TutorialIcon}
                        sx={{
                            width: "1.5625vw",
                            height: "1.5625vw",
                        }}
                    ></Image>
                </BidTacToeTutorial>
            </Box>
            <Box
                onClick={onOpen}
                sx={{
                    borderRadius: "0.5208vw",
                    height: "2.3958vw",
                    width: "2.3958vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                }}
            >
                <Text sx={{ fontSize: "0.8333vw" }}>Quit</Text>
            </Box>
            {quitType && (
                <QuitModal
                    isOpen={isOpen}
                    onClose={onClose}
                    quitType={quitType}
                ></QuitModal>
            )}
        </Box>
    );
};

export default ToolBar;
