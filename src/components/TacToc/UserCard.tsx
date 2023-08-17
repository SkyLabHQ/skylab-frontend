import { shortenAddress } from "@/utils";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import React from "react";

interface UserCardProps {
    markIcon: string;
    address: string;
    balance: string;
    currentBid: string;
    showButton?: boolean;
}

const UserCard = ({
    markIcon,
    address,
    balance,
    currentBid,
    showButton,
}: UserCardProps) => {
    console.log(address, "address");
    return (
        <Box sx={{ width: "247px" }}>
            <Image src={markIcon} sx={{ width: "48px" }}></Image>
            <Text sx={{ fontSize: "36px" }}>
                {shortenAddress(address, 5, 4)}{" "}
            </Text>
            <Box
                sx={{
                    borderRadius: "40px",
                    background: "rgba(255, 255, 255, 0.40)",
                    fontSize: "36px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {balance} pt
            </Box>
            <Box sx={{ marginTop: "6px" }} className="first-step">
                <Text sx={{ fontSize: "24px" }}>Bid</Text>
                <Box
                    sx={{
                        height: "81px",
                        background: "#D9D9D9",
                        borderRadius: "18px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#000000",
                        fontSize: "36px",
                    }}
                >
                    {currentBid}
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    height: "65px",
                    width: "157px",
                    margin: "0 auto",
                }}
            >
                {showButton && (
                    <Button
                        variant={"outline"}
                        sx={{
                            color: "#fff",
                            border: "3px solid #fff !important",
                            height: "100%",
                            borderRadius: "18px",
                            marginTop: "20px",
                        }}
                    >
                        Confirm
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default UserCard;
