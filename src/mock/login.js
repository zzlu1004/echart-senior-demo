export default {
  logout: () => 'success',
  mockLogin() {
    return { data: { token: 'admin' }} // axios.get(`${MOCK_BASE_API}/login`)
  },
  getUser() {
    return {
      data: {
        comments: null,
        createTime: '2018-05-04T07:08:53.000+0000',
        createUser: '1',
        departCode: 'f340000',
        departId: '1103',
        departName: '安徽省人民政府法制办公室',
        employeeNum: null,
        groupCode: 'f340000',
        groupId: null,
        groupName: '安徽省人民政府法制办公室',
        id: '342903井飞雪',
        loginName: 'admin',
        partyId: null,
        password: '$2a$10$Ne6W/3ypnXavOo41Ey5II.OOCrCTj/uWxPgko1jD8RaT.nH3zK6MC',
        passwordChgTimes: 0,
        sortId: null,
        undeletableFlag: '0',
        updateTime: '2018-06-05T08:20:14.000+0000',
        updateUser: '342903井飞雪',
        userBirthdate: null,
        userEmail: null,
        userIdcard: null,
        userLevel: null,
        userMobile: null,
        userName: '井飞雪',
        userPhoto: 'data:image/png;base64,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…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',
        userSex: null,
        userStatus: '0',
        workDate: null,
        workDuty: null,
        workTelephone: null
      }
    }
  },
  getProduct() {
    return {
      data: [{
        comments: null,
        createTime: '2018-07-25T06:32:37.000+0000',
        createUser: 'admin',
        deleteFlag: '0',
        id: '1001-01',
        name: '汉族',
        parentDesc: 'nation_id',
        parentId: '1001',
        parentName: '民族',
        sortId: 26,
        updateTime: '2018-07-25T06:32:37.000+0000',
        updateUser: 'admin'
      }, {
        comments: null,
        createTime: '2018-07-25T06:32:37.000+0000',
        createUser: 'admin',
        deleteFlag: '0',
        id: '1001-02',
        name: '蒙古族',
        parentDesc: 'nation_id',
        parentId: '1001',
        parentName: '民族',
        sortId: 27,
        updateTime: '2018-07-25T06:32:37.000+0000',
        updateUser: 'admin'
      }]
    }
  },
  getTestAsyncRouter() {
    return {
      data: [
        { iconClass: '',
          id: 'system',
          resourceName: '系统管理',
          parentId: null,
          routePath: 'system',
          type: 'menu'
        },
        { iconClass: '',
          id: 'user',
          resourceName: '用户管理',
          parentId: 'system',
          routePath: 'user',
          resourceType: 'page'
        },
        { iconClass: '',
          id: 'group',
          resourceName: '分组管理',
          parentId: 'system',
          routePath: 'group',
          resourceType: 'page'
        },
        { iconClass: '',
          id: 'resource',
          resourceName: '菜单管理',
          parentId: 'system',
          routePath: 'resource',
          resourceType: 'page',
          routeHidden: '0'// '0'显示， '1'隐藏
        }
      ]
    }
  },
  getGroups() {
    return {
      data: [{
        areaName: '安徽省',
        code: 'f340000',
        id: '1103',
        label: '安徽省人民政府法制办公室',
        parentId: '-1',
        parentName: null
      }]
    }
  }
}
