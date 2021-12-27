// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Skirmishers {
    struct SkirmisherAttributes{
        uint256 skirmisherID;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 damage;
    }

    SkirmisherAttributes[] skirmisherStats;

    constructor(
        string[] memory _skirmisherNames,
        string[] memory _skirmisherImageURIs,
        uint[] memory _skirmisherHp,
        uint[] memory _skirmisherDmg
    ){
        for(uint256 i = 0; i < _skirmisherNames.length; i++){
            skirmisherStats.push(
                SkirmisherAttributes({
                    skirmisherID: i,
                    name: _skirmisherNames[i],
                    imageURI: _skirmisherImageURIs[i],
                    hp: _skirmisherHp[i],
                    maxHp: _skirmisherHp[i],
                    damage: _skirmisherDmg[i]
                })
            );

            SkirmisherAttributes memory skirmisher = skirmisherStats[i];
            console.log("Created skirmisher %s with health %s HP and img %s", skirmisher.name, skirmisher.hp, skirmisher.imageURI);

        }
    }
}