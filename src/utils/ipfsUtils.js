import bs58 from "bs58";

const ipfsHashToBytes32 = hash => {
  return (
    "0x" +
    bs58
      .decode(hash)
      .toString("hex")
      .substr(4)
  );
};

const bytes32ToIpfsHash = bytes32 => {
  return bs58.encode(Buffer.from("1220" + bytes32.substr(2), "hex"));
};

const fetchWithTimeout = (url, options, timeout = 7000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeout)
    )
  ]);
};

export { bytes32ToIpfsHash, ipfsHashToBytes32, fetchWithTimeout };
