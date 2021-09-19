import * as React from 'react';
import { ethers } from 'ethers';
import './App.css';

function App() {
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

        <button className='waveButton' onClick={wave}>
          Wave at Me
        </button>
        <p></p>
      </div>
      <footer>
        <h4>Built with ⚡ by Juan Felipe Aranguren</h4>
      </footer>
    </div>
  );
}

export default App;
