import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import homeReducer from '../containers/Home/reducer';
import headerReducer from '../components/Header/store';
import fetchClient from '../client/request';
import fetchServer from '../server/request';
import transitionReducer from '../containers/Transition/store'

const reducer = combineReducers({
    home: homeReducer,
    login: headerReducer,
    transition: transitionReducer
})

// 为什么直接返回的是工厂函数而不是 createStore(reducer) ?
// 这是因为当我们在服务器端渲染时，我们需要一个全新的 Store 实例来处理每个请求。
export const getClientStore = () => {
    return createStore(reducer, window.info, applyMiddleware(thunk.withExtraArgument(fetchClient)))//中间件thunk自定义参数
}

// 为什么直接返回的是工厂函数而不是 createStore(reducer) ?
// 这是因为当我们在服务器端渲染时，我们需要一个全新的 Store 实例来处理每个请求。
export const getServerStore = (req) => {
    return createStore(reducer, applyMiddleware(thunk.withExtraArgument(fetchServer(req))))
}
