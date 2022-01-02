<template>
  <v-card>
    <v-btn
      @click="startPolygon">Start</v-btn>
  </v-card>
</template>

<script>
    import Web3 from "web3"
    import WalletConnectProvider from "@walletconnect/web3-provider";
    const { ethers } = require('ethers');

    export default {
        name: "testwallet",
        mounted() {
            // this.startPolygon();
        },
        methods: {
            async startPolygon() {
                var crypto = require('crypto');
                var shasum = crypto.createHash('sha1');
                shasum.update('0x9224c4b630ba08685e7db4d4caa07bc3c01e44ee98bb920c153f2946a9d0652b');
                var c = shasum.digest('base64').substring(2, 8).toUpperCase();
                console.log(c);
                const maticProvider = new WalletConnectProvider(
                    {
                        rpc: {
                            80001: 'https://matic-mumbai.chainstacklabs.com'
                        },

                    }
                );
                await maticProvider.enable();
                //  Create Web3 instance
                const web3 = new Web3(maticProvider);
                console.log(web3);
                const myAddress = "0x555ede912C6b7f7C05b4729Eb79922d857914341";
                const nonce = await web3.eth.getTransactionCount(myAddress, 'latest'); // nonce starts counting from 0
                const tx = {
                    // from: '0x555ede912C6b7f7C05b4729Eb79922d857914341',
                    'to': '0x5C9A480735D1DFba5c3FE8699e5D16D70c056081',
                    'value': parseFloat('0.5') * (10 ** 18),
                    'nonce': nonce,
                    'gas': 9,
                    'gasLimit': 21000
                };
                try {
                    // const result = await web3.eth.accounts.signTransaction(tx, '0xa1ff42468ee572f2f5d4fd4082a95d9ee3bbe4845a52fae54c8288af1b291014');
                    // console.log(result);
                    // const result2 = await web3.eth.sendSignedTransaction(result.rawTransaction);
                    // console.log(result2);
                } catch (e) {
                    console.log("Try sending Transaction:", e)
                }
            }
        }
    }
</script>

<style scoped>

</style>
