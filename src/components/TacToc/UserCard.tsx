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
    Input,
    NumberInput,
    NumberInputField,
} from "@chakra-ui/react";
import CopyIcon from "./assets/copy-icon.svg";

import React from "react";
import { GameInfo } from ".";

interface UserCardProps {
    loading?: boolean;
    gameInfo?: GameInfo;
    markIcon: string;
    address: string;
    balance: number;
    currentBid: string;
    showButton?: boolean;
    showInput?: boolean;
    showAdvantageTip?: boolean;
    onConfirm?: () => void;
    onInputChange?: (value: string) => void;
}

const UserCard = ({
    loading,
    gameInfo,
    markIcon,
    address,
    balance,
    currentBid,
    showButton,
    showAdvantageTip,
    onConfirm,
    showInput,
    onInputChange,
}: UserCardProps) => {
    console.log(balance, "balance");
    const { onCopy } = useClipboard(address ?? "");
    return (
        <Box sx={{ width: "237px" }}>
            <Image
                src={
                    "https://ipfs.io/ipfs/QmWQUsBUJQSB5ZaMsGXa6bWQSipdweimdjDcYq5gt9zfE8/Round0/2.png"
                }
            ></Image>
            <Box
                sx={{
                    position: "relative",
                    width: "fit-content",
                    marginTop: "30px",
                }}
            >
                <Image src={markIcon} sx={{ width: "48px" }}></Image>
                {showAdvantageTip && (
                    <Popover placement="top">
                        <PopoverTrigger>
                            <Image
                                src={AdvantageIcon}
                                sx={{
                                    position: "absolute",
                                    top: "-20px",
                                    right: "-20px",
                                    cursor: "pointer",
                                }}
                            ></Image>
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
                                    your opponent will win the grid.
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "14px",
                                        marginTop: "20px",
                                    }}
                                >
                                    Draw advantage belongs to loser of the
                                    previous grid. The first buff of each game
                                    is given randomly based on [method]
                                </Text>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                )}
            </Box>
            <Text
                sx={{ fontSize: "24px", cursor: "pointer", marginTop: "6px" }}
                onClick={onCopy}
            >
                {shortenAddress(address, 5, 4)}
                <Image
                    src={CopyIcon}
                    sx={{
                        marginLeft: "10px",
                        display: "inline-block",
                        verticalAlign: "middle",
                    }}
                ></Image>
            </Text>
            <Text sx={{ fontSize: "16px", color: "#BCBBBE" }}>Remaining</Text>
            <Box
                className="third-step fourth-step"
                sx={{
                    borderRadius: "40px",
                    background: "rgba(255, 255, 255, 0.40)",
                    fontSize: "32px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "55px",
                }}
            >
                {balance} pt
            </Box>
            <Box sx={{ marginTop: "15px" }} className="first-step second-step">
                <Text sx={{ fontSize: "24px" }}>Bid</Text>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {showInput ? (
                        <NumberInput
                            isDisabled={loading}
                            variant="unstyled"
                            max={balance}
                            value={currentBid}
                            sx={{
                                "& input": {
                                    height: "55px",
                                    background: "rgba(255, 255, 255, 0.40)",
                                    borderRadius: "18px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#fff",
                                    fontSize: "32px",
                                    width: "180px",
                                    textAlign: "center",
                                    border: "3px solid #fff",
                                    padding: 0,
                                },
                            }}
                            onChange={(e) => {
                                console.log(e, "eee");
                                onInputChange(e);
                            }}
                        >
                            <NumberInputField />
                        </NumberInput>
                    ) : (
                        <Box
                            sx={{
                                height: "55px",
                                background: "#D9D9D9",
                                borderRadius: "18px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#000000",
                                fontSize: "32px",
                                width: "180px",
                            }}
                        >
                            {currentBid}
                        </Box>
                    )}
                    <Text
                        sx={{ fontSize: "32px", textAlign: "right", flex: 1 }}
                    >
                        pt
                    </Text>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    height: "55px",
                    width: "137px",
                    margin: "16px auto 0",
                }}
            >
                {showButton && (
                    <Button
                        onClick={onConfirm}
                        disabled={loading || !(gameInfo?.gameState === 1)}
                        variant={"outline"}
                        sx={{
                            color: "#fff",
                            border: "2px solid #FDDC2D !important",
                            height: "100%",
                            borderRadius: "18px",
                            fontSize: "24px",
                            "&: disabled": {
                                border: "2px solid #fff !important",
                            },
                        }}
                    >
                        {loading ? "Confirming" : "Confirm"}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default UserCard;
