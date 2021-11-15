import React from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";

import "./App.css";

import { useWeb3React } from '@web3-react/core'


import { useEagerConnect, useInactiveListener } from './hooks'
import { injected } from './connectors'


import { Spinner } from './components/Spinner'
import ChainId from "./components/ChainId";
import BlockNumber from "./components/BlockNumber";
import Address from "./components/Address";
import { getErrorMessage } from "./utils"
import Balance from "./components/Balance";

function Header() {
  const { active, error } = useWeb3React()

  return (
    <>
      <h3
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          maxWidth: '50rem',
          lineHeight: '2rem',
          margin: 'auto'
        }}
      >
        <ChainId />
        <BlockNumber />
        <Address />
        <Balance />
        {/* <h1 style={{ margin: '1rem', textAlign: 'right' }}>{active ? '🟢' : error ? '🔴' : '🟠'}</h1> */}

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
  // const name = 'Injected'

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
          // key={connected ? 'Connected': 'Connect'}
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
            {/* {activating && <Spinner color={'black'} style={{ height: '25%', marginLeft: '-1rem' }} />}                 */}
          </div>
          {connected ? 'Connected' : 'Connect to Wallet'}
        </button>
      {/* </div> */}
      {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> */}
        {(active || error) && (
          <button
            style={{
              height: '3rem',
              // marginTop: '2rem',
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
        {/* {!!(chainId) && (
          // Add a contract call in here.
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {connector.changeChainId(chainId === 1 ? 4 : 1)
            }}
          >
            Switch Networks
          </button>
        )} */}
      </div>
    </>
  )
}





export default App;
