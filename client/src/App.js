import React, { Component, useState } from "react";
import RaffleContract from "./contracts/Raffle.json";
import Web3 from "web3";
import { Container } from 'react-bootstrap';

import "./App.css";

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
  nullAddress = "0x0000000000000000000000000000000000000000";

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
      web3.eth.handleRevert = true;
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RaffleContract.networks[networkId];
      const instance = new web3.eth.Contract(
        RaffleContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const ticketsSold = await instance.methods.ticketsSold().call();
      const entrantInRaffle = await instance.methods.entrantInRaffle(accounts[0]).call();
      const winner = await instance.methods.winner().call();
      // TODO pass this in accounts[0]);
      this.setState({
        web3,
        accounts,
        connected: true,
        contract: instance,
        address: deployedNetwork.address,
        ticketsSold: ticketsSold,
        entrantInRaffle: entrantInRaffle,
        winner: winner
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
      await this.state.contract.methods.claimTicket().send({ from: this.state.accounts[0] }).on('error', function (error, receipt) {
        console.log(error);
      });
      const ticketsSold = await this.state.contract.methods.ticketsSold().call();
      this.setState({ ticketsSold: ticketsSold });
      const entrantInRaffle = await this.state.contract.methods.entrantInRaffle(this.state.accounts[0]).call();
      this.setState({ entrantInRaffle: entrantInRaffle });
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

  resetRaffle = async (event) => {
    try {
      await this.state.contract.methods.resetRaffle().send({ from: this.state.accounts[0] }).on('error', function (error, receipt) {
        console.log(error);
      });
      const ticketsSold = await this.state.contract.methods.ticketsSold().call();
      this.setState({ ticketsSold: ticketsSold });
      const entrantInRaffle = await this.state.contract.methods.entrantInRaffle(this.state.accounts[0]).call();
      this.setState({ entrantInRaffle: entrantInRaffle });
      const winner = await this.state.contract.methods.winner().call();
      this.setState({ winner: winner });
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

  runRaffle = async (event) => {
    try {
      await this.state.contract.methods.getRaffleWinner().send({ from: this.state.accounts[0] }).on('error', function (error, receipt) {
        console.log(error);
      });
      this.state.contract.once('RaffleWinnerChosen', (error, event) => {
        const winner = this.state.contract.methods.winner();
        this.setState({ winner: winner });
      });
      const winner = this.state.contract.methods.winner();
      this.setState({ winner: winner });
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


  render() {
    return (
      <Container className="App">
        <button onClick={this.connectToWallet.bind(this)}>Connect</button>
        <h1>Raffle</h1>
        {this.state.connected && <div>
          <p>Connected with account: {this.state.accounts}</p>
          <p>Contract address: {this.state.address} </p>
          <p>Total number of entrants is: {this.state.ticketsSold || 0} </p>
          <p> You are {!this.state.entrantInRaffle && "not"} in the raffle </p>
          {/* {this.state.winner !== this.nullAddress && <p> winner is {this.state.winner}</p> } */}
          {this.state.winner !== this.nullAddress && this.state.winner == this.state.accounts && <p> You are the winner! </p>}
          {this.state.winner !== this.nullAddress && this.state.winner != this.state.accounts && <p> You did not win :(</p>}
          {this.state.winner === this.nullAddress && <p> Raffle has not yet started</p>}

          {/* <button onClick={this.setStorageValueToFive.bind(this)}>Set storage to 5</button> */}
          <button onClick={this.claimTicket.bind(this)}>Buy ticket</button>
          <h2>Admin zone</h2>
          <button onClick={this.resetRaffle.bind(this)}>Reset Raffle</button>
          <button onClick={this.runRaffle.bind(this)}>Run Raffle</button>

          {/* <button onClick={this.setStorageValueToZero.bind(this)}>Set storage to 0</button> */}
        </div>
        }
      </Container>
    );
  }
}

export default App;
