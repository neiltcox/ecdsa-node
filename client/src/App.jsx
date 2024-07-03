import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useEffect, useState } from "react";
import server from "./server";

function App() {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getBalance = async () => {
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    };
    getBalance();
  });

  return (
    <div className="app">
      <Wallet
        setPublicKey={setPublicKey}
        address={address}
        setAddress={setAddress}
        balance={balance}
      />
      <Transfer
        publicKey={publicKey}
        setPublicKey={setPublicKey}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        setBalance={setBalance}
      />
    </div>
  );
}

export default App;
