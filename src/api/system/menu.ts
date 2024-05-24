interface SystemMenuModel {
  id: number
  name: string
  parentId?: number
  path: string
  icon?: string
  component: string
  sort?: number
  title: string
  keepAlive: boolean
  locale?: string
  children?: SystemMenuModel[]
}

export async function getMenuApi() {
  return usePost('/system/menu', {})
}

export async function deleteApi(id: string | number) {
  return useDelete(`/list/${id}`)
}

export type{
  SystemMenuModel,
}
