var Web3 = require('web3');
var TruffleContract = require('truffle-contract');
const BigNumber = require('bignumber.js');

App = {
    web3Provider: null,
    contracts: {},
    currentAccount:{},
    initWeb3 : async function (){
        window.ethereum.enable();
        if (process.env.MODE == 'development' || typeof window.web3 === 'undefined'){
            App.web3Provider = new Web3.providers.HttpProvider(process.env.LOCAL_NODE);
        }
        else{
             App.web3Provider = web3.currentProvider;
        }
        web3 = new Web3(App.web3Provider);
        return  await App.initContractHertz(); 
    },
    initContractHertz : async function (){
        await $.getJSON('_HERTZ.json',function(data){
            var HertzArtifact = data;
            App.contracts.Hertz = TruffleContract(HertzArtifact);
            App.contracts.Hertz.setProvider(App.web3Provider);        
        })
        App.showMessage("Console@HertzExchange:~$ All activity messages will be displayed here.");

        return App.bindEvents();
    },
    bindEvents: function() {
        $('#hztoethbttn').click(App.hztoethfn);
        $('#ethtohzbttn').click(App.ethtohzfn);
        $('#buyhzbttn').click(App.buyhzfn);
        $('#buyethbttn').click(App.buyethfn);
        $('#sellallbttn').click(App.sellallfn);
     },


    hztoethfn: function (){
        if ($('#hztoeth').val()){
            var txtval = $('#hztoeth').val();
            const weiValue = Web3.utils.toWei(txtval, 'ether');

            App.contracts.Hertz.deployed().then(async function(instance){
                 message = await instance.tokensToWei.call(weiValue);
                 message = Web3.utils.fromWei(message.toString(), 'ether');
                 message = "You will get: "+message+" ETH from "+txtval+" HZ, with a 2% reduction included."
            }).then(function(result){
                App.showMessage("Console@HertzExchange:~$ "+message);
            }).catch(function (error){
                App.showError("Console@HertzExchange:~$ Error: "+error);
            })

        }
        else{
            App.showError('Console@HertzExchange:~$ Error: Number is required.');
        }
    },


    ethtohzfn: function (){
        if ($('#ethtohz').val()){
            var txtval = $('#ethtohz').val();
            const weiValue = Web3.utils.toWei(txtval, 'ether');

            App.contracts.Hertz.deployed().then(async function(instance){
                message = await instance.weiToTokens.call(weiValue);
                message = Web3.utils.fromWei(message.toString(), 'ether');
                message = "You will get: "+message+" HZ from "+txtval+" ETH (no reduction fees will be applied)."
            }).then(function(result){
                App.showMessage("Console@HertzExchange:~$ "+message);
            }).catch(function (error){
                App.showError("Console@HertzExchange:~$ Error: "+error);
            })

        }
        else{
            App.showError('Console@HertzExchange:~$ Error: Number is required.');
        }
    },

    buyhzfn: function (){
        App.showMessage("Console@HertzExchange:~$ Please confirm purchase (if any)");
        if ($('#buyhz').val()) {
            web3.eth.getAccounts(function (error, accounts) {
                if (error) {
                    App.showError(error);
                }
                var txtval = $('#buyhz').val();
                const weiValue = Web3.utils.toWei(txtval, 'ether');

                App.contracts.Hertz.deployed().then( function (instance) {
                    return instance
                        .purchaseTokens({from: accounts[0], value: weiValue})

                }).then(function (result) {
                    App.showMessage("Console@HertzExchange:~$ Purchasing HZ is done.");
                }).catch(function (error) {
                    App.showError("Console@HertzExchange:~$ Did not purchase HZ.");
                })
            })
        }
        else{
            App.showError('Console@HertzExchange:~$ Error: Number is required.');
        }
    },



    buyethfn: function (){
        App.showMessage("Console@HertzExchange:~$ Please confirm purchase (if any)");
        if ($('#buyeth').val()) {
            web3.eth.getAccounts(function (error, accounts) {
                if (error) {
                    App.showError("Console@HertzExchange:~$ Error: "+error);
                }
                var txtval = $('#buyeth').val();
                const weiValue = Web3.utils.toWei(txtval, 'ether');
                message = weiValue;
                App.contracts.Hertz.deployed().then(async function (instance) {
                    return await instance
                        .purchaseEth(weiValue, {from:accounts[0]});

                }).then(function (result) {
                    App.showMessage("Console@HertzExchange:~$ Purchasing ETH is done.");
                }).catch(function (error) {
                    App.showError("Console@HertzExchange:~$ Did not purchase ETH.");
                })
            })
        }
        else{
            App.showError('Console@HertzExchange:~$ Error: Number is required.');
        }
    },

    sellallfn: function (){
        App.showMessage("");
            web3.eth.getAccounts(function (error, accounts) {
                if (error) {
                    App.showError(error);
                }

                App.contracts.Hertz.deployed().then(async function (instance) {
                    return await instance
                        .sellAllTokens({from:accounts[0]});

                }).then(function (result) {
                    App.showMessage("Console@HertzExchange:~$ Purchasing ETH is done."+message);
                }).catch(function (error) {
                    App.showError("Console@HertzExchange:~$ Did not purchase ETH. Reason:"+error);
                })
            })
    },

    showMessage: function (msg){
        $('#output').html(msg.toString());
        $('#errorHolder').hide();
        $('#output').show();
    },
    showError: function(err){
        $('#errorHolder').html(err.toString());
        $('#errorHolder').show();
        $('#output').hide();
    },


    showMessage: function (msg){
        $('#output').html(msg.toString());
        $('#errorHolder').hide();
        $('#output').show();
    },
    showError: function(err){
        $('#errorHolder').html(err.toString());
        $('#errorHolder').show();
        $('#output').hide();
    },

    init : async function (){
        await App.initWeb3();       
        App.loadMessage();          
    }
 
}  
 
$(function() {
    $(window).load(function() {
        $('#errorHolder').hide();
        $('#output').hide();
         
      App.init();
    });
  });
