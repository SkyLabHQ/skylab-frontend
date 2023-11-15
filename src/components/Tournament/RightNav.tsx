import { Box, Text, Image, useDisclosure } from "@chakra-ui/react";
import ProMerTab from "@/components/Tournament/assets/proMerTab.png";
import MileageIcon from "./assets/mileage-icon.svg";
import styled from "@emotion/styled";
import RulesIcon from "./assets/rules-icon.svg";
import DownArrow from "./assets/down-arrow.svg";
import LeaderboardIcon from "./assets/leaderboard-icon.svg";
import CosmeticGray from "./assets/cosmetic-gray.svg";
import PilotIcon from "./assets/pilot-icon.svg";
import BabyMercIcon from "./assets/babymerc-icon.svg";
import { useNavigate } from "react-router-dom";
import { ImgButton, PrimaryButton } from "../Button/Index";
import { PilotInfo } from "@/hooks/usePilotInfo";
import Nav2NFT from "./Nav2NFT";
import GameLeaderboard from "./GameLeaderboard";
import { DEAFAULT_CHAINID } from "@/utils/web3Utils";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";

const Mileage = ({ value }: { value: number }) => {
    return (
        <Box
            sx={{
                position: "relative",
                height: "2.0833vw",
                borderRadius: "2.5vw",
                background: "rgba(255, 255, 255, 0.50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 2.6042vw 0 4.1667vw",
            }}
        >
            <Image
                src={MileageIcon}
                sx={{
                    width: "3.125vw",
                    height: "3.125vw",
                    position: "absolute",
                    left: "-0.5208vw",
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
            ></Image>
            <Text
                sx={{
                    color: "#4A4A4A",
                    fontSize: "0.8333vw",
                    fontWeight: 500,
                }}
            >
                Mileage
            </Text>
            <Text
                sx={{
                    color: "#2B2B2B",
                    fontSize: "0.8333vw",
                    fontWeight: 500,
                }}
            >
                {value}
            </Text>
        </Box>
    );
};

const Cosmetics = () => {
    return (
        <Box
            sx={{
                height: "5.5208vw",
                display: "flex",
                borderRadius: "1.0417vw",
                background: "rgba(177, 177, 177, 0.50)",
                padding: "0.5208vw 0 0 0.8333vw",
                marginTop: "0.9375vw",
                cursor: "not-allowed",
            }}
        >
            <Image
                src={CosmeticGray}
                sx={{
                    width: "3.3333vw",
                    height: "3.3333vw",
                    marginRight: "0.8333vw",
                }}
            ></Image>
            <Box>
                <Text
                    sx={{
                        color: "#4A4A4A",
                        fontSize: "1.0417vw",
                        fontWeight: 500,
                    }}
                >
                    ^%2&{")"}$19^#v&!_
                </Text>
                <Text
                    sx={{
                        color: "#4A4A4A",
                        fontSize: "0.7292vw",
                    }}
                >
                    coming soon...
                </Text>
            </Box>
        </Box>
    );
};

const NavButtonStyle = styled(PrimaryButton)`
    width: 11.0417vw;
    height: 2.7083vw;
    border-radius: 0.7813vw;
    border: 2px solid #F2D861;
    background: linear-gradient(95deg, rgba(143, 255, 249, 0.00) 29.09%, rgba(0, 0, 0, 0.20) 60.98%, rgba(251, 209, 97, 0.00) 89.72%);
    box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.25);
    font-size: 1.0417vw;
    display: flex;
    align-items: center;
    color:#F2D861;
    fonw-weight: 700;
    cursor: pointer;
}
`;

const RightNav = ({
    activePilot,
    onNextRound,
}: {
    activePilot: PilotInfo;
    onNextRound: (step: number | string) => void;
}) => {
    const navigate = useNavigate();
    const { chainId } = useActiveWeb3React();
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
    const addNetworkToMetask = useAddNetworkToMetamask();

    return (
        <Box
            right="1.1979vw"
            top="3.2407vh"
            pos={"absolute"}
            sx={{
                width: "22.3958vw",
            }}
        >
            <Mileage value={activePilot.xp}></Mileage>
            <Box
                sx={{
                    position: "relative",
                    marginTop: "1.8519vh",
                    height: "54.0741vh",
                }}
            >
                <GameLeaderboard show={isOpen}></GameLeaderboard>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.7292vw",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                    }}
                >
                    <Image
                        src={DownArrow}
                        sx={{
                            position: "absolute",
                            left: "50%",
                            top: "-0.7813vw",
                            transform: isOpen
                                ? "translateX(-50%)"
                                : "translateX(-50%) rotate(180deg)",
                            transition: "all 0.3s",
                            transformOrigin: "center center",
                        }}
                    ></Image>
                    <NavButtonStyle
                        onClick={() => {
                            if (isOpen) {
                                onClose();
                            } else {
                                onOpen();
                            }
                        }}
                    >
                        <Image
                            src={LeaderboardIcon}
                            sx={{
                                width: "1.8229vw",
                                marginRight: "0.1042vw",
                            }}
                        ></Image>
                        <Text>Leaderboard</Text>
                    </NavButtonStyle>
                </Box>

                <NavButtonStyle
                    onClick={() => {
                        navigate("/tactoe/rules");
                    }}
                >
                    <Image
                        src={RulesIcon}
                        sx={{
                            width: "1.8229vw",
                            marginRight: "0.1042vw",
                        }}
                    ></Image>
                    <Text>Detailed Rules</Text>
                </NavButtonStyle>
            </Box>
            <Cosmetics></Cosmetics>
            <Box
                sx={{
                    marginTop: "0.7292vw",
                    display: "flex",
                    justifyContent: "space-between",
                    position: "relative",
                }}
            >
                <Nav2NFT
                    icon={PilotIcon}
                    title={"Pilot"}
                    onClick={async () => {
                        if (chainId !== Number(DEAFAULT_CHAINID)) {
                            await addNetworkToMetask(Number(DEAFAULT_CHAINID));
                            return;
                        }
                        onNextRound("currentPilot");
                    }}
                ></Nav2NFT>
                <Nav2NFT
                    icon={BabyMercIcon}
                    title={"Mint"}
                    disabled={true}
                    value={"Baby Merc"}
                    onClick={() => {
                        onNextRound("babyMerc");
                    }}
                ></Nav2NFT>
                <ImgButton
                    sx={{
                        width: "14.5833vw",
                        left: "-16.8333vw",
                        position: "absolute",
                        bottom: "0",
                        height: "5.7292vw",
                    }}
                >
                    <Image
                        onClick={() => {
                            window.open("/#/?part=primitives", "_blank");
                        }}
                        src={ProMerTab}
                    ></Image>
                </ImgButton>
            </Box>
        </Box>
    );
};

export default RightNav;
