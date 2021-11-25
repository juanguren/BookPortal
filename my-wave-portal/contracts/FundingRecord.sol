// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import "./structs/Book.sol";

contract FundingRecord {
    Book[] public books; // Struct-like array
    event NewBook(address indexed sender, uint256 timestamp, string book_name);

    function fundAccount() internal {
        uint256 prizeAmount = 0.001 ether; // Fixed
        require(
            prizeAmount <= address(this).balance,
            "Withdraw request exceed contract's funds!"
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}(""); // sends ether
        require(success, "Failed to withdraw funds from contract.");
    }

    function handleBookRecords(string memory book_name) internal {
        // Save user-generated message as struct
        books.push(Book(msg.sender, book_name, block.timestamp));

        // Event emitted: Data is propagated to be stored on transaction logs (EVM)
        emit NewBook(msg.sender, block.timestamp, book_name);
    }
}