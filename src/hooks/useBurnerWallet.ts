import { ethers } from "ethers";
import { useCallback } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import {
    getSigner,
    skylabTestFlightAddress,
    skylabTournamentAddress,
    useLocalSigner,
    useSkylabBidTacToeContract,
    useSkylabGameFlightRaceContract,
} from "./useContract";
import qs from "query-string";
import { ChainId } from "@/utils/web3Utils";
import useSkyToast from "./useSkyToast";
import {
    ContractType,
    useRetryBalanceCall,
    useRetryContractCall,
} from "./useRetryContract";
import { useTacToeSigner } from "./useSigner";
import { useLocation } from "react-router-dom";

export enum BalanceState {
    ACCOUNT_LACK,
    LACK,
    ENOUTH,
}

export enum ApproveGameState {
    APPROVED,
    NOT_APPROVED,
}

const balanceInfo = {
    [ChainId.POLYGON]: {
        low: "1",
        high: "1",
        need: "1.01",
    },
    [ChainId.MUMBAI]: {
        low: "0.18",
        high: "0.2",
        need: "0.21",
    },
    [ChainId.BASEGOERLI]: {
        low: "0.018",
        high: "0.02",
        need: "0.021",
    },
};

const useBurnerWallet = (
    tokenId: number,
    propTestflight: boolean = false,
): any => {
    const toast = useSkyToast();
    const { chainId } = useActiveWeb3React();
    const { library, account } = useActiveWeb3React();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const skylabBidTacToeContract = useSkylabBidTacToeContract();
    const skylabBidTacToeContractWithoutSigner =
        useSkylabBidTacToeContract(false);
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = propTestflight
        ? propTestflight
        : params.testflight === "true";
    const burner = useLocalSigner();
    const [tacToeBurner] = useTacToeSigner(tokenId, istest);
    const retryContractCall = useRetryContractCall();

    const balanceCall = useRetryBalanceCall();

    const getBalanceState = useCallback(async () => {
        if (!library || !burner) {
            return;
        }

        const burnerBalance = await balanceCall(burner.address);
        if (
            burnerBalance.lt(ethers.utils.parseEther(balanceInfo[chainId].low))
        ) {
            const balance = await balanceCall(account);
            if (
                balance.lt(ethers.utils.parseEther(balanceInfo[chainId].need))
            ) {
                return BalanceState.ACCOUNT_LACK;
            }
            return BalanceState.LACK;
        }
        return BalanceState.ENOUTH;
    }, [burner, library, chainId]);

    const getTacToeBalanceState = useCallback(async () => {
        if (!library || !tacToeBurner) {
            return;
        }

        const burnerBalance = await balanceCall(tacToeBurner.address);

        if (
            burnerBalance.lt(ethers.utils.parseEther(balanceInfo[chainId].low))
        ) {
            const balance = await balanceCall(account);
            if (
                balance.lt(ethers.utils.parseEther(balanceInfo[chainId].need))
            ) {
                return BalanceState.ACCOUNT_LACK;
            }
            return BalanceState.LACK;
        }
        return BalanceState.ENOUTH;
    }, [tacToeBurner, library, chainId]);

    const transferGas = useCallback(async () => {
        if (!library || !account || !burner) {
            return;
        }
        toast("Confirm transaction in MetaMask to proceed");
        const singer = getSigner(library, account);
        const transferResult = await singer.sendTransaction({
            to: burner.address,
            value: ethers.utils.parseEther(balanceInfo[chainId].high),
        });
        await transferResult.wait();
    }, [library, burner, account, chainId]);

    const transferTacToeGas = useCallback(async () => {
        if (!library || !account || !tacToeBurner) {
            return;
        }
        toast("Confirm transaction in MetaMask to proceed");
        const singer = getSigner(library, account);
        const transferResult = await singer.sendTransaction({
            to: tacToeBurner.address,
            value: ethers.utils.parseEther(balanceInfo[chainId].high),
        });
        await transferResult.wait();
    }, [library, tacToeBurner, account, chainId]);

    const getApproveGameState = useCallback(async () => {
        if (!skylabGameFlightRaceContract || !tokenId || !burner) {
            return;
        }

        const isApprovedForGame = await retryContractCall(
            ContractType.RACETOURNAMENT,
            "isApprovedForGame",
            [tokenId],
            true,
        );

        return isApprovedForGame
            ? ApproveGameState.APPROVED
            : ApproveGameState.NOT_APPROVED;
    }, [skylabGameFlightRaceContract, tokenId, burner]);

    const getApproveBitTacToeGameState = useCallback(async () => {
        if (
            !skylabBidTacToeContractWithoutSigner ||
            !tokenId ||
            !tacToeBurner ||
            !chainId
        ) {
            return;
        }

        const isApprovedForGame =
            await skylabBidTacToeContractWithoutSigner.isApprovedForGame(
                tokenId,
                istest
                    ? skylabTestFlightAddress[chainId]
                    : skylabTournamentAddress[chainId],
                {
                    from: tacToeBurner.address,
                },
            );

        return isApprovedForGame
            ? ApproveGameState.APPROVED
            : ApproveGameState.NOT_APPROVED;
    }, [skylabBidTacToeContractWithoutSigner, tokenId, tacToeBurner, chainId]);

    const approveForGame = useCallback(async () => {
        if (!account || !skylabGameFlightRaceContract || !tokenId || !burner) {
            return;
        }
        console.log("start approveForGame");
        const approveResult = await skylabGameFlightRaceContract.approveForGame(
            burner.address,
            tokenId,
        );
        await approveResult.wait();
        console.log("success approveForGame");
    }, [tokenId, burner, account, skylabGameFlightRaceContract]);

    const approveForBidTacToeGame = useCallback(async () => {
        if (
            !account ||
            !skylabBidTacToeContract ||
            !tokenId ||
            !tacToeBurner ||
            !chainId
        ) {
            return;
        }

        console.log("start approveForGame");

        const approveResult = await skylabBidTacToeContract.approveForGame(
            tacToeBurner.address,
            tokenId,
            istest
                ? skylabTestFlightAddress[chainId]
                : skylabTournamentAddress[chainId],
        );
        await approveResult.wait();
        console.log("success approveForGame");
    }, [tokenId, tacToeBurner, account, skylabBidTacToeContract, chainId]);

    const handleCheckBurner = async (
        transferBeforFn?: Function,
        approveBeforeFn?: Function,
    ) => {
        const balanceState = await getBalanceState();
        if (balanceState === BalanceState.ACCOUNT_LACK) {
            toast(
                `You do not have enough balance, have at least ${balanceInfo[chainId].high} MATIC in your wallet and refresh`,
                true,
            );

            return;
        } else if (balanceState === BalanceState.LACK) {
            transferBeforFn?.();
            await transferGas();
        }

        const approveState = await getApproveGameState();
        if (approveState === ApproveGameState.NOT_APPROVED) {
            approveBeforeFn?.();
            await approveForGame();
        }
        return true;
    };

    const handleCheckBurnerBidTacToe = async (
        transferBeforFn?: Function,
        approveBeforeFn?: Function,
    ) => {
        const balanceState = await getTacToeBalanceState();
        if (balanceState === BalanceState.ACCOUNT_LACK) {
            toast(
                `You do not have enough balance, have at least ${balanceInfo[chainId].high} MATIC in your wallet and refresh`,
                true,
            );

            return;
        } else if (balanceState === BalanceState.LACK) {
            transferBeforFn?.();
            await transferTacToeGas();
        }

        const approveState = await getApproveBitTacToeGameState();

        if (approveState === ApproveGameState.NOT_APPROVED) {
            approveBeforeFn?.();
            await approveForBidTacToeGame();
        }

        return true;
    };

    return {
        burner,
        tacToeBurner,
        handleCheckBurner,
        handleCheckBurnerBidTacToe,
    };
};

