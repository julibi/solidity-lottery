const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);
const compiledContract = require("../compile");

describe("Inbox", () => {
  let accounts;
  let inbox;
  const INITIAL_STRING = "Hi there!";
  beforeEach(async () => {
    // Get a list of all accounts provided by Ganache
    accounts = await web3.eth.getAccounts();
    const bytecode = compiledContract.evm.bytecode.object;

    inbox = await new web3.eth.Contract(compiledContract.abi)
      .deploy({
        data: bytecode,
        arguments: [INITIAL_STRING],
      })
      .send({ from: accounts[0], gas: "1000000" });
    inbox.setProvider(provider);
  });
  it("deploys a contract", () => {
    // asserting that the address exists because deployment has been successful
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });

  it("can change the message", async () => {
    // this just returns a hash, so no const necessary
    await inbox.methods.setMessage("New Message!").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "New Message!");
  });
});
