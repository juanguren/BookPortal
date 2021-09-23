import * as React from 'react';
//import { ethers } from 'ethers';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');

  const walletIsConnected = async () => {
    const { ethereum: eth } = window; // Injected by Metamask into the browser
    // TODO: Change this to a notification handler function. No alerts.
    if (!eth) {
      alert('Hey! Remember to install your Metamask wallet!');
    } else {
      console.log(eth);
    }

    const authorizedAccount = await eth.request({ method: 'eth_accounts' });
    if (authorizedAccount.length > 0) {
      const account = authorizedAccount[0];
      setCurrentAccount(account); // Saves current account;
      console.log(`Current account: ${account}`);
    } else {
      console.log('No authorized Metamask account');
    }
  };

  const connectWallet = async () => {
    const { ethereum: eth } = window;
    if (!eth) return alert('Get Metamask!'); // TODO: Notification handler
    try {
      const accountRequest = await eth.request({
        method: 'eth_requestAccounts',
      });
      const accountToUse = accountRequest[0];
      console.log(`Connected! ${accountToUse}`);

      setCurrentAccount(accountToUse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    walletIsConnected();
  }, []);

  const wave = () => {};
  return (
    <div className='mainContainer'>
      <div className='dataContainer'>
        <div className='header'>Hey there! 🚀</div>
        <h1> I'm Juan </h1>
        <div className='bio'>
          I'm a Software Dev learning Blockchain development! Connect your
          Ethereum wallet and wave at me!
        </div>

        {currentAccount ? (
          <button className='waveButton' onClick={wave}>
            Wave at me!
          </button>
        ) : null}

        {currentAccount ? null : (
          <button className='waveButton' onClick={connectWallet}>
            Connect your Wallet
          </button>
        )}
        <p></p>
      </div>
      <footer>
        <h4>Built with ⚡ by Juan Felipe Aranguren</h4>
      </footer>
    </div>
  );
}

export default App;
