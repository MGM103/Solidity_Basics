const hre = require("hardhat");

async function main() {
  const images = [
    "https://ak.picdn.net/shutterstock/videos/1031556623/preview/stock-footage-animated-cartoon-comic-cute-pet-rocket-insectoide-robot-cyborg-video-white-background.webm",
    "https://ak.picdn.net/shutterstock/videos/1068038726/preview/stock-footage-the-banana-tree-monkey-explained-and-talked.webm"
  ];
  const names = ["Musk-Bots", "Tree Dwellers"];
  const hpVals = [100, 250];
  const damages = [50, 22];

  // We get the contract to deploy
  const skirmisherFactory = await hre.ethers.getContractFactory("Skirmishers");
  
  const skirmisher = await skirmisherFactory.deploy(names, images, hpVals, damages);
  await skirmisher.deployed();

  console.log("SkirmisherTm has been deplyed to:", skirmisher.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
