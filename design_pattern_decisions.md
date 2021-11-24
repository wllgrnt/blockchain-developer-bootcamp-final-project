# design_pattern_decisions

This contract uses the following design patterns:

-  Inheritance - we inherit from Openzeppelin's Ownable to restrict access to key functions, and Chainlink's VRFConsumerBase to use the Chainlink RNG oracle.
-  Oracles - we are running a raffle, and therefore need non-gameable randomisation when choosing the winner. We use the Chainlink verifiable random function for this.
-  Access Control Design Patterns - see Ownable above.