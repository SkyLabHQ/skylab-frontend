import React, { FC, useEffect, useReducer, useRef } from "react";
import { Box, Img, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

import GameLoadingBackground from "../assets/game-loading-background.png";
import Helicopter from "../assets/helicopter.svg";
import { useGameContext } from "../pages/Game";
import {
    useSkylabBaseContract,
    useSkylabGameFlightRaceContract,
} from "../hooks/useContract";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapInfo } from "./GameContent";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";

type Props = {};

const Progress = styled.div`
    flex: 1;
    margin-right: 5vw;
    height: 10px;
    background: linear-gradient(
        to right,
        rgb(19, 255, 218),
        rgb(35, 126, 255) 50%,
        rgb(255, 57, 140)
    );
`;

const duration = 5;

const initMap = (mapInfo: any) => {
    const map: MapInfo[][] = [];
    for (let i = 0; i < 15; i++) {
        map.push([]);
        for (let j = 0; j < 15; j++) {
            if (i === 7 && j === 7) {
                map[i].push({
                    role: "end",
                });
            } else {
                map[i].push({
                    role: "normal",
                    distance: mapInfo[i][j][0],
                    fuelScaler: mapInfo[i][j][1],
                    batteryScaler: mapInfo[i][j][2],
                    fuelLoad: 0,
                    batteryLoad: 0,
                });
            }
        }
    }
    return map;
};

export const GameLoading: FC<Props> = ({}) => {
    const { account } = useActiveWeb3React();

    const navigate = useNavigate();

    const [_, forceRender] = useReducer((x) => x + 1, 0);
    const { onNext, tokenId, onMapChange, onUserAndOpInfo } = useGameContext();
    const skylabBaseContract = useSkylabBaseContract();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const progress = useRef(0);

    // 跟合约交互 获取地图
    const handleGetMap = async () => {
        const res = await skylabGameFlightRaceContract.getMap(tokenId);
        await res.wait();
    };

    // 读取mapId
    const handleGetMapId = async () => {
        try {
            const mapId = await skylabGameFlightRaceContract.mapId(tokenId);
            const f = (mapId.toNumber() / 10).toFixed(0);
            const res = await axios.get(
                `https://red-elegant-wasp-428.mypinata.cloud/ipfs/Qmaf7vhNyd7VudLPy2Xbx2K6waQdydj8KnExU2SdqNMogp/batch_fullmap_${f}.json`,
            );
            const map = res.data[mapId];
            const initialMap = initMap(map.map_params);
            onMapChange(initialMap);
        } catch (error) {
            console.log(error);
        }
    };

    // 获取游戏状态
    const getGameState = async () => {
        const state = await skylabGameFlightRaceContract.gameState(tokenId);
        return state.toNumber();
    };

    const getOpponentInfo = async () => {
        try {
            const opTokenId =
                await skylabGameFlightRaceContract.matchedAviationIDs(tokenId);
            const [myTank, opTank, opAccount] = await Promise.all([
                skylabGameFlightRaceContract.gameTank(tokenId),
                skylabGameFlightRaceContract.gameTank(opTokenId.toString()),
                skylabBaseContract.ownerOf(opTokenId),
            ]);

            // const tokenURL = await skylabBaseContract.tokenURI(opTokenId);
            // console.log(tokenURL, "tokenURL");
            onUserAndOpInfo(
                {
                    tokenId: tokenId,
                    address: account,
                    fuel: myTank.fuel.toString(),
                    battery: myTank.battery.toString(),
                },
                {
                    tokenId: opTokenId.toNumber(),
                    address: opAccount,
                    fuel: opTank.fuel.toString(),
                    battery: opTank.battery.toString(),
                },
            );
        } catch (error) {
            console.log(error);
        }
    };

    const waitingForOpponent = async () => {
        const res = await skylabGameFlightRaceContract?.matchedAviationIDs(
            tokenId,
        );
        // 匹配到对手
        if (res.toString() !== "0") {
            const state = await getGameState();
            // 用户未参加游戏
            if (state === 0) {
                navigate(`/spendresource?tokenId=${tokenId}`);
            }
            // 用户已经参加游戏 未获取地图
            else if (state === 1) {
                await handleGetMap();
                await handleGetMapId();
                onNext(1);
            }
            // 用户已经参加游戏 已经获取地图 开始游戏
            else if (state === 2) {
                await handleGetMapId();
                await getOpponentInfo();
                onNext(1);
            }
        } else {
            setTimeout(() => {
                waitingForOpponent();
            }, 1000);
        }
    };

    useEffect(() => {
        if (!skylabGameFlightRaceContract || !tokenId) {
            return;
        }
        waitingForOpponent();
    }, [skylabGameFlightRaceContract, tokenId]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // const step = calculateStep();
            // temporarily hardcode step before contract is ready
            const step = 5;
            const nextValue = progress.current + step;
            if (nextValue >= 100) {
                clearInterval(intervalId);
                // onNext();
            } else {
                progress.current = nextValue;
            }
            forceRender();
        }, 250);
    }, []);

    return (
        <Box
            pos="relative"
            bgImage={GameLoadingBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
            overflow="hidden"
        >
            <motion.div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: "41vh",
                    position: "relative",
                }}
                initial={{ width: "34vw" }}
                animate={{ width: "100vw" }}
                transition={{ duration }}
            >
                <Progress />
                <Img
                    pos="absolute"
                    right="310px"
                    top="-2vh"
                    src={Helicopter}
                    width="18vw"
                />
                <Text width="388px" fontSize="128px" color="white">
                    {progress.current}%
                </Text>
            </motion.div>
        </Box>
    );
};
