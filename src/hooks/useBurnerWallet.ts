import { ethers } from "ethers";
import { useCallback } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import {
    getSigner,
    useLocalSigner,
    useSkylabGameFlightRaceContract,
} from "./useContract";

const useBurnerWallet = (tokenId: number) => {
    const { library, account } = useActiveWeb3React();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const burner = useLocalSigner();
    const approveForGame = useCallback(async () => {
        if (!library || !account || !skylabGameFlightRaceContract || !tokenId) {
            return;
        }
        const singer = getSigner(library, account);
        const balance = await library.getBalance(burner.address);
        if (balance.lt(ethers.utils.parseEther("0.005"))) {
            console.log("start transfer");
            const transferResult = await singer.sendTransaction({
                to: burner.address,
                value: ethers.utils.parseEther("0.01"),
            });
            await transferResult.wait();
            console.log("success transfer");
        }

        const isApprovedForGame = await skylabGameFlightRaceContract
            .connect(burner)
            .isApprovedForGame(tokenId);
        console.log(
            tokenId,
            isApprovedForGame,
            "isApprovedForGameisApprovedForGame",
        );
        if (isApprovedForGame) {
            return;
        }
        console.log("start approveForGame");
        const approveResult = await skylabGameFlightRaceContract.approveForGame(
            burner.address,
            tokenId,
        );
        await approveResult.wait();
        console.log("success approveForGame");
    }, [tokenId, library, account, skylabGameFlightRaceContract]);

    return { approveForGame, burner };
};

export default useBurnerWallet;
