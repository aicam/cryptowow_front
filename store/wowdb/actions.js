export default {
  async useGift({commit}, {gift_id, heroSelectedName}) {
    return await this.$axios.get("/gift/" + gift_id + "/" + heroSelectedName)
  }
}
