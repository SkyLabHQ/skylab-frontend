// @ts-ignore
import { getCalculateTimePerGrid } from "./snark";

self.onmessage = async (event: any) => {
    const { level, mapDetail, x, y } = event.data;
    try {
        // 在这里执行耗时操作或其他任务
        const result = await getCalculateTimePerGrid(level, mapDetail);
        // 将结果发送回主线程
        self.postMessage({ time: result, x, y });
    } catch (error) {
        throw error;

        self.postMessage({ time: 0, x, y });
    }
};
