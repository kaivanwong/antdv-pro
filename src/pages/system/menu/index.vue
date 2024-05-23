<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import type MenuModal from './components/menu-modal.vue'
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
    title: '授权标识',
    dataIndex: 'flag',
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
  if (!record.id)
    return message.error('id 不能为空')
  try {
    const res = await deleteApi(record.id)
    if (res.code === 200)
      await query()
    message.success('删除成功')
  }
  catch (e) {
    console.log(e)
  }
  finally {
    close()
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
              <a-button type="link" @click="handleEdit(scope.record as SystemMenuModel)">
                {{ t('system.menu.edit') }}
              </a-button>
              <a-popconfirm
                title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
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

    <CrudTableModal ref="menuModalRef" />
  </page-container>
</template>

<style lang="less" scoped>
.system-crud-wrapper{
    .ant-form-item{
      margin: 0;
    }
  }
</style>
