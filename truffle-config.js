const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv');
dotenv.config();
const private_key = process.env.ETH_RINKEBY_PRIVATE_KEY;
const infura_url = process.env.INFURA_RINKEBY_URL;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    rinkeby: {
      provider: () => new HDWalletProvider({privateKeys: [private_key], providerOrUrl: infura_url}),
      network_id: "4",
      gas: 5500000
    }
  },
  compilers: {
    solc: {
      version: "pragma"
    }
  }
};
