import React, { useEffect, useMemo } from "react";
import { shortenAddress } from "@/utils";
import AdvantageIcon from "./assets/advantage-icon.svg";
import {
    Box,
    Button,
    Image,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    useClipboard,
    NumberInput,
    NumberInputField,
} from "@chakra-ui/react";
import CopyIcon from "./assets/copy-icon.svg";
import GoldIcon from "./assets/gold.svg";
import AddIcon from "./assets/add-icon.svg";
import SubIcon from "./assets/sub-icon.svg";
import DotIcon from "./assets/dot3.svg";
import UnlockIcon from "./assets/unlock.svg";
import LockIcon from "./assets/lock.svg";
import { GameState, MessageStatus } from ".";
import Plane1 from "@/assets/aviations/a1.png";
import { EMOTES, MERCS, MESSAGES } from "./Chat";
import useSkyToast from "@/hooks/useSkyToast";

export const Message = ({
    message = 0,
    emote = 0,
    messageLoading = MessageStatus.Unknown,
    emoteLoading = MessageStatus.Unknown,
    emoteIndex = 0,
    messageIndex = 0,
    status = "my",
}: {
    message: number;
    emote: number;
    messageLoading?: MessageStatus;
    emoteLoading?: MessageStatus;
    emoteIndex?: number;
    messageIndex?: number;
    status?: "my" | "op";
}) => {
    const [whiteTriangle, transparentTriangle] = useMemo(() => {
        if (status === "my") {
            return [
                { borderRightColor: "#fff", top: "10px", left: "-20px" },
                {
                    borderRightColor: "#303030",
                    top: "10px",
                    left: "-18px",
                },
            ];
        } else {
            return [
                { borderLeftColor: "#fff", top: "10px", right: "-20px" },
                {
                    borderLeftColor: "#303030",
                    top: "10px",
                    right: "-18px",
                },
            ];
        }
    }, [status]);

    const sendText = useMemo(() => {
        if (
            messageLoading === MessageStatus.Sending ||
            emoteLoading === MessageStatus.Sending
        ) {
            return "Sending";
        }

        if (
            messageLoading === MessageStatus.Sent ||
            emoteLoading === MessageStatus.Sent
        ) {
            return "Sent";
        }

        return "";
    }, [messageLoading, emoteLoading]);

    const showMessage = useMemo(() => {
        if (messageLoading !== MessageStatus.Unknown) {
            return MESSAGES[messageIndex - 1];
        } else if (message > 0) {
            return MESSAGES[message - 1];
        }
        return "";
    }, [message, messageLoading, messageIndex]);

    const showMercs = useMemo(() => {
        if (emoteLoading !== MessageStatus.Unknown) {
            return MERCS[emoteIndex - 1];
        } else if (emote > MERCS.length && emote === 0) {
            return "";
        } else if (emote > 0) {
            return MERCS[emote - 1];
        }

        return "";
    }, [emote, emoteLoading, emoteIndex]);

    const showEmote = useMemo(() => {
        if (emoteLoading !== MessageStatus.Unknown) {
            return EMOTES[emoteIndex - MERCS.length - 1];
        } else if (emote <= MERCS.length) {
            return "";
        } else if (emote > 0) {
            return EMOTES[emote - MERCS.length - 1];
        }

        return "";
    }, [emote, emoteLoading, emoteIndex]);

    return (
        <Box
            sx={{
                position: "relative",
                display:
                    emote === 0 &&
                    message === 0 &&
                    emoteLoading === MessageStatus.Unknown &&
                    messageLoading == MessageStatus.Unknown &&
                    "none",
            }}
        >
            <Box
                sx={{
                    border: "2px solid #fff",
                    height: "50px",
                    lineHeight: "50px",
                    borderRadius: "10px",
                    position: "relative",
                    padding: "0 10px",
                    display: "flex",
                    alignItems: "center",
                    minWidth: "100px",
                }}
            >
                <Box
                    sx={{
                        width: "0",
                        height: "0",
                        border: "10px solid transparent",
                        position: "absolute",
                        ...whiteTriangle,
                    }}
                ></Box>
                <Box
                    sx={{
                        width: "0",
                        height: "0",
                        border: "10px solid transparent",
                        position: "absolute",
                        ...transparentTriangle,
                    }}
                ></Box>

                {showMessage && (
                    <Text
                        sx={{
                            whiteSpace: "nowrap",
                            marginRight: "5px",
                        }}
                    >
                        {showMessage}
                    </Text>
                )}
                {showMercs && (
                    <Box
                        sx={{
                            height: "32px",
                            width: "32px",
                        }}
                    >
                        <Image src={showMercs}></Image>
                    </Box>
                )}

                {showEmote && (
                    <Text
                        sx={{
                            whiteSpace: "nowrap",
                        }}
                    >
                        {showEmote}
                    </Text>
                )}
            </Box>
            {sendText && (
                <Text
                    sx={{
                        color: "#bcbbbe",
                        fontSize: "16px",
                        position: "absolute",
                        bottom: "-25px",
                        left: "0",
                        width: "100%",
                    }}
                >
                    {sendText}
                </Text>
            )}
        </Box>
    );
};

