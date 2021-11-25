import React, { Component, useState } from "react";
import RaffleContract from "./contracts/Raffle.json";
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
  state = {
    connected: false,
    web3: null,
    accounts: null,
    contract: null,
    address: null,
    ticketsSold: null,
    entrantInRaffle: false,
  };

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
      const deployedNetwork = RaffleContract.networks[networkId];
      const instance = new web3.eth.Contract(
        RaffleContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const ticketsSold = await instance.methods.ticketsSold().call();
      const entrantInRaffle = await instance.methods.entrantInRaffle().call();
      // TODO pass this in accounts[0]);
      this.setState({
        web3,
        accounts,
        connected: true,
        contract: instance,
        address: deployedNetwork.address,
        ticketsSold: ticketsSold,
        entrantInRaffle: entrantInRaffle
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  claimTicket = async (event) => {
    try {
      await this.state.contract.methods.claimTicket().send({ from: this.state.accounts[0] }).catch(e => { console.error(e) });
      const ticketsSold = await this.state.contract.methods.ticketsSold().call();
      this.setState({ ticketsSold: ticketsSold });
    }
    catch (error) {
      if (error.code === 4001) {
        alert('user denied transaction signature');
      }
      else {
        alert('transaction failed');
      }
      console.error(error);
    }
  };

  // submitTransaction = async (value) => {
  //   try {
  //     await this.state.contract.methods.set(value).send({ from: this.state.accounts[0] });
  //   }
  //   catch (error) {
  //     if (error.code === 4001) {
  //       alert('user denied transaction signature');
  //     }
  //     console.log(error);
  //   }
  // }

  // setStorageValueToZero = async () => {
  //   try {
  //     await this.submitTransaction(0).catch(e => { console.error(e) });
  //     const value = await this.state.contract.methods.get().call();
  //     this.setState({ storageValue: value });
  //   }
  //   catch (error) {
  //     alert('transaction failed');
  //     console.log(error);
  //   }
  // };

  // buyTicket = async () => {
  //   try {
  //     await this.state.contract.methods.buyTicket().send({ from: this.state.accounts[0], value: 0.05 });
  //   }
  //   catch (error) {
  //     if (error.code === 4001) {
  //       alert('user denied transaction signature');
  //     }
  //     else {
  //       alert('transaction failed');
  //     }
  //     console.log(error)
  //   }
  // };

  render() {
    return (
      <Container className="App">
        <button onClick={this.connectToWallet.bind(this)}>Connect</button>
        <h1>Raffle</h1>
        {this.state.connected && <div>
          <p>Connected with account: {this.state.accounts}</p>
          <p>Contract address: {this.state.address} </p>
          <p>Contract stored value is: {this.state.storageValue}</p>
          <p>Total number of tickets sold is: {this.state.ticketsSold || 0} </p>
          <p> You are {!this.state.entrantInRaffle && "not"} in the raffle </p>
          {/* <button onClick={this.setStorageValueToFive.bind(this)}>Set storage to 5</button> */}
          <button onClick={this.claimTicket.bind(this)}>Buy ticket</button>
          {/* <button onClick={this.setStorageValueToZero.bind(this)}>Set storage to 0</button> */}
        </div>
        }
      </Container>
    );
  }
}

export default App;
