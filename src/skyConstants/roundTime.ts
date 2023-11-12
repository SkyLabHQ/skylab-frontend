const requireContext = require.context("./winnerImg", true, /^\.\/.*\.png$/);
const images = requireContext.keys().map(requireContext);

const RoundTime: any = {
    1: {
        startTime: "Nov 06",
        endTime: "Nov 10",
        rewardList: [
            {
                address: "0xaC7605770E89ef96F68A081815b2fb8D59532896",
                img: images.find((item: any) =>
                    item.includes("/static/media/8."),
                ),
            },
            {
                address: "0xD3E401814d1FaA8ca0419EccCBFeE93aC7B15B31",
                img: images.find((item: any) =>
                    item.includes("/static/media/9."),
                ),
            },
        ],
    },
    2: {
        startTime: "",
        endTime: "",
        rewardList: [],
    },
    3: {
        startTime: "",
        endTime: "",
        rewardList: [],
    },
    4: {
        startTime: "",
        endTime: "",
        rewardList: [],
    },
    5: {
        startTime: "",
        endTime: "",
        rewardList: [],
    },
};

export default RoundTime;
