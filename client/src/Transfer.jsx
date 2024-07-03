import { useState } from "react";
import server from "./server";
import { getPublicKey, getTxSignature } from "./scripts/crypto";

function Transfer({
  publicKey,
  setPublicKey,
  privateKey,
  setPrivateKey,
  setBalance,
}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = await getPublicKey(privateKey);
    setPublicKey(publicKey);
  }

  async function transfer(evt) {
    evt.preventDefault();

    const amount = parseInt(sendAmount);
    const txSignature = await getTxSignature(privateKey, recipient, amount);
    const payload = {
      sender: publicKey,
      recipient,
      amount,
      signature: JSON.stringify(txSignature, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      ),
    };

    try {
      const {
        data: { balance },
      } = await server.post(`send`, payload);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Private key
        <input
          placeholder="Type a private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
