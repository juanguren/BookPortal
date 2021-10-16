import * as React from 'react';
import './App.css';
import { useEffect, useState } from 'react';
import BookResults from './components/BookResults';
import { connection } from './modules/contract';
import web3 from 'web3';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [txnIsLoading, setTxnInProgress] = useState(false);
  const [txnIsMined, setTxnCompleted] = useState(false);
  const [bookTotals, setBookTotals] = useState(null);
  const [bookTxnHash, setBookTxnHash] = useState('');
  const [sharedBooks, setSharedBooks] = useState(0);
  const [personalBooks, setPersonalBooks] = useState(0);
  const [bookName, setBookName] = useState('');

  const retrieveBookTotals = async () => {
    const savedBooks = [];
    try {
      const bookContract = await connection();
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

      setSharedBooks(bookCount.toString());
      setPersonalBooks(accountBookCount.toString());
      setBookTotals({ currentAccount, savedBooks });
    } catch (error) {
      console.log({ error });
    }
  };

  const walletIsConnected = async () => {
    const { ethereum: eth } = window; // Injected by Metamask into the browser
    // TODO: Change this to a notification handler function. No alerts.

    try {
      const authorizedAccount = await eth.request({ method: 'eth_accounts' });
      if (authorizedAccount.length > 0) {
        const account = authorizedAccount[0];
        setCurrentAccount(account); // Saves current session's account;
      } else {
        console.log({ connectionStatus: 'No authorized Metamask account' });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const connectWallet = async () => {
    const { ethereum: eth } = window;
    if (!eth) return alert('Remember to install Metamask Wallet!'); // TODO: Notification handler
    try {
      const accountRequest = await eth.request({
        method: 'eth_requestAccounts',
      });
      const accountToUse = accountRequest[0];
      console.log({ connectionStatus: `Connected! ${accountToUse}` });

      setCurrentAccount(accountToUse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    walletIsConnected();
    retrieveBookTotals();
  });

  const shareBook = async (e) => {
    e.preventDefault();
    try {
      const bookContract = await connection();
      const bookTxn = await bookContract.shareBook(bookName, {
        gasLimit: 300000,
      });
      setTxnInProgress(true); // Only if metamask's pop-up gets accepted
      console.log('Mining...');
      await bookTxn.wait(); // Waits while the computation is executed by miners
      setBookTxnHash(bookTxn.hash);

      const balance = await bookContract.getBalance();
      const ethBalance = web3.utils.fromWei(balance.toString(), 'ether');

      console.log({
        message: `Mined -- ${bookTxn.hash}`,
        contractBalance: ethBalance,
      });

      if (bookTxn.hash) {
        setTxnInProgress(false);
        setTxnCompleted(true);
        setBookName('');

        setTimeout(() => {
          setTxnCompleted(false);
        }, 7000);
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
            I'm a Software Dev learning Blockchain development! I LOVE reading,
            so please connect your Metamask wallet and share your favorite
            book(s) with me!
          </div>
          {currentAccount ? (
            <div className='book-results'>
              <div>
                <h4>
                  Total Books: <span> {sharedBooks} </span>
                </h4>
              </div>
              <div>
                <h4>
                  Your Books: <span> {personalBooks} </span>
                </h4>
              </div>
            </div>
          ) : null}

          {currentAccount ? (
            <form onSubmit={shareBook}>
              <input
                type='text'
                className='waveText'
                placeholder='book here'
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
              ></input>
              <button type='submit' className='waveButton'>
                Share Book!
              </button>
            </form>
          ) : null}

          {txnIsLoading ? <h4>Saving...</h4> : null}
          {txnIsMined ? (
            <div>
              <h4>
                Received! Your book has been{' '}
                <a
                  href={`https://rinkeby.etherscan.io/tx/${bookTxnHash}`}
                  target='_blank'
                  rel='noreferrer'
                  id='etherscan_link'
                >
                  recorded
                </a>{' '}
                on the blockchain!
              </h4>
            </div>
          ) : null}

          {currentAccount ? null : (
            <button className='waveButton' onClick={connectWallet}>
              Connect your Wallet
            </button>
          )}
          <p></p>
        </div>
      </div>
      <footer>
        <h4>
          Built with ⚡ by{' '}
          <a
            style={{ textDecoration: 'none' }}
            href='https://twitter.com/juanguren'
          >
            @juanguren
          </a>
        </h4>
      </footer>
      {bookTotals ? <BookResults data={bookTotals} /> : null}
    </div>
  );
}

export default App;
