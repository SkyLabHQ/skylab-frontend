// @ts-ignore
import { pathHashCalldata } from "./snark";

self.onmessage = async (event: any) => {
    const { seed, path, used_resources } = event.data;
    try {
        // 在这里执行耗时操作或其他任务
        const result1 = await pathHashCalldata({
            seed,
            input_path: path,
        });

        const result2 = await pathHashCalldata({
            seed,
            input_path: used_resources,
        });
        // 将结果发送回主线程
        self.postMessage({ result1, result2 });
    } catch (error) {
        self.postMessage(undefined);
    }
};
