import * as React from 'react';
import './App.css';
import { useEffect, useState } from 'react';
import BookResults from './components/BookResults';
import { connection } from './modules/contract';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [txnIsLoading, setTxnInProgress] = useState(false);
  const [txnIsMined, setTxnCompleted] = useState(false);
  const [bookCount, setBookCount] = useState({});
  const [bookTxnHash, setBookTxnHash] = useState('');
  const [sharedBooks, setSharedBooks] = useState(0);
  const [personalBooks, setPersonalBooks] = useState(0);

  const retrieveBookTotals = async () => {
    try {
      const bookContract = await connection();
      const bookCount = await bookContract.getTotalBookCount();
      const accountBookCount = await bookContract.getBookCountPerUser(
        currentAccount
      );

      setPersonalBooks(accountBookCount.toString());
      setSharedBooks(bookCount.toString());
    } catch (error) {
      console.log({ error });
    }
  };

  const walletIsConnected = async () => {
    const { ethereum: eth } = window; // Injected by Metamask into the browser
    // TODO: Change this to a notification handler function. No alerts.
    if (eth) console.log({ ethereumObject: eth });

    try {
      const authorizedAccount = await eth.request({ method: 'eth_accounts' });
      if (authorizedAccount.length > 0) {
        const account = authorizedAccount[0];
        setCurrentAccount(account); // Saves current session's account;
      } else {
        console.log('No authorized Metamask account');
      }
    } catch (error) {
      console.log({ error });
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
    retrieveBookTotals();
  });

  const shareBook = async () => {
    const savedBooks = [];
    try {
      const bookContract = await connection();

      const bookTxn = await bookContract.shareBook(
        'To Sleep In a Sea of Stars'
      );
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

        const getAllBooks = await bookContract.getTotalBookData();
        getAllBooks.forEach((book) => {
          savedBooks.push({
            address: book.sender,
            name: book.book_name,
            timestamp: new Date(book.timestamp * 1000),
          });
        });

        setBookCount({
          currentAccount,
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
          <form onClick={(e) => e.preventDefault()}>
            {currentAccount ? (
              <input type='text' className='waveText' placeholder='...'></input>
            ) : null}
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
      </div>
      <footer>
        <h4>Built with ⚡ by Juan Felipe Aranguren</h4>
      </footer>
      <BookResults props={bookCount ? bookCount : null} />
    </div>
  );
}

export default App;
