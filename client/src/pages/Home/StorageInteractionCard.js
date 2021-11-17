import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Text from '../../components/Text';
import BalanceInput from '../../components/BalanceInput';
import Input from '../../components/Input';
import Card from '../../components/Card';
import Button from 'react-bootstrap/Button';
import { colors } from '../../theme';
import { ArrowDown } from 'react-bootstrap-icons';
import { useSimpleStorage } from '../../hooks/useSimpleStorage';
import { useAppContext } from '../../AppContext';
import Spinner from 'react-bootstrap/Spinner';
import useEth from '../../hooks/useEth';
import useTransaction from '../../hooks/useTransaction';
import { useWeb3React } from '@web3-react/core';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  -webkit-box-align: center;
  align-items: center;
  flex: 1 1 0%;
  overflow: hidden auto;
  z-index: 1;
`;

const StorageInteractionCard = () => {
  const [storageAmount, setStorageAmount] = useState(0);
  const { setBalanceContract, storageBalance, fetchBalance } = useSimpleStorage();
  const { ethBalance } = useEth();
  const { txnStatus, setTxnStatus } = useTransaction();
  const handleStorageSubmit = () => setBalanceContract(storageAmount);
  const { account } = useWeb3React();

  
  if (txnStatus === 'LOADING') {
    return (
      <Container show>
        <Card style={{ maxWidth: 420, minHeight: 400 }}>
          <Spinner animation="border" role="status" className="m-auto" />
        </Card>
      </Container>
    );
  }

  if (txnStatus === 'COMPLETE') {
    return (
      <Container show>
        <Card style={{ maxWidth: 420, minHeight: 400 }}>
          <Text block center className="mb-5">
            Txn Was successful!
          </Text>
          <Button onClick={() => setTxnStatus('NOT_SUBMITTED')}>Go Back</Button>
        </Card>
      </Container>
    );
  }

  if (txnStatus === 'ERROR') {
    return (
      <Container show>
        <Card style={{ maxWidth: 420, minHeight: 400 }}>
          <Text>Txn ERROR</Text>
          <Button onClick={() => setTxnStatus('NOT_SUBMITTED')}>Go Back</Button>
        </Card>
      </Container>
    );
  }
  return (
    <Container show>
      <Card style={{ maxWidth: 420, minHeight: 400 }}>
        <Text block t2 color={colors.green} className="mb-3">
          Deposit
        </Text>
        <Text>Storage Balance {account && storageBalance}</Text>
        <Input value={storageAmount} setValue={setStorageAmount} />
        <Button variant="outline-dark" disabled={storageAmount < 0} onClick={handleStorageSubmit} className="mt-3"> 
          Set value to {storageAmount}
        </Button>
      </Card>
    </Container>
  );
};

export default StorageInteractionCard;
