const requireContext = require.context("./winnerImg", true, /^\.\/.*\.png$/);
const images = requireContext.keys().map(requireContext);

const RoundTime: any = {
    1: {
        startTime: "Jul 22",
        endTime: "Jul 24",
        rewardList: [
            {
                address: "0x29691D3989381c447013df11eA517358195f69B7",
                img: images.find((item: any) =>
                    item.includes("/static/media/1."),
                ),
            },
            {
                address: "0x4e715286A0E0e9464df5d27ed725c1357a29BB37",
                img: images.find((item: any) =>
                    item.includes("/static/media/2."),
                ),
            },
        ],
    },
    2: {
        startTime: "Jul 24",
        endTime: "Jul 30",
        rewardList: [
            {
                address: "0x5A85d5F29f2f6eBEdc64263acEadAFf09d94357F",
                img: images.find((item: any) =>
                    item.includes("/static/media/3."),
                ),
            },
            {
                address: "0x7B6447e8FFfD05BcF629Db7D8Fcd76be75a10692",
                img: images.find((item: any) =>
                    item.includes("/static/media/4."),
                ),
            },
        ],
    },
    3: {
        startTime: "Aug 01",
        endTime: "Aug 03",
        rewardList: [],
    },
    4: {
        startTime: "Aug 05",
        endTime: "Aug 07",
        rewardList: [],
    },
    5: {
        startTime: "",
        endTime: "",
        rewardList: [],
    },
};

export default RoundTime;
