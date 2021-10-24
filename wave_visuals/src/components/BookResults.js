import React, { useEffect } from 'react';
import './styles/BookResults.css';

/* // TODO: Evaluate IPFS to store:
 * Data: js.ipfs.io
 */
function BookResults(props) {
  const { savedBooks } = props.data;

  return (
    <div className='main'>
      {savedBooks ? (
        <div id='book-data-complete'>
          {savedBooks.map((book, index) => {
            return (
              <ul key={index}>
                <li>Sender: {book.address}</li>
                <li style={{ fontWeight: 'bold' }}>Book Name: {book.name}</li>
                <li>Shared on: {book.timestamp.toString()}</li>
              </ul>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default BookResults;
