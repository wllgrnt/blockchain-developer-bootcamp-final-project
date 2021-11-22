import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Web3 from "web3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, address: null };

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
      console.log(instance.methods);
      const value = await instance.methods.get().call();
      this.setState({ web3, accounts, contract: instance, address: deployedNetwork.address, storageValue: value});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  setStorageValueToFive = async (event) => {
    try {
    await this.state.contract.methods.set(5).send({from: this.state.accounts[0]});
    const value = await this.state.contract.methods.get().call();
    this.setState({storageValue: value});
    }
    catch (error) {
      alert('transaction failed');
      console.error(error);
    }
  };

  setStorageValueToZero = async (event) => {
    try {
    await this.state.contract.methods.set(0).send({from: this.state.accounts[0]});
    const value = await this.state.contract.methods.get().call();
    this.setState({storageValue: value});
    }
    catch (error) {
      alert('transaction failed');
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
        <p>Connected with account: {this.state.accounts}</p>
        <p>Contract address: {this.state.address} </p>
        <p>Contract stored value is: {this.state.storageValue}</p>
        <button onClick={this.setStorageValueToFive.bind(this)}>Set storage to 5</button>
        <button onClick={this.setStorageValueToZero.bind(this)}>Set storage to 0</button>

      </div>
    );
  }
}

export default App;
