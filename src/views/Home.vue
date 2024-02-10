<template>
  <a-carousel effect="fade">
    <div class="banner banner-1"></div>
    <div class="banner banner-2"></div>
    <div class="banner banner-3"></div>
    <div class="banner"></div>
  </a-carousel>

  <div class="example">
    <a-spin />
  </div>

  <a-skeleton avatar active :paragraph="{ rows: 4 }" />
  <div style="height: 20px" />
</template>

<style lang="less" scoped>
  .banner {
    width: 100%;
    height: 320px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: #eee;
    border-radius: 6px;

    &.banner-1 {
      background-image: url('@/assets/images/home-banner-1.jpg');
    }

    &.banner-2 {
      background-image: url('@/assets/images/home-banner-2.png');
    }

    &.banner-3 {
      background-image: url('@/assets/images/home-banner-3.jpg');
    }
  }

  .example {
    text-align: center;
    background: rgba(0, 0, 0, 0.07);
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 60px 50px;
    margin: 20px 0;
  }
</style>
