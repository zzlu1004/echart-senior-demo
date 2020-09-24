import Mock from 'mockjs'
// import login from './login'
import { getResource, getTestAsyncRouter } from './mockData'

// Mock.mock(/\/api\/auth\/token/, 'post', login.mockLogin)
// Mock.mock(/\/login\/logout/, 'post', login.logout)
// Mock.mock(/\api\/codes\/product/, 'get', login.getProduct)
Mock.mock(/\api\/user\/resources\/menu/, 'get', getTestAsyncRouter)
// Mock.mock(/\/api\/user/, 'get', login.getUser)
// Mock.mock(/\/api\/groups\/departs\/all/, 'get', login.getGroups)
// Mock.mock(/\/api\/groups/, 'get', login.getGroups)
Mock.mock(/\/api\/resources\/menu/, 'get', getResource)
export default Mock

