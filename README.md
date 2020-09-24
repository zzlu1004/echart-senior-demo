# fd-vue单个项目的脚手架
## 新建项目需要修改的点

### 1. index.html
> ####  title标签内的值修改为项目名称

### 2. config目录
> #### * index.js文件中dev的port端口号修改，避免和本地其他已有项目重复。proxyTable中的target修改为本地调试连接的微服务地址
#### * prod.env.js文件中的BASE_API改成打包部署需要连接的微服务地址，可以和index.js中target相同也可不用

### 3. view目录
> #### * login/login.vue 将文件中【系统名称需要修改】修改为对应的名称 bgs中的背景图可能需要替换，现在用的是安徽法院的照片其他项目不一定合适
#### *  main.js 内置mock数据可以在没有微服务的前提下登录系统，打包的时候需要将import './mock'的引入注释

## 新增项目业务代码说明

### 1. view文件夹下新建.vue文件,存放页面展示代码
### 2. api文件夹下建同名的js文件,里面存具体的方法实现
### 3. router文件夹下的project.js中asyncRouter对象里面引入新增的模块
### 4. mock文件夹下login.js中的方法getTestAsyncRouter内增加模块的返回
> 如果不使用mock数据显示页面需要将getTestAsyncRouter方法内的数据存到对应的数据库中
