<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import MenuModal from './components/menu-modal.vue'
import type { SystemMenuModel } from '~@/api/system/menu'
import { deleteApi, getListApi } from '~@/api/system/menu'
import { useTableQuery } from '~@/composables/table-query'
import AsyncIcon from '~@/layouts/components/menu/async-icon.vue'

const { t } = useI18n()

const message = useMessage()

const columns = shallowRef([
  {
    title: '名称',
    dataIndex: 'title',
  },
  {
    title: '图标',
    dataIndex: 'icon',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '路由',
    dataIndex: 'path',
  },
  {
    title: '组件',
    dataIndex: 'component',
  },
  {
    title: '操作',
    dataIndex: 'action',
  },
])

const { state, query } = useTableQuery({
  queryApi: getListApi,
})

const menuModalRef = ref<InstanceType<typeof MenuModal>>()

async function handleDelete(record: SystemMenuModel) {
  if (!record.id) {
    message.error('id 不能为空')
    return
  }

  if (record.children && record.children.length > 0) {
    message.error('请先删除子菜单')
    return
  }

  try {
    const res = await deleteApi(record.id)
    if (res.code === 200) {
      query()
      message.success('删除成功')
    }
  }
  catch (e) {
    console.error(e)
  }
}

function handleAdd() {
  menuModalRef.value?.open()
}

function handleEdit(record: SystemMenuModel) {
  menuModalRef.value?.open(record)
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
            {{ scope.record.locale ? t(scope?.record.locale) : scope.record.title }}
          </template>
          <template v-if="scope.column.dataIndex === 'icon'">
            <AsyncIcon :icon="scope.record.icon" />
          </template>
          <template v-if="scope.column.dataIndex === 'action'">
            <div flex gap-2>
              <a-button type="link">
                {{ t('system.menu.flags') }}
              </a-button>
              <a-button type="link" @click="handleEdit(scope.record as SystemMenuModel)">
                {{ t('system.menu.edit') }}
              </a-button>
              <a-popconfirm
                :title="t('system.menu.delete-confirm')"
                @confirm="handleDelete(scope.record as SystemMenuModel)"
              >
                <a-button type="link">
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
