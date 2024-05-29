<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { cloneDeep } from 'lodash'
import * as icons from '@ant-design/icons-vue'
import type { SystemMenuModel } from '~@/api/system/menu'
import { getMenuApi } from '~@/api/system/menu'
import AsyncIcon from '~@/layouts/components/menu/async-icon.vue'

const emit = defineEmits(['cancel', 'ok'])

const iconList = computed(() => Object.keys(icons).filter(key => /^[A-Z][a-zA-Z]*$/.test(key)))

const { t } = useI18n()

const isUpdate = ref(false)

const visible = ref(false)

const title = computed(() => {
  return isUpdate.value ? t('system.menu.model-title-edit') : t('system.menu.model-title-add')
})

const formRef = ref<FormInstance>()

const menuData = ref<SystemMenuModel[]>([])

const formData = ref<SystemMenuModel>({
  id: 0,
  name: '',
  path: '',
  component: '',
  title: '',
  keepAlive: false,
})

const labelCol = { style: { width: '100px' } }
const wrapperCol = { span: 24 }

function open(record?: SystemMenuModel) {
  visible.value = true
  getMenuTreeData()
  if (record) {
    isUpdate.value = !!record?.id
    formData.value = cloneDeep(record)
  }
  nextTick(() => {
    formRef.value?.resetFields()
  })
}

async function getMenuTreeData() {
  try {
    const res = await getMenuApi()
    if (res.code === 200)
      menuData.value = res.data?.records || []
  }
  catch (e) {
    console.error(e)
  }
}

async function handleOk() {
  try {
    await formRef.value?.validate()

    // 新增或者编辑接口...

    emit('ok')
    visible.value = false
  }
  catch (e) {
    console.error(e)
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
      <a-form-item name="parentId" label="上级菜单" :rules="[{ required: true, message: '请选择上级菜单' }]">
        <a-tree-select
          v-model:value="formData.parentId" :tree-data="menuData" :field-names="{
            children: 'children',
            label: 'title',
            value: 'id',
          }" placeholder="请选择上级菜单"
        />
      </a-form-item>
      <a-form-item name="path" label="菜单路由" :rules="[{ required: true, message: '请输入菜单路由' }]">
        <a-input v-model:value="formData.path" :maxlength="20" placeholder="请输入菜单路由称" />
      </a-form-item>
      <a-form-item name="component" label="组件路径" :rules="[{ required: true, message: '请输入组件路径' }]">
        <a-input v-model:value="formData.component" :maxlength="20" placeholder="请输入组件路径" />
      </a-form-item>
      <a-form-item name="icon" label="图标">
        <a-select
          v-model:value="formData.icon"
          allow-clear
          show-search
          placeholder="select one country"
          option-label-prop="children"
        >
          <a-select-option v-for="item in iconList" :key="item" :value="item" :label="item">
            <AsyncIcon class="mr-2" :icon="item" />
            <span>{{ item }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="sort" label="排序">
        <a-input-number v-model:value="formData.sort" :min="0" :max="999" :precision="0" :maxlength="20" placeholder="请输入" />
      </a-form-item>
      <a-form-item name="keepAlive" label="Keep Alive">
        <a-switch v-model:value="formData.keepAlive" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
