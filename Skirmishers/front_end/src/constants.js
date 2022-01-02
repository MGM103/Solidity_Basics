const CONTRACT_ADDRESS = '0xDc1f9B815163734c9cF784B6973D015FdBa5374e';

const transformSkirmisherData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.damage.toNumber(),
  };
};

export {CONTRACT_ADDRESS, transformSkirmisherData};