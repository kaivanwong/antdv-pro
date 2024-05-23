interface SystemMenuModel {
  id?: number
  name: string
  parentId?: number
  path: string
  component: string
  title: string
  keepAlive: boolean
  locale: string
  children?: SystemMenuModel[]
}

type CrudTableParams = Partial<Omit<SystemMenuModel, 'id'>>

export async function getListApi(params?: CrudTableParams) {
  return usePost<SystemMenuModel[]>('/system/menu', params)
}

export async function deleteApi(id: string | number) {
  return useDelete(`/list/${id}`)
}

export type{
  CrudTableParams,
  SystemMenuModel,
}
