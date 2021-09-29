import React from 'react';
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { matchRoutes } from 'react-router-config'
import { Helmet } from 'react-helmet';

import Routers from './router';
import { getServerStore } from "./store";

export const render = (req, res) => {
    //匹配路由 获取数据
    // const Store = createStore(Reducer, applyMiddleware(thunk.withExtraArgument(fetchServer)));
    const Store = getServerStore(req);
    // 匹配路由配置中页面所涉及的所有组件
    const mathPath = matchRoutes(Routers, req.path);
    const promiseAll = [];
    //我们在这里拿到每个组件展示所需要的数据，这样的话服务端返回给客户端的页面就已经是有内容的了
    mathPath.map(path => { path.route.getData ? promiseAll.push(path.route.getData(Store.dispatch)) : '' })
    //  使用promise.all在所有异步请求完成之后执行对应的render函数，这时请求都已经结束了，（但是并不一定都是成功的）
    //  此时组件所需要的数据已经请求完毕了我们再通过script 标签将客户端 store 初始化所需要的数据 包裹起来，
    //  这样客户端就可以拿这个数据进行store的初始化
    const context = { style: [] }
    Promise.all(promiseAll).then(() => {
        const content = renderToString(
            <Provider store={Store}>
                {/* location：由于服务器端并不能主动感知客户端地址栏的变化，所以需要location 属性获取到当前的url地址 */}
                {/* context ：服务器端用于数据传递给子组件 */}
                <StaticRouter context={context} location={req.path}>
                    {renderRoutes(Routers)}
                </StaticRouter>
            </Provider>
        )
        const styleStr = context.style.length ? context.style.join('\n') : '';
        //404页面
        context.notFound && res.status(404);
        context.action === 'REPLACE' && res.status(301);
        //seo优化title和meta标签
        const helmet = Helmet.renderStatic();
        res.send(`<html>
            <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
                <style>${styleStr}</style>
            </head>
            <body>
            <div id="root">${content}</div>
            </body>
            <script>var info = ${JSON.stringify(Store.getState())}</script>
            <script src="./index.js"></script>
        </html>`)
    })
}


export const dateFormat = (fmt, date) => {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}