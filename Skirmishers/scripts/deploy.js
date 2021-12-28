const hre = require("hardhat");

async function main() {
  const images = [
    "https://i.pinimg.com/236x/5a/e2/ef/5ae2efa7167ea56a14ba2c8b5db3e77d.jpg",
    "https://i.pinimg.com/564x/ba/5d/4d/ba5d4d0a4147a0b1a90437daf7681ec0.jpg"
  ];
  const names = ["Musk-Bots", "Dwellers"];
  const hpVals = [100, 250];
  const damages = [50, 22];
  const muskBotID = 0;
  const dwellerID = 1;

  // We get the contract to deploy
  const skirmisherFactory = await hre.ethers.getContractFactory("Skirmishers");
  
  const skirmisherContract = await skirmisherFactory.deploy(names, images, hpVals, damages);
  await skirmisherContract.deployed();

  console.log("Skirmisher has been deplyed to:", skirmisherContract.address);

  let txn;

  //Create the two characters
  txn = await skirmisherContract.createSkirmisher(muskBotID);
  await txn.wait();
  console.log("NFT#1, a musk-bot has been created");
  txn = await skirmisherContract.createSkirmisher(dwellerID);
  await txn.wait();
  console.log("NFT#2, a dweller has been created");
  txn = await skirmisherContract.createSkirmisher(muskBotID);
  await txn.wait();
  console.log("NFT#3, a musk-bot has been created");
  txn = await skirmisherContract.createSkirmisher(dwellerID);
  await txn.wait();
  console.log("NFT#4, a dweller has been created");

  console.log("Finished deployment and generation 1 character creation");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
