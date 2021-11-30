// Tests for Raffle.sol. We cannot test the oracle call locally, so test the surrounding functions:
// resetRaffle (necessary for all tests):
// - check that after a reset ticketsSold reads zero.
// - check that only the owner can do this.
// claimTicket:
//   - check that if you perform five claims then all five are in the entrant map
//   - check that double-entry is not allowed
//  getRaffleWinner:
//   - check that if the owner calls the function with zero entrants there's an error
//   - check that non-owners can't call the function
//  ticketsSold:
//   - check that the behaviour is expected (e.g. after three entrants, return 3)
//  withdrawLink:
//   - check that non-owners cannot call this function.

const Raffle = artifacts.require("Raffle");
const truffleAssert = require('truffle-assertions');

contract("Raffle", accounts => {
  // reduce boilerplate by deploying the contract for each test.
  let raffleInstance;
  beforeEach('should setup the contract instance', async () => {
    raffleInstance = await Raffle.deployed();
  });

  it("resets the raffle to have zero entrants", async () => {
    // add some entrants
    for (let i = 0; i < 5; i++) {
      await raffleInstance.claimTicket({ from: accounts[i] });
    }
    let ticketsSold = await raffleInstance.ticketsSold({ from: accounts[0] });
    assert.equal(ticketsSold, 5);
    await raffleInstance.resetRaffle({ from: accounts[0] });
    ticketsSold = await raffleInstance.ticketsSold({ from: accounts[0] });
    assert.equal(ticketsSold, 0);

  });

  it("can't reset the raffle if not an owner", async () => {
    // add some entrants
    for (let i = 0; i < 5; i++) {
      await raffleInstance.claimTicket({ from: accounts[i] });
    }
    let ticketsSold = await raffleInstance.ticketsSold({ from: accounts[0] });
    assert.equal(ticketsSold, 5);
    await truffleAssert.reverts(raffleInstance.resetRaffle({ from: accounts[1] }));
    ticketsSold = await raffleInstance.ticketsSold({ from: accounts[0] });
    assert.equal(ticketsSold, 5);

  });


  it("can't call raffle with no entrants", async () => {
    await raffleInstance.resetRaffle({ from: accounts[0] });
    await truffleAssert.reverts(raffleInstance.getRaffleWinner({ from: accounts[0] }));
  });

  it("five claims give five entrants", async () => {
    await raffleInstance.resetRaffle({ from: accounts[0] });
    for (let i = 0; i < 5; i++) {
      await raffleInstance.claimTicket({ from: accounts[i] });
      let entrantInRaffle = await raffleInstance.entrantInRaffle(accounts[i], { from: accounts[i] });
      assert.isTrue(entrantInRaffle, 'Entrant not successfully added');
    }
  });

  it("no double-entry", async () => {
    await raffleInstance.resetRaffle({ from: accounts[0] });

    // entrant should be added.
    await raffleInstance.claimTicket({ from: accounts[0] });
    entrantInRaffle = await raffleInstance.entrantInRaffle(accounts[0], { from: accounts[0] });
    assert.isTrue(entrantInRaffle)
    // entrant should not be allowed to enter again.
    await truffleAssert.reverts(raffleInstance.claimTicket({ from: accounts[0] }));
  });


  it("non-owner can't call the raffle", async () => {
    await raffleInstance.resetRaffle({ from: accounts[0] });

    // add an entrant
    await raffleInstance.claimTicket({ from: accounts[0] });
    await truffleAssert.reverts(raffleInstance.getRaffleWinner({ from: accounts[1] }));
  });

  it("ticketSold should return proper values", async () => {
    await raffleInstance.resetRaffle({ from: accounts[0] });

    let ticketsSold = await raffleInstance.ticketsSold({ from: accounts[0] });
    assert.equal(ticketsSold, 0, 'should return 0 with no entrants');
    await raffleInstance.claimTicket({ from: accounts[0] });
    ticketsSold = await raffleInstance.ticketsSold({ from: accounts[0] });
    assert.equal(ticketsSold, 1, 'should return 1 with one entrant');
    await raffleInstance.claimTicket({ from: accounts[1] });
    ticketsSold = await raffleInstance.ticketsSold({ from: accounts[0] });
    assert.equal(ticketsSold, 2, 'should return 2 with one entrant');
  });

  it("withdrawLink should only be callable by contract deployer", async () => {
    await truffleAssert.reverts(raffleInstance.withdrawLink({ from: accounts[1] }));
  });
});





// const SimpleStorage = artifacts.require("./SimpleStorage.sol");

// contract("SimpleStorage", accounts => {
//   it("...should store the value 89.", async () => {
//     const simpleStorageInstance = await SimpleStorage.deployed();

//     // Set value of 89
//     await simpleStorageInstance.set(89, { from: accounts[0] });

//     // Get stored value
//     const storedData = await simpleStorageInstance.get.call();

//     assert.equal(storedData, 89, "The value 89 was not stored.");
//   });
// });
