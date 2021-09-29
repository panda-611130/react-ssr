#模拟next.js 实现服务端渲染
-  无脑菜鸡版本，学个梗概，做个麻雀.
-  具体的学习笔记在工程中.

# 技术栈
- React Hooks/Redux
- node/express


# 本地开发环境启动
```
node 版本 v11.0.0 !!!!!!!!!!!!!!!!!!!
npm install
npm run dev
    如果报错的话直接将 script 中打包客户端和服务端的指令执行下生成对应的打包文件即可！
```


 ```
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "npm-run-all --parallel dev:test:**",
    "dev:start": "nodemon --watch build --exec node \"./build/bundle.js\"",
    "dev:build:server": "webpack --config webpack.server.js --watch",
    "dev:build:client": "webpack --config webpack.client.js --watch",
  },
  ```

访问路径为：http://localhost:8888/ 


# 新组件开发流程
- 在containers创建我们的组件，提供静态的getData方法在服务端获取数据,如果需要添加样式使用withStyle.js提供的方法对组件进行修饰
- router里设置路由。



# ssr核心思路
- 用户输入url访问我们的网站 - 服务端返回 renderToString方法生成的页面内容（毫无灵魂的html + css）
  - 其中包含了 我们给客户端 store 进行初始化的数据  ===》 通过 script 标签传递
  - 其中包含了 我们在客户端首屏需要使用的 css 代码  ===》 通过 style  标签传递
  - **最重要的** 是其中包括了 在客户端与用户发生交互的js代码===》通过script标签直接引用
  （实际是react业务代码）
     我们通过核心 api === ReactDom.hydrate 进行水合，将没有灵魂的html + css  注入我们的js代码。这样接下来发生的任何交互（非刷新页面的交互）实际上都不是服务端渲染的内容。
     此时 react/react-router/redux 接管了用户的操作。如果我们刷新页面重复上述过程




