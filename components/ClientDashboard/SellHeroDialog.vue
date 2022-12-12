<template>
  <v-dialog
    v-model="sellingDialog"
    width="1000"
    @click:outside="$emit('close')"
  >

    <v-card style="padding: 50px;">
      <v-card-title style="margin-bottom: 10px;" class="text-h2 lighten-1">
        Selling {{heroSelectedName}}
      </v-card-title>
      <v-stepper v-model="sellingSteps" justify="space-between">
        <v-stepper-content step="0">
          <h4>Add new price based on available cryptocurrencies</h4>
          <h4 class="h4-head">Note: customers will choose to buy with currency they prefer.</h4>
          <h4>You can write price both in float (0.0025) or exponent of 10 (25e-4)</h4>
          <v-row class="row-head">
            <v-col lg="4">
              <v-text-field
                v-model="cPrice"
                label="Price"></v-text-field>
            </v-col>
            <v-col lg="4">
              <v-select v-model="cCrypto" :items="currencies">
                <template v-slot:selection="{item, index}">
                  {{item}}
                  <v-divider></v-divider>
                  <v-img max-width="48px" :src="require(`~/static/currencies/${item}.png`)"/>
                </template>
                <template v-slot:item="{item}">
                  {{item}}
                  <v-divider></v-divider>
                  <v-img max-width="48px" :src="require(`~/static/currencies/${item}.png`)"/>
                </template>
              </v-select>
            </v-col>
            <v-col lg="4">
              <v-btn
                @click="addPrice"
              >
                Add
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-for="(price, i) in prices" :key="i">
            <v-col lg="3" class="justify-center text-center">
              <h4>{{price.value}}</h4>
            </v-col>
            <v-col lg="3">
              <h4>{{price.name}}</h4>
            </v-col>
            <v-col lg="2">
              <v-img max-width="48" :src="require(`~/static/currencies/${price.name}.png`)"/>
            </v-col>
            <v-col lg="2">
              <v-btn
                outlined
                color="red"
                @click="prices = prices.filter(obj => {return obj.name !== price.name})">
                Delete
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content step="1">
          <h4>Write a note about your hero to justify its price and value (less than 300 characters).</h4>
          <h4>Your hero information same as the "inspect" option for your hero will be available for shopper, in
            addition, hero gold, total kill and your note
            will be added to this information.</h4>
          <v-textarea
            filled
            name="input-7-1"
            label="Note"
            hint="Mention hero distinguishable options, achievements, guild and ..."
            counter="300"
            v-model="note"
          ></v-textarea>
        </v-stepper-content>
      </v-stepper>
      <v-card-actions class="justify-end">
        <v-btn
          v-if="sellingSteps === 1"
          color="#AC2020"
          @click="sellingSteps = 0"
        >
          Back
        </v-btn>
        <v-btn
          class="success"
          @click="sellingSteps === 0 ? goNoteStep() : finalizeSell()">
          {{sellingSteps === 0 ? "Next" : "Finish"}}
        </v-btn>
        <v-btn
          class="warning"
          @click="$emit('close')">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SellHeroDialog",
  props: ['sellingDialog', 'heroSelectedName', 'pushNewHero', 'currencies', 'snackbarAction'],
  data() {
    return {
      sellingSteps: 0,
      cPrice: "",
      cCrypto: "",
      prices: [],
      note: ""
    }
  },
  methods: {
    goNoteStep: function () {
      if (this.prices.length < this.currencies.length) {
        this.snackbarAction("All crypto prices should be specified")
        return
      }
      this.sellingSteps = 1
    },
    finalizeSell: function () {
      if (this.note.length > 350) {
        this.snackbarAction("Please edit your note!!")
        return
      }
      let priceTxT = "";
      this.prices.map(price => {
        priceTxT += price.value + '-' + price.name + '&'
      });
      priceTxT = priceTxT.substring(0, priceTxT.length - 1);
      this.$store.dispatch("hero/sellHero", {info: {
          hero_name: this.heroSelectedName,
          hero_price: priceTxT,
          note: this.note
        }})
        .then(response => {
          this.$emit('close')
          this.snackbarAction(response.data.body)
          if (response.data.status === 1) {
            this.pushNewHero(this.heroSelectedName)
          }
        });
    },
    addPrice: function () {
      let exist = false;
      this.prices.map(price => {
        if (price.name === this.cCrypto) {
          this.snackbarAction("Pick another currency or delete the existing one")
          exist = true
        }
      });
      if (!exist)
        this.prices.push({value: this.cPrice, name: this.cCrypto})
    },
  }
}
</script>

<style scoped>
.h4-head {
  color: orangered;
  font-weight: bold
}

.row-head {
  margin-bottom: 10px;
  border-bottom: 2px solid orangered;
}
</style>
