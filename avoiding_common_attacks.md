# avoiding_common_attacks

We implement the following features discussed in Solidity Pitfalls and Attacks:

- Using Specific Compiler Pragma - here 0.8.10 is used
- Proper User of Require, Assert, and Revert - we use require liberally to validate input arguments.
- Use Modifiers Only for Validations

The following smart contract weaknesses are mitigated:
- SWC-101: We avoid integer overflow/underflow by using more recent Solidity compilers (though no arithmetic is performed in this contract).
- SWC-102: We use the latest compiler version.
- SWC-115: We use msg.sender over tx.origin when checking accounts' addresses.
- SWC-120: We use an external oracle to generate our random numbers rather than relying on e.g. block hashes or timestamps.