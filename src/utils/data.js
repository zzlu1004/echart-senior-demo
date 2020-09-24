const data = {
  changeObjKey,
  changeListKey,
  classify,
  objToArray,
  getKeys,
  getRate,
  listToTree,
  getBaseLog,
  getDifByKey,
  dealNull,
  getCount,
  getValuesByKey,
  getMinMax,
  changeToTree,
  arrayToObj,
  getParentCount,
  treeSort,
  getTreeDeep,
  fixedFloat,
  saveFloat,
  boolean
}
/**
 * 获取树状结构数据的层级深度
 * @param {list} data
 * @param {String} childKey 树状结构数据中子集的key
 * @return deep
 **/
function getTreeDeep(data = [], childKey = 'children', deep = 0) {
  if (data.length === 0) {
    return deep
  }
  let next = []
  deep++
  for (const item of data) {
    if (item[childKey] && item[childKey].length > 0) {
      next = next.concat(item[childKey])
    }
  }
  return getTreeDeep(next, childKey, deep)
}
/**
 * 获取list中的最大值和最小值
 * @param {list} data
 * @param {String} key 当list为对象时需要传key值
 * @return {{min: *, max: *}}
 **/
function getMinMax(data, key) {
  let min = null
  let max = null
  let value = 0
  for (const item of data) {
    value = parseFloat(item[key])
    if (min === null) {
      min = value
      max = value
    }
    if (min > value) {
      min = value
    }
    if (max < value) {
      max = value
    }
  }
  return { min: min, max: max }
}
/**
 * 将一个值显示在页面之前做的显示处理，null和undefined显示成'--'
 * @param {String} data
 * @return {String}
 **/
function dealNull(data) {
  if (data === null || data === undefined) {
    data = '--'
  }
  return data
}
/**
 * 获取List中某一属性的所有取值
 * @param {Object} data
 * @param {String} key
 * @return {Object}
 **/
function getDifByKey(data, key) {
  const back = new Set()
  for (const item of data) {
    back.add(item[key])
  }
  return [...back]
}
/**
 * 对象的key值转换
 * @param {Object} data
 * @param {Object} opt 转换的映射关系
 * @return {Object}
 **/
function changeObjKey(data, opt) {
  const obj = {}
  for (const key in data) {
    obj[opt[key] || key] = data[key]
  }
  return obj
}
/**
 * json类型的数组中每个对象的key值转换
 * @param {List} data
 * @param {Object} opt 转换的映射关系
 * @return {List}
 **/
function changeListKey(data, opt) {
  const back = []
  for (const item of data) {
    back.push(changeObjKey(item, opt))
  }
  return back
}
/**
 * json数组根据key进行分类
 * @param {List} data
 * @param {String} key 分类的关键字，默认值为seriesName
 * @return {Object}
 **/
function classify(d = [], key = 'seriesName') {
  const data = [...d]
  const obj = {}
  for (let i = 0; i < data.length; i++) {
    const item = data[i][key]
    obj[item] = obj[item] || []
    obj[item].push(data[i])
  }
  return obj
}
/**
 * json数组根据key进行分类
 * @param {list} data
 * @param {String} key 分类的关键字，默认值为seriesName
 * @param {String} key 分类的关键字，默认值为seriesName
 * @return [{id:'',children:[]}]
 **/
function changeToTree(d, id = 'id', pid = 'parentId') {
  const key = id
  const pkey = pid
  const ckey = 'children'
  const data = JSON.parse(JSON.stringify(d))
  let flag = false // 字段保证顺序是否变化
  if (!key || !data) return []

  let tree = []
  const names = []
  const parents = {}
  data.forEach(item => {
    names.push(item[key] + '_')
    // 父类相同的分类
    parents[item[pkey] + '_'] = parents[item[pkey] + '_'] || []
    parents[item[pkey] + '_'].push(item)
  })
  data.forEach(item => {
    if (parents[item[key] + '_'] && item[pkey] !== item[key]) {
      flag = true
      item[ckey] = [...parents[item[key] + '_']]
    }
  })
  // 保证顺序不能变(前提是：没有子节点)
  if (flag) {
    // 获取根节点
    for (const keyName in parents) {
      if (names.indexOf(keyName) < 0) {
        tree.push(...parents[keyName])
      }
    }
  } else {
    tree = JSON.parse(JSON.stringify(data))
  }
  // 节点的id为key，存储节点，便于查找
  // const map = arrayToObj(data, key)
  //
  // for (const v of data) {
  //   // 若父节点存在，且id和pid不同，放入父节点的子节点中。
  //   if (map[v[pkey]] && v[key] !== v[pkey]) {
  //     // 父节点的子节点
  //     if (!map[v[pkey]][ckey]) {
  //       map[v[pkey]][ckey] = []
  //     }
  //     // 放入子节点中
  //     map[v[pkey]][ckey].push(v)
  //   } else {
  //     // 否则作为根节点，根节点可能有多个。
  //     tree.push(v)
  //   }
  // }
  return tree
}

/**
 * 对象转换成数组
 * @param {Object} obj 待转对象
 * @return {Array}
 **/
function objToArray(obj) {
  const arr = []
  for (const key in obj) {
    arr.push({ key: key, value: obj[key] })
  }
  return arr
}
/**
 * 数组转对象
 * @param {list} obj 待转对象
 * @return {Object}
 **/
