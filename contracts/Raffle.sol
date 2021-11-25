// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

/// @title A Raffle contract for allocating prizes.
/// @author William P. Grant
/// This randomly chooses a winner, but doesn't currently give the winner anything, and is bottable.
/// @dev Contract must be funded with LINK to function (use the Rinkeby faucet).
contract Raffle is Ownable, VRFConsumerBase {
    // used by the chainlink VRF (below is true only for Rinkeby)
    address internal linkToken = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
    address internal vrfCoordinator =
        0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B;
    bytes32 internal keyHash =
        0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
    uint256 internal fee = 0.1 * 10**18;

    mapping(address => bool) internal entrants;
    address[] internal entrants_array;

    /// @dev N.B this is uninitialised until a winner is chosen. Should always be in entrants and entrants_array.
    address public winner;

    /// Emitted once the random number has been requested from the external oracle.
    /// @param requestId Used internally by the oracle.
    event RaffleInProgess(bytes32 requestId);

    /// Emitted once the random number has been received and used to choose a winner.
    /// @param requestId Used internally by the oracle.
    /// @param winner The address of the winner of the raffle.
    event RaffleWinnerChosen(bytes32 requestId, address winner);

    /// Initialises the contract with hardcoded Rinkeby VRF info.
    constructor()
        VRFConsumerBase(
            vrfCoordinator, // VRF Coordinator
            linkToken // LINK Token
        )
    {}

    /// Requests the random number used to assign a winner, which is then
    /// acted on by fulfillRandomness.
    /// @return requestId The internal oracle id.
    function getRaffleWinner() public onlyOwner returns (bytes32 requestId) {
        require(entrants_array.length >= 1, "Need at least one entrant");
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        requestId = requestRandomness(keyHash, fee);
        emit RaffleInProgess(requestId);
    }

    /// Required as part of the VRF interface. Uses the randomness from requestRandomness()
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        uint256 winner_index = randomness % entrants_array.length;
        winner = entrants_array[winner_index];
        emit RaffleWinnerChosen(requestId, winner);
    }

    /// Utility to withdraw spare LINK.
    function withdrawLink() public onlyOwner {
        // return LINK to owner
        uint256 link_balance = LINK.balanceOf(address(this));
        LINK.transfer(msg.sender, link_balance);
    }

    /// Utility to check that the contract is funded before it's used.
    function linkBalance() public view returns (uint256 balance) {
        return LINK.balanceOf(address(this));
    }

    /// Enforces one raffle entry per unique address.
    modifier entrantValid(address _entrant) {
        require(entrants[_entrant] != true, "Only one entry per address");
        _;
    }

    /// adds the message sender to the list of raffle entrants. Cost only gas.
    function claimTicket() public entrantValid(msg.sender) {
        entrants[msg.sender] = true;
        entrants_array.push(msg.sender);
    }

    /// Used to display odds to the frontend.
    function ticketsSold() public view returns (uint256) {
        return entrants_array.length;
    }

    /// Reset the raffle, removing all entrants
    function resetRaffle() public onlyOwner {
        for (uint256 i = 0; i < entrants_array.length; i++) {
            entrants[entrants_array[i]] = false;
        }
        delete entrants_array;
    }

    /// Used to check entry status on the frontend.
    function entrantInRaffle() public view returns (bool) {
        return entrants[msg.sender];
    }

    /// Used to distinguish the winner on the frontend.
    /// @dev This is basically a no-op currently but could be used to e.g. mint coveted NFTs.
    function claimPrize() public view returns (bool) {
        if (msg.sender == winner) {
            return true;
        } else {
            return false;
        }
    }
}
