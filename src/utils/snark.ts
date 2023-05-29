// @ts-ignore
import { groth16 } from "snarkjs";
import { MapInfo } from "@/components/GameContent";

const url =
    process.env.NODE_ENV === "development"
        ? ""
        : "https://skylab-zkey.s3.amazonaws.com";

export const exportCallDataGroth16 = async (
    input: unknown,
    wasmPath: string,
    zkeyPath: string,
) => {
    const { proof: _proof, publicSignals: _publicSignals } =
        await groth16.fullProve(input, wasmPath, zkeyPath);

    const calldata = await groth16.exportSolidityCallData(
        _proof,
        _publicSignals,
    );

    const argv = calldata
        .replace(/["[\]\s]/g, "")
        .split(",")
        .map((x: string) => BigInt(x).toString());

    const a = [argv[0], argv[1]];
    const b = [
        [argv[2], argv[3]],
        [argv[4], argv[5]],
    ];
    const c = [argv[6], argv[7]];
    const Input = [];

    for (let i = 8; i < argv.length; i++) {
        Input.push(argv[i]);
    }

    return { a, b, c, Input };
};

export const mercuryCalldata = async (input: unknown) => {
    try {
        return await exportCallDataGroth16(
            input,
            `${url}/gameboard-traverse.wasm`,
            `${url}/gameboard-traverse_0001.zkey`,
        );
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const gridTimeCalldata = async (input: unknown) => {
    try {
        return await exportCallDataGroth16(
            input,
            `/calculate_time_per_grid.wasm`,
            `/calculate_time_per_grid_0001.zkey`,
        );
    } catch (error) {
        throw error;
    }
};

export const pathHashCalldata = async (input: unknown) => {
    try {
        return await exportCallDataGroth16(
            input,
            `/compute_hash_path_data.wasm`,
            `/compute_hash_path_data_0001.zkey`,
        );
    } catch (error) {
        throw error;
    }
};

export const getCalculateTimePerGrid = async (
    level: number,
    mapDetail: MapInfo,
) => {
    if (!mapDetail || mapDetail.role === "end") {
        return 0;
    }
    const level_scaler = 2 ** (level - 1);
    let c1;
    if (level <= 7) {
        c1 = 2;
    } else if (level <= 12) {
        c1 = 6;
    } else {
        c1 = 17;
    }

    const used_fuel = mapDetail.fuelLoad;
    const fuel_scaler = mapDetail.fuelScaler;
    const used_battery = mapDetail.batteryLoad;
    const battery_scaler = mapDetail.batteryScaler;
    const distance = mapDetail.distance;
    const input = {
        level_scaler,
        c1,
        used_fuel,
        fuel_scaler,
        used_battery,
        battery_scaler,
        distance,
    };
    const { Input } = await gridTimeCalldata(input);
    return Number(Input[0]);
};
