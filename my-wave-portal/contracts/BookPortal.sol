// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./structs/Book.sol";

contract BookPortal {
    // state elements
    string private contractName = "BookPortal."; 
    uint256 totalBooks; 
    mapping(address => uint256) public bookMap;

    // Event declared
    event NewBook(address indexed sender, uint256 timestamp, string message);

    Book[] public books;

    constructor() {
        console.log("Hey! This is", contractName);
    }

    function shareBook(string memory message) public {
        totalBooks += 1;

        // Save the ammount of books per user
        uint userBook = bookMap[msg.sender];
        userBook += 1;
        bookMap[msg.sender] = userBook;

        // Save user-generated message as struct
        books.push(Book(msg.sender, message, block.timestamp));

        // Event emitted: Data is propagated to be stored on transaction logs
        emit NewBook(msg.sender, block.timestamp, message);
    }

    function getTotalBooks() public view returns (uint256, Book[] memory) {
        return (totalBooks, books);
    }

    function getBooksPerUser(address userAddress) public view returns (uint) {
        return bookMap[userAddress];
    }
}

