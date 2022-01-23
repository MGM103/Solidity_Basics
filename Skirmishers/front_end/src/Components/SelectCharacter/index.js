import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformSkirmisherData } from '../../constants.js';
import Skirmishers from '../../utils/Skirmishers.json';
import LoadingIndicator from '../LoadingIndicator';

const SelectSkirmisher = ({ setSkirmisherNFT }) => {
  
  const [skirmishers, setSkirmishers] = useState([]);
  const [skirmisherContract, setSkirmisherContract] = useState(null);
  const [mintingSkirmisher, setMintingSkirmisher] = useState(false);

  // Actions
  const mintSkirmisherNFTAction = (id) => async () => {
    try {
      if (skirmisherContract) {
        console.log('Minting character in progress...');
        setMintingSkirmisher(true);
        const mintTxn = await skirmisherContract.createSkirmisher(id);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
        setMintingSkirmisher(false);
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
      setMintingSkirmisher(false);
    }
  };

  // Render Methods
  const renderSkirmishers = () =>
    skirmishers.map((skirmisherType, index) => (
      <div className="character-item" key={skirmisherType.name}>
        <div className="name-container">
          <p>{skirmisherType.name}</p>
        </div>
        <img src={skirmisherType.imageURI} alt={skirmisherType.name} />
        <button
          type="button"
          className="character-mint-button"
          onClick={mintSkirmisherNFTAction(index)}
        >{`Mint ${skirmisherType.name}`}</button>
      </div>
    ));
  

  // UseEffect
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const skirmisherContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Skirmishers.abi,
        signer
      );

      setSkirmisherContract(skirmisherContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  useEffect(() => {
    const getSkirmishers = async () => {
      try {
        console.log('Getting contract characters to mint');

        /*
        * Call contract to get all mint-able characters
        */
        const skirmishersTxn = await skirmisherContract.getBaseSkirmishers();
        console.log('skirmisherTxn:', skirmishersTxn);

        /*
        * Go through all of our characters and transform the data
        */
        const skirmishers = skirmishersTxn.map((skirmisherData) =>
          transformSkirmisherData(skirmisherData)
        );

        /*
        * Set all mint-able characters in state
        */
        setSkirmishers(skirmishers);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };

    /*
    * Add a callback method that will fire when this event is received
    */
    const onSkirmisherMint = async (sender, tokenId, skirmisherType) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${skirmisherType.toNumber()}`
      );

      /*
      * Once our character NFT is minted we can fetch the metadata from our contract
      * and set it in state to move onto the Arena
      */
      if (skirmisherContract) {
        const skirmisherNFT = await skirmisherContract.checkPresenceNFT();
        console.log('CharacterNFT: ', skirmisherNFT);
        setSkirmishers(transformSkirmisherData(skirmisherNFT));
      }
    };

    if (skirmisherContract) {
      getSkirmishers();

      /*
      * Setup NFT Minted Listener
      */
      skirmisherContract.on('SkirmisherNFTMinted', onSkirmisherMint);
    }

    return () => {
      /*
      * When your component unmounts, let;s make sure to clean up this listener
      */
      if (skirmisherContract) {
        skirmisherContract.off('SkirmisherNFTMinted', onSkirmisherMint);
      }
    };
  }, [skirmisherContract]);

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {/* Only show this when there are characters in state */}
      {skirmishers.length > 0 && (
        <div className="character-grid">{renderSkirmishers()}</div>
      )}
      {/* Only show our loading state if mintingCharacter is true */}
      {mintingSkirmisher && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Minting In Progress...</p>
          </div>
          <img
            src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
            alt="Minting loading indicator"
          />
        </div>
      )}
    </div>
  );
};

export default SelectSkirmisher;