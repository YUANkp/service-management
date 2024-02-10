<template>
  <div class="warper">
    <div class="login-box">
      <div class="system-name">CRM电销外呼系统</div>
      <a-form
        :model="formState"
        name="normal_login"
        class="login-form"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item label="账号" name="username" :rules="[{ required: true, message: '请输入您的账号!' }]">
          <a-input v-model:value="formState.username">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入您的密码!' }]">
          <a-input-password v-model:value="formState.password">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <br />
        <a-form-item>
          <a-button
            style="width: 100%"
            :disabled="disabled"
            type="primary"
            html-type="submit"
            size="large"
            class="login-form-button"
          >
            登 录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, computed } from 'vue';
  import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';

  interface FormState {
    username: string;
    password: string;
  }

  const router = useRouter();

  const formState = reactive<FormState>({
    username: '',
    password: '',
  });

  const onFinish = (values: any) => {
    if (values.username !== 'Yzz0125' || values.password !== '01259900') {
      message.error('账号或密码不正确');
      return
    }

    window.localStorage.setItem('username', values.username)
    window.localStorage.setItem('loginTime', Date.now().toString())
    message.success('登录成功');
    router.push('/home');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const disabled = computed(() => {
    return !(formState.username && formState.password);
  });
</script>

<style lang="less" scoped>
  .warper {
    background-color: #36405d;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100vh;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-image: url('@/assets/images/login-bg.png');

    .login-box {
      width: 400px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1);
      padding: 34px;
      margin-right: 10vw;

      .system-name {
        margin-bottom: 40px;
        text-align: center;
        font-weight: bold;
        font-size: 20px;
        margin-top: 6px;
        background-color: #f4f4f4;
        border-radius: 3px;
        padding: 20px 0;
      }
    }
  }
</style>
