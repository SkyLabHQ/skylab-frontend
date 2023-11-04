import { Box } from "@chakra-ui/react";
import { tournamentChainId, PlaneInfo } from "@/pages/Activities";
import { useEffect, useMemo, useState } from "react";
import PlanetList from "./PlanetList";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { skylabTournamentAddress } from "@/hooks/useContract";
import { getMetadataImg } from "@/utils/ipfsImg";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import { Contract } from "ethers-multicall";
import RightNav from "./RightNav";
import { useMultiProvider } from "@/hooks/useMultiContract";
import Header from "./Header";
import { usePilotInfo } from "@/hooks/usePilotInfo";
import { DEAFAULT_CHAINID } from "@/utils/web3Utils";

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

    const pList = useMemo(() => {
        return planeList.filter((item) => {
            return item.round === currentRound;
        });
    }, [currentRound, planeList]);

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
            p1.push(tournamentContract.isAviationLocked(tokenId));
        });

        const levels: any = await ethcallProvider.all(p1);

        const list = planeTokenIds.map((item: any, index: number) => {
            const level = levels[index * 4].toNumber();
            const metadata = levels[index * 4 + 1];
            const round = levels[index * 4 + 2];
            const state = levels[index * 4 + 3];
            return {
                tokenId: item.toNumber(),
                level: level,
                img: getMetadataImg(metadata),
                round:
                    round.toNumber() >= 3
                        ? round.toNumber() - 1
                        : round.toNumber(),
                state,
            };
        });

        const _list = list
            .sort((item1, item2) => {
                return item2.level - item1.level; //  大的 level 排在前面
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
                planeList={pList}
                currentImg={currentImg}
                active={active}
                showAllActivities={showAllActivities}
                onChangeActive={(index) => {
                    setActive(index);
                }}
                onChangeAllActivities={(flag) => {
                    setShowAllActivities(flag);
                }}
            ></PlanetList>
            <RightNav
                list={pList}
                activePilot={activePilot}
                onNextRound={onNextRound}
                currentRound={currentRound}
                onCurrentImg={handleCurrentImg}
                currentImg={currentImg}
            ></RightNav>
        </Box>
    );
};

export default MissionRound;
