const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("myFirstNFTs");
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("This contract has been deployed to: ", nftContract.address);

    let txn = await nftContract.birthNFT();
    await txn.wait();
    console.log("First NFT has been minted");

    txn = await nftContract.birthNFT();
    await txn.wait();
    console.log("Second NFT has been minted");
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch(error) {
        console.log(error);
        process.exit(0);
    }
}

runMain();