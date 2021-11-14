import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
// import getWeb3 from "./getWeb3";
import Web3 from "web3";

import "./App.css";
// import getWeb3 from "./getWeb3";
// import getWeb3 from "./getWeb3";

import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
// import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
// import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import { Web3Provider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'

import { useEagerConnect, useInactiveListener } from './hooks'
import {
  injected,
//   network,
//   walletconnect,
//   walletlink,
//   ledger,
//   trezor,
//   lattice,
//   frame,
//   authereum,
//   fortmatic,
//   magic,
//   portis,
//   torus
} from './connectors'


import { Spinner } from './components/Spinner'


function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected
    // || error instanceof UserRejectedRequestErrorWalletConnect ||
    // error instanceof UserRejectedRequestErrorFrame
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}


function ChainId() {
  const { chainId } = useWeb3React()

  return (
    <>
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span>{chainId === null ? '' : chainId}</span>
    </>
  )
}

function BlockNumber() {
  const { chainId, library } = useWeb3React()

  const [blockNumber, setBlockNumber] = React.useState()
  React.useEffect(() => {
    if (!!library) {
      let stale = false

      library
        .getBlockNumber()
        .then((blockNumber) => {
          if (!stale) {
            setBlockNumber(blockNumber)
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null)
          }
        })

      const updateBlockNumber = (blockNumber) => {
        setBlockNumber(blockNumber)
      }
      library.on('block', updateBlockNumber)

      return () => {
        stale = true
        library.removeListener('block', updateBlockNumber)
        setBlockNumber(undefined)
      }
    }
  }, [library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Block Number</span>
      <span role="img" aria-label="numbers">
        🔢
      </span>
      <span>{blockNumber === null ? 'Error' : blockNumber || ''}</span>
    </>
  )
}

function Account() {
  const { account } = useWeb3React()

  return (
    <>
      <span>Account</span>
      <span role="img" aria-label="robot">
        🤖
      </span>
      <span>
        {account === null
          ? '-'
          : account
          ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
          : ''}
      </span>
    </>
  )
}

function Balance() {
  const { account, library, chainId } = useWeb3React()

  const [balance, setBalance] = React.useState()
  React.useEffect(() => {
    if (!!account && !!library) {
      let stale = false

      library
        .getBalance(account)
        .then((balance) => {
          if (!stale) {
            setBalance(balance)
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null)
          }
        })

      return () => {
        stale = true
        setBalance(undefined)
      }
    }
  }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Balance</span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>{balance === null ? 'Error' : balance ? `Ξ${formatEther(balance)}` : ''}</span>
    </>
  )
}

function Header() {
  const { active, error } = useWeb3React()

  return (
    <>
      <h1 style={{ margin: '1rem', textAlign: 'right' }}>{active ? '🟢' : error ? '🔴' : '🟠'}</h1>
      <h3
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr min-content 1fr',
          maxWidth: '20rem',
          lineHeight: '2rem',
          margin: 'auto'
        }}
      >
        <ChainId />
        <BlockNumber />
        <Account />
        <Balance />
      </h3>
    </>
  )
}


// class App extends Component {
//   state = { storageValue: 0, web3: null, accounts: null, contract: null };

//   // componentDidMount = async () => {
//   //   try {
//   // //     // Get network provider and web3 instance.
//   //     // const web3 = await getWeb3();
//   //     const web3 = new Web3(window.ethereum);
//   //     this.setState({ web3});
//   //   }
//   //   catch (error) {
//   //     alert('Failed to load web3');
//   //     console.error(error);
//   //   }
//   //   };
//   //     // Use web3 to get the user's accounts.
//   //     // const accounts = await web3.eth.getAccounts();

//   //     // Get the contract instance.
//   //     // const networkId = await web3.eth.net.getId();
//   //     // const deployedNetwork = SimpleStorageContract.networks[networkId];
//   //     // const instance = new web3.eth.Contract(
//   //     //   SimpleStorageContract.abi,
//   //     //   deployedNetwork && deployedNetwork.address,
//   //     // );

//   //     // Set web3, accounts, and contract to the state, and then proceed with an
//   //     // example of interacting with the contract's methods.
//   //   //   this.setState({ web3, accounts, contract: instance }, this.runExample);
//   //   } catch (error) {
//   //     // Catch any errors for any of the above operations.
//   //     alert(
//   //       `Failed to load web3, accounts, or contract. Check console for details.`,
//   //     );
//   //     console.error(error);
//   //   }
//   // };

