function hex_to_ascii(str1: string) {
    var hex = str1.toString();
    var str = "";
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}

export async function getReason(provider: any, hash: string) {
    let tx = await provider.getTransaction(hash);
    if (!tx) {
        console.log("tx not found");
    } else {
        let code = await provider.call(
            { to: tx.to, data: tx.data, value: tx.value },
            tx.blockNumber,
        );
        let reason = hex_to_ascii(code.substr(138));
        console.log("revert reason:", reason);
        return reason;
    }
}
