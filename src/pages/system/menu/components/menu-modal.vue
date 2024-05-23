<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { cloneDeep } from 'lodash'
import type { SystemMenuModel } from '~@/api/system/menu'

const emit = defineEmits(['cancel', 'ok'])

const isUpdate = ref(false)

const visible = ref(false)

const title = computed(() => {
  return isUpdate.value ? '编辑' : '新增'
})

const formRef = ref<FormInstance>()

const formData = ref<SystemMenuModel>({
  name: '',
  path: '',
  component: '',
  title: '',
  keepAlive: false,
  locale: '',
})

const labelCol = { style: { width: '100px' } }
const wrapperCol = { span: 24 }

function open(record?: SystemMenuModel) {
  visible.value = true
  isUpdate.value = !!record?.id
  formData.value = cloneDeep(record) ?? {
    name: '',
    path: '',
    component: '',
    title: '',
    keepAlive: false,
    locale: '',
  }
}

async function handleOk() {
  try {
    await formRef.value?.validate()

    // 新增或者编辑接口...

    emit('ok')
    visible.value = false
  }
  catch (errorInfo) {
    console.log('Form Validate Failed:', errorInfo)
  }
}

function handleCancel() {
  formRef.value?.resetFields()
  emit('cancel')
}

defineExpose({
  open,
})
</script>

<template>
  <a-modal v-model:open="visible" :title="title" @ok="handleOk" @cancel="handleCancel">
    <a-form ref="formRef" :model="formData" class="w-full" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item name="title" label="菜单名称" :rules="[{ required: true, message: '请输入菜单名称' }]">
        <a-input v-model:value="formData.title" :maxlength="20" placeholder="请输入菜单名称" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
