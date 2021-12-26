//HRE = Hardhat run time environment
//It is an object that contains all functionality, it essentially is hardhat
//Hardhat config ensures you never actually have to import HRE

const main = async () => {
    //compiles the smart contract specified in the () 
    //and produces the artifacts needed to run the contract
    const nftContractFactory = await hre.ethers.getContractFactory("myFirstNFTs");
    //A local eth network is created and our smart contract is deployed to it
    //Eacb time this is run a fresh fake blockchain will be used
    const nftContract = await nftContractFactory.deploy();
    
    //Wait for the contract to be mined on the netowrk 
    //so that it is able to be interacted with
    await nftContract.deployed();

    //See the address to which the contract is deployed to
    console.log("Contract is deployed to:", nftContract.address);

    //call the mint function
    let txn;
    
    try{
        for(let i = 0; i < 50; i++){
            txn = await nftContract.birthNFT();
            await txn.wait();
        }
    }catch(error){
        console.log(error);
    }
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    }catch(error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();