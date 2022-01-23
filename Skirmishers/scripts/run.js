const hre = require("hardhat");

async function main() {
  const skirmisherImgs = [
    "https://i.pinimg.com/236x/5a/e2/ef/5ae2efa7167ea56a14ba2c8b5db3e77d.jpg",
    "https://i.pinimg.com/564x/ba/5d/4d/ba5d4d0a4147a0b1a90437daf7681ec0.jpg"
  ];
  const skirmisherNames = ["Musk-Bots", "Dwellers"];
  const skirmisherHpVals = [100, 250];
  const skirmisherDmg = [50, 22];
  const muskBotID = 0;
  const dwellerID = 1;
  const bossImg = 'https://i.pinimg.com/564x/48/f9/02/48f90200b97bcd9fcb3610d2cea7b7c0.jpg';
  const bossName = "The forge master";
  const bossHp = 500;
  const bossDmg = 11;

  // We get the contract to deploy
  const skirmisherFactory = await hre.ethers.getContractFactory("Skirmishers");
  
  const skirmisherContract = await skirmisherFactory.deploy(
    skirmisherNames, 
    skirmisherImgs, 
    skirmisherHpVals, 
    skirmisherDmg,
    bossName,
    bossImg,
    bossHp,
    bossDmg
  );
  await skirmisherContract.deployed();

  console.log("SkirmisherTm has been deplyed to:", skirmisherContract.address);

  let txn;

  //Create the two characters
  txn = await skirmisherContract.createSkirmisher(muskBotID);
  await txn.wait();

  let URITx = await skirmisherContract.tokenURI(1);
  console.log(URITx);

  //ATTACK!!!
  txn = await skirmisherContract.attackBoss();
  await txn.wait();
  txn = await skirmisherContract.attackBoss();
  await txn.wait();

  //Get the character URIs
  // let muskBotURI = await skirmisherContract.tokenURI(muskBotID+1);
  // let dwellerURI = await skirmisherContract.tokenURI(dwellerID+1);
  // console.log( `Token URIs are: ${muskBotURI} and ${dwellerURI}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
