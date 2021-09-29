const express = require('express');
const app = express();
const proxy = require('http-proxy-middleware');

import { render, dateFormat } from '../untils'

//配置静态资源访问目录
app.use(express.static('public'));

//将node中间层变成代理服务
app.use('/api', proxy({
    target: 'http://47.95.113.63/ssr'
}))

app.get("*", (req, res) => {
    render(req, res)
})

app.listen('8888', () => {
    let date = new Date()
    console.log("服务器已经启动 ===", dateFormat("YYYY-mm-dd HH:MM:SS", date));
})






