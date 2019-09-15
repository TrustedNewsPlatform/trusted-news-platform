import { ethers } from "ethers";

import abi from "../resources/abi.json";
import { ethereumEndpoint, contractAddress } from "../config.js";

let provider;

if (window.ethereum) {
  const ethereumEnabled = window.ethereum.enable();

  if (!ethereumEnabled) {
    provider = new ethers.providers.JsonRpcProvider(ethereumEndpoint);
  } else {
    provider = new ethers.providers.Web3Provider(window.ethereum).getSigner();
  }
}

const contract = new ethers.Contract(contractAddress, abi, provider);

export { contract, provider };
