export default {
  restoreHero({commit}, {heroName}) {
    return this.$axios.get("/wow/restore_hero/" + heroName)
  },
  sellHero({commit}, {info}) {
    return this.$axios.post("/wow/sell_hero", JSON.stringify(info))
  },
  cancelSellingHero({commit}, {heroName}) {
    return this.$axios.get("/wow/cancel_selling_hero/" + heroName)
  }
}
