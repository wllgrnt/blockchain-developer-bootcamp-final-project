import React, { Component, useState } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Web3 from "web3";
import { Container } from 'react-bootstrap';

import "./App.css";

// window.onunhandledrejection = function(evt) { console.log(evt)};

// process.on('unhandledRejection', (reason, p) => {
//   console.error(`Unhandled Rejection`);
// });
// const Input = () => {
//   const [ stor, setStor ] = useState(0);
//   return (
//       <div className="d-flex">
//         <input
//           type="number"
//           value={stor}
//           onChange={(e) => {
//             if (e.target.value >= 0) {
//               setStor(e.target.value);
//             }
//           }}
//         />
//       </div>
//   );
// };


class App extends Component {
  state = { connected: false, storageValue: 0, web3: null, accounts: null, contract: null, address: null};

  componentDidCatch(error) {
    // Log or store the error
    console.error(error);
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
    try {
      const web3 = await this.getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const value = await instance.methods.get().call();
      this.setState({ web3, accounts, connected: true, contract: instance, address: deployedNetwork.address, storageValue: value });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  setStorageValueToFive = async (event) => {
    // const [txnStatus, setTxnStatus] = useState('');
    try {
      this.state.contract.methods.set(5).send({ from: this.state.accounts[0] });
      const value = await this.state.contract.methods.get().call();
      this.setState({ storageValue: value });
    }
    catch (error) {
      alert('transaction failed');
      console.error(error);
    }
  };

  submitTransaction = async (value) => {
    try{
      await this.state.contract.methods.set(value).send({ from: this.state.accounts[0] });
  }
  catch(error) {
    if (error.code === 4001) {
      alert('user denied transaction signature');
    }
    console.log(error);
  }
  }

  setStorageValueToZero = async () => {
    try {
      await this.submitTransaction(0).catch(e => {console.error(e)});
      const value = await this.state.contract.methods.get().call();
      this.setState({ storageValue: value });
    }
    catch (error) {
      alert('transaction failed');
      console.log(error);
    }
  };

  buyTicket = async () => {
    try {
      await this.state.contract.methods.buyTicket().send({ from: this.state.accounts[0], value: 0.05});
    }
    catch (error) {
      if (error.code === 4001) {
        alert('user denied transaction signature');
      }
      else {
        alert('transaction failed');
      }
      console.log(error)
    }
  };

  render() {
    return (
      <Container className="App">
      <button onClick={this.connectToWallet.bind(this)}>Connect</button>
        <h1>Raffle</h1>
        {this.state.connected && <div>
          <p>Connected with account: {this.state.accounts}</p>
          <p>Contract address: {this.state.address} </p>
          <p>Contract stored value is: {this.state.storageValue}</p>
          <p>Total number of tickets sold is: {this.state.numberOfTickets || 0} </p>
          <p> You have {this.state.yourTickets || 0} tickets </p>
          <button onClick={this.setStorageValueToFive.bind(this)}>Set storage to 5</button>
          <button onClick={this.buyTicket.bind(this)}>Buy ticket</button>
          <button onClick={this.setStorageValueToZero.bind(this)}>Set storage to 0</button>
        </div>
        }
      </Container>
    );
  }
}

export default App;
