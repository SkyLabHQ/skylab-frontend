import React from "react";
import { Image, Tooltip } from "@chakra-ui/react";
import PlayBackIcon from "./assets/playback.svg";
import { useNavigate } from "react-router-dom";

const BttPlayBackButton = () => {
    const navigate = useNavigate();
    return (
        <Tooltip
            label="Playback"
            bg="white"
            color="black"
            placement="right"
            sx={{
                borderRadius: "5px",
            }}
        >
            <Image
                onClick={() => {
                    navigate("/tactoe/history");
                }}
                src={PlayBackIcon}
                sx={{
                    width: "1.8229vw",
                    height: "1.8229vw",
                    cursor: "pointer",
                }}
            ></Image>
        </Tooltip>
    );
};

export default BttPlayBackButton;
