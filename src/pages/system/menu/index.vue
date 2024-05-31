<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import MenuModal from './components/menu-modal.vue'
import type { SystemMenuModel } from '~@/api/system/menu'
import { deleteApi, getMenuApi } from '~@/api/system/menu'
import { useTableQuery } from '~@/composables/table-query'
import AsyncIcon from '~@/layouts/components/menu/async-icon.vue'

const { t } = useI18n()

const message = useMessage()

const columns = shallowRef([
  {
    title: t('system.menu.table-title'),
    dataIndex: 'title',
  },
  {
    title: t('system.menu.table-icon'),
    dataIndex: 'icon',
  },
  {
    title: t('system.menu.table-sort'),
    dataIndex: 'sort',
  },
  {
    title: t('system.menu.table-path'),
    dataIndex: 'path',
  },
  {
    title: t('system.menu.table-component'),
    dataIndex: 'component',
  },
  {
    title: t('system.menu.table-action'),
    dataIndex: 'action',
  },
])

const { state, query } = useTableQuery({
  queryApi: getMenuApi,
})

const menuModalRef = ref<InstanceType<typeof MenuModal>>()

async function handleDelete(record: SystemMenuModel) {
  if (!record.id) {
    message.error(t('system.menu.delete-id-required'))
    return
  }

  if (record.children && record.children.length > 0) {
    message.error(t('system.menu.delete-has-children'))
    return
  }

  try {
    const res = await deleteApi(record.id)
    if (res.code === 200) {
      query()
      message.success(t('system.menu.delete-success'))
    }
  }
  catch (e) {
    console.error(e)
  }
}

function handleAdd() {
  menuModalRef.value?.open()
}

function handleEdit(record: SystemMenuModel, isAddChild = false) {
  menuModalRef.value?.open(record, isAddChild)
}

function handleRole(record: SystemMenuModel) {
  console.log(record)
}
</script>

<template>
  <page-container>
    <a-card :title="t('system.menu.title')">
      <template #extra>
        <a-space size="middle">
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <PlusOutlined />
            </template>
            {{ t('system.menu.add') }}
          </a-button>
        </a-space>
      </template>
      <a-table
        row-key="id" :row-selection="state.rowSelections" :loading="state.loading" :columns="columns"
        :data-source="state.dataSource" :pagination="state.pagination"
      >
        <template #bodyCell="scope">
          <template v-if="scope.column.dataIndex === 'title'">
            {{ scope.record.title }}
          </template>
          <template v-if="scope.column.dataIndex === 'icon'">
            <AsyncIcon :icon="scope.record.icon" />
          </template>
          <template v-if="scope.column.dataIndex === 'action'">
            <div flex gap-2>
              <a-button type="link" @click="handleEdit(scope.record as SystemMenuModel, true)">
                {{ t('system.menu.add-child') }}
              </a-button>
              <a-button type="link" @click="handleEdit(scope.record as SystemMenuModel)">
                {{ t('system.menu.edit') }}
              </a-button>
              <a-button type="link" @click="handleRole(scope.record as SystemMenuModel)">
                {{ t('system.menu.role') }}
              </a-button>
              <a-popconfirm
                :title="t('system.menu.delete-confirm')"
                @confirm="handleDelete(scope.record as SystemMenuModel)"
              >
                <a-button v-if="scope.record.children.length === 0" type="link">
                  {{ t('system.menu.delete') }}
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <MenuModal ref="menuModalRef" />
  </page-container>
</template>
