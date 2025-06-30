const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const { ethers } = require("ethers");
const fs = require("fs");

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // your contract
const RPC_URL = "https://rpc.ankr.com/eth_goerli";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

  const sdk = new ThirdwebSDK(provider); // This fixes the issue
  const contract = await sdk.getContract(CONTRACT_ADDRESS);

  const preparedEvent = contract.events.prepare("TokensClaimed");
  const events = await contract.events.getEvents(preparedEvent);

  console.log("Total events found:", events.length);

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
