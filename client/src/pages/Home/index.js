import React from 'react';
import { Container } from 'react-bootstrap';
import CompInteractionCard from './CompInteractionCard';
import StorageInteractionCard from './StorageInteractionCard';
import ConnectWalletModal from '../../components/ConnectWalletModal';
import useWalletConnectionModal from '../../hooks/useWalletConnectionModal';

const Home = () => {
  const { isWalletConnectModalOpen } = useWalletConnectionModal();
  return (
    <Container className="mt-5">
      {isWalletConnectModalOpen && <ConnectWalletModal />}
      {/* <CompInteractionCard /> */}
      <StorageInteractionCard />
    </Container>
  );
};

export default Home;
