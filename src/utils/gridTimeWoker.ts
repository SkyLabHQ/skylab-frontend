// @ts-ignore
import { getCalculateTimePerGrid } from "./snark";

self.onmessage = async (event: any) => {
    try {
        const { level, mapDetail, x, y } = event.data;
        // 在这里执行耗时操作或其他任务
        const result = await getCalculateTimePerGrid(level, mapDetail);
        // 将结果发送回主线程
        self.postMessage({
            status: "success",
            time: result,
            x,
            y,
            fuel: mapDetail.fuelLoad,
            battery: mapDetail.batteryLoad,
        });
    } catch (e) {
        self.postMessage({
            status: "error",
        });
    }
};
