// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenTransfer {
    event Transfer(address indexed from, address indexed to, uint256 amount);

    function transfer(address payable _to) external payable {
        require(msg.value > 0, "You need to send some Ether");
        require(_to != address(0), "Invalid recipient address");

        _to.transfer(msg.value);

        emit Transfer(msg.sender, _to, msg.value);
    }
}
