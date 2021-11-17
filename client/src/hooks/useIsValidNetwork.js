import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';

const supportedNetworks = [4];

function useIsValidNetwork() {
  const { chainId } = useWeb3React();

  const isValidNetwork = useMemo(() => {
    return supportedNetworks.includes(chainId);
  }, [chainId]);

  return {
    isValidNetwork: isValidNetwork,
  };
}

export default useIsValidNetwork;
