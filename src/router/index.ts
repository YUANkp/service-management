import { h } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { ShakeOutlined, WhatsAppOutlined, WalletOutlined, TeamOutlined, UngroupOutlined } from '@ant-design/icons-vue';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import HistoryRecord from '../views/console/HistoryRecord.vue';
import TodayRecord from '../views/console/TodayRecord.vue';
import CustomerService from '../views/console/CustomerService.vue';
import Card from '../views/console/Card.vue';

import UserManagement from '../views/user/UserManagement.vue';
import SystemConfig from '../views/system/SystemConfig.vue';

export const routes = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      menuHide: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      menuHide: true,
      isFullscreen: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      label: '首页'
    }
  },
  {
    path: '/console',
    name: 'console',
    redirect: '/console/historyRecord',
    meta: {
      label: '控制台'
    },
    children: [
      {
        path: '/console/todayRecord',
        component: TodayRecord,
        name: 'todayRecord',
        meta: {
          label: '当天通话记录',
          menuHide: true,
        },
      },
      {
        path: '/console/historyRecord',
        component: HistoryRecord,
        name: 'historyRecord',
        meta: {
          label: '历史通话记录',
          menuHide: true,
        },
      },
      {
        path: '/console/customer-service',
        component: CustomerService,
        name: 'customer-service',
        meta: {
          label: '客服管理',
          icon: () => h(WhatsAppOutlined)
        }
      },
      {
        path: '/console/card',
        component: Card,
        name: 'card',
        meta: {
          label: '卡片管理',
          icon: () => h(WalletOutlined)
        }
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    redirect: '/user/user-management',
    meta: {
      label: '用户'
    },
    children: [
      {
        path: '/user/user-management',
        name: 'user-management',
        component: UserManagement,
        meta: {
          label: '用户管理',
          icon: () => h(TeamOutlined)
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    redirect: '/system/system-config',
    meta: {
      label: '系统'
    },
    children: [
      {
        path: '/system/system-config',
        name: 'system-config',
        component: SystemConfig,
        meta: {
          label: '系统配置',
          icon: () => h(UngroupOutlined)
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
