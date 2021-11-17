import { useContract } from './useContract';
import C_TOKEN_ABI from '../static/cEthABI';
import useIsValidNetwork from './useIsValidNetwork';
import { useWeb3React } from '@web3-react/core';
import { useAppContext } from '../AppContext';
import { formatUnits, parseEther } from '@ethersproject/units';
import { useEffect } from 'react';

import SimpleStorageContract from "../contracts/SimpleStorage.json";


export const useSimpleStorage = () => {
  const { account, chainId } = useWeb3React();
  const { isValidNetwork } = useIsValidNetwork();
  // const cTokenContractAddress = '0xd6801a1dffcd0a410336ef88def4320d6df1883e'; // rinkeby
  const deployedNetwork = SimpleStorageContract.networks[4];  // TODO set this beforehand
  const storageAddress = deployedNetwork.address;
  const storageContract = useContract(storageAddress, SimpleStorageContract.abi);
  const { setBalance, setExchangeRate, setTxnStatus, storageBalance, exchangeRate } = useAppContext();
  console.log(chainId);

  const getBalance = async () => {
    const storageBalance = await storageContract.get();;
    setBalance(storageBalance);
  };

  // const getCTokenExchangeRate = async () => {
  //   try {
  //     let exchangeRateCurrent = await cTokenContract.callStatic.exchangeRateCurrent();
  //     exchangeRateCurrent = exchangeRateCurrent / Math.pow(10, 18 + 18 - 8);
  //     setExchangeRate(exchangeRateCurrent);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };




  const setBalanceContract = async (amount) => {
    if (account && isValidNetwork) {
      try {
        setTxnStatus('LOADING');
        const txn = await storageContract.set(amount); 
        const result = await txn.wait();
        await getBalance();
        setTxnStatus('COMPLETE');
      } catch (error) {
        console.log(error);
        setTxnStatus('ERROR');
      }
    }
  };

  // const deposit = async (amount) => {
  //   if (account && isValidNetwork) {
  //     try {
  //       setTxnStatus('LOADING');
  //       const txn = await cTokenContract.mint({
  //         from: account,
  //         value: parseEther(amount),
  //       });
  //       await txn.wait(1);
  //       await fetchCTokenBalance();
  //       setTxnStatus('COMPLETE');
  //     } catch (error) {
  //       setTxnStatus('ERROR');
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (account) {
  //     getCTokenExchangeRate();
  //   }
  // }, [account]);

  return {
    // cTokenBalance,
    storageBalance,
    setBalanceContract,
    // exchangeRate,
    // getCTokenExchangeRate,
    getBalance,
    // fetchCTokenBalance,
    // deposit,
  };
};
