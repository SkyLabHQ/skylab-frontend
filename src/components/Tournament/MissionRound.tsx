import { Box } from "@chakra-ui/react";
import { tournamentChainId, PlaneInfo } from "@/pages/Activities";
import { useEffect, useMemo, useState } from "react";
import PlanetList from "./PlanetList";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { skylabTournamentAddress } from "@/hooks/useContract";
import { getPilotImgFromUrl } from "@/utils/ipfsImg";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import { Contract } from "ethers-multicall";
import RightNav from "./RightNav";
import { useMultiProvider } from "@/hooks/useMultiContract";
import Header from "./Header";
import { usePilotInfo } from "@/hooks/usePilotInfo";

interface ChildProps {
    currentRound: number;
    onBack: () => void;
    onNextRound: (step: number | string) => void;
}

const MissionRound = ({ currentRound, onBack, onNextRound }: ChildProps) => {
    const { account } = useActiveWeb3React();
    const [planeList, setPlaneList] = useState<PlaneInfo[]>([]);
    const [currentImg, setCurrentImg] = useState(0);
    const { activePilot } = usePilotInfo(account);

    const [active, setActive] = useState(1);
    const [showAllActivities, setShowAllActivities] = useState(false);
    const ethcallProvider = useMultiProvider(tournamentChainId);

    const currentIsExpired = useMemo(() => {
        if (planeList.length === 0) {
            return false;
        }
        return currentRound > planeList[currentImg].round;
    }, [currentRound, planeList, currentImg]);

    const handleCurrentImg = (index: number) => {
        setCurrentImg(index);
    };

    const handleGetPlaneBalance = async () => {
        setCurrentImg(0);
        setPlaneList([]);

        const tournamentContract = new Contract(
            skylabTournamentAddress[tournamentChainId],
            SKYLABTOURNAMENT_ABI,
        );

        const [balance] = await ethcallProvider.all([
            tournamentContract.balanceOf(account),
        ]);
        const p = new Array(balance.toNumber()).fill("").map((item, index) => {
            return tournamentContract.tokenOfOwnerByIndex(account, index);
        });
        const planeTokenIds = await ethcallProvider.all(p);
        const p1: any = [];
        planeTokenIds.forEach((tokenId) => {
            p1.push(tournamentContract.aviationLevels(tokenId));
            p1.push(tournamentContract.tokenURI(tokenId));
            p1.push(tournamentContract.aviationRounds(tokenId));
            p1.push(tournamentContract.aviationRounds(tokenId));
            // p1.push(skylabGameFlightRaceContract.gameState(tokenId));
        });

        const levels: any = await ethcallProvider.all(p1);

        const list = planeTokenIds.map((item: any, index: number) => {
            const level = levels[index * 4].toNumber();
            const metadata = levels[index * 4 + 1];
            const round = levels[index * 4 + 2];
            const state = 0; // levels[index * 4 + 3].toNumber();
            return {
                tokenId: item.toNumber(),
                level: level,
                img: getPilotImgFromUrl(metadata),
                round:
                    round.toNumber() >= 3
                        ? round.toNumber() - 1
                        : round.toNumber(),
                state,
            };
        });

        const imgRes = await Promise.all(
            list.map((item) => {
                return item.img;
            }),
        );

        const _list = list.map((item, index) => {
            return { ...item, img: imgRes[index] };
        });

        _list
            .sort((item1, item2) => {
                if (item1.round !== item2.round) {
                    return item2.round - item1.round; // 大的 round 排在前面
                } else {
                    return item2.level - item1.level; // 相同 round 中，大的 level 排在前面
                }
            })
            .reverse();

        setPlaneList(_list);
    };

    useEffect(() => {
        if (!account) {
            return;
        }
        handleGetPlaneBalance();
    }, [account]);
    return (
        <Box
            h={"100vh"}
            w={"100vw"}
            sx={{ color: "#000", fontWeight: 600 }}
            onClick={() => {}}
        >
            <Header
                activePilot={activePilot}
                onNextRound={onNextRound}
            ></Header>
            <PlanetList
                planeList={planeList}
                currentImg={currentImg}
                active={active}
                showAllActivities={showAllActivities}
                onChangeActive={(index) => {
                    setActive(index);
                }}
                onChangeAllActivities={(flag) => {
                    setShowAllActivities(flag);
                }}
                currentIsExpired={currentIsExpired}
            ></PlanetList>
            <RightNav
                list={planeList}
                activePilot={activePilot}
                onNextRound={onNextRound}
                currentIsExpired={currentIsExpired}
                currentRound={currentRound}
                onCurrentImg={handleCurrentImg}
                currentImg={currentImg}
            ></RightNav>
        </Box>
    );
};

export default MissionRound;
