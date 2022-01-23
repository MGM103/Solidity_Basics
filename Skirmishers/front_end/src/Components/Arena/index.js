import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformSkirmisherData } from '../../constants.js';
import Skirmishers from '../../utils/Skirmishers.json';
import './Arena.css';
import LoadingIndicator from '../LoadingIndicator';

/*
 * We pass in our skirmisherNFT metadata so we can a cool card in our UI
 */
const Arena = ({ skirmisherNFT, setSkirmisherNFT }) => {
  // State
  const [skirmisherContract, setSkirmisherContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState(null);
  const [showToast, setShowToast] = useState(false);

  //Attack function
  const runAttackAction = async () => {
    try{
      if (skirmisherContract) {
        setAttackState('attacking');
        console.log('Attacking boss...');
        const attackTxn = await skirmisherContract.attackBoss();
        await attackTxn.wait();
        console.log('attackTxn:', attackTxn);
        setAttackState('hit');
        
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    }catch(error){
      console.error("Error in attacking", error);
      setAttackState('');
    }
  };

  // UseEffects
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

  // UseEffects
  useEffect(() => {
    /*
    * Setup async function that will get the boss from our contract and sets in state
    */
    const fetchBoss = async () => {
      const bossTxn = await skirmisherContract.getBoss();
      console.log('Boss:', bossTxn);
      setBoss(transformSkirmisherData(bossTxn));
    };

    const onAttackCompleted = (newPlayerHp, newBossHp) => {
        const bossHp = newBossHp.toNumber();
        const playerHp = newPlayerHp.toNumber();

        console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

        /*
        * Update both player and boss Hp
        */
        setBoss((prevState) => {
            return { ...prevState, hp: bossHp };
        });

        setSkirmisherNFT((prevState) => {
            return { ...prevState, hp: playerHp };
        });
    };

      if (skirmisherContract) {
          fetchBoss();
          skirmisherContract.on('AttackCompleted', onAttackCompleted);
      }

      /*
      * Make sure to clean up this event when this component is removed
      */
      return () => {
          if (skirmisherContract) {
              skirmisherContract.off('AttackCompleted', onAttackCompleted);
          }
      }
  }, [skirmisherContract]);

  return (
  <div className="arena-container">
    {boss && skirmisherNFT && (
      <div id="toast" className={showToast ? 'show' : ''}>
        <div id="desc">{`💥 ${boss.name} was hit for ${skirmisherNFT.attackDamage}!`}</div>
      </div>
    )}

    {/* Replace your Boss UI with this */}
    {boss && (
      <div className="boss-container">
        <div className={`boss-content ${attackState}`}>
          <h2>🔥 {boss.name} 🔥</h2>
          <div className="image-content">
            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
            <div className="health-bar">
              <progress value={boss.hp} max={boss.maxHp} />
              <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
            </div>
          </div>
        </div>
        <div className="attack-container">
          <button className="cta-button" onClick={runAttackAction}>
            {`💥 Attack ${boss.name}`}
          </button>
          {attackState === 'attacking' && (
            <div className="loading-indicator">
              <LoadingIndicator />
              <p>Attacking ⚔️</p>
            </div>
          )}
        </div>
      </div>
    )}

    {skirmisherNFT && (
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{skirmisherNFT.name}</h2>
              <img
                src={skirmisherNFT.imageURI}
                alt={`Character ${skirmisherNFT.name}`}
              />
              <div className="health-bar">
                <progress value={skirmisherNFT.hp} max={skirmisherNFT.maxHp} />
                <p>{`${skirmisherNFT.hp} / ${skirmisherNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${skirmisherNFT.attackDamage}`}</h4>
            </div>
            {/* <div className="active-players">
              <h2>Active Players</h2>
              <div className="players-list">{renderActivePlayersList()}</div>
            </div> */}
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default Arena;