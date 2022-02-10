export default axios => ({
  async serverStatus() {
    var stats = null;
    var rankings = null;
    await $axios.get("/server_status").then(response => {
      const respJS = JSON.parse(response.data.body);
      stats = respJS.server_status;
      rankings = respJS.rankings;
    });
    return { stats, rankings }
  }
})
