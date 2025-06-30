import { prepareEvent, getContract, getContractEvents } from "thirdweb";
import fs from "fs";

const CONTRACT_ADDRESS = "0xYourContractAddress"; // Replace with actual contract address
const THIRDWEB_RPC = "https://<your-rpc>"; // Optional: only if you use a custom RPC

async function main() {
  const contract = await getContract(CONTRACT_ADDRESS);

  const preparedEvent = prepareEvent({
    signature: "event TokensClaimed(uint256 indexed claimConditionIndex, address indexed claimer, address receiver, uint256 quantity)",
  });

  const events = await getContractEvents({
    contract,
    events: [preparedEvent],
  });

  console.log("📦 Total claim events found:", events.length);

  const rows = ["blockNumber,txHash,claimer,receiver,quantity"];
  events.forEach(evt => {
    const { blockNumber, transactionHash } = evt;
    const { claimer, receiver, quantity } = evt.data;
    rows.push(`${blockNumber},${transactionHash},${claimer},${receiver},${quantity.toString()}`);
  });

  fs.writeFileSync("tokens_claimed.csv", rows.join("\n"));
  console.log("✅ Saved to tokens_claimed.csv");
}

main();
