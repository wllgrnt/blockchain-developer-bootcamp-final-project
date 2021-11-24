// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Raffle is Ownable, VRFConsumerBase {

  // used by the chainlink VRF (below is true only for Rinkeby)
  address internal linkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
  address internal vrfCoordinator = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
  bytes32 internal keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
  uint256 internal fee = 0.1 * 10 ** 18;
  bool RAFFLE_IN_PROGESS = false;

  event RaffleInProgess(bytes32 requestId);
  event RaffleWinnerChosen(bytes32 requestId, address winner);

  mapping(address => bool) internal entrants;
  address[] internal entrants_array;
  address public winner;

  // mapping(address => bool) public winners;
  constructor() 
        VRFConsumerBase(
            vrfCoordinator, // VRF Coordinator
            linkToken  // LINK Token
        )
    {
    }

    /** 
     * Requests randomness 
     */
    function getRaffleWinner() public onlyOwner returns (bytes32 requestId) {
        require(entrants_array.length >= 1, "Need at least one entrant");
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        requestId = requestRandomness(keyHash, fee);
        emit RaffleInProgess(requestId);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 winner_index = randomness % entrants_array.length;
        winner = entrants_array[winner_index];
        emit RaffleWinnerChosen(requestId, winner);
    }

    function withdrawLink() public onlyOwner {
        // return LINK to owner
        uint256 link_balance = LINK.balanceOf(address(this));
        LINK.transfer(msg.sender, link_balance);
    }

    function linkBalance() public view returns (uint256 balance) {
     return LINK.balanceOf(address(this));
    }

  // does nothing for now, could have checks on address used.
  modifier entrantValid(address _entrant) {
    require(entrants[_entrant] != true, "Only one entry per address");
    _;
  }

  // sign a message or something, need this to be easy and cheap.
  function claimTicket() public entrantValid(msg.sender) {
    entrants[msg.sender] = true;
    entrants_array.push(msg.sender);
  }

  // run the raffle. Use Chainlinks' RNG provider.
  function raffle() public view onlyOwner returns (bool) {
    return true;
  }

  // mint one of the NFTs
  function mint() public payable returns (bool) {
    return true;
  }
}