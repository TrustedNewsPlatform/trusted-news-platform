import { ethers } from "ethers";

import abi from "../resources/abi.json";

const contract = new ethers.Contract(
  "0x8D036375cCf21AC9ac1A34Fe2CD93Da56a704918",
  abi,
  new ethers.providers.JsonRpcProvider("https://xeno.yt:8545")
);

export { contract };
