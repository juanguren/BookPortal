// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    // state variables
    uint totalWaves; // undefined integer have initial values of 0 in solidity
    uint256 initialGas = gasleft();

    constructor() {
        console.log("Hey!", "|", " Available gas:", initialGas);
    }

    function wave() public { // has access to declared variable
        totalWaves += 1;
        console.log("%s is waved!", msg.sender );
    }

    // View function declares that no state will be changed.
    function getTotalWaves() public view returns (uint) {
        console.log("We have %d total waves", totalWaves);
        return totalWaves;
    }

    function getGasLeft() public view returns (uint256) {
        return initialGas - gasleft();
    }
}

