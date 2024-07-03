const { getRandomBytes } = require("ethereum-cryptography/random");
const {
  bytesToHex,
  utf8ToBytes,
  hexToBytes,
} = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { sha256 } = require("ethereum-cryptography/sha256");

const generatePrivateKey = async () => {
  try {
    const privateKey = await getRandomBytes(32);
    return bytesToHex(privateKey);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const getPublicKey = async (privateKey) => {
  const publicKey = await bytesToHex(secp256k1.getPublicKey(privateKey));
  return publicKey;
};

const getAddress = async (publicKey) => {
  try {
    const address = keccak256(utf8ToBytes(publicKey).slice(1)).slice(-20);
    return bytesToHex(address);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const getTxSignature = async (privateKey, recipient, amount) => {
  return await secp256k1.sign(
    sha256(utf8ToBytes(recipient + amount)),
    privateKey
  );
};

const verifyTxSignature = async (signature, recipient, amount, publicKey) => {
  return secp256k1.verify(
    utf8ToBytes(signature),
    sha256(utf8ToBytes(recipient + amount)),
    utf8ToBytes(publicKey)
  );
};

async function main(privateKey) {
  console.log("privateKey: ", privateKey);
  const publicKey = await getPublicKey(privateKey);
  console.log("publicKey: ", publicKey);
  const address = await getAddress(publicKey);
  console.log("address: ", address);
}

main("bc309e64c233173a480fd91dee101fb8658f934ff8c2e81a8e0c5a9f10389c01");
main("fa4a022b93e13dc300dd9b32cea08e1c57911d8b4b2ac97eebf6d2e777c50170");
main("da94db756f1d1e5e33867a9863eb9f63a5ce316b84b6834e35df3b76d90ade56");

module.exports = {
  generatePrivateKey,
  getPublicKey,
  getAddress,
  getTxSignature,
  verifyTxSignature,
  bytesToHex,
  hexToBytes,
};
