import {
    Box,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Portal,
    Text,
    Tooltip,
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

const ToolBar = ({ quitType }: { quitType?: "wait" | "game" }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { chainId } = useActiveWeb3React();
    const { bidTacToeGameAddress, myInfo } = useGameContext();
    const toast = useSkyToast();

    const inviteLink = useMemo(() => {
        if (!bidTacToeGameAddress) return "";
        return `${window.location.origin}/#/live?gameAddress=${bidTacToeGameAddress}`;
    }, [bidTacToeGameAddress]);

    const { onCopy } = useClipboard(inviteLink);
    const handleCopyLink = () => {
        onCopy();
        toast("Link copied");
    };

    const handleShareTw = () => {
        const text = `${
            window.location.origin
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
