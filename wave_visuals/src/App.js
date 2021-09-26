import * as React from 'react';
import { ethers } from 'ethers';
import './App.css';
import waveportal from './utils/wavePortal.json';
import { useEffect, useState } from 'react';
import BookResults from './components/BookResults';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [txnIsLoading, setTxnInProgress] = useState(false);
  const [txnIsMined, setTxnCompleted] = useState(false);
  const [bookCount, setBookCount] = useState({});

  const contractAddress = '0xf44F14da5bCa5b02e4680CAb31051495A329dff3';

  const walletIsConnected = async () => {
    const { ethereum: eth } = window; // Injected by Metamask into the browser
    // TODO: Change this to a notification handler function. No alerts.
    if (eth) console.log({ ethereumObject: eth });

    const authorizedAccount = await eth.request({ method: 'eth_accounts' });
    if (authorizedAccount.length > 0) {
      const account = authorizedAccount[0];
      setCurrentAccount(account); // Saves current session's account;
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

  const wave = async () => {
    const { ethereum: eth } = window;
    const waveABI = waveportal.abi;
    try {
      const provider = new ethers.providers.Web3Provider(eth); // a connection to the blockchain. Web3 interacts with the blockchain using the provider.
      const signer = provider.getSigner(); // Is an account for signing the transaction. Can be used to sign messages and transactions
      // Connecting to our whole contract
      const waveContract = new ethers.Contract(
        contractAddress,
        waveABI,
        signer
      );
      /**
       * Here we execute the wave. This modifies the state, thus initiating a transaction
       * 👇👇👇
       */
      const waveTxn = await waveContract.wave();
      setTxnInProgress(true); // Only if metamask's pop-up gets accepted
      console.log('Mining...');
      await waveTxn.wait(); // Waits while the computation is executed by miners
      console.log(`Mined -- ${waveTxn.hash}`);
      /**
       * 👆👆👆
       */
      if (waveTxn.hash) {
        setTxnInProgress(false);
        setTxnCompleted(true);

        setTimeout(() => {
          setTxnCompleted(false);
        }, 5000);

        const bookCount = await waveContract.getTotalWaves(); // Total waves after transaction
        const accountBookCount = await waveContract.getWavesPerUser(
          currentAccount
        );
        setBookCount({
          bookCount: bookCount.toString(),
          accountBookCount: accountBookCount.toString(),
        });
      }
    } catch (error) {
      console.log(error); // TODO: Notification handler
      setTxnCompleted(false);
    }
  };

  return (
    <div>
      <div className='mainContainer'>
        <div className='dataContainer'>
          <div className='header'> Book Portal 📖 </div>
          <h1> Hi! I'm Juan 👋 </h1>
          <div className='bio'>
            I'm a Software Dev learning Blockchain development! Please connect
            your Ethereum wallet and share your favorite book with me!
          </div>
          <form onClick={(e) => e.preventDefault()}>
            {/*currentAccount ? (
            <input type='text' className='waveText' placeholder='...'></input>
          ) : null */}
            {currentAccount ? (
              <button className='waveButton' onClick={wave}>
                Share book!
              </button>
            ) : null}
          </form>

          {txnIsLoading ? <h4>Saving...</h4> : null}
          {txnIsMined ? (
            <h4>Received! Your book has been recorded on the blockchain!</h4>
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
      <BookResults books={bookCount ? bookCount : null} />
    </div>
  );
}

export default App;
