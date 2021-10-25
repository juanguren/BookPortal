// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./structs/Book.sol";

contract BookPortal { // 0xACD6317D2758bf692755D26e2C8037D3aE2109B7
    // A payable user guarantees that it will be able to receive ether via .call{}("")
    address payable public user;

    constructor() payable { // payable constructors can receive ether
        console.log("Hello! This is the BookPortal Contract!");
        user = payable(msg.sender);
    }

    // state elements 
    uint256 private seed; // Visible for this contract, not derived ones
    uint256 totalBooks; 
    mapping(address => uint256) public bookMap;

    // Event declared
    event NewBook(address indexed sender, uint256 timestamp, string book_name);

    Book[] public books; // Struct-like array

    function shareBook(string memory book_name) public {
        totalBooks += 1;

        // Save the ammount of books per user
        uint userBook = bookMap[msg.sender];
        userBook += 1;
        bookMap[msg.sender] = userBook;

        handleBookRecords(book_name);

        uint256 randomNumber = (block.difficulty + block.timestamp + seed) % 100;
        seed = randomNumber;

        if(randomNumber < 50) {
            this.fundingOperations();
        }
    }

    function handleBookRecords(string memory book_name) private {
        // Save user-generated message as struct
        books.push(Book(msg.sender, book_name, block.timestamp));

        // Event emitted: Data is propagated to be stored on transaction logs (EVM)
        emit NewBook(msg.sender, block.timestamp, book_name);
    }

    function fundingOperations() public payable {
        uint256 prizeAmount = 0.001 ether; // Fixed
        require(
            prizeAmount <= address(this).balance,
            "Withdraw request exceed contract's funds!"
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}(""); // sends ether
        require(success, "Failed to withdraw funds from contract.");
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