const MyBid = ({
    showTutorialStep,
    loading,
    balance,
    bidAmount,
    gameState,
    onInputChange,
    onConfirm,
}: {
    showTutorialStep?: boolean;
    loading: boolean;
    balance: number;
    bidAmount: number;
    gameState: number;
    onInputChange?: (value: number) => void;
    onConfirm: () => void;
}) => {
    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            event.shiftKey && key === "Enter";
            switch (key) {
                case "ArrowUp":
                    onInputChange?.(bidAmount + 1);
                    break;

                case "ArrowDown": {
                    onInputChange?.(bidAmount - 1);
                    break;
                }
            }

            if (event.shiftKey && key === "Enter") {
                onConfirm();
            }
        };
        document.addEventListener("keydown", keyboardListener);
        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, [onConfirm, bidAmount]);

    return (
        <Box
            className={
                showTutorialStep
                    ? "btt-first-step btt-second-step btt-third-step"
                    : ""
            }
        >
            <Box
                sx={{
                    marginTop: "15px",
                    display: "flex",
                }}
            >
                <Box>
                    <Text sx={{ fontSize: "24px" }}>Bid</Text>
                    <Box
                        sx={{
                            position: "relative",
                        }}
                    >
                        <Image
                            src={SubIcon}
                            sx={{
                                position: "absolute",
                                left: "-30px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                if (bidAmount - 1 < 0) return;

                                onInputChange(bidAmount - 1);
                            }}
                        ></Image>
                        <Image
                            src={AddIcon}
                            onClick={() => {
                                if (bidAmount + 1 > balance) return;

                                onInputChange(bidAmount + 1);
                            }}
                            sx={{
                                position: "absolute",
                                right: "-30px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                            }}
                        ></Image>
                        <NumberInput
                            isDisabled={loading}
                            variant="unstyled"
                            max={balance}
                            min={0}
                            value={bidAmount}
                            sx={{
                                "& input": {
                                    height: "44px",
                                    background: "rgba(255, 255, 255, 0.40)",
                                    borderRadius: "18px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#fff",
                                    fontSize: "32px",
                                    width: "120px",
                                    textAlign: "center",
                                    border: "3px solid #fff",
                                    padding: 0,
                                },
                            }}
                            onChange={(e) => {
                                if (Number(e) > balance) {
                                    onInputChange(balance);
                                    return;
                                }
                                onInputChange(Number(e));
                            }}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </Box>
                </Box>

                <Box sx={{ marginLeft: "30px", flex: 1 }}>
                    <Text
                        sx={{
                            fontSize: "16px",
                            textAlign: "right",
                            flex: 1,
                            color: "#bcbbbe",
                            lineHeight: "36px",
                        }}
                    >
                        Remaining
                    </Text>
                    <Text
                        sx={{
                            fontSize: "32px",
                            textAlign: "right",
                            flex: 1,
                            color: "#bcbbbe",
                        }}
                    >
                        / {balance}
                    </Text>
                </Box>
            </Box>
            <>
                {loading ? (
                    <Button
                        disabled={true}
                        variant={"outline"}
                        sx={{
                            color: "#BCBBBE",
                            borderRadius: "18px",
                            fontSize: "16px",
                            height: "44px",
                            width: "120px",
                            marginTop: "10px",
                            "&:disabled": {
                                border: "2px solid #fff !important",
                                opacity: 1,
                                background: "transparent",
                            },
                            "&:hover[disabled]": {
                                background: "transparent",
                            },
                        }}
                    >
                        Confirming
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            onConfirm();
                        }}
                        disabled={
                            gameState === GameState.Commited ||
                            gameState === GameState.Revealed
                        }
                        variant={"outline"}
                        sx={{
                            color: "#fddc2d",
                            border: "2px solid #fddc2d !important",
                            borderRadius: "18px",
                            background:
                                gameState === GameState.Commited ||
                                gameState === GameState.Revealed
                                    ? "linear-gradient(180deg, rgba(253, 220, 45, 0.50) 0%, rgba(253, 220, 45, 0.00) 100%)"
                                    : "transparent",
                            fontSize: "16px",
                            height: "44px",
                            width: "120px",
                            marginTop: "10px",
                            "&:disabled": {
                                border: "2px solid #fddc2d !important",
                                opacity: 1,
                            },
                            "&:hover[disabled]": {
                                background:
                                    gameState === GameState.Commited ||
                                    gameState === GameState.Revealed
                                        ? "linear-gradient(180deg, rgba(253, 220, 45, 0.50) 0%, rgba(253, 220, 45, 0.00) 100%)"
                                        : "transparent",
                            },
                        }}
                    >
                        {gameState === GameState.Commited ||
                        gameState === GameState.Revealed
                            ? "Confirmed"
                            : "Confirm"}
                    </Button>
                )}
            </>
        </Box>
    );
};

