// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Raffle {

  address payable owner;
  
  mapping(address => bool) public entrants;

  mapping(address => bool) public winners;


  constructor() public {
    owner = msg.sender;
  }
  
  // does nothing for now, could have checks on address used.
  modifier entrantValid(address _entrant) {
    require(entrants[_entrant] != true);
    _;
  }

  modifier onlyOwner {
      require(msg.sender == owner);
      _;
   }

  // sign a message or something, need this to be easy and cheap.
  function claimTicket() public  entrantValid(msg.sender) returns (bool) {
    entrants[msg.sender] = true;
  }

  // run the raffle. Use Chainlinks' RNG provider.
  function raffle() public onlyOwner() returns (bool) {
    return true;
  }

  // mint one of the NFTs
  function mint() public payable returns (bool) {
    return true;
  }
}
