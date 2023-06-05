import { useCallback } from "react";
import { useSkylabGameFlightRaceContract } from "./useContract";

const useGameState = () => {
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();

    // 获取游戏状态
    const getGameState = useCallback(
        async (tokenId: number) => {
            if (!tokenId || !skylabGameFlightRaceContract) {
                return;
            }
            const state = await skylabGameFlightRaceContract.gameState(tokenId);
            return state.toNumber();
        },
        [skylabGameFlightRaceContract],
    );

    return getGameState;
};

export default useGameState;