const OpBid = ({
    myGameState,
    opGameState,
    balance,
}: {
    myGameState: number;
    opGameState: number;
    balance: number;
}) => {
    return (
        <Box>
            <Box sx={{ marginTop: "15px", display: "flex" }}>
                <Box>
                    <Text sx={{ fontSize: "24px" }}>Bid</Text>
                    <Box
                        sx={{
                            height: "44px",
                            background: "#4a4a4a",
                            borderRadius: "18px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#000000",
                            fontSize: "32px",
                            width: "120px",
                        }}
                    >
                        {myGameState === GameState.WaitingForBid &&
                            opGameState === GameState.Commited && (
                                <Image src={LockIcon}></Image>
                            )}
                        {opGameState === GameState.WaitingForBid && (
                            <Image src={DotIcon}></Image>
                        )}

                        {myGameState === GameState.Commited &&
                            opGameState === GameState.Commited && (
                                <Image src={DotIcon}></Image>
                            )}

                        {myGameState === GameState.Revealed &&
                            opGameState === GameState.Commited && (
                                <Image src={DotIcon}></Image>
                            )}
                        {myGameState === GameState.Commited &&
                            opGameState === GameState.Revealed && (
                                <Image src={UnlockIcon}></Image>
                            )}
                    </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Text
                        sx={{
                            fontSize: "16px",
                            textAlign: "right",
                            flex: 1,
                            color: "#bcbbbe",
                            lineHeight: "36px",
                        }}
                    >
                        Remaining
                    </Text>
                    <Text
                        sx={{
                            fontSize: "32px",
                            textAlign: "right",
                            margin: "0px 0 0 10px",
                            flex: 1,
                            color: "#bcbbbe",
                        }}
                    >
                        / {balance}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};

interface UserCardProps {
    showTutorialStep?: boolean;
    loading?: boolean;
    messageLoading?: MessageStatus;
    emoteLoading?: MessageStatus;
    markIcon: string;
    address: string;
    balance: number;
    bidAmount: number;
    messageIndex?: number;
    emoteIndex?: number;
    showAdvantageTip?: boolean;
    level?: number;
    emote?: number;
    message?: number;
    myGameState?: number;
    opGameState?: number;
    status?: "my" | "op";
    planeUrl?: string;
    onConfirm?: () => void;
    onInputChange?: (value: number) => void;
}

export const AdvantageTip = ({
    direction,
    markIcon,
    showAdvantageTip,
}: {
    direction: "right" | "left";
    markIcon: string;
    showAdvantageTip: boolean;
}) => {
    return (
        <Box
            sx={{
                width: "fit-content",
                marginTop: "30px",
            }}
        >
            <Popover placement={direction}>
                <Image src={markIcon} sx={{ width: "36px" }}></Image>
                <PopoverTrigger>
                    <Box
                        sx={{
                            position: "relative",
                        }}
                    >
                        {showAdvantageTip && (
                            <Image
                                src={AdvantageIcon}
                                sx={{
                                    position: "absolute",
                                    top: "-55px",
                                    right:
                                        direction === "right"
                                            ? "-25px"
                                            : "30px",
                                    cursor: "pointer",
                                }}
                            ></Image>
                        )}
                    </Box>
                </PopoverTrigger>
                <PopoverContent
                    sx={{
                        background: "#D9D9D9",
                        borderRadius: "10px",
                        border: "none",
                        color: "#000",
                        textAlign: "center",
                        "&:focus": {
                            outline: "none !important",
                            boxShadow: "none !important",
                        },
                    }}
                >
                    <PopoverBody
                        sx={{
                            textAlign: "left",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: "16px",
                            }}
                        >
                            <span style={{ fontWeight: 600 }}>
                                [Draw Advantage]
                            </span>
                            If your next bid equals to your opponent,
                            {direction === "left"
                                ? "your opponent will win the grid"
                                : "your will win the grid."}
                        </Text>
                        <Text
                            style={{
                                fontSize: "14px",
                                marginTop: "20px",
                            }}
                        >
                            Draw advantage belongs to loser of the previous
                            grid. The first draw advantage of each game is given
                            randomly.
                        </Text>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    );
};

export const MyUserCard = ({
    showTutorialStep,
    level,
    loading,
    markIcon,
    address,
    balance,
    bidAmount,
    showAdvantageTip,
    status = "my",
    myGameState,
    emote = 0,
    message = 0,
    messageIndex = 0,
    emoteIndex = 0,
    planeUrl = Plane1,
    messageLoading,
    emoteLoading,
    onConfirm,
    onInputChange,
}: UserCardProps) => {
    const { onCopy } = useClipboard(address ?? "");
    const toast = useSkyToast();
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                }}
            >
                <Image
                    sx={{
                        width: "134px",
                        height: "134px",
                    }}
                    src={planeUrl}
                ></Image>
                <Text
                    sx={{
                        fontSize: "16px",
                        fontWeight: "bold",
                    }}
                >
                    Level {level}
                </Text>
                <Box
                    sx={{
                        position: "absolute",
                        left: "134px",
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    <Message
                        message={message}
                        emote={emote}
                        messageLoading={messageLoading}
                        emoteLoading={emoteLoading}
                        status={status}
                        emoteIndex={emoteIndex}
                        messageIndex={messageIndex}
                    ></Message>
                </Box>
            </Box>
            <AdvantageTip
                direction="right"
                markIcon={markIcon}
                showAdvantageTip={showAdvantageTip}
            ></AdvantageTip>
            <Text
                sx={{
                    fontSize: "16px",
                    cursor: "pointer",
                    marginTop: "6px",
                }}
                onClick={() => {
                    onCopy();
                    toast("Copy address success");
                }}
            >
                {shortenAddress(address, 5, 4)}
                <Image
                    src={CopyIcon}
                    sx={{
                        width: "16px",
                        marginLeft: "10px",
                        display: "inline-block",
                        verticalAlign: "middle",
                    }}
                ></Image>
            </Text>
            <Box
                sx={{
                    background: "#787878",
                    borderRadius: "20px",
                    height: "242px",
                    padding: "7px 16px 12px 38px",
                    marginTop: "15px",
                }}
            >
                <Box
                    sx={{
                        width: "186px",
                        height: "48px",
                        background: "#bcbbbe",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "26px",
                        paddingLeft: "14px",
                    }}
                >
                    <Image src={GoldIcon} sx={{ width: "54px" }}></Image>
                    <Text
                        sx={{
                            textShadow: "1px 1px 0px #303030",
                            fontSize: "24px",
                            color: "#fddc2d",
                            marginLeft: "13px",
                        }}
                    >
                        GOLD
                    </Text>
                </Box>
                <MyBid
                    showTutorialStep={showTutorialStep}
                    loading={loading}
                    balance={balance}
                    bidAmount={bidAmount}
                    onInputChange={onInputChange}
                    onConfirm={onConfirm}
                    gameState={myGameState}
                ></MyBid>
            </Box>
        </Box>
    );
};

