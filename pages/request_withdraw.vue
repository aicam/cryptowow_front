<template>
  <v-row justify="center" style="margin-top: 50px;">
    <v-dialog
      v-model="submitDialog"
      transition="dialog-bottom-transition">
      <v-card style="padding: 20px" width="600">
        <h1 class="text-center">Withdrawal Form</h1>
        <v-row>
          <v-col lg="6">
            <v-text-field
              label="Amount (For ex. 0.002)"
              :rules="[(x) => {return x != null ? parseFloat(x).toString() === x.toString() : true}]"
              v-model="submitAmount"
            >
            </v-text-field>
          </v-col>
          <v-col lg="6">
            <v-select v-model="submitCurrency" :items="currencies">
              <template v-slot:selection="{item, index}">
                {{item}}
                <v-divider></v-divider>
                {{parseFloat(walletMap[item]).toFixed(5)}}
                <v-img max-width="48px" :src="require(`~/static/currencies/${item}.png`)"/>
              </template>
              <template v-slot:item="{item}">
                {{item}}
                <v-divider></v-divider>
                {{parseFloat(walletMap[item]).toFixed(5)}}
                <v-img max-width="48px" :src="require(`~/static/currencies/${item}.png`)"/>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <p>You will receive {{parseFloat(submitAmount).toString() === submitAmount.toString() ? (9/10 *
          parseFloat(submitAmount)).toFixed(4) : 0}}
          {{` ${submitCurrency}`}}</p>
        <v-divider></v-divider>
        <h3>Wallet address</h3>
        <v-text-field
          v-model="submitWalletAddress"
          label="For ex. 0xaerd21"></v-text-field>
        <v-divider></v-divider>
        <h3>Wallet Application</h3>
        <v-text-field
          label="For ex. Trust Wallet or MetaMask"
          v-model="submitWalletApp"></v-text-field>
        <v-divider></v-divider>
        <h3>Note</h3>
        <v-text-field
          label="For ex. I need this money until next week"></v-text-field>
        <v-card-actions>
          <v-btn
            block
            style="background: linear-gradient(45deg, #0B636E, #6E0F64)"
            @click="submitWithdrawal"
          >Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-card style="padding: 50px;background: rgba(0, 0, 0, 0.7);" class="text-center">
      <h1 class="font-weight-bold">Withdrawal</h1>
      <v-row justify="center">
        <v-img max-width="150" :src="require(`~/static/withdrawal.png`)"/>
      </v-row>
      <h4>This wallet is not a global cryptocurrency wallet and is only connected to your
        trusted wallet. In this regard, there is no worries about your wallet security and information. You can consider
        this wallet as a DApps. CWT (Crypto
        WoW Token) is used only in the game and can not be cashed, all other cryptocurrencies are available to be cashed
        and return to your wallet.
        <p style="color: orangered">Caution: all payments in this website are done by cryptocurrency, therefore
          CryptoWoW is not responsible for any
          fluctuation in cryptocurrency price in dollar. You can get back your cryptocurrency anytime you want.</p>
        There is 10% tax for each withdrawal. After you submit a withdraw request, our GMs will check the request and
        add a new transaction to your wallet.
        You can check your request status, when finishes, you can check the transaction hash.
      </h4>
      <v-row justify="center" style="margin-top: 10px;">
        <v-btn
          color="#17D9F3"
          outlined
          @click="submitDialog = true"
        >
          Submit New
        </v-btn>
        <v-btn
          color="#B7BE0D"
        >
          History
        </v-btn>
      </v-row>
    </v-card>


    <v-snackbar
      v-model="snackbar">
      {{snackbarText}}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
    export default {
        name: "request_withdraw",
        middleware: "auth",
        mounted() {
            this.currencies = this.$auth.user.currencies;
            this.wallets = [...this.$auth.user.wallets];
            console.log(this.currencies);
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
            this.wallets.map(wallet => {
                this.walletMap[wallet.currency_id] = wallet.amount
            });
        },
        methods: {
            submitWithdrawal() {
                let checked = true;
                this.wallets.map(wallet => {
                    if (wallet.currency_id === this.submitCurrency) {
                        if (wallet.amount < this.submitAmount) {
                            this.snackbarText = "Not enough balance!";
                            this.snackbar = true;
                            checked = false;
                        }
                    }
                });
                if (this.submitCurrency === 'CWT') {
                    this.snackbarText = "CWT can not be withdrawn!";
                    this.snackbar = true;
                    checked = false;
                }
                if (!checked)
                    return
                this.$axios.post("/wallet/request_withdraw", JSON.stringify({
                    "amount": parseFloat(this.submitAmount),
                    "currency_id": this.submitCurrency,
                    "wallet_address": this.submitWalletAddress,
                    "wallet_app": this.submitWalletApp,
                    "note": this.submitNote
                })).then(response => {
                    if (response.data.status === 1)
                        this.$auth.fetchUser();
                    this.snackbarText = response.data.body;
                    this.snackbar = true;
                    this.submitDialog = false;
                }).catch(err => console.log(err));
            }
        },
        data() {
            return ({
                submitDialog: false,
                submitAmount: 0,
                submitNote: "For ex. I need this money until next week",
                submitCurrency: '',
                submitWalletAddress: '',
                submitWalletApp: '',
                wallets: [],
                currencies: [],
                walletMap: {},
                snackbar: false,
                snackbarText: ""
            })
        }
    }
</script>

<style scoped>
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url('~/static/withdrawal.png');
    background-size: cover;
    transform: scale(1);
  }
</style>
