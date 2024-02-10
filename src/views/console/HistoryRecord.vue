<template>
  <div class="operate-row">
    <div class="left">
      <a-button type="primary" @click="showDrawer">
        <template #icon><PlusOutlined /></template>
        新增
      </a-button>

      <a-range-picker
        :placeholder="['记录开始时间', '结束时间']"
        style="margin-left: 8px"
        v-model:value="timeRange"
        show-time
      />

      <a-radio-group style="margin-left: 8px" v-model:value="durationRange">
        <a-radio-button value="all">全部</a-radio-button>
        <a-radio-button value="0s-40s">0s-40s</a-radio-button>
        <a-radio-button value="41s-60s">41s-60s</a-radio-button>
        <a-radio-button value="61s-80s">61s-80s</a-radio-button>
      </a-radio-group>

      <a-popconfirm v-if="selectedRowKeys.length" title="确认删除选中？" @confirm="deleteSelected">
        <a-button style="margin-left: 8px">删除选中</a-button>
      </a-popconfirm>
    </div>

    <div class="right">
      <a-upload
        style="display: inline-block"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :max-count="1"
        :showUploadList="false"
        @remove="handleRemove"
      >
        <a-button>
          <template #icon>
            <DownloadOutlined />
          </template>
        </a-button>
      </a-upload>
      <a-popconfirm v-if="filterData.length" title="确认导出？" @confirm="exportData">
        <a-button style="margin-left: 8px">
          <template #icon>
            <UploadOutlined />
          </template>
          导出
        </a-button>
      </a-popconfirm>
    </div>
  </div>

  <a-table :row-selection="rowSelection" :columns="columns" :data-source="filterData" size="middle">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'duration'">{{ record.duration }}s</template>
      <template v-else-if="column.key === 'action'">
        <a @click="onEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确认删除？" @confirm="onDelete(record.key)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>

  <a-drawer
    title="新增通话记录"
    :width="720"
    :open="open"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <template #extra>
      <a-space>
        <a-button @click="onClose">取消</a-button>
        <a-button type="primary" @click="onSubmit">提交</a-button>
      </a-space>
    </template>

    <a-form :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="任务名称" name="taskName" v-bind="validateInfos.taskName">
            <a-input v-model:value="form.taskName" placeholder="请输入任务名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="电销号码" name="phoneNumber" v-bind="validateInfos.phoneNumber">
            <a-input v-model:value="form.phoneNumber" placeholder="请输入电销号码" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="客户号码" name="targetNumber" v-bind="validateInfos.targetNumber">
            <a-input v-model:value="form.targetNumber" placeholder="请输入客户号码" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="意向等级" name="ideaRank" v-bind="validateInfos.ideaRank">
            <a-select v-model:value="form.ideaRank" placeholder="请选择意向等级">
              <a-select-option value="A级意向">A级意向</a-select-option>
              <a-select-option value="B级意向">B级意向</a-select-option>
              <a-select-option value="C级意向">C级意向</a-select-option>
              <a-select-option value="D级意向">D级意向</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="通话时间" name="recordTimeDate" v-bind="validateInfos.recordTimeDate">
            <a-date-picker
              show-time
              v-model:value="form.recordTimeDate"
              style="width: 100%"
              :get-popup-container="(trigger: any) => trigger.parentElement"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="editRecord">
          <a-form-item label="创建时间">
            {{ editRecord.createTime }}
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="拨打类型" name="type" v-bind="validateInfos.type">
            <a-select v-model:value="form.type" placeholder="拨打类型">
              <a-select-option value="股票推荐">股票推荐</a-select-option>
              <a-select-option value="贷款">贷款</a-select-option>
              <a-select-option value="金融">金融</a-select-option>
              <a-select-option value="信用开卡">信用开卡</a-select-option>
              <a-select-option value="广告">广告</a-select-option>
              <a-select-option value="代理">代理</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="状态" name="state" v-bind="validateInfos.state">
            <a-select v-model:value="form.state" placeholder="请选择状态">
              <a-select-option value="已接通">已接通</a-select-option>
              <a-select-option value="未接通">未接通</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item label="通话时长" name="duration" v-bind="validateInfos.duration">
            <a-input-number style="width: 100%" v-model:value="form.duration" :min="0" :max="10000" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="备注" name="remarks">
            <a-textarea v-model:value="form.remarks" :rows="4" placeholder="请输入备注" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { reactive, ref, toRaw, type Ref, computed, unref } from 'vue';
  import { Form, message, Table, type UploadProps } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { PlusOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue';
  import dayjs from 'dayjs';
  import type { Dayjs } from 'dayjs';
  import { exportXlsx } from '@/utils/exportXlsx';
  import { importXlsx } from '@/utils/importXlsx';

  interface DataItem {
    key: string;
    state: string;
    duration: number;
    createTime: string;
    recordTime: string;
    type: string;
    remarks: string;
    taskName: string;
    phoneNumber: string;
    targetNumber: string;
    ideaRank: string;
  }

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
      ellipsis: true
    },
    {
      title: '电销号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: '客户号码',
      dataIndex: 'targetNumber',
      key: 'targetNumber'
    },
    {
      title: '通话时间',
      key: 'recordTime',
      dataIndex: 'recordTime'
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      filters: [
        { text: '已接通', value: '已接通' },
        { text: '未接通', value: '未接通' }
      ],
      onFilter: (value: string, record: DataItem) => record.state.indexOf(value) === 0,
      width: 80
    },
    {
      title: '通话时长（秒）',
      dataIndex: 'duration',
      key: 'duration',
      width: 120
    },
    {
      title: '拨打类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '股票推荐', value: '股票推荐' },
        { text: '贷款', value: '贷款' },
        { text: '金融', value: '金融' },
        { text: '信用开卡', value: '信用开卡' },
        { text: '广告', value: '广告' },
        { text: '代理', value: '代理' }
      ],
      onFilter: (value: string, record: DataItem) => record.type.indexOf(value) === 0,
      width: 120
    },
    {
      title: '意向等级',
      dataIndex: 'ideaRank',
      key: 'ideaRank',
      width: 96,
      filters: [
        { text: 'A级意向', value: 'A级意向' },
        { text: 'B级意向', value: 'B级意向' },
        { text: 'C级意向', value: 'C级意向' },
        { text: 'D级意向', value: 'D级意向' }
      ]
    },
    {
      title: '操作',
      key: 'action',
      width: 120
    }
  ];

  const sourceData: Ref<DataItem[]> = ref([
    // {
    //   key: '1',
    //   state: '已完成',
    //   duration: 32,
    //   createTime: '2024/01/17 18:15:51',
    //   recordTime: '2024/01/15 18:15:51',
    //   type: '一般',
    //   remarks: '',
    //   taskName: '随机任务',
    //   phoneNumber: '14583818999',
    //   ideaRank: 3
    // }
  ]);

  const open = ref<boolean>(false);
  const editRecord = ref<any>(null);
  const durationRange = ref('all');

  const useForm = Form.useForm;
  const form = reactive({
    duration: 0,
    type: '',
    state: '',
    recordTimeDate: ref(),
    remarks: '',
    taskName: '',
    phoneNumber: '',
    targetNumber: '',
    ideaRank: ''
  });

  const rules: Record<string, Rule[]> = reactive({
    duration: [{ required: true, message: '请输入通话时长' }],
    taskName: [{ required: true, message: '请输入任务名称' }],
    phoneNumber: [{ required: true, message: '请输入电销号码' }],
    targetNumber: [{ required: true, message: '请输入客户号码' }],
    ideaRank: [{ required: true, message: '请选择意向等级' }],
    type: [{ required: true, message: '请选择拨打类型' }],
    state: [{ required: true, message: '请选择状态' }],
    recordTimeDate: [{ required: true, message: '请选择通话时间', type: 'object' }],
    remarks: [{ required: false }]
  });

  const { resetFields, validate, validateInfos } = useForm(form, rules, {
    onValidate: (...args) => console.log(...args)
  });

  type RangeValue = [Dayjs, Dayjs];
  const timeRange = ref<RangeValue>();

  const filterData = computed(() => {
    let result = sourceData.value;

    if (durationRange.value !== 'all') {
      const range = durationRange.value
        .replace(/[s]/g, '')
        .split('-')
        .map((s) => Number(s));

      range[1]++;

      result = sourceData.value.filter((record) => {
        return record.duration >= range[0] && record.duration < range[1];
      });
    }

    if (timeRange.value && timeRange.value[0] && timeRange.value[1]) {
      const startTime = timeRange.value[0].valueOf();
      const endTime = timeRange.value[1].valueOf();
      result = result.filter((record) => {
        const recordTimeDate = dayjs(record.recordTime).valueOf();
        return recordTimeDate >= startTime && recordTimeDate <= endTime;
      });
    }

    return result;
  });

  const fileList = ref<UploadProps['fileList']>([]);

  const onDelete = (key: string) => {
    sourceData.value = sourceData.value.filter((item) => item.key !== key);
    saveData();
  };

  const showDrawer = () => {
    open.value = true;
  };

  const onClose = () => {
    open.value = false;
    editRecord.value = null;
    resetFields();
  };

  const onSubmit = () => {
    validate()
      .then(() => {
        const formData = toRaw(form);

        const newData = {
          duration: formData.duration,
          type: formData.type,
          state: formData.state,
          recordTime: formData.recordTimeDate ? formData.recordTimeDate.value.format('YYYY/MM/DD HH:mm:ss') : '',
          remarks: formData.remarks,
          taskName: formData.taskName,
          phoneNumber: formData.phoneNumber,
          targetNumber: formData.targetNumber,
          ideaRank: formData.ideaRank
        };

        if (editRecord.value) {
          Object.assign(editRecord.value, newData);
        } else {
          const newRecord = {
            createTime: dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss'),
            key: String(sourceData.value.length),
            ...newData
          };
          sourceData.value.unshift(newRecord);
        }

        saveData();
        onClose();
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  const onEdit = (record: DataItem) => {
    editRecord.value = record;
    form.duration = record.duration;
    form.type = record.type;
    form.state = record.state;
    form.recordTimeDate = dayjs(record.recordTime);
    form.remarks = record.remarks;
    form.taskName = record.taskName;
    form.phoneNumber = record.phoneNumber;
    form.targetNumber = record.targetNumber;
    form.ideaRank = record.ideaRank;
    showDrawer();
  };

  const exportData = () => {
    const _columns = [
      ...columns.slice(0, columns.length - 1),
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        colSpan: 0
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        colSpan: 0
      }
    ];
    exportXlsx(_columns, filterData.value, 'Communicate');
  };

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    console.log(file);
    const isXlsx = file.name.endsWith('.xlsx');
    if (!isXlsx) {
      message.error(`${file.name} 不是xlsx格式的文件`);
      return false;
    }
    fileList.value = [...(fileList.value || []), file];
    importXlsx(file, (data: any[]) => {
      const keys: Array<[string, number]> = [];
      const dNow = Date.now();

      data.shift().forEach((title: string, index: number) => {
        const col = columns.find((col) => col.title === title);
        if (col) {
          keys.push([col.key, index]);
        }
      });

      const result = data.map((item: any, index: number) => {
        let d: any = {
          key: String(dNow + index)
        };
        keys.forEach(([key, index]) => {
          d[key] = item[index];
        });
        return d;
      });

      sourceData.value = sourceData.value.concat(result);

      saveData();
    });
    return false;
  };

  const handleRemove: UploadProps['onRemove'] = (file) => {
    if (fileList.value) {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    }
  };

  const selectedRowKeys = ref<DataItem['key'][]>([]);

  const onSelectChange = (changedRowKeys: string[]) => {
    selectedRowKeys.value = changedRowKeys;
  };

  const rowSelection = computed(() => {
    return {
      selectedRowKeys: unref(selectedRowKeys),
      onChange: onSelectChange,
      hideDefaultSelections: true,
      selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE]
    };
  });

  const deleteSelected = () => {
    selectedRowKeys.value.forEach((key) => {
      sourceData.value = sourceData.value.filter((item) => item.key !== key);
    });

    selectedRowKeys.value = [];

    saveData();
  };

  const saveData = () => {
    window.localStorage.setItem('CommunicateData', JSON.stringify(sourceData.value));
  };

  const loadData = () => {
    const localData = JSON.parse(window.localStorage.CommunicateData || '[]');

    sourceData.value = localData;
  };

  loadData();
</script>

<style lang="less" scoped>
  .operate-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
</style>
