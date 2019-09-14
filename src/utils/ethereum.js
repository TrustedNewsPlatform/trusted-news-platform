import { ethers } from "ethers";

import abi from "../resources/abi.json";

const nodeUrl = "https://xeno.yt:8545";

let provider;

if (window.ethereum) {
  if (window.ethereum.enable()) {
    console.log("provider signer");
    provider = new ethers.providers.Web3Provider(window.ethereum).getSigner();
  } else {
    console.log("provider regular");
    provider = new ethers.providers.JsonRpcProvider(nodeUrl);
  }
}

const contract = new ethers.Contract(
  "0x8D036375cCf21AC9ac1A34Fe2CD93Da56a704918",
  abi,
  provider
);

export { contract, provider };
