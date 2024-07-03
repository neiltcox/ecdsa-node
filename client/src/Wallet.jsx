function Wallet({ address, setAddress, balance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Address
        <input
          placeholder="Type an address"
          value={address}
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
