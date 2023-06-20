import React, {
    ReactElement,
    useEffect,
    useState,
    createContext,
    useContext,
    useRef,
} from "react";
import qs from "query-string";
import { GameLoading } from "../components/GameLoading";
import { GameContent, MapInfo } from "../components/GameContent";
import { Presetting } from "../components/GameContent/presetting";
import { Driving } from "../components/GameContent/driving";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";
import { GridPosition } from "../components/GameContent/map";
import {
    useSkylabTestFlightContract,
    useSkylabGameFlightRaceContract,
} from "../hooks/useContract";

import { useLocation, useNavigate } from "react-router-dom";
import { MapStart } from "@/components/GameContent/mapstart";
import { useDisclosure, useToast } from "@chakra-ui/react";
import FleeModal from "../components/GameContent/FleeModal";
import GameLose from "@/components/GameContent/result/lose";
import GameWin from "@/components/GameContent/result/win";
import ResultPending from "@/components/GameContent/resultPending";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";

const GameContext = createContext<{
    map_params: number[][][];
    myInfo: Info;
    opInfo: Info;
    map: MapInfo[][];
    level: number | undefined;
    onNext: (nextStep?: number) => void;
    mapPath: GridPosition[];
    tokenId: number;
    onMyInfo: (info: any) => void;
    onOpInfo: (info: any) => void;
    onMapChange: (map: MapInfo[][]) => void;
    onMapPathChange: (mapPath: GridPosition[]) => void;
    onOpen: () => void;
    onMapParams: (map: [][][]) => void;
}>(null);

export const useGameContext = () => useContext(GameContext);
export interface Info {
    address: string;
    tokenId: number;
    fuel: number;
    battery: number;
    level: number;
    img: string;
}

const Game = (): ReactElement => {
    const { account } = useActiveWeb3React();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const [tokenId, setTokenId] = useState<number>(Number(params.tokenId));
    const [step, setStep] = useState(0);

    const [map, setMap] = useState([]);

    const [myInfo, setMyInfo] = useState<Info>({
        address: "",
        tokenId: 0,
        fuel: 0,
        battery: 0,
        level: 0,
        img: "",
    });

    const [opInfo, setOpInfo] = useState<Info>({
        address: "",
        tokenId: 0,
        fuel: 0,
        battery: 0,
        level: 0,
        img: "",
    });
    const [gameLevel, setGameLevel] = useState(0); //游戏等级

    const [mapPath, setMapPath] = useState<GridPosition[]>([]);
    const [map_params, setMap_params] = useState<number[][][]>([]);

    const { setIsKnobVisible } = useKnobVisibility();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const skylabTestFlightContract = useSkylabTestFlightContract();

    const onNext = async (nextStep?: number) => {
        if (nextStep) {
            setStep(nextStep);
        } else {
            setStep((val) => val + 1);
        }
        if (isOpen) {
            onClose();
        }
    };

    // 设置路径
    const handleMapPathChange = (mapPath: GridPosition[]) => {
        setMapPath(mapPath);
    };

    // 获取等级
    const handleGetGameLevel = async () => {
        const gameLevel = await skylabTestFlightContract._aviationLevels(
            tokenId,
        );
        setGameLevel(gameLevel.toNumber());
    };

    // 设置地图
    const handleMapChange = (map: MapInfo[][]) => {
        setMap(map);
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (!params.tokenId) {
            navigate(`/mercury`);
        }
    }, []);

    useEffect(() => {
        if (!skylabGameFlightRaceContract || !tokenId) {
            return;
        }
        handleGetGameLevel();
    }, [skylabGameFlightRaceContract, tokenId]);

    return (
        <GameContext.Provider
            value={{
                map_params: map_params,
                onOpen,
                opInfo,
                myInfo,
                map,
                onNext,
                mapPath: mapPath,
                level: gameLevel,
                tokenId,
                onMyInfo: setMyInfo,
                onOpInfo: setOpInfo,
                onMapChange: handleMapChange,
                onMapPathChange: handleMapPathChange,
                onMapParams: setMap_params,
            }}
        >
            <>
                {step === 0 && <GameLoading />}
                {step === 1 && <GameContent />}
                {step === 2 && <MapStart />}
                {step === 3 && <Presetting />}
                {step === 4 && <Driving />}
                {step === 6 && <ResultPending />}
                {step === 7 && <GameLose />}
                {step === 8 && <GameWin />}
                <FleeModal onClose={onClose} isOpen={isOpen}></FleeModal>
            </>
        </GameContext.Provider>
    );
};

export default Game;
