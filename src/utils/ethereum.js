import { ethers } from "ethers";

import abi from "../resources/abi.json";

let provider;

if (window.ethereum) {
  const ethereumEnabled = window.ethereum.enable();

  if (!ethereumEnabled) {
    provider = new ethers.providers.JsonRpcProvider("https://xeno.yt:8545");
  } else {
    provider = new ethers.providers.Web3Provider(window.ethereum).getSigner();
  }
}

const contract = new ethers.Contract(
  "0x8D036375cCf21AC9ac1A34Fe2CD93Da56a704918",
  abi,
  provider
);

export { contract, provider };
