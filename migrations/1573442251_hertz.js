var _HERTZ = artifacts.require('_HERTZ');
 
module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(_HERTZ);
};
