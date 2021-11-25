const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider');
const dotenv = require('dotenv');
dotenv.config();
const private_key = process.env.ETH_RINKEBY_PRIVATE_KEY;
const infura_url = process.env.INFURA_RINKEBY_URL;
const etherscan_key = process.env.ETHERSCAN_KEY;

module.exports = {
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
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: etherscan_key
  }
};
