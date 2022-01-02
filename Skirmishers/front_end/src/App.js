import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import {ethers} from 'ethers'
import Skirmishers from './utils/Skirmishers.json';

//Components
import SelectCharacter from './Components/SelectCharacter';

//Variable imports
import {CONTRACT_ADDRESS, transformSkirmisherData} from './constants.js';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [skirmisherNFT, setSkirmisherNFT] = useState(null);

  const checkNetwork = async () => {
    try { 
      if (window.ethereum.networkVersion !== '4') {
        alert("Please connect to Rinkeby!")
      }else{
        console.log("Connected to the correct network!");
      }
    } catch(error) {
      console.log(error)
    }
  }

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderContent = () => {
    //Scenario 1, user is not connected/authenticated
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://imgr.search.brave.com/NIgqPR10-vTq65QDDvfZ4Q0rZLieJHo3yi6z-64CrsM/fit/1200/1200/ce/1/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvcHJl/dmlld3MvMDAwLzU1/MS81ODYvb3JpZ2lu/YWwvY29taWMtZmln/aHRpbmctY2FydG9v/bi1iYWNrZ3JvdW5k/LXJlZC12cy15ZWxs/b3ctdmVjdG9yLWls/bHVzdHJhdGlvbi5q/cGc"
            alt="Fight Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
      * Scenario #2
      */
    }else if(currentAccount && !skirmisherNFT){
      return <SelectCharacter setSkirmisherrNFT={setSkirmisherNFT} />;
    }
  };

  useEffect(() => {
    checkNetwork();
  })
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  useEffect(() => {
    /*
    * The function we will call that interacts with out smart contract
    */
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const skirmisherContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Skirmishers.abi,
        signer
      );

      const txn = await skirmisherContract.checkPresenceNFT();
      if (txn.name) {
        console.log('User has character NFT');
        console.log(txn);
        setSkirmisherNFT(transformSkirmisherData(txn));
      } else {
        console.log('No character NFT found');
      }
    };

    /*
    * We only want to run this, if we have a connected wallet
    */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Skirmishers ⚔️</p>
          <p className="sub-text">The fate of humanity rests in your hands!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;