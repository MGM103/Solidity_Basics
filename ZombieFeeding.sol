pragma solidity >=0.5.0 <0.6.0;

import "./ZombieFactory.sol";

//interfaces are used to communicate with other contracts that are not owned by you
//specify the functions you wish to interact with by defining their header
contract KittyInterface {
  function getKitty(uint256 _id) external view returns (
    bool isGestating,
    bool isReady,
    uint256 cooldownIndex,
    uint256 nextActionAt,
    uint256 siringWithId,
    uint256 birthTime,
    uint256 matronId,
    uint256 sireId,
    uint256 generation,
    uint256 genes
  );
}

contract ZombieFeeding is ZombieFactory {
    
    //To communicate with an external contract, its address is required
    //initialise the interface with the address to use the contract in your own code
    KittyInterface kittyContract;

    function setKittyContractAddress(address _address) external onlyOwner {
        kittyContract = KittyInterface(_address);
    }
    
    function feedAndMultiply(uint _zombieId, uint _targetDna, string memory _species) public {
        require(msg.sender == zombieToOwner[_zombieId]);
        Zombie storage myZombie = zombies[_zombieId];
        _targetDna = _targetDna % dnaModulus;
        uint newDna = (myZombie.dna + _targetDna) / 2;
        
        //check to see if the zombie ate a kitty, if so give it special attribute
        if(keccak256(abi.encodePacked(_species)) == keccak256(abi.encodePacked("kitty"))){
          newDna = newDna - newDna % 100 + 99;
        }
        
        _createZombie("NoName", newDna);
    }
    
    function feedOnKitty(uint _zombieId, uint _kittyId) public {
        uint kittyDna;
        //extracting the final attribute of getKitty function
        (,,,,,,,,,kittyDna) = kittyContract.getKitty(_kittyId);
        // And modify function call here:
        feedAndMultiply(_zombieId, kittyDna, "kitty");
    }
}