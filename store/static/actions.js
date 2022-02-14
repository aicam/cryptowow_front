export default {
  async getHomePageInfo({commit}) {
    var stats = null;
    var rankings = null;
    await this.$axios.get("/server_status").then(response => {
      const respJS = JSON.parse(response.data.body);
      stats = respJS.server_status;
      rankings = respJS.rankings;
    });
    return [stats, rankings]
  },
  async getEvents({commit}) {
    return await this.$axios.get("/events")
  }
}