//   // runExample = async () => {
//   //   const { accounts, contract } = this.state;

//   //   // Stores a given value, 5 by default.
//   //   await contract.methods.set(5).send({ from: accounts[0] });

//   //   // Get the value from the contract to prove it worked.
//   //   const response = await contract.methods.get().call();

//   //   // Update state with the result.
//   //   this.setState({ storageValue: response });
//   // };

//   getWeb3 = async () => {
//       if (window.ethereum) {
//         const web3 = new Web3(window.ethereum);
//         try {
//           // Request account access if needed
//           await window.ethereum.enable();
//           // Accounts now exposed
//           return web3;
//         } catch (error) {
//           console.log(error);
//         }
//       }
//       // Legacy dapp browsers...
//       else if (window.web3) {
//         // Use Mist/MetaMask's provider.
//         const web3 = window.web3;
//         return web3;
//       }
//     return null;
//   }

//   connectToWallet = async (event) => {
//     try{
//       const web3 = await this.getWeb3();
//       const accounts = await web3.eth.getAccounts();
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = SimpleStorageContract.networks[networkId];
//       const instance = new web3.eth.Contract(
//         SimpleStorageContract.abi,
//         deployedNetwork && deployedNetwork.address,
//       );
//       this.setState({ web3, accounts, contract: instance });
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`,
//       );
//       console.error(error);
//     }
//   };

  

//   render() {
//     // if (!this.state.web3) {
//     //   return <div>Loading Web3, accounts, and contract...</div>;
//     // }

//     return (
//       <div className="App">
//         <button onClick={this.connectToWallet.bind(this)}>Connect</button>

//         <h1>Good to Go!</h1>
//         <p>Your Truffle Box is installed and ready. test.</p>
//         <h2>Smart Contract Example</h2>
//         <p>
//           If your contracts compiled and migrated successfully, below will show
//           a stored value of 5 (by default).
//         </p>
//         <p>
//           Try changing the value stored on <strong>line 42</strong> of App.js.
//         </p>
//         <div>The stored value is: {this.state.storageValue}</div>
//       </div>
//     );
//   }
// }

function App() {
  const context = useWeb3React();
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  const currentConnector = injected
  const activating = currentConnector === activatingConnector
  const connected = currentConnector === connector
  const disabled = !triedEager || !!activatingConnector || connected || !!error
  const name = 'Injected'

  return (
    <>
      <Header />
      <hr style={{ margin: '2rem' }} />
      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '20rem',
          margin: 'auto'
        }}
      >      
            <button
              style={{
                height: '3rem',
                borderRadius: '1rem',
                borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
                cursor: disabled ? 'unset' : 'pointer',
                position: 'relative'
              }}
              disabled={disabled}
              key={name}
              onClick={() => {
                setActivatingConnector(currentConnector)
                activate(injected)
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'black',
                  margin: '0 0 0 1rem'
                }}
              >
                {activating && <Spinner color={'black'} style={{ height: '25%', marginLeft: '-1rem' }} />}
                {connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {name}
            </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {(active || error) && (
          <button
            style={{
              height: '3rem',
              marginTop: '2rem',
              borderRadius: '1rem',
              borderColor: 'red',
              cursor: 'pointer'
            }}
            onClick={() => {
              deactivate()
            }}
          >
            Deactivate
          </button>
        )}

        {!!error && <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>{getErrorMessage(error)}</h4>}
      </div>

      <hr style={{ margin: '2rem' }} />

      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: 'fit-content',
          maxWidth: '20rem',
          margin: 'auto'
        }}
      >
        {!!(library && account) && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              library
                .getSigner(account)
                .signMessage('👋')
                .then((signature) => {
                  window.alert(`Success!\n\n${signature}`)
                })
                .catch((error) => {
                  window.alert('Failure!' + (error && error.message ? `\n\n${error.message}` : ''))
                })
            }}
          >
            Sign Message
          </button>
        )}
        {!!(chainId) && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              ;connector.changeChainId(chainId === 1 ? 4 : 1)
            }}
          >
            Switch Networks
          </button>
        )}
      </div>
    </>
  )
}





export default App;