export const OpUserCard = ({
    level,
    markIcon,
    address,
    balance,
    opGameState,
    showAdvantageTip,
    status = "my",
    myGameState,
    emote = 0,
    message = 0,
    planeUrl = Plane1,
}: UserCardProps) => {
    const { onCopy } = useClipboard(address ?? "");
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                }}
            >
                <Image
                    sx={{
                        width: "134px",
                        height: "134px",
                        transform: "scaleX(-1)",
                    }}
                    src={planeUrl}
                ></Image>
                <Text
                    sx={{
                        fontSize: "16px",
                        textAlign: "right",
                        fontWeight: "bold",
                    }}
                >
                    Level {level}
                </Text>
                <Box
                    sx={{
                        position: "absolute",
                        right: "134px",
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    <Message
                        message={message}
                        emote={emote}
                        status={status}
                    ></Message>
                </Box>
            </Box>
            <AdvantageTip
                direction="left"
                markIcon={markIcon}
                showAdvantageTip={showAdvantageTip}
            ></AdvantageTip>
            <Text
                sx={{
                    fontSize: "16px",
                    cursor: "pointer",
                    marginTop: "6px",
                }}
                onClick={onCopy}
            >
                {shortenAddress(address, 5, 4)}
                <Image
                    src={CopyIcon}
                    sx={{
                        width: "16px",
                        marginLeft: "10px",
                        display: "inline-block",
                        verticalAlign: "middle",
                    }}
                ></Image>
            </Text>
            <Box
                sx={{
                    background: "#787878",
                    borderRadius: "20px",
                    height: "242px",
                    padding: "7px 16px 12px 16px",
                    marginTop: "15px",
                }}
            >
                <Box
                    sx={{
                        width: "186px",
                        height: "48px",
                        background: "#bcbbbe",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "26px",
                        paddingLeft: "14px",
                    }}
                >
                    <Image src={GoldIcon} sx={{ width: "54px" }}></Image>
                    <Text
                        sx={{
                            textShadow: "1px 1px 0px #303030",
                            fontSize: "24px",
                            color: "#fddc2d",
                            marginLeft: "13px",
                        }}
                    >
                        GOLD
                    </Text>
                </Box>
                <OpBid
                    myGameState={myGameState}
                    opGameState={opGameState}
                    balance={balance}
                ></OpBid>
            </Box>
        </Box>
    );
};
