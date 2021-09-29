export const showInfo = (info) => {
    return {
        type: 'show',
        info: info.data
    }
}

export const getHomeList = (dispatch, getState, fetch) => {

    return fetch('/api/news.json')
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            dispatch(showInfo(res))
        })
        .catch((err) => {
            console.log(err)
        })
}