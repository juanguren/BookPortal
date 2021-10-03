// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./structs/Book.sol";

contract BookPortal {
    // state elements 
    uint256 totalBooks; 
    mapping(address => uint256) public bookMap;

    // Event declared
    event NewBook(address indexed sender, uint256 timestamp, string book_name);

    Book[] public books; // Struct-like array
    mapping (address => Book) public book_database; // Struct-like map (searchable)

    constructor() {
        console.log("Hello! This is BookPortal!");
    }

    function shareBook(string memory book_name) public {
        totalBooks += 1;

        // Save the ammount of books per user
        uint userBook = bookMap[msg.sender];
        userBook += 1;
        bookMap[msg.sender] = userBook;
        
        this.handleBookRecords(book_name);
    }

    function handleBookRecords(string memory book_name) public {
        // Save user-generated message as struct
        books.push(Book(msg.sender, book_name, block.timestamp));

        // Event emitted: Data is propagated to be stored on transaction logs
        emit NewBook(msg.sender, block.timestamp, book_name);
    }

    function getTotalBookData() public view returns (Book[] memory) {
        return books; 
    }

    function getTotalBookCount() public view returns (uint256) {
        return totalBooks;
    }

    function getBookCountPerUser(address userAddress) public view returns (uint256) {
        return bookMap[userAddress];
    }
}

