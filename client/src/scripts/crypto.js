import { getRandomBytes } from "ethereum-cryptography/random";
import {
  bytesToHex,
  utf8ToBytes,
  hexToBytes,
} from "ethereum-cryptography/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { sha256 } from "ethereum-cryptography/sha256";

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

export {
  generatePrivateKey,
  getPublicKey,
  getAddress,
  getTxSignature,
  verifyTxSignature,
  bytesToHex,
  hexToBytes,
};
