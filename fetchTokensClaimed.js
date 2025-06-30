import { prepareEvent, getContract, getContractEvents } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import fs from "fs";

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // dummy address

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli");
  const contract = await getContract(CONTRACT_ADDRESS, provider);

  const preparedEvent = prepareEvent({
    signature: "event TokensClaimed(uint256 indexed claimConditionIndex, address indexed claimer, address receiver, uint256 quantity)"
  });

  const events = await getContractEvents({
    contract,
    events: [preparedEvent],
  });

  console.log("Total events found:", events.length);

  const rows = ["blockNumber,txHash,claimer,receiver,quantity"];
  events.forEach(evt => {
    const { blockNumber, transactionHash } = evt;
    const { claimer, receiver, quantity } = evt.data;
    rows.push(`${blockNumber},${transactionHash},${claimer},${receiver},${quantity.toString()}`);
  });

  fs.writeFileSync("tokens_claimed.csv", rows.join("\n"));
  console.log("Saved to tokens_claimed.csv");
}

main();
