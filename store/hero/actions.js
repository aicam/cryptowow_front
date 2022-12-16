export default {
  restoreHero({commit}, {heroName}) {
    return this.$axios.get("/wow/restore_hero/" + heroName)
  },
  sellHero({commit}, {info}) {
    return this.$axios.post("/wow/sell_hero", JSON.stringify(info))
  },
  cancelSellingHero({commit}, {heroName}) {
    return this.$axios.get("/wow/cancel_selling_hero/" + heroName)
  },
  listForSaleHeros({commit}) {
    return this.$axios.get("/wow/selling_heros")
  },
  buyHero({commit}, {info}) {
    return this.$axios.post("/wow/buy_hero", {
      selected_currency: info.currency,//this.selectedCurrency.split('-')[1],
      hero_info: info.hero
    })
  }
}