export const useCheckBurnerBalanceAndApprove = () => {
    const toast = useSkyToast();
    const { account, chainId, library } = useActiveWeb3React();
    const skylabBidTacToeContract = useSkylabBidTacToeContract();

    const approveForBidTacToeGame = useCallback(
        async (
            aviationAddress: string,
            tokenId: number,
            burnerAddress: string,
            needTransfer: boolean,
        ) => {
            if (
                !account ||
                !skylabBidTacToeContract ||
                !tokenId ||
                !burnerAddress
            ) {
                return;
            }

            console.log(
                needTransfer
                    ? "start approveForGame and transferGas"
                    : "start approveForGame",
            );

            const approveResult = await skylabBidTacToeContract.approveForGame(
                burnerAddress,
                tokenId,
                aviationAddress,
                {
                    value: needTransfer
                        ? ethers.utils.parseEther(balanceInfo[chainId].high)
                        : 0,
                    gasLimit: 1000000,
                },
            );
            await approveResult.wait();
            console.log(
                needTransfer
                    ? "success approveForGame and transferGas"
                    : "success approveForGame",
            );
        },
        [account, skylabBidTacToeContract],
    );

    const getTacToeBalanceState = useCallback(
        async (burnerAddress: string) => {
            if (!library || !burnerAddress) {
                return;
            }
            const burnerBalance = await library.getBalance(burnerAddress);
            if (
                burnerBalance.lt(
                    ethers.utils.parseEther(balanceInfo[chainId].low),
                )
            ) {
                const balance = await library.getBalance(account);
                if (
                    balance.lt(
                        ethers.utils.parseEther(balanceInfo[chainId].need),
                    )
                ) {
                    return BalanceState.ACCOUNT_LACK;
                }
                return BalanceState.LACK;
            }
            return BalanceState.ENOUTH;
        },
        [library, chainId],
    );

    const transferTacToeGas = useCallback(
        async (burnerAddress: string) => {
            if (!library || !account || !burnerAddress) {
                return;
            }
            toast("Confirm transaction in MetaMask to proceed");
            const singer = getSigner(library, account);
            const transferResult = await singer.sendTransaction({
                to: burnerAddress,
                value: ethers.utils.parseEther(balanceInfo[chainId].high),
            });
            await transferResult.wait();
        },
        [library, account, chainId],
    );

    const getApproveBitTacToeGameState = useCallback(
        async (
            aviationAddress: string,
            tokenId: number,
            operateAddress: string,
        ) => {
            if (
                !tokenId ||
                !operateAddress ||
                !skylabBidTacToeContract ||
                !library
            ) {
                return;
            }

            const voidSigner = new ethers.VoidSigner(operateAddress, library);
            const isApprovedForGame = await skylabBidTacToeContract
                .connect(voidSigner)
                .isApprovedForGame(tokenId, aviationAddress);

            return isApprovedForGame
                ? ApproveGameState.APPROVED
                : ApproveGameState.NOT_APPROVED;
        },
        [skylabBidTacToeContract, library],
    );

    const handleCheckBurnerBidTacToe = useCallback(
        async (
            aviationAddress: string,
            tokenId: number,
            operateAddress: string,
            needTransferGas: boolean = true,
        ) => {
            const balanceState = await getTacToeBalanceState(operateAddress);
            if (balanceState === BalanceState.ACCOUNT_LACK) {
                toast(
                    `You do not have enough balance, have at least ${balanceInfo[chainId].high} MATIC in your wallet and refresh`,
                    true,
                );

                return;
            }

            const approveState = await getApproveBitTacToeGameState(
                aviationAddress,
                tokenId,
                operateAddress,
            );

            if (approveState === ApproveGameState.NOT_APPROVED) {
                await approveForBidTacToeGame(
                    aviationAddress,
                    tokenId,
                    operateAddress,
                    needTransferGas && balanceState === BalanceState.LACK,
                );
            }
        },
        [
            getTacToeBalanceState,
            transferTacToeGas,
            getApproveBitTacToeGameState,
            approveForBidTacToeGame,
        ],
    );

    return handleCheckBurnerBidTacToe;
};

export default useBurnerWallet;
