<template>
  <a-modal v-model:open="openUserInfo" width="800px" title="账户信息" :footer="null">
    <div style="height: 20px" />
    <a-avatar style="background-color: #eee; color: #222" :size="70" shape="square">
      <template #icon><UserOutlined /></template>
    </a-avatar>
    <div style="height: 14px" />
    <a-descriptions size="small" :column="1">
      <a-descriptions-item label="用户昵称">{{ username }}</a-descriptions-item>
      <a-descriptions-item label="用户类型">分管账号</a-descriptions-item>
      <a-descriptions-item label="用户权限">
        <a-tag color="blue">全渠道</a-tag>
        <a-tag color="blue">下属渠道</a-tag>
        <a-tag color="blue">分管渠道</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="已接入卡数"><b>13910</b></a-descriptions-item>
    </a-descriptions>
    <div style="height: 10px" />
  </a-modal>

  <RouterView v-if="isFullscreen" />
  <a-layout v-else style="min-height: 100vh">
    <a-layout-header class="header">
      <div>
        <div class="logo">
          <div>CRM电销外呼系统</div>
          <span class="desc">全渠道专业数据分析专业版</span>
        </div>
        <a-menu
          v-model:selectedKeys="selectedNavMenu"
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '70px', height: '68px', fontSize: '12px', width: '500px' }"
          @click="clickMenu"
        >
          <a-menu-item v-for="item in navMenu" :key="item.name">{{ item.meta.label }}</a-menu-item>
        </a-menu>
      </div>
      <div class="right">
        <a-dropdown placement="bottomRight">
          <a class="username-box" @click.prevent>
            <a-avatar style="background-color: #ccc; color: #222; margin-right: 8px" :size="20" shape="square">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <span class="username">{{ username }}</span>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a href="javascript:;" @click="showModal">账户信息</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-button type="text" style="color: #fff; margin-top: -1px" size="small" @click="logout">
          <template #icon>
            <LogoutOutlined />
          </template>
        </a-button>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-if="siderVisible" width="160" v-model:collapsed="collapsed" :trigger="null" collapsible>
        <a-menu
          v-model:selectedKeys="selectedSideMenu"
          mode="inline"
          :style="{ height: 'calc(100% - 40px)', borderRight: 0, fontSize: '12px' }"
          @click="clickSiderMenu"
        >
          <a-sub-menu v-if="selectedNavMenu[0] === 'console'">
            <template #title>
              <span>
                <ShakeOutlined />
                <span>通话管理</span>
              </span>
            </template>
            <a-menu-item key="todayRecord">当天通话记录</a-menu-item>
            <a-menu-item key="historyRecord">历史通话记录</a-menu-item>
          </a-sub-menu>

          <a-menu-item :icon="item.meta.icon" v-for="item in siderMenu" :key="item.name">
            <span>{{ item.meta.label }}</span>
          </a-menu-item>

        </a-menu>
        <div class="collapse-trigger" @click="() => (collapsed = !collapsed)">
          <menu-unfold-outlined v-if="collapsed" class="trigger" />
          <menu-fold-outlined v-else class="trigger" />
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <div style="margin-top: 16px" />
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '24px',
            minHeight: '280px',
            maxHeight: 'calc(100vh - 105px)',
            overflowY: 'auto'
          }"
        >
          <RouterView />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { RouterView, useRouter, useRoute } from 'vue-router';
  import { routes } from '@/router';
  import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined, UserOutlined, ShakeOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';

  const username = window.localStorage.username;
  const router = useRouter();
  const route = useRoute();

  const collapsed = ref<boolean>(false);

  const selectedNavMenu = ref<string[]>([route.path.split('/')[1]]);
  const selectedSideMenu = ref<string[]>([route.path.split('/')[2]]);

  const navMenu = routes.slice(0).filter((item) => !item.meta.menuHide);

  const currentNavMenu = computed(() => {
    const item = navMenu.find((item) => item.name === selectedNavMenu.value[0]);
    return item || { name: '', children: [], meta: { label: '' } };
  });

  const siderMenu = computed(() => {
    return (currentNavMenu.value.children || []).filter(item => !item.meta.menuHide);
  });

  const siderVisible = computed(() => {
    return siderMenu.value.length > 0;
  });

  const clickMenu = (event: any) => {
    router.push({
      name: event.key
    });
  };

  const clickSiderMenu = (event: any) => {
    router.push({
      name: event.key
    });
  };

  const isFullscreen = computed(() => {
    return !!route.meta.isFullscreen;
  });

  watch(
    () => route.path,
    (n) => {
      selectedNavMenu.value = [n.split('/')[1]];
      selectedSideMenu.value = [n.split('/')[2]];
    }
  );

  const logout = () => {
    router.push('/login');
    message.info('已退出系统');
  };

  const openUserInfo = ref<boolean>(false);

  const showModal = () => {
    openUserInfo.value = true;
  };
</script>

<style lang="less" scoped>
  @import '@/assets/common.less';

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .right {
      .flex-center();

      .username-box {
        .flex-center();
        line-height: 30px;
        height: 30px;

        .username {
          color: #fff;
          margin-right: 16px;
        }
      }
    }
  }

  .logo {
    .flex-center();

    float: left;
    width: 120px;
    height: 48px;
    margin: 12px 34px 12px 0px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-radius: 30px;
    font-weight: bold;
    line-height: 16px;
    text-align: center;
    font-size: 14px;
    flex-direction: column;

    .desc {
      font-size: 12px;
      font-weight: normal;
      opacity: 0.5;
      margin-top: 3px;
      transform: scale(0.9);
      white-space: nowrap;
    }
  }

  .collapse-trigger {
    .default-active();
    .flex-center();

    width: 100%;
    height: 40px;
    background-color: #fafafa;
    color: #777;
  }
</style>
