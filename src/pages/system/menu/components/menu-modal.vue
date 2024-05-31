<script lang="ts" setup>
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

const formRef = ref()

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

const isAddChild = ref(false)

function open(record?: SystemMenuModel, _isAddChild = false) {
  visible.value = true
  isAddChild.value = _isAddChild
  getMenuTreeData()
  nextTick(() => {
    if (record && !_isAddChild) {
      isUpdate.value = !!record?.id
      formData.value = cloneDeep(record)
    }
    if (_isAddChild)
      formData.value.parentId = record?.id
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
    await formRef.value.validate()

    // 新增或者编辑接口...

    emit('ok')
    visible.value = false
  }
  catch (e) {
    console.error(e)
  }
}

function handleCancel() {
  formRef.value.resetFields()
  emit('cancel')
}

defineExpose({
  open,
})
</script>

<template>
  <a-modal v-model:open="visible" destroy-on-close :title="title" @ok="handleOk" @cancel="handleCancel">
    <a-form ref="formRef" :model="formData" class="w-full" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item name="title" :label="t('system.menu.table-title')" required>
        <a-input v-model:value="formData.title" :placeholder="t('system.menu.placeholder-title')" :maxlength="20" />
      </a-form-item>
      <a-form-item name="parentId" :label="t('system.menu.table-parent-title')">
        <a-tree-select
          v-model:value="formData.parentId" :placeholder="t('system.menu.placeholder-parent-title')"
          :tree-data="menuData" :field-names="{
            children: 'children',
            label: 'title',
            value: 'id',
          }"
        />
      </a-form-item>
      <a-form-item name="path" :label="t('system.menu.table-path')" required>
        <a-input v-model:value="formData.path" :placeholder="t('system.menu.placeholder-path')" :maxlength="20" p />
      </a-form-item>
      <a-form-item name="component" :label="t('system.menu.table-component')" required>
        <a-input
          v-model:value="formData.component" :placeholder="t('system.menu.placeholder-component')"
          :maxlength="20"
        />
      </a-form-item>
      <a-form-item name="icon" :label="t('system.menu.table-icon')">
        <a-select
          v-model:value="formData.icon" allow-clear show-search :placeholder="t('system.menu.placeholder-icon')"
          option-label-prop="children"
        >
          <a-select-option v-for="item in iconList" :key="item" :value="item" :label="item">
            <AsyncIcon class="mr-2" :icon="item" />
            <span>{{ item }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="locale" :label="t('system.menu.table-locale')">
        <a-input v-model:value="formData.locale" :placeholder="t('system.menu.placeholder-locale')" />
      </a-form-item>
      <a-form-item name="sort" :label="t('system.menu.table-sort')">
        <a-input-number
          v-model:value="formData.sort" style="width: 120px;" :min="0" :max="999" :precision="0"
          :maxlength="20" :placeholder="t('system.menu.placeholder-sort')"
        />
      </a-form-item>
      <a-form-item name="keepAlive" :label="t('system.menu.table-keep-alive')">
        <a-switch v-model:checked="formData.keepAlive" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
