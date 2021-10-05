import * as React from 'react';
import './App.css';
import bookPortal from './utils/bookPortal.json';
import { useEffect, useState } from 'react';
import BookResults from './components/BookResults';
import connectContract from './modules/contractConnection';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [txnIsLoading, setTxnInProgress] = useState(false);
  const [txnIsMined, setTxnCompleted] = useState(false);
  const [bookCount, setBookCount] = useState({});
  const [bookTxnHash, setBookTxnHash] = useState('');

  const contractAddress = '0xa66a3916bCAB115296b1Ec56635d9c646dcc9A07';

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

  const shareBook = async () => {
    const { ethereum: eth } = window;
    const bookABI = bookPortal.abi;
    const savedBooks = [];
    try {
      const bookContract = await connectContract(eth, contractAddress, bookABI);

      const bookTxn = await bookContract.shareBook('The Shell Collector');
      setTxnInProgress(true); // Only if metamask's pop-up gets accepted
      console.log('Mining...');
      await bookTxn.wait(); // Waits while the computation is executed by miners
      setBookTxnHash(bookTxn.hash);
      console.log(`Mined -- ${bookTxn.hash}`);

      if (bookTxn.hash) {
        setTxnInProgress(false);
        setTxnCompleted(true);

        setTimeout(() => {
          setTxnCompleted(false);
        }, 7000);

        const bookCount = await bookContract.getTotalBookCount();
        const accountBookCount = await bookContract.getBookCountPerUser(
          currentAccount
        );
        const getAllBooks = await bookContract.getTotalBookData();
        getAllBooks.forEach((book) => {
          savedBooks.push({
            address: book.sender,
            name: book.book_name,
            timestamp: new Date(book.timestamp * 1000),
          });
        });

        setBookCount({
          bookCount: bookCount.toString(),
          userBookCount: accountBookCount.toString(),
          savedBooks,
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
              <button className='waveButton' onClick={shareBook}>
                Share Book!
              </button>
            ) : null}
          </form>

          {txnIsLoading ? <h4>Saving...</h4> : null}
          {txnIsMined ? (
            <div>
              <h4>Received! Your book has been recorded on the blockchain!</h4>
              <a
                href={`https://rinkeby.etherscan.io/tx/${bookTxnHash}`}
                target='_blank'
                rel='noreferrer'
              >
                <h4>Check it out!</h4>
              </a>
            </div>
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
