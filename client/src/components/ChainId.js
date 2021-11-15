import React from "react";
import { useWeb3React } from '@web3-react/core';

function ChainId() {
    const { chainId } = useWeb3React()
    return (
        <>
            <div>
            <span>Chain Id: </span>
            {/* <span role="img" aria-label="chain">
                ⛓
            </span> */}
            <span>{chainId === null ? '' : chainId}</span>
            </div>
        </>
    )
}

export default ChainId;