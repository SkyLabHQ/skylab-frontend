// @ts-ignore
import { mercuryCalldata } from "./snark";

self.onmessage = async (event: any) => {
    const { input } = event.data;

    // 在这里执行耗时操作或其他任务
    const result = await mercuryCalldata(input);
    // 将结果发送回主线程
    self.postMessage(result);
    self.close();
};
