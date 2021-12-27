<template>
  <v-row style="align-items: center; justify-content: center;margin-top: 40px">
    <v-card v-if="!walletConnected" style="padding: 50px">
      <v-card-title class="justify-center align-center"><img style="width: 300px"
                                                             src="~/static/wallet/walletconnect-banner.png"/>
      </v-card-title>
      <v-card-text class="text-center"><h3>Please connect your wallet.</h3></v-card-text>
      <v-row style="align-items: center; justify-content: center;margin-top: 40px">
        <v-btn
          v-if="!isDisconnectingPrograss"
          class="success"
          @click="connect"
        >
          Connect
        </v-btn>
        <v-progress-circular
          v-if="isDisconnectingPrograss"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-row>
    </v-card>
    <v-card v-if="walletConnected" style="width: 700px; padding: 30px;">
      <v-row justify="center" style="margin-bottom: 20px">
        <img style="width: 300px"
             src="~/static/wallet/walletconnect-banner.png"/>
      </v-row>
      <v-card-title class="justify-center"><h2>{{walletPayload.params[0].peerMeta.name}}</h2>
      </v-card-title>
      <a><h5 class="text-center" style="color: orangered;" @click="killSession">Disconnect</h5></a>
      <h4 class="text-center" style="font-weight: bold;">{{accounts[0]}}</h4>
      <h4 class="text-center" style="font-weight: bold;">Chain ID: {{chainID}}</h4>
      <v-row justify="center" align="center" style="margin-top: 10px;">
        <v-col lg="5">
          <h4 class="text-center" style="font-weight: bold;">Total ETH in wallet: {{EthBalance}}</h4>
        </v-col>
        <v-col lg="3">
          <img style="max-width: 36px;" src="~/static/currencies/Ethereum.png"/>
        </v-col>
      </v-row>
      <v-row justify="center" align="center" style="margin-top: -5px;" v-for="(wallet, i) in wallets" :key="i">
        <v-col lg="5">
          <h4 class="text-center" style="font-weight: bold;">Total {{wallet.currency_id}} in account:
            {{wallet.amount}}</h4>
        </v-col>
        <v-col lg="3">
          <v-img style="max-width: 36px;" :src="require(`~/static/currencies/${wallet.currency_id}.png`)"/>
        </v-col>
      </v-row>
      <v-divider style="margin-bottom: 25px;"></v-divider>
      <h2 class="text-center">Add balance</h2>
      <v-text-field
        label="Amount (for ex. 0.002)"
        hide-details="auto"
        v-model="sendTransactionValue"></v-text-field>
      <!--      <h4 class="text-center" v-if="!hasEth" style="color: orangered;">You have no ETH</h4>-->
    </v-card>
    <!--  <v-card width="60%" class="justify-center">-->
    <!--    <v-card-title class="text-center justify-center"><h1 style="color: #41b38a;">CryptoWoW Wallet</h1></v-card-title>-->
    <!--    <v-card-text>Here you can buy cryptocurrencies for your account. This wallet is not a global cryptocurrency wallet and is only connected to your-->
    <!--    trusted wallet. In this regard, there is no worries about your wallet security and information. You can consider this wallet as a DApps. CWT (Crypto-->
    <!--    WoW Token) is used only in the game and can not be cashed, all other cryptocurrencies are available to be cashed and return to your wallet.-->
    <!--    <p style="color: orangered">Caution: all payments in this website are done by cryptocurrency, therefore CryptoWoW is not responsible for any-->
    <!--    fluctuation in cryptocurrency price in dollar. You can get back your cryptocurrency anytime you want.</p> </v-card-text>-->
    <!--  </v-card>-->
  </v-row>
</template>

