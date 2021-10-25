import * as React from 'react';
import './App.css';
import { useEffect, useState } from 'react';
import BookResults from './components/BookResults';
import { connection } from './modules/contract';
import web3 from 'web3';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const [txnIsLoading, setTxnInProgress] = useState(false);
  const [txnIsMined, setTxnCompleted] = useState(false);
  const [bookTotals, setBookTotals] = useState(null);
  const [bookTxnHash, setBookTxnHash] = useState('');
  const [sharedBooks, setSharedBooks] = useState(0);
  const [personalBooks, setPersonalBooks] = useState(0);
  const [bookName, setBookName] = useState('');
  const [isWinner, setIsWinner] = useState(false);

  const retrieveTotals = async () => {
    const savedBooks = [];
    try {
      const bookContract = await connection();
      const bookCount = await bookContract.getTotalBookCount();
      const userBookCount = await bookContract.getBookCountPerUser(
        currentAccount
      );
      const getAllBooks = await bookContract.getTotalBookData();
      const contractBalance = await bookContract.getBalance();
      const ethBalance = web3.utils.fromWei(
        contractBalance.toString(),
        'ether'
      );

      getAllBooks.forEach((book) => {
        savedBooks.push({
          address: book.sender,
          name: book.book_name,
          timestamp: moment(new Date(book.timestamp * 1000)).format(
            'MMMM Do YYYY, h:mm:ss a'
          ),
        });
      });

      setSharedBooks(bookCount.toString());
      setPersonalBooks(userBookCount.toString());
      setBookTotals({ savedBooks });
      setCurrentBalance(Number(ethBalance));
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
    try {
      const { ethereum: eth } = window;
      if (!eth) return alert('Remember to install Metamask Wallet!'); // TODO: Notification handler

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
    retrieveTotals();
  });

  const shareBook = async (e) => {
    e.preventDefault();
    const { REACT_APP_ALCHEMY_KEY: ALCHEMY_KEY } = process.env;
    if (bookName.length <= 2) return;

    try {
      const bookContract = await connection();
      const web3 = createAlchemyWeb3(ALCHEMY_KEY);

      const bookTxn = await bookContract.shareBook(bookName, {
        gasLimit: 300000,
      });
      setTxnInProgress(true); // Only if metamask's pop-up gets accepted
      console.log('Mining...');
      await bookTxn.wait(); // Waits while the computation is executed by miners
      setBookTxnHash(bookTxn.hash);

      const balance = await bookContract.getBalance();
      const ethBalance = web3.utils.fromWei(balance.toString(), 'ether');

      if (bookTxn.hash) {
        const blockNumber = await web3.eth.getBlockNumber();

        console.log({
          hash: bookTxn.hash,
          contractBalance: ethBalance,
          blockNumber,
        });

        setTxnInProgress(false);
        setTxnCompleted(true);
        setBookName('');

        if (ethBalance < currentBalance) setIsWinner(true);

        setTimeout(() => {
          setTxnCompleted(false);
          setIsWinner(false);
        }, 7000);
      }
    } catch (error) {
      console.log(error); // TODO: Notification handler
      setTxnCompleted(false);
      setIsWinner(false);
    }
  };

  return (
    <div>
      <div className='mainContainer'>
        <div className='dataContainer'>
          <div className='header'> Book Portal 📖 </div>
          {isWinner ? <h3>You win 0.001 eth 🎉</h3> : null}
          <h1> Hi! I'm Juan 👋 </h1>
          <p className='bio'>
            I'm a Software Dev learning Blockchain development. I LOVE reading,
            so I created BookPortal, an app that lets you share books with me
            (and everyone else). On the Blockchain! <br /> To use it, please
            connect your <span style={{ fontWeight: 'bold' }}> Metamask </span>{' '}
            wallet and share your favorite book(s)!
          </p>
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
            target='_blank'
            rel='noreferrer'
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
