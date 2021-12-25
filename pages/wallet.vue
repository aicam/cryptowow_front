<template>
<v-row style="align-items: center; justify-content: center;margin-top: 40px">
  <v-card width="60%" class="justify-center">
    <v-card-title class="text-center justify-center"><h1 style="color: #41b38a;">CryptoWoW Wallet</h1></v-card-title>
    <v-card-text>Here you can buy cryptocurrencies for your account. This wallet is not a global cryptocurrency wallet and is only connected to your
    trusted wallet. In this regard, there is no worries about your wallet security and information. You can consider this wallet as a DApps. CWT (Crypto
    WoW Token) is used only in the game and can not be cashed, all other cryptocurrencies are available to be cashed and return to your wallet.
    <p style="color: orangered">Caution: all payments in this website are done by cryptocurrency, therefore CryptoWoW is not responsible for any
    fluctuation in cryptocurrency price in dollar. You can get back your cryptocurrency anytime you want.</p> </v-card-text>
  </v-card>
</v-row>
</template>

<script>
    import WalletConnect from "@walletconnect/client";
    import QRCodeModal from "@walletconnect/qrcode-modal";

    export default {
        name: "wallet",
        middleware: "auth",
        methods: {
            async connect () {
                // bridge url
                const bridge = "https://bridge.walletconnect.org";

                // create new connector
                const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });

                // check if already connected
                if (!connector.connected) {
                    // create new session
                    await connector.createSession();
                }
                console.log(connector);
                // subscribe to events
                // await this.subscribeToEvents();
            },
        },
        data() {
            return ({

            })
        }
    }
</script>

<style scoped>

</style>
