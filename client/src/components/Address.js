import React from "react";
import { useWeb3React } from '@web3-react/core';

export function Address() {
    const { account } = useWeb3React()
  
    return (
      <><div>
        <span>Address: </span>
        {/* <span role="img" aria-label="robot">
          🤖
        </span> */}
        <span>
          {account === null
            ? '-'
            : account
            ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
            : ''}
        </span>
        </div>
      </>
    )
  }

  export default Address;