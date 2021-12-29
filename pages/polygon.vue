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
        name: "polygon",
        mounted() {
          // this.startPolygon();
        },
        methods: {
            async startPolygon() {
                const maticProvider = new WalletConnectProvider(
                    {
                        rpc: {
                            80001: 'https://matic-mumbai.chainstacklabs.com'
                        },
                        infuraId: '96f7c27fa1de4ef5ad1c42614836de9a'
                    }
                );
                await maticProvider.enable();
                //  Create Web3 instance
                const web3 = new Web3(maticProvider);
                console.log(web3);
                const myAddress = "0x555ede912C6b7f7C05b4729Eb79922d857914341";
                const nonce = await web3.eth.getTransactionCount(myAddress, 'latest'); // nonce starts counting from 0
                const tx = {
                    'from': '0x555ede912C6b7f7C05b4729Eb79922d857914341',
                    'to': '0x5C9A480735D1DFba5c3FE8699e5D16D70c056081',
                    'value': parseFloat('0.25') * (10 ** 18),
                    'nonce': nonce,
                    'gas': 9,
                    'gasLimit': 21000,
                    'chain': 'mumbai',
                    common: {
                        customChain: {
                            'chainId': 80001
                        },
                        'baseChain': 'goerli'
                    }
                };
                try {
                    const result = await web3.eth.sendTransaction(tx, (e) => console.log(e));
                    console.log(result);
                    // web3.eth.sendSignedTransaction(result.rawTransaction).then(result => console.log(result));
                    // console.log(result);
                } catch (e) {
                    console.log("Try sending Transaction:", e)
                }
            }
        }
    }
</script>

<style scoped>

</style>
