pragma solidity >=0.5.0 <0.6.0;

contract ZombieFactory {
    // defining event, events allow our contract to communicate to the front end
    event NewZombie(uint zombieId, string name, uint dna);
    
    //state variables are written to the blockchain
    //uint short for unint128
    uint dnaDigits = 16;
    
    //** = to the power of
    uint dnaModulus = 10 ** dnaDigits;

    struct Zombie {
        string name;
        uint dna;
    }
    
    //arrays can be fixed or dynamic(leave size blank)
    //declaring array as public results in automatic getter method for array
    Zombie[] public zombies;
    
    //"_" is used at the front of variables in function definitions, to differentiate them from global variables
    //the key word memory is used for variables that are parsed as a reference
    //functions are public by default
    //private functions start with a "_", only functions in the same contract can call private functions
    function _createZombie(string memory _name, uint _dna) private {
        uint id = zombies.push(Zombie(_name, _dna)) - 1;
        emit NewZombie(id, _name, _dna); //trigger event
    }
    
    //must specify the return value in function declaration
    //view keyword is used for functions that do not modify data
    //pure keyword is used for functions that do not modify or view data
    function _generateRandomDna(string memory _str) private view returns (uint) {
        //hash function for pseudorandom number generation, takes bytes as input
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }
    
    function createRandomZombie(string memory _name) public {
        uint randDna = _generateRandomDna(_name);
        _createZombie(_name, randDna);
    }
}
