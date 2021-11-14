import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
// import getWeb3 from "./getWeb3";
import Web3 from "web3";

import "./App.css";
// import getWeb3 from "./getWeb3";
// import getWeb3 from "./getWeb3";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null};

   runExample = async () => {
    const { web3 } = this.state;
    if (web3 === null) {
      this.getWeb3();
    }
    
    const {contract, accounts} = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  // storeValue = async () => {
  //   const { accounts, contract } = this.state;
  //   await this.getValue();
  //   await contract.methods.set(this.state.storageValue + 5, { from: accounts[0] });
  //   await this.getValue();
  // }

  getValue = async () => {
    const { contract } = this.state;
    const response = await contract.methods.get().call();
    this.setState({ storageValue: response});
  }







  getWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Accounts now exposed
          return web3;
        } catch (error) {
          console.log(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        return web3;
      }
    return null;
  }

  connectToWallet = async (event) => {
    try{
      const web3 = await this.getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.connectToWallet.bind(this)}>Connect</button>

        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <button onClick={this.runExample.bind(this)}>Add 5 to the balance</button>
        <div>
          <p>The stored value is: {this.state.storageValue}</p>
        <button onClick={this.getValue.bind(this)}>Refresh</button>

        </div>
      </div>
    );
  }
}

export default App;
