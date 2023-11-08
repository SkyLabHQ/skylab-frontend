import { Box, Image, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import React from "react";
import Discord from "./assets/discord.svg";
import UpArrow from "./assets/up-arrow.svg";
import FaucetIcon from "./assets/faucet-icon.svg";
import AviOnMerc from "./assets/aviOnMerc.svg";
import Lock from "./assets/tower-icon.svg";
import Tw from "./assets/tw.svg";
import Task from "./assets/task-icon.svg";
import Telegram from "./assets/telegram.svg";
import { PilotInfo } from "@/hooks/usePilotInfo";
import SkylabIcon from "./assets/skylab-icon.svg";
import MyPilot from "./MyPilot";
import Airdrop from "./assets/airdrop-icon.svg";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";
import { DEAFAULT_CHAINID } from "@/utils/web3Utils";
import { faucetUrl } from "@/skyConstants";

const IconGroup = ({
    onNextRound,
}: {
    onNextRound: (step: number | string) => void;
}) => {
    const { isOpen: socialOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <Tooltip
                label={"Coming soon"}
                bg="white"
                borderRadius={"5px"}
                aria-label="A tooltip"
            >
                <Image
                    src={Lock}
                    sx={{
                        width: "2.3438vw",
                        marginRight: "1.0417vw",
                        cursor: "no-drop",
                    }}
                ></Image>
            </Tooltip>

            <Box
                sx={{
                    position: "relative",
                    marginRight: "1.0417vw",
                }}
            >
                <Image
                    src={SkylabIcon}
                    sx={{ width: "2.3438vw", cursor: "pointer" }}
                    onClick={() => {
                        if (socialOpen) {
                            onClose();
                        } else {
                            onOpen();
                        }
                    }}
                ></Image>
                <Box
                    sx={{
                        display: "flex",
                        position: "absolute",
                        flexDirection: "column",
                        right: 0,
                        height: socialOpen ? "10.4167vw" : "0",
                        transition: "all 0.2s",
                        top: "3.125vw",
                        overflow: "hidden",
                        justifyContent: "space-between",
                        "& > img": {
                            cursor: "pointer",
                        },
                    }}
                >
                    <Image
                        src={Telegram}
                        sx={{
                            width: "2.3438vw",
                            height: "2.3438vw",
                        }}
                        onClick={() => {
                            window.open("https://t.me/skylabHQ", "_blank");
                        }}
                    ></Image>
                    <Image
                        src={Discord}
                        onClick={() => {
                            window.open(
                                "https://discord.gg/qWxPz8Qr87",
                                "_blank",
                            );
                        }}
                    ></Image>
                    <Image
                        src={Tw}
                        sx={{
                            width: "2.3438vw",
                            height: "2.3438vw",
                        }}
                        onClick={() => {
                            window.open(
                                "https://twitter.com/skylabHQ",
                                "_blank",
                            );
                        }}
                    ></Image>
                    <Image
                        src={UpArrow}
                        sx={{ width: "2.3438vw" }}
                        onClick={() => {
                            onClose();
                        }}
                    ></Image>
                </Box>
            </Box>
            <Image
                src={FaucetIcon}
                sx={{
                    width: "2.3438vw",
                    marginRight: "1.0417vw",
                    cursor: "pointer",
                }}
                onClick={() => {
                    window.open(faucetUrl);
                }}
            ></Image>

            <Tooltip
                label={"Coming soon"}
                bg="white"
                borderRadius={"5px"}
                aria-label="A tooltip"
            >
                <Image
                    src={Task}
                    sx={{
                        width: "2.3438vw",
                        marginRight: "1.0417vw",
                        cursor: "no-drop",
                    }}
                ></Image>
            </Tooltip>
            <Image
                src={Airdrop}
                sx={{
                    width: "2.3438vw",
                    marginRight: "1.0417vw",
                    cursor: "pointer",
                }}
                onClick={() => {
                    onNextRound(0);
                }}
            ></Image>
        </Box>
    );
};

const Header = ({
    activePilot,
    onNextRound,
}: {
    activePilot: PilotInfo;
    onNextRound: (step: number | string) => void;
}) => {
    const { account, chainId } = useActiveWeb3React();
    const addNetworkToMetask = useAddNetworkToMetamask();

    return (
        <Box
            pos="absolute"
            left="1.1979vw"
            top="3.2407vh"
            width={"100%"}
            zIndex={20}
            sx={{
                display: "flex",
            }}
        >
            <MyPilot
                img={activePilot.img}
                showSupport={activePilot.owner !== account}
                onClick={async () => {
                    if (chainId !== Number(DEAFAULT_CHAINID)) {
                        await addNetworkToMetask(Number(DEAFAULT_CHAINID));
                        return;
                    }
                    onNextRound("currentPilot");
                }}
            ></MyPilot>

            <Box>
                <Box
                    sx={{
                        display: "flex",
                    }}
                >
                    <Text
                        sx={{
                            color: "#F2D861",
                            textShadow: "0.2083vw 0.2083vw 0vw #000",
                            fontFamily: "Orbitron",
                            fontSize: "2.5vw",
                            fontStyle: "normal",
                            fontWeight: 800,
                            lineHeight: "normal",
                            WebkitTextStroke: "0.1042vw #000",
                            marginRight: "1.5625vw",
                        }}
                    >
                        Tournament
                    </Text>
                    <IconGroup onNextRound={onNextRound}></IconGroup>
                </Box>
            </Box>
        </Box>
    );
};

export default Header;
