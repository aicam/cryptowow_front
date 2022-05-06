<template>
  <div v-if="loading" class="justify-center align-center loading-page">
    <span class="helper"></span>
    <img :src="require(`~/static/logo.png`)" class="image-class"/>
  </div>
</template>

<script>
export default {
  name: "LoadingBar",
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
}
</script>

<style scoped>
@keyframes image-entrance {
  from {opacity: 1;}
  to {opacity: 0;}
}

.image-class {
  height: auto;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  vertical-align: middle;
  animation-name: image-entrance;
  animation-duration: 5s;
}

.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: white;
  z-index: 10;
}

.helper {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}
</style>
