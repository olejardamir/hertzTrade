const HDWalletProvider = require('truffle-hdwallet-provider');




require('dotenv').config();
 
module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none) 8545?
     network_id: "*",       // Any network (default: none)
    },
    mainnet:{
      provider: () => new HDWalletProvider(process.env.MNEMONIC,process.env.REMOTE_NODE),
      network_id: liveNetworkId
    }
  },
 
  mocha: {
    // timeout: 100000
  },
  // Configure your compilers
  compilers: {
    solc: { 
    }
  }
}
