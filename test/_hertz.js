var hertz = artifacts.require('_HERTZ');
contract('_HERTZ', function(accounts) {
  let instance;
  before(async () => {
    instance = await hertz.deployed();
  });
  it('Default message should be hello world',async () => {
    let message = web3.utils.BN(await instance.totalSupply.call()).toString();
    assert.equal(message, "21000000000000000000000");
  });
});
