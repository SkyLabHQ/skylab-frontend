import { ethers } from "ethers";

export const erc721iface = new ethers.utils.Interface([
    "event Transfer(address indexed from,address indexed to,uint256 indexed tokenId);",
]);

export const topic0Transfer = erc721iface.getEventTopic("Transfer");

export const UserOperationiface = new ethers.utils.Interface([
    "event UserOperationRevertReason(bytes32 indexed userOpHash, address indexed sender, uint256 nonce, bytes revertReason);",
    "event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed);",
]);

export const topic0UserOperationRevertReason = UserOperationiface.getEventTopic(
    "UserOperationRevertReason",
);

export const topic0UserOpearationEvent =
    UserOperationiface.getEventTopic("UserOperationEvent");
