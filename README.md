# blockchain-developer-bootcamp-final-project
Final project for the 2021 Consensys Blockchain Developer certification

Ideas:

1. Raffle mechanism for NFT minting rights, dispersed over some time period,
  thus preventing gas spikes.
2. Transaction viewer to search for bot activity.
3. Something more interesting, non-financial? Hard to incentivise given current
  costs.

## Raffle idea

Current minting is broken - high project demand results in even free mints
being expensive, with all that value captured by miners. There are a variety of
new methods, but they often work around the problem. Having a raffle would
allow fully on-chain minting.

Immediate issue - you need to work around lack of loops and sleep() function.

- Step one of contract, sign up for the raffle.  
- Step two, randomly select the raffle winners.


Issues:
- How do we make signing up for the raffle cheap, but prevent botting?

<!-- 



## Bot viz

Look at 'true' ownership of NFTS - we can probably identify bot activity by
look at tumble. -->

---
## Project criteria

Project must:

1. Contain a README.md file which describes the project, describes the directory structure, and where the frontend project can be accessed (see #8).
2. Contain smart contract(s) which:
   -  Are commented to the specs described here
   -   Use at least two design patterns from the "Smart Contracts" section
   -   Protect against two attack vectors from the "Smart Contracts" section with its the SWC number
   -   Inherits from at least one library or interface
   -   Can be easily compiled, migrated and tested (see #5)
3. Contain a Markdown file named design_pattern_decisions.md and avoiding_common_attacks.md describing your design patterns and security measures.
4. Have at least five unit tests for your smart contract(s) that pass. In the code, include a sentence or two explaining what the tests are covering their expected behavior.
5. Contain a deployed_address.txt file which contains the testnet address and network where your contract(s) have been deployed
6. Have a frontend interface built with a framework like React or HTML/CSS/JS that:
     - Detects the presence of MetaMask
     - Connects to the current account
     - Displays information from your smart contract
     - Allows a user to submit a transaction to update smart contract state
     - Updates the frontend if the transaction is successful or not
7. Hosted on Github Pages, Heroku, Netlify, Fleek, or some other free frontend service that gives users a public interface to your decentralized application. That address should be in your README.md document.
8. Have a folder named scripts which contains these scripts (based on Github's Scripts to Rule Them All):
   - scripts/bootstrap When run locally, it builds or checks for the dependencies of your project.
   - scripts/server Spins up a local testnet and server to serve your decentralized application locally
   - scripts/tests Used to run the test suite for your project.
9. A screencast of you walking through your project, including submitting transactions and seeing the updated state. You can use a screenrecorder of your choosing or something like Loom, and you can share the link to the recording in your README.md.