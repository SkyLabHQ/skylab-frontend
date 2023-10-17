import { PilotInfo } from "@/hooks/usePilotInfo";
import { Box, BoxProps, Image } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import UnkowPilotIcon from "./assets/unknow-pilot.svg";
import PilotBorder from "./assets/pilot-border.svg";

const MyPilotStyle = styled(Box)`
    background: url(${(props) => (props.img ? PilotBorder : "")});
    width: 4.8958vw;
    height: 4.8958vw;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const MyPilot = ({
    activePilot,
    onClick,
    ...rest
}: { activePilot: PilotInfo; onClick?: () => void } & BoxProps) => {
    return (
        <MyPilotStyle {...rest} onClick={onClick} img={activePilot.img}>
            {activePilot.img ? (
                <Image
                    src={activePilot.img ? activePilot.img : UnkowPilotIcon}
                    sx={{
                        width: "80%",
                        height: "80%",
                        borderRadius: "0.8333vw",
                    }}
                ></Image>
            ) : (
                <Image
                    src={UnkowPilotIcon}
                    sx={{
                        width: "100%%",
                        height: "100%%",
                        borderRadius: "0.8333vw",
                    }}
                ></Image>
            )}
        </MyPilotStyle>
    );
};

export default MyPilot;
