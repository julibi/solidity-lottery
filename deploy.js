// HDWalletProvider specifies which account to unlock as a source of ether
// also specifies what outside node or API we connect to
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledContract = require("./compile");
const bytecode = compiledContract.evm.bytecode.object;
const abi = compiledContract.abi;
const mnemonic = require("./KEYS");

const provider = new HDWalletProvider(
  mnemonic,
  "https://rinkeby.infura.io/v3/0b94c28823b04c22ac987c8e10ae9ab5"
);

const web3 = new Web3(provider);

// we are using a function here just so that we can use async await
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deply from account: ", accounts[0]);
  const result = await new web3.eth.Contract(abi)
    .deploy({ data: "0x" + bytecode })
    .send({ from: accounts[0] });
  console.log("Contract deployed to:", result.options.address);
};
deploy();
