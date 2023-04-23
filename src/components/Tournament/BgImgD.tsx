import TournamentLeft from "../../assets/tournament-left.svg";
import TournamentRight from "../../assets/tournament-right.svg";
import TournamentTop from "../../assets/tournament-top.svg";
import TournamentBottom from "../../assets/tournament-bottom.svg";
import { motion } from "framer-motion";
import React from "react";

const BgImgD = ({ show = false }: { show?: boolean }) => {
    return (
        <>
            <motion.img
                src={TournamentLeft}
                style={{
                    position: "absolute",
                    top: "0vh",
                    left: "0",
                }}
                initial={{ width: show ? 0 : "18vw" }}
                animate={{ width: "18vw" }}
                transition={{ duration: 1 }}
            />
            <motion.img
                src={TournamentRight}
                style={{
                    position: "absolute",
                    top: "2vh",
                    right: "0",
                }}
                initial={{ width: show ? 0 : "20vw" }}
                animate={{ width: "20vw" }}
                transition={{ duration: 1 }}
            />

            <motion.img
                src={TournamentTop}
                style={{
                    position: "absolute",
                    left: "8vw",
                    top: "1vh",
                }}
                initial={{ width: show ? 0 : "8vw" }}
                animate={{ width: "8vw" }}
                transition={{ duration: 1 }}
            />

            <motion.img
                src={TournamentBottom}
                style={{
                    position: "absolute",
                    right: "3vw",
                    bottom: "0vh",
                }}
                initial={{ width: show ? 0 : "7vw" }}
                animate={{ width: "7vw" }}
                transition={{ duration: 1 }}
            />
        </>
    );
};

export default BgImgD;
