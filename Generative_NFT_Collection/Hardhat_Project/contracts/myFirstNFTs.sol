// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.0;

//Gives the ability to console.log contracts as well as other use cases
import "hardhat/console.sol";

//Allows for the use of functions within these utility contracts from open zeplin
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

//Helper functions for Base64 encoding
import "./libraries/Base64.sol";

contract myFirstNFTs is ERC721URIStorage {
    //Use open zeplin counters for iterator object
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 immutable maxSupply = 50;

    //SVG has been split into two parts where the fill is to be entered
    //to allow for random backgrounds to be generated 
    string svgPart1 = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='";
    string svgPart2 = "'/><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    //The words that will be used to generate the catchphrases for the nft collection
    string[] firstWords = ["Naughty", "Silly", "Enraged", "Stoned", "Hungry", "Thirsty", "Yearning", "Decitful", "Flumptious", "Seedy", "Shady", "Suss"];
    string[] secondWords = ["Warrior", "Pacifist", "Bitcoiner", "Raver", "Slayer", "Dreamer", "Alocatoooor", "Rotatooooor", "Wimp", "Legendary", "Omnivore"];
    string[] thirdWords = ["Dude", "Panda", "Ninja", "Zombie", "Monkey", "Alien", "Ghost", "Drone", "Android", "Fighter", "Founder", "Rugpull", "Whirlpool", "Jeremy"];

    //These colors will be used as randomly generated backgrounds
    string[] backgroundColours = ["#ba56f6", "#001133", "#f8b500", "#042069", "#c0ebff", "#ff748c", "#ff8da1"];

    event birthedNFT(address sender, uint256 tokenID);
    
    //We are inheriting from ERC721 contract, this is the constructor we are using
    constructor() ERC721("Anon User Names", "ANON") {
        console.log("This is my first NFT project");
    }

    //Functions to pick a combination of random words for the nft
    function selectRandomFirstWord(uint256 tokenId) public view returns(string memory){
        uint256 randInt = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        randInt = randInt % firstWords.length;
        
        return firstWords[randInt];
    }

    function selectRandomSecondWord(uint256 tokenId) public view returns(string memory){
        uint256 randInt = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        randInt = randInt % secondWords.length;
        
        return secondWords[randInt];
    }

    function selectRandomThirdWord(uint256 tokenId) public view returns(string memory){
        uint256 randInt = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        randInt = randInt % thirdWords.length;

        return thirdWords[randInt];
    }

    function selectRandomBackground(uint256 _tokenId) public view returns(string memory){
        uint randInt = random(string(abi.encodePacked("BACKGROUND", Strings.toString(_tokenId))));
        randInt = randInt % backgroundColours.length;

        return backgroundColours[randInt];
    }

    //Random number function
    function random(string memory input) internal pure returns(uint256){
        return uint256(keccak256(abi.encodePacked(input)));
    }

    //This function will create nfts
    function birthNFT() public {
        require(_tokenIds.current() < 50, "Max supply has been reached");
        //Get the value of the iterator, starts at zero
        uint256 newNFTID = _tokenIds.current();

        //Get info for nft, meaning grab all the words
        string memory firstWord = selectRandomFirstWord(newNFTID);
        string memory secondWord = selectRandomSecondWord(newNFTID);
        string memory thirdWord = selectRandomThirdWord(newNFTID);
        string memory finalWord = string(abi.encodePacked(firstWord, secondWord, thirdWord));

        //Generate random background
        string memory background = selectRandomBackground(newNFTID);

        //Concat all the strings with the svg to build the final nft
        string memory finalSVG = string(abi.encodePacked(svgPart1, background, svgPart2, finalWord, "</text>""</svg>"));
        
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // We set the title of our NFT as the generated word.
                        finalWord,
                        '", "description": "Anon user names for frogs", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSVG)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenURI = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log("\n----------------------------");
        console.log(
            string(
                abi.encodePacked(
                    "https://nftpreview.0xdev.codes/?code=",
                    finalTokenURI
                )
            )
        );
        console.log("\n----------------------------");

        //Mint next nft to the sender address
        _safeMint(msg.sender, newNFTID);

        //Give the new nft its relevant data
        _setTokenURI(newNFTID, finalTokenURI);
        console.log("New NFT has been minted with the ID of %s to the lucky: %s", newNFTID, msg.sender);

        //increment the counter to ensure the next nft can be minted
        _tokenIds.increment();

        //fire the event to allow our front end to show user info about their nft
        emit birthedNFT(msg.sender, newNFTID);
    }

    function getCirculatingSupply() external view returns(uint256){
        return _tokenIds.current();
    }
}