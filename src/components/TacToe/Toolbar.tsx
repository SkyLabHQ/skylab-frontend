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
import KeyboardIcon from "./assets/keyboard.svg";
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
import UpArrowIcon from "./assets/up-arrow.svg";
import DownArrowIcon from "./assets/down-arrow.svg";

const KeyItem = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box
            sx={{
                height: "20px",
                mixWidth: "20px",
                borderRadius: "5px",
                border: "1px solid #000",
                backgroundColor: "rgba(0, 0, 0, 0.20)",
                width: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "bold",
                padding: "0 10px",
            }}
        >
            {children}
        </Box>
    );
};
const KeyBoard = () => {
    return (
        <Popover>
            <PopoverTrigger>
                <Box
                    sx={{
                        borderRadius: "10px",
                        height: "46px",
                        width: "46px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #fff",
                        marginRight: "14px",
                    }}
                >
                    <Image
                        src={KeyboardIcon}
                        sx={{
                            width: "38px",
                            height: "38px",
                        }}
                    ></Image>
                </Box>
            </PopoverTrigger>
            <PopoverContent
                sx={{
                    backgroundColor: "#fff",
                    color: "#000",
                    width: "280px",
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
                <PopoverBody>
                    <Box>
                        <Box sx={{}}>
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <KeyItem>Shift</KeyItem>
                                        <Text
                                            sx={{
                                                fontSize: "14px",
                                            }}
                                        >
                                            +
                                        </Text>
                                        <KeyItem>Enter</KeyItem>
                                    </Box>

                                    <Text
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            width: "100px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Confirm Bid
                                    </Text>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        marginTop: "15px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flex: 1,
                                        }}
                                    >
                                        <Image
                                            src={UpArrowIcon}
                                            sx={{}}
                                        ></Image>
                                    </Box>
                                    <Text
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            width: "100px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Add Bid
                                    </Text>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        marginTop: "15px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flex: 1,
                                        }}
                                    >
                                        <Image
                                            src={DownArrowIcon}
                                            sx={{}}
                                        ></Image>
                                    </Box>
                                    <Text
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            width: "100px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Reduce Bid
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        ></Box>
                    </Box>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

const ShareLink = () => {
    const { chainId } = useActiveWeb3React();
    const { bidTacToeGameAddress, myInfo } = useGameContext();

    const toast = useSkyToast();

    const inviteLink = useMemo(() => {
        if (!bidTacToeGameAddress) return "";
        return `${
            window.location.origin
        }/#/tactoe/live?gameAddress=${bidTacToeGameAddress}&burner=${shortenAddressWithout0x(
            myInfo.burner,
        )}`;
    }, [bidTacToeGameAddress, myInfo]);

    const { onCopy } = useClipboard(inviteLink);
    const handleCopyLink = () => {
        onCopy();
        toast("Link copied");
    };
    const handleShareTw = () => {
        const text = `${
            window.location.host
        }/#/tactoe/live?gameAddress=${bidTacToeGameAddress}&burner=${shortenAddressWithout0x(
            myInfo.burner,
        )}
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
        <Popover>
            <PopoverTrigger>
                <Box
                    sx={{
                        borderRadius: "10px",
                        height: "46px",
                        width: "46px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #fff",
                        marginRight: "14px",
                    }}
                >
                    <Image
                        src={ShareIcon}
                        sx={{
                            width: "30px",
                            height: "30px",
                        }}
                    ></Image>
                </Box>
            </PopoverTrigger>
            <PopoverContent
                sx={{
                    backgroundColor: "#fff",
                    color: "#000",
                    width: "200px",
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
                <PopoverBody>
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
                                    marginRight: "10px",
                                }}
                            ></Image>
                            <Text
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                            >
                                Copy Live Invite Link
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
                                    marginRight: "5px",
                                }}
                            ></Image>
                            <Text
                                sx={{
                                    fontSize: "14px",
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
            {quitType === "game" && <KeyBoard></KeyBoard>}
            {quitType === "game" && <ShareLink></ShareLink>}
            <Box
                sx={{
                    borderRadius: "10px",
                    height: "46px",
                    width: "46px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                    marginRight: "14px",
                }}
            >
                <BidTacToeTutorial>
                    <Image
                        src={TutorialIcon}
                        sx={{
                            width: "30px",
                            height: "30px",
                        }}
                    ></Image>
                </BidTacToeTutorial>
            </Box>
            <Box
                onClick={onOpen}
                sx={{
                    borderRadius: "10px",
                    height: "46px",
                    width: "46px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                }}
            >
                <Text sx={{ fontSize: "16px" }}>Quit</Text>
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
