// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    // state variables
    string private contractName = "WavePortal."; // The `public` modifier makes a variable readable from outside the contract.
    uint totalWaves; // unassigned integers have initial values of 0 in solidity
    uint256 initialGas = gasleft();
    mapping(address => uint) public waveMap;

    constructor() {
        console.log("Hey! This is", contractName, "Available gas:", initialGas);
    }

    function wave() public { // has access to declared variable
        totalWaves += 1;
        console.log("%s is waved!", msg.sender );

        // Saving the ammount of waves per user
        uint userWave = waveMap[msg.sender];
        userWave += 1;
        waveMap[msg.sender] = userWave;
    }

    // View function declares that no state will be changed.
    function getTotalWaves() public view returns (uint) {
        console.log("We have %d total waves", totalWaves);
        return totalWaves;
    }

    function getWavesPerUser(address userAddress) public view returns (uint) {
        return waveMap[userAddress];
    }
}