function arrayToObj(list, key) {
  const data = [...list]
  const obj = {}
  for (const item of data) {
    obj[item[key]] = item
  }
  return obj
}
/**
 * 获取对象所有的key值
 * @param {Object}
 * @return {Object}
 **/
function getKeys(obj) {
  const back = []
  for (const key in obj) {
    back.push(key)
  }
  return back
}
/**
 * 获取一个长度占总长度的多少
 * @param {Number} num 单个长度
 * @param {Number} total 总长度
 * @return {Number} 百分比值
 **/
function getRate(num = 0, total = 0) {
  let rate = 0
  if (total !== 0) {
    rate = Math.floor(num / total * 10000) / 100
    rate = rate > 100 ? 100 : rate
    rate = rate < 0.01 ? 0.01 : rate
  }
  return rate
}
/**
 * 获取一个List数组中某一个属性的和
 * @param {list} List对象数组
 * @param {key} 对哪个属性求和
 * @return {number} 和
 **/
function getCount(data, key) {
  let count = 0
  for (const item of data) {
    count += parseFloat(item[key]) || 0
  }
  return count
}
/**
 * 获取一个List数组中某一个属性的和
 * @param {list} List对象数组
 * @param {key} 对哪个属性求和
 * @return {count} 和
 **/
function getValuesByKey(data, key) {
  const back = []
  data = data || []
  for (const item of data) {
    back.push(item[key])
  }
  return back
}
/**
* List结构转换为树形Json
* @param {Array} data 需要处理的List
* @param {Object} options 输出JSON key值配置项，默认{idKey:'permissionId', parentKey:'parentId', childrenKey: 'children', titleKey: 'permissionName'}
* @return {Object}
**/
function listToTree(data, options) {
  options = options || {}
  const ID_KEY = options.idKey || 'permissionId'
  const PARENT_KEY = options.parentKey || 'parentId'
  const CHILDREN_KEY = options.childrenKey || 'children'
  const TITLE_KEY = options.titleKey || 'permissionName'
  const tree = []
  const childrenOf = {}
  let item, id, parentId

  for (let i = 0, length = data.length; i < length; i++) {
    item = data[i]
    id = item[ID_KEY]
    item.title = item[TITLE_KEY]
    parentId = item[PARENT_KEY] || 0
    // every item may have children
    childrenOf[id] = childrenOf[id] || []
    // init its children
    item[CHILDREN_KEY] = childrenOf[id]
    if (parentId !== 0) {
      // init its parent's children
      childrenOf[parentId] = childrenOf[parentId] || []
      // push it into its parent's children
      childrenOf[parentId].push(item)
      // if (item[CHILDREN_KEY].length === 0) {
      //   delete item[CHILDREN_KEY]
      // }
    } else {
      tree.push(item)
    }
  }

  function deleteJsonKey(treeData, TARGET = 'children') {
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i][TARGET].length === 0) {
        delete treeData[i][TARGET]
      } else {
        deleteJsonKey(treeData[i][TARGET])
      }
    }
    return treeData
  }
  return deleteJsonKey(tree)
}
function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x)
}
/**
 * 对树形结构数据进行排序
 * @param {Array} data 需要排序的数据
 * @param child: 子集的关键词
 * @param key: sort排序的关键词
 * @return []
 **/
function treeSort(data, child = 'children', key = 'sort') {
  data.sort((a, b) => {
    (a[key] || 999999) - (b[key] || 999999)
  })
  for (const item of data) {
    if (item[child]) {
      treeSort(item[child], child, key)
    }
  }
  return data
}
/**
 * 获取所有父节点的数量
 * @param pid: 第一个父节点的id值
 * @param map: 所有节点的对象集合
 * @param key: 对象父节点的key值
 * @param deep: 父节点的长度
 * @return number
 **/
function getParentCount(pid, map, key = 'pid', deep = 0) {
  if (!map[pid]) {
    return deep
  } else {
    deep++
  }
  return getParentCount(map[pid][key], map, key, deep)
}
/**
 * 获取所有父节点的数量
 * @param float: 小数
 * @param min: 最小值
 * @param max: 最大值
 * @param length: 保留小数点长度
 * @return float
 **/
function fixedFloat(float, min = 0, max = 100, length = 3) {
  float = parseFloat(float)
  min = parseFloat(min)
  max = parseFloat(max)
  float = isNaN(float) ? 0 : float
  min = isNaN(min) ? 0 : min
  max = isNaN(max) ? 100 : max
  if (float < min) {
    float = min
  }
  if (float > max) {
    float = max
  }
  return float.toFixed(length)
}
/**
 * 保留某个数字的小数位数
 * @param float: 小数
 * @param length: 保留小数点长度
 * @return float
 **/
function saveFloat(float, length = 3) {
  float = parseFloat(float)
  float = isNaN(float) ? 0 : float
  return float.toFixed(length)
}
/**
 * 将值转换成boolean值，数字0作为true处理
 * @param {data} 数值
 * @return {boolean}
 **/
function boolean(data) {
  let back = true
  if (type(data) === 'Array') {
    back = data.length > 0
  } else if (type(data) === 'Object') {
    back = JSON.stringify(data) !== '{}'
  } else if (!data && data !== 0) {
    back = false
  }
  return back
}
function type(params) {
  return Object.prototype.toString.apply(params).replace(/[\[\]]/g, '').split(/\s+/)[1]
}
export default data
