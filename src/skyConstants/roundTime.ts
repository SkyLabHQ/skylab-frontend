const requireContext = require.context("./winnerImg", true, /^\.\/.*\.png$/);
console.log(requireContext, "requireContext");
const images = requireContext.keys().map(requireContext);

console.log(images, "images");
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
        endTime: "Jul 26",
        rewardList: [],
    },
    3: {
        startTime: "Jul 26",
        endTime: "Jul 28",
        rewardList: [
            {
                address: "",
                img: images[5],
            },
            {
                address: "",
                img: images[6],
            },
        ],
    },
    4: {
        startTime: "Jul 28",
        endTime: "Jul 30",
        rewardList: [],
    },
};

export default RoundTime;
