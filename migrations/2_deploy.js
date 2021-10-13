const Raffle = artifacts.require("Raffle");
const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = function (deployer) {
  deployer.deploy(Raffle);
  deployer.deploy(SimpleStorage);
};
