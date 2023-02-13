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

    return { totalFuelLoad, totalBatteryLoad, totalTime: totalTime < 10 ? `0${totalTime}`: `${totalTime}` };
};