const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { verifyTxSignature, getAddress } = require("./scripts/crypto");

app.use(cors());
app.use(express.json());

const balances = {
  "4707a30c6b1a9614b19d7812e1ddfa5f19d97e00": 100,
  "548f26ac7e08fa94e63bcb9f00c9b26ed23cee04": 50,
  "124830dc2e013c4156893e3b35bfa4ad0cb0a80e": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  const address = await getAddress(sender);
  setInitialBalance(address);
  setInitialBalance(recipient);
  if (!verifyTxSignature(signature, recipient, amount, sender)) {
    res.status(400).send({ message: "Invalid signature!" });
  } else if (balances[address] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[address] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
