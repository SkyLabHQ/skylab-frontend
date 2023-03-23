import { MapInfo } from ".";

export const calculateLoad = (map: MapInfo[][], skipSelectCheck = false) => {
    let totalFuelLoad = 0,
        totalBatteryLoad = 0,
        totalTime = 0;

    for (const row of map) {
        for (const item of row) {
            if (item.selected || skipSelectCheck) {
                totalFuelLoad += item.fuelLoad ?? 0;
                totalBatteryLoad += item.batteryLoad ?? 0;
                totalTime += 2;
            }
        }
    }

    return {
        totalFuelLoad,
        totalBatteryLoad,
        totalTime: totalTime < 10 ? `0${totalTime}` : `${totalTime}`,
    };
};

export const decreaseLoad = (load?: number) => (!load ? 0 : load - 1);

export const increaseLoad = (load?: number) => (load ?? 0) + 1;

export const mergeIntoLocalStorage = (
    key: string,
    object: Record<string, unknown>,
) => {
    const originalValue = localStorage.getItem(key);
    if (originalValue) {
        localStorage.setItem(
            key,
            JSON.stringify({ ...JSON.parse(originalValue), ...object }),
        );
        return;
    }
    localStorage.setItem(key, JSON.stringify(object));
};

export const getRecordFromLocalStorage = (key: string) => {
    const val = localStorage.getItem(key);
    if (val) {
        return JSON.parse(val);
    }
    return undefined;
};
