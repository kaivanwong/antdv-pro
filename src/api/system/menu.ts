interface SystemMenuModel {
  id?: number
  name: string
  parentId?: number
  path: string
  component: string
  title: string
  keepAlive: boolean
  locale: string
}

type CrudTableParams = Partial<Omit<SystemMenuModel, 'id'>>

export async function getListApi(params?: CrudTableParams) {
  return usePost<SystemMenuModel[]>('/system/menu', params)
}

export async function deleteApi(id: string | number) {
  return useDelete(`/system/menu/${id}`)
}

export type{
  CrudTableParams,
  SystemMenuModel,
}
