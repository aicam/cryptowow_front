<template>

    <div class="banner_bg" >
      <p>{{title}}</p>
    </div>

</template>

<script>
    export default {
        props: ['title', 'body', 'img_src'],
        name: "HorizontalBanner",
        computed: {
            cssVars() {
                return {
                    '--imgsrc': this.img_src,
                }
            }
        }
    }
</script>

<style>
.banner_bg {
  position: absolute;
  top: 0;
  left: 0;
  background-image: var(img_src);
  background-size: cover;
  background-color: red;
  transform: scale(1.1);
}
</style>