<script>
    import WalletConnect from "@walletconnect/client";
    import QRCodeModal from "@walletconnect/qrcode-modal";
    import {convertUtf8ToHex} from "@walletconnect/utils";
    import {
        convertAmountToRawNumber,
        convertStringToHex,
        hashMessage,
        sanitizeHex,
        verifySignature
    } from "../components/helpers/wallet-utilities";

    export default {
        name: "wallet",
        middleware: "auth",
        mounted() {
            this.currencies = this.$auth.user.currencies;
            this.wallets = [...this.$auth.user.wallets];
            let availableCurrencies = [];
            this.wallets.map(item => {
                availableCurrencies.push(item.currency_id)
            });
            this.currencies.map(item => {
                if (!availableCurrencies.includes(item))
                    this.wallets.push({
                        currency_id: item,
                        amount: 0
                    })
            });

            // bridge url
            const bridge = "https://bridge.walletconnect.org";
            console.log(this.$auth.user);
            // create new connector
            this.connector = new WalletConnect({bridge, qrcodeModal: QRCodeModal});
            if (this.connector.connected) {
                this.subscribeToEvents();
                this.getAccountAssets();
            }
        },
        methods: {
            async connect() {

                // check if already connected
                if (!this.connector.connected) {
                    // create new session
                    await this.connector.createSession();
                }
                // subscribe to events
                await this.subscribeToEvents();
            },
            killSession() {
                if (this.connector) {
                    this.connector.killSession();
                }
                this.resetApp();
            },
            subscribeToEvents() {
                if (!this.connector) {
                    return;
                }

                this.connector.on("session_update", async (error, payload) => {
                    console.log(`connector.on("session_update")`);

                    if (error) {
                        throw error;
                    }

                    const {chainId, accounts} = payload.params[0];
                    console.log("Accounts: ", accounts);
                    console.log("chainID: ", chainId);
                    this.accounts = accounts;
                    this.chainID = chainId;
                });

                this.connector.on("connect", (error, payload) => {
                    console.log(`connector.on("connect")`);

                    if (error) {
                        throw error;
                    }
                    const {chainId, accounts} = payload.params[0];
                    console.log("Accounts: ", accounts);
                    console.log("chainID: ", chainId);
                    this.walletConnected = true;
                    this.walletPayload = payload;
                    localStorage.setItem("wallet_info", JSON.stringify(payload));
                    this.address = accounts[0];
                    this.accounts = accounts;
                    this.chainID = chainId;
                    this.getAccountAssets();
                });

                this.connector.on("disconnect", (error, payload) => {
                    console.log(`connector.on("disconnect")`);

                    if (error) {
                        throw error;
                    }

                    this.resetApp();
                });

                if (this.connector.connected) {
                    const {chainId, accounts} = this.connector;
                    const address = accounts[0];
                    this.walletConnected = true;
                    this.address = accounts[0];
                    this.accounts = accounts;
                    this.chainID = chainId;
                    this.walletPayload = JSON.parse(localStorage.getItem("wallet_info"));
                }
            },
            async sendTransaction() {
                if (!this.connector)
                    return;

                // from
                const from = this.address;

                //to
                const to = "0xDE4C72835bcC0041Dd1B446BfD0D85bE346BC0A2";

                // nonce
                const _nonce = await this.apiGetAccountNonce(this.address, this.chainID);
                const nonce = sanitizeHex(convertStringToHex(_nonce));

                // gas price
                const gasPrices = await apiGetGasPrices();
                const _gasPrice = gasPrices.slow.price;
                const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));

                // gasLimit
                const _gasLimit = 21000;
                const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

                // value (1 ETH = 1e18)
                // const _value = 1000000000000000000;
                const _value = 0;
                const value = sanitizeHex(convertStringToHex(_value));

                // data
                const data = "0x";

                // test transaction
                const tx = {
                    from,
                    to,
                    nonce,
                    gasPrice,
                    gasLimit,
                    value,
                    data,
                };

                try {

                    // send transaction
                    const result = await this.connector.sendTransaction(tx);

                    // format displayed result
                    const formattedResult = {
                        method: "eth_sendTransaction",
                        txHash: result,
                        from: address,
                        to: address,
                        value: "0 ETH",
                    };
                    console.log("formatted result", formattedResult);
                } catch (e) {
                    console.log("Try sending Transaction:", e)
                }
            },
            async apiGetAccountNonce(address, chainId) {
                const response = await this.EthApi.get(`/account-nonce?address=${address}&chainId=${chainId}`);
                const {result} = response.data;
                return result;
            },
            async apiGetGasPrices() {
                const response = await this.EthApi.get(`/gas-prices`);
                const {result} = response.data;
                return result;
            },
            // async signMessage () {
            //     if (!this.connector)
            //         return;
            //
            //     const message = `User ${this.$auth.username} sent ${this.sendTransactionValue} in ${new Date().toUTCString()}`;
            //     console.log('message' , message);
            //     const hexMsg = convertUtf8ToHex(message);
            //
            //     // eth_sign params
            //     const msgParams = [this.address, hexMsg];
            //
            //     try {
            //         // send message
            //         const result = await this.connector.signMessage(msgParams);
            //
            //         // verify signature
            //         const hash = hashMessage(message);
            //         const valid = await verifySignature(address, result, hash, chainId);
            //
            //         // format displayed result
            //         const formattedResult = {
            //             method: "eth_sign",
            //             address,
            //             valid,
            //             result,
            //         };
            //         console.log('valid', valid);
            //         console.log('result', result);
            //
            //     } catch (e) {
            //         console.log(e)
            //     }
            //
            // },
            async getAccountAssets() {
                const response = await this.EthApi.get(`/account-assets?address=${this.address}&chainId=${this.chainID}`);
                // const { result } = response.data;
                response.data.result.map(item => {
                    if (item.symbol === 'ETH') {
                        this.hasEth = true;
                        this.EthBalance = (parseInt(item.balance) * (10 ** (-18))).toString().substring(0, 5);
                    }
                })
            },
            async resetApp() {
                Object.assign(this.$data, this.$options.data());
                this.isDisconnectingPrograss = true;
                await setTimeout(() => {
                    this.isDisconnectingPrograss = false
                }, 2000);
                const bridge = "https://bridge.walletconnect.org";
                this.connector = new WalletConnect({bridge, qrcodeModal: QRCodeModal});
            }
        },
        data() {
            return ({
                walletConnected: false,
                isDisconnectingPrograss: false,
                connector: null,
                accounts: null,
                chainID: null,
                address: null,
                walletPayload: null,
                hasEth: false,
                sendTransactionValue: null,
                EthBalance: 0,
                wallets: [],
                EthApi: this.$axios.create({
                    baseURL: "https://ethereum-api.xyz",
                    timeout: 30000, // 30 secs
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                })
            })
        }
    }
</script>

<style scoped>

</style>
