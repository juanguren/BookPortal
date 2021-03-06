// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./FundingRecord.sol";

contract BookPortal is FundingRecord { // 0xACD6317D2758bf692755D26e2C8037D3aE2109B7
    constructor() payable { // payable constructors can receive ether
        console.log("Hello! This is the BookPortal Contract!");  
    }

    // state elements 
    uint256 private seed; // Visible for this contract, not derived ones
    uint256 totalBooks; 
    mapping(address => uint256) public bookMap;

    function shareBook(string memory book_name) public {
        totalBooks += 1;

        // Save the ammount of books per user
        uint userBook = bookMap[msg.sender];
        userBook += 1;
        bookMap[msg.sender] = userBook;

        handleBookRecords(book_name);

        uint256 randomNumber = (block.difficulty + block.timestamp + seed) % 100;
        seed = randomNumber;

        if(randomNumber < 50) fundAccount();
    }

    function getTotalBookData() public view returns (Book[] memory) {
        return books; 
    }

    function getTotalBookCount() public view returns (uint256) {
        return totalBooks;
    }

    function getBookCountPerUser(address userAddress) public view returns (uint256 count) {
        count = bookMap[userAddress]; // return variable
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}

