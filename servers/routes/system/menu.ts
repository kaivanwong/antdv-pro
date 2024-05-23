import { accessMenuData, menuData } from '../menu'

function parseMenuData(data: any[]): any[] {
  const map = new Map<number, any>()
  const result: any[] = []

  for (const item of data)
    map.set(item.id, { ...item, children: [] })

  for (const item of data) {
    const parent = map.get(item.parentId)
    if (parent)
      parent.children.push(map.get(item.id))
    else
      result.push(map.get(item.id))
  }

  return result
}

export default eventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')
  // eslint-disable-next-line node/prefer-global/buffer
  const username = Buffer.from(token as any, 'base64').toString('utf-8')

  const data = parseMenuData([...menuData, ...(username === 'admin' ? accessMenuData : [])])

  return {
    code: 200,
    msg: '获取成功',
    data: {
      records: data,
      total: data.length,
    },
  }
})
