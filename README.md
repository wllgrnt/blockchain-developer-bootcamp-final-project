# blockchain-developer-bootcamp-final-project
This is the final project for the 2021 Consensys Blockchain Developer course.

## Overview
This project demonstrates how to use a VRF oracle to run a raffle. Oversubscribed projects in the NFT space and elsewhere currently struggle with fair distribution, and avoiding botting. Free-for-all mints result in incredibly high gas fees, with none of that cost going to the creator. By using a verifiable random function to select from a set of addresses we can improve this. In production, a cost-per-address or anti-botting measure could be added.

## Frontend access
This project can be accessed at https://wpg-blockchain-course.netlify.app (as of 30/11/21).



## Directory structure
This project is based on the React Truffle box.
- **client** - contains the frontend code, based on create-react-app.
- **contracts** - the Solidity code. `Raffle.sol` is the key file describing the contract.
- **migrations** - used by Truffle for deployment.
- **test** - contains Truffle tests for the Solidity code.


## Usage
The project relies on Truffle, installed globally with `npm install -g truffle`.

To install the project dependencies, run `npm install` from the project root.

Run the development console with `truffle develop`.

Within the Truffle development environment, compile with `compile` and migrate with `migrate` (use `migrate --network rinkeby --reset` to re-deploy on the testnet). Run tests with `test`. 

The contract code can be verified on Etherscan with `truffle run verify Raffle --network rinkeby`.

To run the frontend locally, install frontend dependencies with `npm install` from `/client` and `npm run start` to start the React app.

See the below screen recording for a demonstration of the project, including compilation, migration, testing, and interacting with the frontend.

https://www.loom.com/share/31ddc9df6e8e4610be1bcdd2551340a5



## ETH Address
My address is 0xb6c5D999E32C806468A2fF165c2E679dDbD6e569 (williamgrant.eth).

## Future QoL improvements
- better react interface, better handling of errors (propagate to frontend)
- some anti-bot measure
- allow for multiple winners
- make contract upgradable with UUPS.
- listen to emitted events, update frontend

