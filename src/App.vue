<script setup lang="ts">
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import Layout from './components/Layout.vue';
</script>

<template>
  <a-config-provider :locale="zhCN">
    <Layout />
  </a-config-provider>
</template>
